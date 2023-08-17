const express = require("express");
const router = express.Router();
const users = require("../models/User");
const authenticate = require("../authMiddleware");
const products = require("../models/Product");

// Get all users
router.get("/", authenticate, async (req, res) => {
  res.json(await users.find({}));
});

// Get a specific user by ID
router.get("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const user = await users.findOne({ _id: userId });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json(user);
});

// Create a new user
router.post("/", async (req, res) => {
  const { username, password, deposit, role } = req.body;
  if (!username || !password || !deposit || !role) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const newUser = new users({ userName: username, password, deposit, role });
  await newUser.save();

  res.status(201).json(newUser);
});

// Update a user
router.put("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  const { username, password, deposit, role } = req.body;

  if (!username || !password || !deposit || !role) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const user = await users.findOne({ _id: userId });

  if (!user) return res.status(404).json({ message: "User not found" });

  const updatedUser = await user.updateOne(
    { _id: userId },
    { userName: username, password, deposit, role }
  );

  return res.json(updatedUser);
});

// Delete a user
router.delete("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;
  await users.deleteOne({ _id: userId });
  return res.json({ message: "User deleted successfully" });
});

// Buy endpoint (protected route)
router.post("/buy", authenticate, async (req, res) => {
  const { productId, amount } = req.body;

  if (!productId || !amount || amount <= 0) {
    return res.status(400).json({
      message:
        "Invalid request. Please provide productId and a positive amount.",
    });
  }

  const user = await users.findOne({ _id: req.user._id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Assume you have a products array with products in the productController
  const product = await products.findOne({ _id: productId });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (amount > product.amountAvailable) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  const totalCost = product.cost * amount;
  if (user.deposit < totalCost) {
    return res.status(400).json({ message: "Insufficient funds" });
  }

  // Perform the purchase and deduct from the user's deposit and update product stock
  user.deposit -= totalCost;
  await user.save();
  product.amountAvailable -= amount;
  await product.save();
  res.json({
    message: "Purchase successful",
    totalSpent: totalCost,
    productsPurchased: amount,
  });
});

// Deposit endpoint (protected route)
router.post("/deposit", authenticate, async (req, res) => {
  const { amount } = req.body;

  if (req.user.role !== "buyer") {
    return res.status(403).json({
      message: 'Forbidden: Only users with "buyer" role can deposit money.',
    });
  }

  if (![5, 10, 20, 50, 100].includes(amount)) {
    return res.status(400).json({
      message:
        "Invalid coin amount. Only 5, 10, 20, 50, and 100 cent coins are allowed.",
    });
  }

  const user = await users.findOne({ _id: req.user._id });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.deposit += amount;
  await user.save();
  res.json({
    message: `Successfully deposited ${amount} cents`,
    deposit: user.deposit,
  });
});

// Reset endpoint (protected route)
router.post("/reset", authenticate, async (req, res) => {
  const user = await users.findOne({ _id: req.user.username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.deposit = 0;
  await user.save();
  res.json({ message: "Deposit reset to 0" });
});

module.exports = router;
