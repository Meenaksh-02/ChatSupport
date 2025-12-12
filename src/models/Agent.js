const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    department: { type: String, default: "general" },
    status: { type: String, default: "offline" },
    currentChats: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
