const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Protected route that requires JWT token
router.get('/protected', verifyToken, (req, res) => {
  res.json({ 
    message: "Access granted",
    user: req.user
  });
});

module.exports = router; 