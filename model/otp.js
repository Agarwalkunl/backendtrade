const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let answer = new Schema(
  {
    otp: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("otp", answer);
