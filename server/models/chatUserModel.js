const mongoose = require("mongoose");

const chatUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  socket_id: {
    type: String,
    required: true,
  },
});

const ChatUser = mongoose.model("ChatUser", chatUserSchema);

module.exports = ChatUser;
