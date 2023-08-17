const express = require("express");
const router = express.Router();
const products = require("../models/Product");
const users = require("../models/User");
const authenticate = require("../authMiddleware");

// Get all products
router.get("/", async (req, res) => {
  res.json(await products.find({}));
});

// Get a specific product by ID
router.get("/:id", authenticate, async (req, res) => {
  const productId = req.params.id;
  const product = await products.findOne({ _id: productId });

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// Create a new product (protected route, accessible to users with "seller" role only)
router.post("/", authenticate, async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: 'Forbidden: Only users with "seller" role can create products.',
    });
  }

  const { amountAvailable, cost, productName } = req.body;

  if (!amountAvailable || !cost || !productName)
    return res.status(400).json({ message: "Please provide all fields" });

  const newProduct = new products({
    amountAvailable,
    cost,
    productName,
    sellerId: req.user._id,
  });
  await newProduct.save();

  res.status(201).json(newProduct);
});

// Update a product (protected route, accessible to users with "seller" role only)
router.put("/:id", authenticate, async (req, res) => {
  if (req.user.role !== "seller")
    return res.status(403).json({
      message: 'Forbidden: Only users with "seller" role can update products.',
    });

  const productId = req.params.id;
  const { amountAvailable, cost, productName } = req.body;

  if (!amountAvailable || !cost || !productName)
    return res.status(400).json({ message: "Please provide all fields" });

  const product = await products.findOne({ _id: productId });

  if (product) return res.status(404).json({ message: "Product not found" });

  if (product.sellerId !== req.user.username) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only update your own products." });
  }

  product.amountAvailable = amountAvailable;
  product.cost = cost;
  product.productName = productName;
  await product.save();

  res.json(product);
});

// Delete a product (protected route, accessible to users with "seller" role only)
router.delete("/:id", authenticate, async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      message: 'Forbidden: Only users with "seller" role can delete products.',
    });
  }

  const productId = req.params.id;

  const product = await products.findOne({ _id: productId });

  if (product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.sellerId !== req.user.username) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only delete your own products." });
  }

  products.deleteOne({ _id: product._id });

  res.json({ message: "Product deleted successfully" });
});

module.exports = router;
