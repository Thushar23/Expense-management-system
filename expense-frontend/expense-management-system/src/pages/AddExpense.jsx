//AddExpense.jsx
import React, { useState, useEffect } from 'react';

function AddExpense() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('expense'); // Default type
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      description,
      amount,
      date,
      type,
      category_id: categoryId,
    };

    try {
      const response = await fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        console.log('Expense added successfully!');
      } else {
        console.error('Failed to add expense');
      }

      // Clear form inputs after submission
      setDescription('');
      setAmount('');
      setDate('');
      setType('expense'); // Reset type to default
      setCategoryId(''); // Reset categoryId
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='addexpense'>
     <div className="formcontainer">
      <div className="formheader">
        <h1>Add New Expense</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-input">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-input">
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-input">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-input">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.c_id} value={category.c_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Expense</button>
      </form>
    </div>
    </div>
  );
}

export default AddExpense;
