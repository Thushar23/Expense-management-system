//pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:3000/expenses');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          console.error('Failed to fetch expenses');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();

    // Fetch user information from local storage or backend API
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Expense deleted successfully!');
        // Remove the deleted expense from the state
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.e_id !== expenseId));
      } else {
        console.error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    // Clear user session and redirect to login page
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <div className="header">
        <h1>Welcome to Expense Management System</h1>
        <div className="user-info">
          {userEmail && <p>Welcome, {userEmail}</p>}
          <button onClick={handleLogout} className='logout-btn'>Logout</button>
        </div>
      </div>
      <div className="expense-management-system">
        <div className="links">
          <Link to="/add-expense" className="btn">Add New Expense</Link>
          <Link to="/analysis" className="btn">View Analysis</Link>
        </div>

        <h2>Expenses</h2>
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.e_id}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
                <td>{expense.type}</td>
                <td>{expense.category_name}</td>
                <td>
                  <button onClick={() => handleDeleteExpense(expense.e_id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="footer">
        <div className="bg-dark text-white text-center py-3">
          <p>&copy; All rights reserved © Thushar Acharya</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
