const Message = require("../models/Message");

exports.get = async (req, res) => {
  const messages = await Message.find();
  res.render("home", { user: req.user, messages: messages });
};
