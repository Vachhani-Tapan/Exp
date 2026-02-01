const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, '.ledgercore.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        phone TEXT,
        managerId INTEGER,
        created TEXT,
        uniqueId TEXT,
        profileImage TEXT,
        twoFactorEnabled INTEGER DEFAULT 0
    )`);

    // Expenses table
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        employeeId INTEGER,
        name TEXT,
        amount REAL,
        category TEXT,
        date TEXT,
        status TEXT,
        FOREIGN KEY (employeeId) REFERENCES users(id)
    )`);

    // Budgets table
    db.run(`CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE,
        limit_amount REAL
    )`);

    // Notifications table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        recipientId INTEGER,
        message TEXT,
        date TEXT,
        read INTEGER DEFAULT 0,
        FOREIGN KEY (recipientId) REFERENCES users(id)
    )`);

    // Settings table (per user)
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        userId INTEGER PRIMARY KEY,
        sessionTimeout INTEGER DEFAULT 30,
        loginNotifications INTEGER DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);
});

module.exports = db;
