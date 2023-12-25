const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectId;
let answer = new Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
      default: "no name",
    },
    stock_name: {
      type: String,
      default: null,
    },
    expected_amount: {
      type: Number,
      default: "no email",
    },
    stockprice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "pending",
    },
    lots: {
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
module.exports = mongoose.model("share", answer);
