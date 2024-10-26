// models/transaction.js
const db = require('../db/database');

// // Fetch all transactions
// exports.getAll = (callback) => {
//     db.all('SELECT * FROM transactions', [], (err, rows) => {
//         if (err) {
//             return callback(err);
//         }
//         callback(null, rows);
//     });
// };


// Function to get transactions for a user
exports.getTransactions = (userId, limit, offset, callback) => {
    const query = `SELECT * FROM transactions WHERE user_id = ? LIMIT ? OFFSET ?`;
    db.all(query, [userId, limit, offset], (err, rows) => {
        callback(err, rows);
    });
};

// // Create a new transaction
// exports.create = (data, callback) => {
//     const { type, category, amount, date, description } = data;
//     db.run(
//         'INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
//         [type, category, amount, date, description],
//         function (err) {
//             if (err) return callback(err);
//             callback(null, { id: this.lastID });
//         }
//     );
// };

// Function to insert a new transaction
exports.createTransaction = (type, category, amount, date, description, userId, callback) => {
    const query = `INSERT INTO transactions (type, category, amount, date, description, user_id) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [type, category, amount, date, description, userId], function(err) {
        callback(err, this);
    });
};

// Get transaction by ID
exports.getById = (id, callback) => {
    db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        if (err) return callback(err);
        callback(null, row);
    });
};

// Update transaction by ID
exports.update = (id, data, callback) => {
    const { type, category, amount, date, description } = data;
    db.run(
        'UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?',
        [type, category, amount, date, description, id],
        function (err) {
            if (err) return callback(err);
            callback(null, { changes: this.changes });
        }
    );
};

// Delete transaction by ID
exports.delete = (id, callback) => {
    db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
        if (err) return callback(err);
        callback(null, { changes: this.changes });
    });
};

// Function to get the summary of transactions
exports.getSummary = (startDate, endDate, callback) => {
    let query = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
    `;

    const params = [];

    // Adding date filters if provided
    if (startDate && endDate) {
        query += ' WHERE date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    db.get(query, params, (err, summary) => {
        callback(err, summary);
    });
};


