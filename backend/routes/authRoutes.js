
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "Registered successfully" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful" });
});

router.get("/dashboard", protect, (req, res) => {
    res.json({ message: "Welcome to Dashboard", user: req.user });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;
