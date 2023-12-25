const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let answer = new Schema(
  {
    Message: {
      type: String,
      default: "no name",
    },

    status: {
      type: String,
      default: "no email",
    },
    userid: {
      type: mongoose.Types.ObjectId,
      default: "no name",
    },
  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("Notification", answer);
