//server.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Import MySQL connection from db.js
const userRoutes = require('./routes/users'); // Import user routes
const expenseRoutes = require('./routes/expense'); // Import expense routes
const categoryRoutes = require('./routes/categories'); // Import categories route
const cors = require('cors'); // Import cors middleware

// Create Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Apply CORS middleware
app.use(cors());

// Route for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Retrieve user from the database
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for user registration
app.use('/users', userRoutes);

// Route for expenses
app.use('/expenses', expenseRoutes);

// Route for categories
app.use('/categories', categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
