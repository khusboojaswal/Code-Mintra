import React, { useState, useEffect } from 'react';
import axios from './api/axios';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { months } from './utils/helpers';
import './App.css';

const App = () => {
  const [month, setMonth] = useState(3); // Default to March
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    const response = await axios.get('/transactions', { params: { month, search, page } });
    setTransactions(response.data);
  };

  const fetchStatistics = async () => {
    const response = await axios.get('/statistics', { params: { month } });
    setStatistics(response.data);
  };

  const fetchBarChartData = async () => {
    const response = await axios.get('/bar-chart', { params: { month } });
    setBarChartData(response.data);
  };

  const fetchPieChartData = async () => {
    const response = await axios.get('/pie-chart', { params: { month } });
    setPieChartData(response.data);
  };

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>
      <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TransactionsTable transactions={transactions} />
      <Statistics statistics={statistics} />
      <BarChart data={barChartData} />
      <PieChart data={pieChartData} />
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
    </div>
  );
};

export default App;
