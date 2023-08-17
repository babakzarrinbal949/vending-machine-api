const express = require("express");
const router = express.Router();
const users = require("../models/User");
const { generateToken } = require("../auth");

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findOne({ userName: username, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  // Generate a JWT token and store it in the user object
  user.token = generateToken({
    _id: user._id,
    username: user.userName,
    role: user.role,
  });
  await user.save();

  res.json({ message: "Login successful", token: user.token, balance: user.deposit });
});

module.exports = router;
