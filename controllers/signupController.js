require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("express-validator");

const { validationResult, body } = validator;

exports.post = [
  body("firstName", "First Name should be atleast 3 character")
    .exists()
    .escape()
    .isString({ min: 3 }),
  body("lastName", "Last Name should be atleast 3 character")
    .exists()
    .escape()
    .isString({ min: 3 }),
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
      return res.render("sign-up-form", { errors: errors });
    }
    const {
      firstName,
      lastName,
      username,
      password,
      adminPassword,
      memberPassword,
    } = req.body;

    bcrypt.hash(password, 10, async (err, passwordHash) => {
      const isAdmin = adminPassword === process.env.adminPass;
      const user = new User({
        firstName,
        lastName,
        username,
        passwordHash,
        isMember: memberPassword === process.env.memberPass || isAdmin,
        isAdmin,
      });
      try {
        await user.save();
      } catch (e) {
        if (e?.errors?.username) {
          return res.render("sign-up-form", {
            errors: [{ msg: e.errors.username }],
          });
        }
        return res.render("sign-up-form", { errors: e.errors });
      }
      return res.redirect("/login");
    });
  },
];

exports.get = (req, res) => {
  res.render("sign-up-form", { errors: [] });
};
