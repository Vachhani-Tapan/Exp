const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { User, Expense, Budget, Notification, Settings } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Helper to transform MongoDB document to frontend format
const transform = (doc) => {
    if (!doc) return doc;
    const obj = doc.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
};

// Auth: Sign Up
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, role, managerId, created, uniqueId } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            managerId: managerId || null,
            created,
            uniqueId
        });

        const savedUser = await newUser.save();

        // Create default settings for new user
        await new Settings({ userId: savedUser._id }).save();

        res.json(transform(savedUser));
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(400).json({
            error: err.message.includes('duplicate key')
                ? 'Email already in use'
                : 'Database error: ' + err.message
        });
    }
});

// Auth: Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json(transform(user));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const [users, expenses, budgets, notifications, settingsDoc] = await Promise.all([
            User.find({}),
            Expense.find({}),
            Budget.find({}),
            Notification.find({}),
            Settings.findOne({}) // Just first one as global for now
        ]);

        res.json({
            users: users.map(transform),
            expenses: expenses.map(e => e.toObject()), // Expenses already have a custom 'id' field in schema
            budgets: budgets.map(b => ({ id: b._id.toString(), category: b.category, limit: b.limit })),
            notifications: notifications.map(n => n.toObject()),
            settings: settingsDoc ? { sessionTimeout: settingsDoc.sessionTimeout, loginNotifications: settingsDoc.loginNotifications } : { sessionTimeout: 30, loginNotifications: true }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Expenses
app.post('/api/expenses', async (req, res) => {
    try {
        const expenses = Array.isArray(req.body) ? req.body : [req.body];
        await Expense.insertMany(expenses);
        res.json({ message: 'Expenses saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/expenses/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await Expense.findOneAndUpdate({ id: req.params.id }, { status });
        res.json({ message: 'Expense updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Budgets
app.post('/api/budgets', async (req, res) => {
    try {
        const { category, limit } = req.body;
        await Budget.findOneAndUpdate(
            { category },
            { limit },
            { upsert: true, new: true }
        );
        res.json({ message: 'Budget saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/budgets/:id', async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Users Update/Delete
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, phone, profileImage, twoFactorEnabled, managerId, password } = req.body;
        const update = {};
        if (name) update.name = name;
        if (phone) update.phone = phone;
        if (profileImage !== undefined) update.profileImage = profileImage;
        if (twoFactorEnabled !== undefined) update.twoFactorEnabled = !!twoFactorEnabled;
        if (managerId) update.managerId = managerId;
        if (password) update.password = bcrypt.hashSync(password, 10);

        await User.findByIdAndUpdate(req.params.id, update);
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Notifications
app.post('/api/notifications', async (req, res) => {
    try {
        const notes = Array.isArray(req.body) ? req.body : [req.body];
        await Notification.insertMany(notes);
        res.json({ message: 'Notifications saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notifications/clear', async (req, res) => {
    try {
        const { recipientId } = req.body;
        await Notification.deleteMany({ recipientId });
        res.json({ message: 'Notifications cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Settings
app.put('/api/settings', async (req, res) => {
    try {
        const { sessionTimeout, loginNotifications } = req.body;
        await Settings.findOneAndUpdate({}, { sessionTimeout, loginNotifications: !!loginNotifications }, { upsert: true });
        res.json({ message: 'Settings updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear All
app.post('/api/clear-all', async (req, res) => {
    try {
        await Promise.all([
            Expense.deleteMany({}),
            Budget.deleteMany({}),
            Notification.deleteMany({}),
            User.deleteMany({ role: { $ne: 'ADMIN' } })
        ]);
        res.json({ message: 'Data cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve static frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
