let adminModel = require("../../../model/admin");
let serviceModel = require("../../../model/service");

let transactionModel = require("../../../model/transaction");
let shareModel = require("../../../model/shares");
let admins = require("../../../model/admin");
let notificationModel = require("../../../model/Notification");
let userModel = require("../../../model/user");
let randomstring = require("randomstring");
const twilio = require("twilio");
const xlsx = require("xlsx");
const axios = require("axios");

// Your Twilio Account SID and Auth Token
const accountSid = "ACyour_account_sid";
const authToken = "your_auth_token";

const client = twilio(accountSid, authToken);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { mailsend } = require("../../../utillsfunction/nodemailer");

let mongoose = require("mongoose");
const user = require("../../../model/user");
const stockexchange = require("../../../model/stockexchange");
const shares = require("../../../model/shares");

//USER

exports.register_user_save = async (req) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let number = req.body.mobile;
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    let data = userModel.findOne({ email: email });
    if (data.email) {
      return {
        message: "already exixt",
        data: [],
        sucess: false,
      };
    } else {
      const mailOptions = {
        To: email,
        Subject: "Your OTP Code",
        Text: `Your OTP code is: ${otp}`,
      };
      mailsend(mailOptions);

      let savedata = new userModel({
        name: name,
        email: email,
        password: pass,
        mobile: number,
        otp: otp,
      });
      let saved_data = await savedata.save();
      if (saved_data) {
        return {
          message: "data saved",
          data: saved_data,
          sucess: true,
        };
      } else {
        return {
          message: "data not saved",
          data: [],
          sucess: false,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};
exports.login_user = async (req) => {
  let Id = req.body.Id;
  let data = await userModel.findOne({ Id: Id });
  console.log("Data from database query:", data);

  if (data) {
    let matchpass = bcrypt.compareSync(req.body.pass, data.password);

    if (matchpass) {
      const token = jwt.sign(
        { _id: data._id.toString() },
        process.env.SECRET_KEY
      );
      console.log("Generated token:", token);

      let userData = await userModel.findByIdAndUpdate(
        { _id: data._id },
        { auth_key: token },
        { new: true }
      );

      return {
        message: "User is logged in",
        success: true,
        token: token,
        userData: userData,
        status: 200,
      };
    } else {
      return {
        message: "Invalid credentials",
        success: false,
        status: 400,
      };
    }
  } else {
    return {
      message: "Invalid credentials",
      success: false,
      status: 380,
    };
  }
};

exports.signout = async (req) => {
  try {
    if (req.body.token) {
      const token = req.body.token;
      let data = await userModel.findOneAndUpdate(
        { auth_key: token },
        { auth_key: null },
        { new: true }
      );

      if (data?.auth_key == null) {
        return {
          data: data,
          message: "user is logout",
          sucess: true,
          status: 200,
        };
      } else {
        return {
          data: data,
          message: "user is not logout",
          sucess: false,
          status: 300,
        };
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.mcx = async (req) => {
  try {
    let total_amount = Number(req.body.lots) * Number(req.body.expected_amount);
    let user = await userModel.findOne({ _id: req.body.userid });
    if (user.points >= total_amount) {
      let type = req.body.type;
      let userid = req.body.userid;
      let stockname = req.body.stock_name;
      let expected_amount = Number(req.body.expected_amount);
      let status = "pending";
      let lot = req.body.lots;
      console.log(user);

      let stockdata = new shareModel({
        type: type,
        userid: userid,
        stock_name: stockname,
        expected_amount: expected_amount,
        lots: lot,
        brokrage: user.brokrage,
      });
      await stockdata.save();
      return {
        message: "Stock saved successfully",
        data: stockdata,
        sucess: true,
      };
    } else {
      return {
        message: "Your Balance Is Not Enough For This Transaction ",
        data: [],
        sucess: false,
        status: 400,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.buyOrSell = async (req) => {
  try {
    let user = await userModel.findOne({ _id: req.body.userid });
    if (Number(user.points) >= Number(req.body.expected_amount)) {
      req.body.brokrage = user.brokrage;
      let stockdata = await shares.create(req.body);
      console.log("=user", user);
      let amount = Number(req.body.lots) * Number(user.brokrage);
      console.log("req.body", req.body);
      await transactionModel.create({
        amount: amount,
        userid: req.body.userid,
        status: "credited",
        stock_name: req.body.stock_name,
        type: "brokrage",
        brokrage: user.brokrage,
      });
      await admins.findOneAndUpdate(
        {
          type: "admin",
        },
        {
          $inc: { amount: amount, brokrage: amount },
        },
        { new: true } // This option returns the modified document
      );

      if (req.body.type == "sell") {
        await userModel.findByIdAndUpdate(
          {
            _id: req.body.userid,
          },
          {
            $inc: { points: req.body.expected_amount },
          }
        );
        await userModel.findByIdAndUpdate(
          {
            _id: req.body.userid,
          },
          {
            $inc: { points: -amount },
          }
        );

        await transactionModel.create({
          amount: req.body.expected_amount,
          userid: req.body.userid,
          status: "selling",
          stock_name: req.body.stock_name,
          type: "sell",
          brokrage: user.brokrage,
        });
      } else {
        await userModel.findByIdAndUpdate(
          {
            _id: req.body.userid,
          },
          {
            $inc: { points: -req.body.expected_amount },
          }
        );

        await userModel.findByIdAndUpdate(
          {
            _id: req.body.userid,
          },
          {
            $inc: { points: -amount },
          }
        );

        await transactionModel.create({
          amount: req.body.expected_amount,
          userid: req.body.userid,
          status: "purchase",
          stock_name: req.body.stock_name,
          type: "buy",
          brokrage: user.brokrage,
        });
      }

      return {
        message: "transaction successfully",
        data: stockdata,
        sucess: true,
        status: 200,
      };
    } else {
      return {
        message: "Your Balance Is Not Enough For This Transaction ",
        data: [],
        sucess: false,
        status: 400,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.mcxBuyOrSell = async (req) => {
  try {
    let type = req.body.type;
    let stock_name = req.body.stock_name;
    let actual_price = Number(req.body.actual_price);
    let userid = req.body.userid;
    let user = await userModel.findOne({ _id: userid });
    let sharedata = await shares.aggregate([
      {
        $match: {
          userid: user._id,
          status: "pending",
          expected_amount: actual_price,
          stock_name: stock_name,
        },
      },
    ]);
    for (let item of sharedata) {
      if (item.type == "buy") {
        if (user.points >= item.expected_amount * Number(item.lots)) {
          await userModel.findByIdAndUpdate(
            {
              _id: userid,
            },
            {
              $inc: { points: -(item.expected_amount * Number(item.lots)) },
            }
          );

          await transactionModel.create({
            amount: item.expected_amount * Number(item.lots),
            userid: userid,
            status: "purchase",
            stock_name: stock_name,
            type: "buy",
            brokrage: user.brokrage,
          });

          let data = await shares.findOneAndUpdate(
            {
              _id: item._id,
            },
            { status: "completed" },
            { new: true }
          );

          let amount = Number(data.lots) * Number(user.brokrage);
          await transactionModel.create({
            amount: amount,
            userid: userid,
            status: "credited",
            stock_name: stock_name,
            type: "brokrage",
            brokrage: user.brokrage,
          });
          await admins.findOneAndUpdate(
            {
              type: "admin",
            },
            {
              $inc: { amount: amount },
            },
            { new: true } // This option returns the modified document
          );
        } else {
          // let notificationData = new notificationModel({
          //   message: "Your Balance Is Not Enough To Buy",
          //   status: 400,
          // });
          // await notificationData.save();
          return {
            message: "Your Balance Is Not Enough To Buy",
            data: [],
            sucess: false,
            status: 400,
          };
        }
      } else {
        await userModel.findByIdAndUpdate(
          {
            _id: userid,
          },
          {
            $inc: { points: item.expected_amount * Number(item.lots) },
          }
        );

        await transactionModel.create({
          amount: item.expected_amount * Number(item.lots),
          userid: userid,
          status: "selling",
          stock_name: stock_name,
          type: "sell",
          brokrage: user.brokrage,
        });

        let data = await shares.findOneAndUpdate(
          {
            _id: item._id,
          },
          { status: "completed" },
          { new: true }
        );

        let amount = Number(data.lots) * Number(user.brokrage);
        await transactionModel.create({
          amount: amount,
          userid: userid,
          status: "credited",
          stock_name: stock_name,
          type: "brokrage",
          brokrage: user.brokrage,
        });
        await admins.findOneAndUpdate(
          {
            type: "admin",
          },
          {
            $inc: { amount: amount },
          },
          { new: true } // This option returns the modified document
        );
      }
    }

    const total_brokrage = await transactionModel.aggregate([
      {
        $match: {
          type: "brokrage",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    await admins.findOneAndUpdate(
      {
        type: "admin",
      },
      {
        $set: { brokrage: total_brokrage[0].totalAmount },
      },
      { new: true } // This option returns the modified document
    );

    // let notificationData = new notificationModel({
    //   message: "mcx buy or sell successfully",
    //   status: 200,
    //   userid: req.body.userid,
    // });
    // await notificationData.save();
    return {
      message: "mcx buy or sell successfully",
      data: [],
      sucess: true,
    };
  } catch (error) {
    console.log("error", error);
  }
};

exports.user_trades_type = async (req) => {
  try {
    if (req.body.userid && req.body.status) {
      console.log("req.body", req.body);
      let data = await userModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.body.userid),
          },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "_id",
            foreignField: "userid",
            pipeline: [
              {
                $match: {},
              },
            ],
            as: "transactiondata",
          },
        },
        {
          $lookup: {
            from: "shares",
            localField: "_id",
            foreignField: "userid",
            pipeline: [
              {
                $match: {
                  status: req.body.status,
                },
              },
            ],
            as: "sharesdata",
          },
        },
      ]);

      return {
        message: "user information",
        data: data,
        sucess: true,
        status: 200,
      };
    } else {
      return {
        message: "Something Went Wrong",
        data: [],
        sucess: false,
        status: 400,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.cancel_stocks = async (req) => {
  try {
    if (req.body.shareid) {
      let data = await shareModel.findByIdAndUpdate(
        { _id: req.body.shareid },
        { status: "cancelled" },
        { new: true }
      );

      return {
        message: "Stock is cancelled",
        data: data,
        sucess: true,
        status: 200,
      };
    } else {
      return {
        message: "Something Went Wrong",
        data: [],
        sucess: false,
        status: 400,
      };
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.update_password = async (req) => {
  try {
    let old_password = req.body.oldpassword;
    let new_password = req.body.newpassword;
    let confirm_password = req.body.confirmpassword;

    if (new_password == confirm_password) {
      const password = req.user.password;

      if (req.user) {
        // console.log(foundUser);
        let result = await bcrypt.compare(old_password, password);
        let hashPassword = await bcrypt.hash(new_password, 10);
        if (result == true) {
          let user = await userModel.findOneAndUpdate(
            { _id: req.user._id },
            {
              password: hashPassword,
            },
            {
              new: true,
            }
          );
          if (user) {
            return {
              message: "data updated successfully",
              data: user,
              success: true,
            };
          }
        }

        if (result) {
          return {
            // message: "password updated successfully",
            data: [],
            success: true,
          };
        } else {
          return {
            message: "password did not update",
            data: [],
            success: false,
          };
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
