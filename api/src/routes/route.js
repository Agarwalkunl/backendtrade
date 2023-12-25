const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/apiauth");
const multer = require("multer");
const upload = multer({ dest: "../../public/images/" });
let {
  register_user_save,
  login_user,
  mcx,
  signout,
  buying,
  mcxBuyOrSell,
  tradeShare,
  user_trades_type,
  cancel_stocks,
  update_password,
} = require("./../controller/controller");
//USER
router.post("/register_user_save", register_user_save);
router.post("/login_user", login_user);
router.post("/signout", signout);
router.post("/order", mcx);
router.post("/buying", buying);
router.post("/mcxBuyOrSellCheck", mcxBuyOrSell);
router.post("/tradeShare", tradeShare);

//Trades
router.post("/user_trades_type", user_trades_type);
router.post("/cancel_stocks", cancel_stocks);
router.post("/update_password", auth, update_password);

module.exports = router;
