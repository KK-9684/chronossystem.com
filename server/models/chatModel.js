const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  image: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
