const Chat = require("../models/Chat");
const Agent = require("../models/Agent");

exports.receiveMessage = async (req, res) => {
  try {
    const { visitorId, message } = req.body;

    let chat = await Chat.findOne({ visitorId });

    // NEW CHAT
    if (!chat) {
      const agent = await Agent.findOne({ status: "online" }).sort({
        currentChats: 1,
      });

      if (!agent) {
        chat = await Chat.create({
          visitorId,
          agentId: "0",
          assigned: true,
          messages: [{ sender: "visitor", text: message }],
        });
      } else {
        chat = await Chat.create({
          visitorId,
          agentId: agent._id,
          assigned: true,
          messages: [{ sender: "visitor", text: message }],
        });
      }

      agent.currentChats++;
      await agent.save();

      // Notify agent dashboard
      global.io.emit("new_chat", chat);
    } else {
      // OLD CHAT
      chat.messages.push({ sender: "visitor", text: message });
      await chat.save();

      global.io.emit("new_message", {
        chatId: chat._id,
        message,
      });
    }

    res.json({ reply: "Agent will reply shortly" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
