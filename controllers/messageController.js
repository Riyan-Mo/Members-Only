const Message = require("../models/Message");
const User = require("../models/User");
const { validationResult, body } = require("express-validator");

exports.getMessages = async (req, res) => {
  const messages = await Message.find().populate("user").exec();
  res.render("message", { user: req.user, messages: messages });
};

function timeStampExtractor(Date) {
  return `${Date.toLocaleDateString()} ${Date.toLocaleTimeString()}`;
}

exports.postMessage = [
  body("title", "Title is too short").exists().isString({ min: 2 }).escape(),
  body("message", "Message is too short")
    .exists()
    .isString({ min: 2 })
    .escape(),
  async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length === 0) {
      const { message, title } = req.body;
      const { _id } = req.user;
      const timeStamp = timeStampExtractor(new Date());
      try {
        await new Message({ user: _id, message, title, timeStamp }).save();
      } catch (e) {
        console.log(e);
      }
    }
    return res.redirect("/");
  },
];

exports.deleteMessage = async (req, res) => {
  const { id } = req.body;
  try {
    await Message.findByIdAndDelete(id);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/");
};
