const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let answer = new Schema(
  {
    Stockname: {
      type: String,
      default: "no name",
    },
 
    userId: {
      type: mongoose.Types.ObjectId,
      default: "no email",
    },
    stockprice: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    lot: {
        type: String,
        default: null,
      },
      lotprice: {
        type: String,
        default: null,
      },
      status:{
        type:String,
        default:"pending"
      }

  },
  {
    timestamps: true,
    versionKey: "",
  }
);
module.exports = mongoose.model("stockexchange", answer);
