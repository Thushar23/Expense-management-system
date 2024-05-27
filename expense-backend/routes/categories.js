// routes/categories.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route for fetching all categories
router.get('/', async (req, res) => {
  try {
    // Retrieve all categories from the database
    const [categories] = await pool.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

module.exports = router;
