const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// User Registration
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.status = 400;
    throw error;
  }

  // Check if user already exists
  const [existingUsers] = await db.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    const error = new Error('User with this email already exists');
    error.status = 400;
    throw error;
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert new user
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: result.insertId, 
      name, 
      email, 
      role: 'user' 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: result.insertId,
      name,
      email,
      role: 'user'
    }
  });
}));

// User Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.status = 400;
    throw error;
  }

  // Find user by email
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  const user = users[0];

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// Get current user (protected route)
router.get('/me', auth, asyncHandler(async (req, res) => {
  const [users] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );

  if (users.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  res.json({ user: users[0] });
}));

module.exports = router; 