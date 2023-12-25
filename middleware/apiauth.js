const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const auth = async (req, res, next) => {
  try {
    //console.log("-------------req.url--------------------------",req.url);
    const token = req.header("Authorization").replace("Bearer ", "");
    //console.log("verify", token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let data = await userModel.findOne({ _id: decoded._id });
    //console.log("data",data.status=="activated")
    // console.log(decoded);

    if (data.access == false) {
      return res.status(401).json(
        Object.assign(
          { success: false },
          {
            status: false,
            msg: "User is blocked",
          }
        )
      );
    }

    if (!decoded) {
      throw new Error();
    }
    req.user = data;
    next();
  } catch (e) {
    token = {
      status: false,
      msg: "Invalid Token",
    };
    return res.status(401).json(Object.assign({ success: false }, token));
  }
};
module.exports = auth;
