// controllers/transactionController.js
const Transaction = require('../models/transaction');
console.log('inside top controller')

// // Get all transactions
// exports.getTransactions = (req, res) => {
//     Transaction.getAll((err, transactions) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(transactions);
//     });
// };

// Retrieve transactions for the authenticated user with pagination
exports.getTransactions = (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 5 } = req.query; // Default to page 1, 10 transactions per page
    const offset = (page - 1) * limit;

    Transaction.getTransactions(userId, limit, offset, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving transactions' });
        }
        res.json(rows);
    });
};

// // Add new transaction
// exports.createTransaction = (req, res) => {
//     console.log("yes")
//     const data = req.body;
//     Transaction.create(data, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: 'Transaction added successfully', id: result.id });
//     });
// };

// Add a new transaction for the authenticated user
exports.createTransaction = (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const userId = req.user.userId;

    Transaction.createTransaction(type, category, amount, date, description, userId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating transaction' });
        }
        res.status(201).json({ message: 'Transaction created', transactionId: result.lastID });
    });
};

// Get transaction by ID
exports.getTransactionById = (req, res) => {
    const { id } = req.params;
    Transaction.getById(id, (err, transaction) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    });
};

// Update a transaction
exports.updateTransaction = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    Transaction.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Transaction updated successfully' });
    });
};

// Delete a transaction
exports.deleteTransaction = (req, res) => {
    const { id } = req.params;
    Transaction.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Transaction deleted successfully' });
    });
};

console.log("just above")

// Function to get a summary of transactions
exports.getSummary = (req, res) => {
    console.log("just innnnn")
    const { startDate, endDate } = req.query;

    console.log("in controller")

    console.log('start date',startDate)

    Transaction.getSummary(startDate, endDate, (err, summary) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const balance = (summary.total_income || 0) - (summary.total_expense || 0);
        res.json({
            total_income: summary.total_income || 0,
            total_expense: summary.total_expense || 0,
            balance,
        });
    });
};
