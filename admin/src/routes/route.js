const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/adminauth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    let exe = file.originalname.split(".").pop();
    let filename = `${Date.now()}.${exe}`;
    cb(null, filename);
  },
});
const upload = multer({
  storage: storage,
});
let {
  register,
  register_data_save,
  login_data_validation,
  update_service,
  resservice,
  add_admin_service,
  login,
  signout,
  adminprofile,
  profileupdate,
  update_profile,
  dashboard,
  add_admin_service_page,
  update_user_page,
  verify_otp,
  change_pass_page,
  change_pass,
  filter_service,
  transaction_view,
  filter_transaction,
  user_view,
  filter_user,
  mailpage,
  mailsend,
  block,
  registeruser,
  register_user_save,
  update_points,
  update_points_data,
  share_view,
  filter_market,
  delete_user,
  otp_genrate,
  send_mail_otp,
  otp_check,
} = require("./../controller/controller");
//router.get("/register", register);
router.get("/", login);
router.post("/register_data_save", register_data_save);
router.post("/login-data-validation", login_data_validation);
router.get("/dashboard", auth, dashboard);
router.get("/add_admin_services_page", auth, add_admin_service_page);

router.post("/user_update_page", auth, update_user_page);
router.post("/add_admin_service", auth, add_admin_service);
router.post("/verify-otp", verify_otp);

router.post("/update_service", auth, update_service);

router.get("/reservice", auth, resservice);

router.post("/flash", async (req, res) => {
  res.render("/flash");
});
router.get("/signout", signout);
router.get("/adminprofile", auth, adminprofile);
router.get("/profileupdate", auth, profileupdate);
router.get("/change_pass_page", auth, change_pass_page);
router.post("/update_profile", upload.single("image"), auth, update_profile);
router.post("/change_pass", auth, change_pass);
router.post("/filterservice", auth, filter_service);
router.get("/viewtransaction", auth, transaction_view);
router.post("/filtertransaction", auth, filter_transaction);
router.get("/userview", auth, user_view);
router.post("/filteruser", auth, filter_user);
router.post("/filtermarket", auth, filter_market);
router.get("/filteruser", auth, filter_user);
router.post("/user_mail_page", auth, mailpage);
router.post("/send_mail", auth, mailsend);
router.post("/user_block", auth, block);
router.post("/update_points", auth, update_points);
router.get("/update_points", auth, update_points);
router.post("/update_points_data", auth, update_points_data);
router.get("/viewshare", auth, share_view);
router.post("/delete_user", auth, delete_user);
//USER
router.get("/register_user", registeruser);
router.post("/register_user_save", register_user_save);
router.get("/otp_genrate", auth, otp_genrate);
router.post("/send_mail_otp", auth, send_mail_otp);
router.post("/otp_check", auth, otp_check);
module.exports = router;
