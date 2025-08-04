const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/verifyToken');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const [cartItems] = await db.execute(`
    SELECT c.*, i.title, i.description, i.price, i.image, u.name as seller_name
    FROM cart c
    JOIN items i ON c.item_id = i.id
    JOIN users u ON i.created_by = u.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `, [req.user.id]);

  res.json(cartItems);
}));

// POST /api/cart - Add item to cart
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { item_id, quantity = 1 } = req.body;

  if (!item_id) {
    const error = new Error('Item ID is required');
    error.status = 400;
    throw error;
  }

  // Check if item exists and is not created by the same user
  const [items] = await db.execute('SELECT * FROM items WHERE id = ?', [item_id]);
  if (items.length === 0) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }

  if (items[0].created_by === req.user.id) {
    const error = new Error('You cannot add your own item to cart');
    error.status = 400;
    throw error;
  }

  // Check if item is already in cart
  const [existingCart] = await db.execute(
    'SELECT * FROM cart WHERE user_id = ? AND item_id = ?',
    [req.user.id, item_id]
  );

  if (existingCart.length > 0) {
    // Update quantity
    await db.execute(
      'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?',
      [quantity, req.user.id, item_id]
    );
  } else {
    // Add new item to cart
    await db.execute(
      'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)',
      [req.user.id, item_id, quantity]
    );
  }

  res.status(201).json({ message: 'Item added to cart' });
}));

// PUT /api/cart/:item_id - Update cart item quantity
router.put('/:item_id', verifyToken, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { item_id } = req.params;

  if (!quantity || quantity < 1) {
    const error = new Error('Valid quantity is required');
    error.status = 400;
    throw error;
  }

  const [result] = await db.execute(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?',
    [quantity, req.user.id, item_id]
  );

  if (result.affectedRows === 0) {
    const error = new Error('Cart item not found');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'Cart updated' });
}));

// DELETE /api/cart/:item_id - Remove item from cart
router.delete('/:item_id', verifyToken, asyncHandler(async (req, res) => {
  const { item_id } = req.params;

  const [result] = await db.execute(
    'DELETE FROM cart WHERE user_id = ? AND item_id = ?',
    [req.user.id, item_id]
  );

  if (result.affectedRows === 0) {
    const error = new Error('Cart item not found');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'Item removed from cart' });
}));

// DELETE /api/cart - Clear entire cart
router.delete('/', verifyToken, asyncHandler(async (req, res) => {
  await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
  res.json({ message: 'Cart cleared' });
}));

module.exports = router; 