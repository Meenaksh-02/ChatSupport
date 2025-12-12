const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Agent = require("../models/Agent");

const router = express.Router();

// LOGIN AGENT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email: email.toLowerCase() });
    if (!agent) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    agent.status = "online";
    await agent.save();
    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      agent,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// AUTH MIDDLEWARE
function verifyAgent(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.agentId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

// PROTECTED ROUTE EXAMPLE (Agent Dashboard Data)
router.get("/dashboard", verifyAgent, async (req, res) => {
  res.json({ success: true, message: "Agent dashboard loaded!" });
});

module.exports = router;
