const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const authenticate = require('../authMiddleware');

// Sample data for products
const products = [
    new Product(10, 50, 'Product 1', 'seller'),
    new Product(5, 100, 'Product 2', 'seller'),
];

// Sample data for users (replace this with your database)
const users = [
    new User('seller', 'password123', 0, 'seller'),
    new User('buyer', 'password123', 0, 'buyer'),
];

// Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Get a specific product by ID
router.get('/:id', authenticate, (req, res) => {
    const productId = req.params.id;
    const product = products.find((product) => product.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
});

// Create a new product (protected route, accessible to users with "seller" role only)
router.post('/', authenticate, (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Forbidden: Only users with "seller" role can create products.' });
    }

    const { amountAvailable, cost, productName } = req.body;

    if (!amountAvailable || !cost || !productName) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newProduct = new Product(amountAvailable, cost, productName, req.user.username);
    products.push(newProduct);

    res.status(201).json(newProduct);
});

// Update a product (protected route, accessible to users with "seller" role only)
router.put('/:id', authenticate, (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Forbidden: Only users with "seller" role can update products.' });
    }

    const productId = req.params.id;
    const { amountAvailable, cost, productName } = req.body;

    if (!amountAvailable || !cost || !productName) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[productIndex];

    if (product.sellerId !== req.user.username) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own products.' });
    }

    product.amountAvailable = amountAvailable;
    product.cost = cost;
    product.productName = productName;

    res.json(product);
});

// Delete a product (protected route, accessible to users with "seller" role only)
router.delete('/:id', authenticate, (req, res) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Forbidden: Only users with "seller" role can delete products.' });
    }

    const productId = req.params.id;
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[productIndex];

    if (product.sellerId !== req.user.username) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own products.' });
    }

    products.splice(productIndex, 1);

    res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
