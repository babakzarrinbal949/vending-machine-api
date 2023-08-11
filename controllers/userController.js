const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../authMiddleware');
const Product = require("../models/Product");

// Sample data for users
const users = [
    new User('seller', 'password123', 0, 'seller'),
    new User('buyer', 'password123', 0, 'buyer'),
];

// Sample data for products
const products = [
    new Product(10, 50, 'Product 1', 'seller'),
    new Product(5, 100, 'Product 2', 'seller'),
];

// Get all users
router.get('/', authenticate, (req, res) => {
    res.json(users);
});

// Get a specific user by ID
router.get('/:id', authenticate, (req, res) => {
    const userId = req.params.id;
    const user = users.find((user) => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
});

// Create a new user
router.post('/', (req, res) => {
    const { username, password, deposit, role } = req.body;

    if (!username || !password || !deposit || !role) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newUser = new User(username, password, deposit, role);
    users.push(newUser);

    res.status(201).json(newUser);
});

// Update a user
router.put('/:id', authenticate, (req, res) => {
    const userId = req.params.id;
    const { username, password, deposit, role } = req.body;

    if (!username || !password || !deposit || !role) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = new User(username, password, deposit, role);
    users[userIndex] = updatedUser;

    res.json(updatedUser);
});

// Delete a user
router.delete('/:id', authenticate, (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);

    res.json({ message: 'User deleted successfully' });
});

// Buy endpoint (protected route)
router.post('/buy', authenticate, (req, res) => {
    const { productId, amount } = req.body;

    if (!productId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid request. Please provide productId and a positive amount.' });
    }

    const user = users.find((user) => user.username === req.user.username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Assume you have a products array with products in the productController
    const product = products.find((product) => product.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (amount > product.amountAvailable) {
        return res.status(400).json({ message: 'Not enough stock available' });
    }

    const totalCost = product.cost * amount;
    if (user.deposit < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Perform the purchase and deduct from the user's deposit and update product stock
    user.deposit -= totalCost;
    product.amountAvailable -= amount;

    res.json({ message: 'Purchase successful', totalSpent: totalCost, productsPurchased: amount });
});

// Deposit endpoint (protected route)
router.post('/deposit', authenticate, (req, res) => {
    const { amount } = req.body;

    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Forbidden: Only users with "buyer" role can deposit money.' });
    }

    if (![5, 10, 20, 50, 100].includes(amount)) {
        return res.status(400).json({ message: 'Invalid coin amount. Only 5, 10, 20, 50, and 100 cent coins are allowed.' });
    }

    const user = users.find((user) => user.username === req.user.username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.deposit += amount;

    res.json({ message: `Successfully deposited ${amount} cents`, deposit: user.deposit });
});

// Reset endpoint (protected route)
router.post('/reset', authenticate, (req, res) => {
    const user = users.find((user) => user.username === req.user.username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.deposit = 0;

    res.json({ message: 'Deposit reset to 0' });
});

module.exports = router;
