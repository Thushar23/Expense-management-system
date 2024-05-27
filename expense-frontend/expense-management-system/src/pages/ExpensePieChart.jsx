// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';

// function ExpensePieChart() {
//   const [categoryExpense, setCategoryExpense] = useState([]);

//   useEffect(() => {
//     const fetchCategoryExpense = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/expenses/category-wise-expense');
//         if (response.ok) {
//           const data = await response.json();
//           setCategoryExpense(data);
//         } else {
//           console.error('Failed to fetch category-wise expense data');
//         }
//       } catch (error) {
//         console.error('Error fetching category-wise expense data:', error);
//       }
//     };

//     fetchCategoryExpense();
//   }, []);

//   // Extract category names and expense amounts for the bar chart
//   const categoryNames = categoryExpense.map(category => category._id);
//   const expenseAmounts = categoryExpense.map(category => category.totalExpense);

//   // Construct data object for the bar chart
//   const chartData = {
//     labels: categoryNames,
//     datasets: [
//       {
//         label: 'Total Expense',
//         data: expenseAmounts,
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Category-wise Expense Distribution</h2>
//       <Bar data={chartData} />
//     </div>
//   );
// }

// export default ExpensePieChart;
