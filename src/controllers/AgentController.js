const Agent = require("../models/Agent");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (agent) => {
  return jwt.sign(
    { id: agent._id, email: agent.email, role: "agent" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// -------------------------
// REGISTER AGENT
// -------------------------
exports.registerAgent = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await Agent.create({
      name,
      email,
      password: hashedPassword,
      department,
    });

    res.status(201).json({
      message: "Agent created successfully",
      agent,
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------
// LOGIN AGENT
// -------------------------
exports.loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(agent);

    res.json({
      message: "Login successful",
      token,
      agent,
    });
  } catch (error) {
    console.error("Error during agent login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------
// GET ALL AGENTS (Admin Only)
// -------------------------
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("-password");

    res.json({
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------
// GET SINGLE AGENT
// -------------------------
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------
// UPDATE AGENT
// -------------------------
exports.updateAgent = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const agent = await Agent.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.json({
      message: "Agent updated successfully",
      agent,
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------
// DELETE AGENT
// -------------------------
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.json({
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
