const Message = require("../models/Message");
const User = require("../models/User");

exports.getMessages = async (req, res) => {
  const messages = await Message.find().populate("user").exec();
  res.render("home", { user: req.user, messages: messages });
};

function timeStampExtractor(Date) {
  return `${Date.toLocaleDateString()} ${Date.toLocaleTimeString()}`;
}

exports.postMessage = async (req, res) => {
  const { message, title } = req.body;
  const { _id } = req.user;
  const timeStamp = timeStampExtractor(new Date());
  try {
    await new Message({ user: _id, message, title, timeStamp }).save();
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.body;
  try {
    await Message.findByIdAndDelete(id);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
};
