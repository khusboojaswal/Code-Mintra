const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.seedDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).send('Database seeded successfully');
  } catch (error) {
    res.status(500).send('Error seeding database: ' + error.message);
  }
};
