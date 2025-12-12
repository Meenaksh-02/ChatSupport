const express = require("express");
const { receiveMessage } = require("../controllers/chatController");
const Chat = require("../models/Chat");

const router = express.Router();

// USER SENDS MESSAGE
router.post("/chat", receiveMessage);

// ADMIN GET ALL CHATS
router.get("/chat/all", async (req, res) => {
  try {
    const agentId = req.query.agentId;
    if (!agentId) return res.json([]);
    const msgs = await Chat.find({ agentId }).populate("agentId");
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/chat/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN SENDS REPLY TO USER
router.post("/chat/reply", async (req, res) => {
  try {
    const { chatId, message } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({
      sender: "agent",
      text: message,
      time: new Date(),
    });

    await chat.save();

    global.io.emit(`agent_reply${chat.visitorId}`, {
      visitorId: chat.visitorId,
      message,
    });

    res.json({ success: true, message: "Reply sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
