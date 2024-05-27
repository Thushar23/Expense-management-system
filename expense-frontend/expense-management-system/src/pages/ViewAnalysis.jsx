import React, { useState, useEffect } from 'react';
import styles from './ViewAnalysis.module.css';


function ViewAnalysis() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalIncomeTransactions, setTotalIncomeTransactions] = useState(0);
  const [totalExpenseTransactions, setTotalExpenseTransactions] = useState(0);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Fetch total expenses
        const expensesResponse = await fetch('http://localhost:3000/expenses');
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          const expensesTotal = expensesData.reduce((acc, expense) => {
            if (expense.type === 'expense') {
              return acc + parseFloat(expense.amount);
            }
            return acc;
          }, 0);
          setTotalExpenses(expensesTotal);
        } else {
          console.error('Failed to fetch expenses');
        }

        // Fetch total income
        const incomeResponse = await fetch('http://localhost:3000/expenses');
        if (incomeResponse.ok) {
          const incomeData = await incomeResponse.json();
          const incomeTotal = incomeData.reduce((acc, income) => {
            if (income.type === 'income') {
              return acc + parseFloat(income.amount);
            }
            return acc;
          }, 0);
          setTotalIncome(incomeTotal);
        } else {
          console.error('Failed to fetch income');
        }

        // Calculate balance
        const calculatedBalance = totalIncome - totalExpenses;
        setBalance(calculatedBalance);

        // Fetch total transactions
        const transactionResponse = await fetch('http://localhost:3000/expenses');
        if (transactionResponse.ok) {
          const transactionData = await transactionResponse.json();
          setTotalTransactions(transactionData.length);
          
          // Calculate total income transactions
          const totalIncome = transactionData.filter(transaction => transaction.type === 'income').length;
          setTotalIncomeTransactions(totalIncome);
          
          // Calculate total expense transactions
          const totalExpense = transactionData.filter(transaction => transaction.type === 'expense').length;
          setTotalExpenseTransactions(totalExpense);
        } else {
          console.error('Failed to fetch transaction data');
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchFinancialData();
  }, [totalIncome, totalExpenses]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MY EXPENSE TRACKER</h1>
      </header>
      <div className={styles.summary}>
        <div className={styles.box}>
          <h2>Total Expenses</h2>
          <h3>{totalExpenses}</h3>
        </div>
        <div className={styles.box}>
          <h2>Total Income</h2>
          <h3>{totalIncome}</h3>
        </div>
        <div className={styles.box}>
          <h2>Balance</h2>
          <h3>{balance}</h3>
        </div>
      </div>
      <div className={styles.summary}>
        <div className={styles.box}>
          <h2>Total Transactions</h2>
          <h3>{totalTransactions}</h3>
        </div>
        <div className={styles.box}>
          <h2>Total Income Transactions</h2>
          <h3>{totalIncomeTransactions}</h3>
        </div>
        <div className={styles.box}>
          <h2>Total Expense Transactions</h2>
          <h3>{totalExpenseTransactions}</h3>
        </div>
      </div>
    </div>
  );
}

export default ViewAnalysis;
