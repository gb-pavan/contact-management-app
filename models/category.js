// models/category.js
const db = require('../db/database');

// Fetch all categories
exports.getAll = (callback) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
};

// Create a new category
exports.create = (data, callback) => {
    const { name, type } = data;
    db.run(
        'INSERT INTO categories (name, type) VALUES (?, ?)',
        [name, type],
        function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        }
    );
};
