const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/orders - Get user's orders
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const [orders] = await db.execute(`
    SELECT o.*, 
           COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.user.id]);

  res.json(orders);
}));

// GET /api/orders/:id - Get specific order with items
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get order details
  const [orders] = await db.execute(`
    SELECT o.*, u.name as buyer_name, u.email as buyer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ? AND o.user_id = ?
  `, [id, req.user.id]);

  if (orders.length === 0) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  // Get order items
  const [orderItems] = await db.execute(`
    SELECT oi.*, i.title, i.description, i.image, u.name as seller_name
    FROM order_items oi
    JOIN items i ON oi.item_id = i.id
    JOIN users u ON i.created_by = u.id
    WHERE oi.order_id = ?
  `, [id]);

  const order = orders[0];
  order.items = orderItems;

  res.json(order);
}));

// POST /api/orders - Create order from cart (checkout)
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { shipping_address, payment_method } = req.body;

  if (!shipping_address) {
    const error = new Error('Shipping address is required');
    error.status = 400;
    throw error;
  }

  // Get cart items
  const [cartItems] = await db.execute(`
    SELECT c.*, i.title, i.price, i.created_by
    FROM cart c
    JOIN items i ON c.item_id = i.id
    WHERE c.user_id = ?
  `, [req.user.id]);

  if (cartItems.length === 0) {
    const error = new Error('Cart is empty');
    error.status = 400;
    throw error;
  }

  // Calculate total
  const total_amount = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Start transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
      [req.user.id, total_amount, shipping_address, payment_method || 'Credit Card']
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
        [orderId, item.item_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    // Get the created order with items
    const [orders] = await db.execute(`
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `, [orderId]);

    res.status(201).json(orders[0]);

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    const error = new Error('Valid status is required');
    error.status = 400;
    throw error;
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    const error = new Error('Admin access required');
    error.status = 403;
    throw error;
  }

  const [result] = await db.execute(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );

  if (result.affectedRows === 0) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'Order status updated' });
}));

// GET /api/orders/seller/:id - Get orders for items sold by user
router.get('/seller/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is requesting their own seller orders or is admin
  if (parseInt(id) !== req.user.id && req.user.role !== 'admin') {
    const error = new Error('Not authorized');
    error.status = 403;
    throw error;
  }

  const [orders] = await db.execute(`
    SELECT DISTINCT o.*, u.name as buyer_name, u.email as buyer_email
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN items i ON oi.item_id = i.id
    JOIN users u ON o.user_id = u.id
    WHERE i.created_by = ?
    ORDER BY o.created_at DESC
  `, [id]);

  res.json(orders);
}));

module.exports = router; 