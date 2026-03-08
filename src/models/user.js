const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator')
require('dotenv').config();
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long'],
      maxlength: [20, 'First name cannot exceed 20 characters'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email: " + value)
      },
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      required: true
    },
    age: {
      type: Number,
      min: 18
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a gender type`
      }
    },
    photoUrl: {
      type: String,
      default: "",
      validate(value) {
        if (value && !validator.isURL(value)) throw new Error("Invalid photo URL: " + value)
      }
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);

