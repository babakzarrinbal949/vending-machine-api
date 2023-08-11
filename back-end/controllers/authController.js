const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../auth');

// Sample data for users (replace this with your database)
const users = [
    new User('seller', 'password123', 0, 'seller'),
    new User('buyer', 'password123', 0, 'buyer'),
];

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token and store it in the user object
    user.token = generateToken({ username: user.username, role: user.role });

    res.json({ message: 'Login successful', token: user.token });
});

module.exports = router;
