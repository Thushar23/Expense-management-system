//App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Change Router to Routes
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import ViewAnalysis from './pages/ViewAnalysis';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} /> 
      <Route path="/add-expense" element={<AddExpense />} />
      <Route path="/analysis" element={<ViewAnalysis />} /> 
    </Routes> 
  );
}

export default App;
