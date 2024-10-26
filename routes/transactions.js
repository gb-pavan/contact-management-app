// routes/transactions.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');

console.log("inside routes/transactions")

router.get('/',authController.authenticateToken, transactionController.getTransactions);
router.post('/',authController.authenticateToken, transactionController.createTransaction);
router.get('/summary', transactionController.getSummary);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);


module.exports = router;
