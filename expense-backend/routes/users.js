// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the provided email already exists
    const [existingUser] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);
    if (existingUser[0].count > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [newUser] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    // Generate JWT token
    const token = jwt.sign({ id: newUser.insertId, username, email }, 'your_secret_key', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with the provided email exists
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User:', user); // Log the user object
    
    if (!user || !user[0].password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Password:', password); // Log the password
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user[0].id, username: user[0].username, email: user[0].email }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});



module.exports = router;
