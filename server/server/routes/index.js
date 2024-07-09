const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');
const transactionController = require('../controllers/transactionController');

router.get('/seed', seedController.seedDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/bar-chart', transactionController.getBarChart);
router.get('/pie-chart', transactionController.getPieChart);
router.get('/combined', transactionController.getCombinedData);

module.exports = router;
