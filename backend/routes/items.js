const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/uploadImage');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');

const router = express.Router();

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// POST /api/items - Add new item (auth required, with image upload)
router.post('/', verifyToken, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  let image = req.body.image;
  if (req.file) {
    image = `/api/items/uploads/${req.file.filename}`;
  }
  if (!title || !price) {
    const error = new Error('Title and price are required');
    error.status = 400;
    throw error;
  }
  const [result] = await db.execute(
    'INSERT INTO items (title, description, price, image, created_by) VALUES (?, ?, ?, ?, ?)',
    [title, description, price, image, req.user.id]
  );
  const [item] = await db.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
  res.status(201).json(item[0]);
}));

// GET /api/items - List all items
router.get('/', asyncHandler(async (req, res) => {
  const [items] = await db.execute(
    'SELECT items.*, users.name as creator_name FROM items JOIN users ON items.created_by = users.id ORDER BY items.created_at DESC'
  );
  res.json(items);
}));

// GET /api/items/:id - Get one item
router.get('/:id', asyncHandler(async (req, res) => {
  const [items] = await db.execute(
    'SELECT items.*, users.name as creator_name FROM items JOIN users ON items.created_by = users.id WHERE items.id = ?',
    [req.params.id]
  );
  if (items.length === 0) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  res.json(items[0]);
}));

// PUT /api/items/:id - Update item (only owner)
router.put('/:id', verifyToken, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;
  let image = req.body.image;
  if (req.file) {
    image = `/api/items/uploads/${req.file.filename}`;
  }
  const [items] = await db.execute('SELECT * FROM items WHERE id = ?', [req.params.id]);
  if (items.length === 0) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  const item = items[0];
  if (item.created_by !== req.user.id) {
    const error = new Error('Not authorized to update this item');
    error.status = 403;
    throw error;
  }
  await db.execute(
    'UPDATE items SET title = ?, description = ?, price = ?, image = ? WHERE id = ?',
    [title, description, price, image, req.params.id]
  );
  const [updated] = await db.execute('SELECT * FROM items WHERE id = ?', [req.params.id]);
  res.json(updated[0]);
}));

// DELETE /api/items/:id - Delete item (only owner or admin)
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const [items] = await db.execute('SELECT * FROM items WHERE id = ?', [req.params.id]);
  if (items.length === 0) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  const item = items[0];
  if (item.created_by !== req.user.id && req.user.role !== 'admin') {
    const error = new Error('Not authorized to delete this item');
    error.status = 403;
    throw error;
  }
  await db.execute('DELETE FROM items WHERE id = ?', [req.params.id]);
  res.json({ message: 'Item deleted' });
}));

module.exports = router;