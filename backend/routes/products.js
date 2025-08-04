const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/uploadImage');
const path = require('path');

const router = express.Router();

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Image upload endpoint
router.post('/upload-image', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `/api/products/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// GET /api/products - List all products
router.get('/', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id - View one product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products - Create new product (auth required, with image upload)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/api/products/uploads/${req.file.filename}`;
    }
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image_url, category]
    );
    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(product[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id - Update product (auth required)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, price, image_url, category } = req.body;
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, image_url, category, req.params.id]
    );
    const [updated] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (auth required)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;