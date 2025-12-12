const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const Agent = require("../models/Agent");

const router = express.Router();

// ========== MIDDLEWARE ==========

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

// ========== ADMIN LOGIN ==========

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) return res.status(401).json({ message: "Invalid email" });
  if (admin.password !== password)
    return res.status(401).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  res.json({ token });
});

// ========== DASHBOARD API ==========

router.get("/dashboard", verifyAdmin, async (req, res) => {
  const chats = await Chat.find().sort({ timestamp: -1 });
  res.json(chats);
});

// ========== CREATE AGENT ==========

router.post("/create-agent", verifyAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    // Check duplicate email
    const exists = await Agent.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.json({
        success: false,
        message: "Email already registered. Try another one.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save agent
    const agent = await Agent.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Agent created successfully!",
      agent: {
        name: agent.name,
        email: agent.email,
        createdAt: agent.createdAt,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// ========== GET ALL AGENTS ==========

router.get("/users", verifyAdmin, async (req, res) => {
  const agents = await Agent.find().sort({ createdAt: -1 });
  res.json({ success: true, users: agents });
});

module.exports = router;
