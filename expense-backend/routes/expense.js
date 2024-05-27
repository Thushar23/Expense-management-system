// routes/expense.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import MySQL connection from db.js

// Route for creating a new expense
router.post('/', async (req, res) => {
  const { category_id, description, amount, type, date } = req.body;

  // Validate request body
  if (!category_id || !description || !amount || !type || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert new expense into the database
    const result = await pool.query(
      'INSERT INTO expenses (category_id, description, amount, type, date) VALUES (?, ?, ?, ?, ?)',
      [category_id, description, amount, type, date]
    );

    // Retrieve the newly created expense from the database, including category name
    const [rows] = await pool.query(
      `SELECT e.*, c.name AS category_name 
       FROM expenses e
       INNER JOIN categories c ON e.category_id = c.c_id
       WHERE e_id = ?`,
      [result.insertId]
    );

    // Send the created expense data in the response
    res.status(201).json({ message: 'Expense created successfully', expense: rows[0] });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Route for retrieving all expenses
router.get('/', async (req, res) => {
  try {
    // Retrieve all expenses from the database, including category name
    const [rows] = await pool.query(
      `SELECT e.*, c.name AS category_name 
       FROM expenses e
       INNER JOIN categories c ON e.category_id = c.c_id`
    );
    // Send the fetched expenses in the response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
});

// Route for retrieving a single expense by ID
router.get('/:e_id', async (req, res) => {
  const { e_id } = req.params;
  try {
    // Retrieve the expense with the specified ID from the database
    const [rows] = await pool.query('SELECT * FROM expenses WHERE e_id = ?', [e_id]);

    // Check if the expense exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Send the fetched expense in the response
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to retrieve expense' });
  }
});

// Route for updating an existing expense by ID
router.put('/:e_id', async (req, res) => {
  const { e_id } = req.params;
  const { category_id, description, amount, type, date } = req.body;

  // Validate request body
  if (!category_id || !description || !amount || !type || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Update the expense with the specified ID in the database
    const result = await pool.query(
      'UPDATE expenses SET category_id = ?, description = ?, amount = ?, type = ?, date = ? WHERE e_id = ?',
      [category_id, description, amount, type, date, e_id]
    );

    // Check if the expense was updated successfully
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Send a success message in the response
    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Route for deleting an existing expense by ID
router.delete('/:e_id', async (req, res) => {
  const { e_id } = req.params;

  try {
    // Delete the expense with the specified ID from the database
    const result = await pool.query('DELETE FROM expenses WHERE e_id = ?', [e_id]);

    // Check if the expense was deleted successfully
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Send a success message in the response
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Route for calculating the total expense
router.get('/total-expense', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT SUM(amount) AS totalExpense FROM expenses WHERE type = "expense"');
    res.json({ totalExpense: result[0].totalExpense });
  } catch (error) {
    console.error('Error calculating total expense:', error);
    res.status(500).json({ error: 'Failed to calculate total expense' });
  }
});

// Route for calculating the total income
router.get('/total-income', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT SUM(amount) AS totalIncome FROM expenses WHERE type = "income"');
    res.json({ totalIncome: result[0].totalIncome });
  } catch (error) {
    console.error('Error calculating total income:', error);
    res.status(500).json({ error: 'Failed to calculate total income' });
  }
});

// Route to fetch category-wise expense data
router.get('/category-wise-expense', async (req, res) => {
  try {
    // Query the database for category-wise expenses
    const categoryWiseExpenses = await pool.query(`
      SELECT c.name AS category_name, SUM(e.amount) AS totalExpense
      FROM expenses e
      JOIN categories c ON e.category_id = c.c_id
      WHERE e.type = 'expense'
      GROUP BY e.category_id
    `);

    // Check if any expenses were found
    if (!categoryWiseExpenses || categoryWiseExpenses.length === 0) {
      return res.status(404).json({ error: 'No expenses found' });
    }

    res.json(categoryWiseExpenses);
  } catch (error) {
    console.error('Error fetching category-wise expense data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  
module.exports = router;
