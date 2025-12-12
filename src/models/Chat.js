const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  agentId: { type: String, default: null },
  assigned: { type: Boolean, default: false },

  messages: [
    {
      sender: { type: String, enum: ["visitor", "agent"], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
