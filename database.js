const mongoose = require('mongoose');

// MongoDB Connection URI - using provided local connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ledgercore';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB: ' + MONGODB_URI))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'EMPLOYEE' },
    phone: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: { type: String },
    uniqueId: { type: String },
    profileImage: { type: String },
    twoFactorEnabled: { type: Boolean, default: false }
});

// Expense Schema
const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping custom ID for frontend compatibility
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'PENDING' }
});

// Budget Schema
const budgetSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    limit: { type: Number, required: true }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    read: { type: Boolean, default: false }
});

// Settings Schema
const settingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null for global settings
    sessionTimeout: { type: Number, default: 30 },
    loginNotifications: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = {
    User,
    Expense,
    Budget,
    Notification,
    Settings,
    mongoose
};
