const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Add other fields later if needed (e.g., resetPasswordToken, streak count)
    // resetPasswordToken: {
    //   type: String,
    //   required: true,
    // },
    // resetPasswordExpires: {
    //   type: Date,
    //   required: true,
    // },
    // streakCount: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
