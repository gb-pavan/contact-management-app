const { emit } = require('nodemon');
const db = require('../db/database');

// Function to insert a new user into the database
// exports.createUser = (email, hashedPassword, callback) => {
//     const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
//     db.run(query, [email, hashedPassword], function(err) {
//         callback(err, this);
//     });
// };

// Save user to the database
// exports.createUser = async (email, hashedPassword) => {
//   try {
    

//     // SQL query to insert a new user into the database
//     const query = `INSERT INTO users (email, password, isVerified) VALUES (?, ?, ?)`;

//     return new Promise((resolve, reject) => {
//       db.run(query, [email, hashedPassword, false], function (err) {
//         if (err) return reject(err.message);
//         resolve({ email, password: hashedPassword, isVerified: false, id: this.lastID });
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

exports.createUser = async (email,hashedPassword,callback) => {
    const query = `INSERT INTO users (email,password, isVerified) VALUES (?, ?, ?)`;
    db.run(query, [email,hashedPassword, false], err => {
        callback(err,this);
    });
};


// // Function to fetch a user by username
// exports.getUserByUsername = (email, callback) => {
//     const query = `SELECT * FROM users WHERE email = ?`;
//     db.get(query, [email], (err, user) => {
//         callback(err, user);
//     });
// };

// Find user by email in the database
exports.findUserByEmail = (email) => {
  console.log("email",email);
  const query = `SELECT * FROM users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Verify user by updating `isVerified` flag in the database
exports.verifyUser = (email) => {
  const query = `UPDATE users SET isVerified = ? WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.run(query, [true, email], function (err) {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

// Save OTP to database
exports.saveOtpToDatabase = (email, otp, expiresAt) => {
  const query = `UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [otp, expiresAt, email], function(err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

// Get OTP from database
exports.getOtpFromDatabase = (email) => {
  const query = `SELECT otp, otp_expires_at FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Update user's password
exports.updateUserPassword = (email, hashedPassword) => {
  const query = `UPDATE users SET password = ? WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [hashedPassword, email], function(err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

// Delete OTP from database
exports.deleteOtpFromDatabase = (email) => {
  const query = `UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [email], function(err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}



