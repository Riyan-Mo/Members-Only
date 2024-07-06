require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult, body } = require("express-validator");

exports.post = [
  body("username", "User Name should be atleast 3 character")
    .exists()
    .escape()
    .isString({ min: 3 }),
  body("password", "Password should be atleast 8 character")
    .exists()
    .escape()
    .isString({ min: 8 }),
  async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length !== 0) {
      return res.render("login-form", { errors: errors });
    }
    next();
  },
];

exports.get = (req, res) => res.render("login-form", { errors: [] });
