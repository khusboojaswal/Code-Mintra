const Transaction = require('../models/Transaction');

// List Transactions with Search and Pagination
exports.listTransactions = async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;
  const regex = new RegExp(search, 'i');
  const startOfMonth = new Date(2024, month - 1, 1);
  const endOfMonth = new Date(2024, month, 0);

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
      $or: [
        { title: regex },
        { description: regex },
        { price: regex }
      ]
    })
    .skip((page - 1) * perPage)
    .limit(Number(perPage));

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions: ' + error.message);
  }
};

// Statistics API
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(2024, month - 1, 1);
  const endOfMonth = new Date(2024, month, 0);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });

    const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

    res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    res.status(500).send('Error fetching statistics: ' + error.message);
  }
};

// Bar Chart API
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(2024, month - 1, 1);
  const endOfMonth = new Date(2024, month, 0);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    transactions.forEach(transaction => {
      if (transaction.price <= 100) priceRanges['0-100']++;
      else if (transaction.price <= 200) priceRanges['101-200']++;
      else if (transaction.price <= 300) priceRanges['201-300']++;
      else if (transaction.price <= 400) priceRanges['301-400']++;
      else if (transaction.price <= 500) priceRanges['401-500']++;
      else if (transaction.price <= 600) priceRanges['501-600']++;
      else if (transaction.price <= 700) priceRanges['601-700']++;
      else if (transaction.price <= 800) priceRanges['701-800']++;
      else if (transaction.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data: ' + error.message);
  }
};

// Pie Chart API
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(2024, month - 1, 1);
  const endOfMonth = new Date(2024, month, 0);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });

    const categories = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send('Error fetching pie chart data: ' + error.message);
  }
};

// Combined API
exports.getCombinedData = async (req, res) => {
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      exports.getStatistics(req, res),
      exports.getBarChart(req, res),
      exports.getPieChart(req, res)
    ]);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).send('Error fetching combined data: ' + error.message);
  }
};
