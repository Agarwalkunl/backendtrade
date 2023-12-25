const mongoose = require("mongoose");
const {
  NumberListInstance,
} = require("twilio/lib/rest/pricing/v1/voice/number");
const Schema = mongoose.Schema;

let answer = new Schema(
  {
    name: {
      type: String,
      default: "no name",
    },

    email: {
      type: String,
      default: "no email",
    },
    password: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    auth_key: {
      type: String,
      default: null,
    },
    brokrage: {
      type: Number,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    mobile: {
      type: Number,
      default: null,
    },
    otp: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("admin", answer);
