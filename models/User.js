const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 3,
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isMember: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName + this.lastName}`;
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
