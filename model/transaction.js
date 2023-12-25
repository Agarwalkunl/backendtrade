const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectId;
let answer = new Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
      default: "no name",
    },
    amount: {
      type: Number,
      default: "no email",
    },
    status: {
      type: String,
      default: "",
    },
    stock_name: {
      type: String,
      default: "",
    },
    brokrage: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    stock_type: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("transaction", answer);
