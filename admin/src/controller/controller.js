let userModel = require("../../../model/user");
let shares = require("../../../model/shares");
let randomstring = require("randomstring");
let {
  register_data_save,
  login_data_validation,
  update_service,
  add_admin_service,
  resservice,
  signout,
  adminprofile,
  update_profile,
  verify_otp,
  change_pass,
  filter_service,
  transaction_view,
  filter_transaction,
  user_view,
  filter_user,
  filter_market,
  mailsend,
  block,
  register_user_save,
  update_points,
  update_points_data,
  shareview,
  delete_user,
  send_mail_otp,
  otp_check,
} = require("./../service/service");
let allfunc = require("./../service/service");
exports.register = async (req, res) => {
  res.render("register");
};

exports.login = async (req, res) => {
  res.render("adminlogin", { message: "" });
};

exports.register_data_save = async (req, res) => {
  let data = await register_data_save(req);
  if (data.sucess) {
    res.render("otpsend", { data: data.data });
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};
exports.login_data_validation = async (req, res) => {
  let data = await login_data_validation(req, res);
  console.log("data", data);
  if (data.sucess) {
    let total_user = await userModel.find({});
    res.render("dashboard", { data, total_user: total_user.length });
  } else {
    res.render("adminlogin", { message: "invalid credentials" });
  }
};

exports.dashboard = async (req, res) => {
  if (req.user) {
    let total_user = await userModel.find({});
    res.render("dashboard", { data: req.user, total_user: total_user.length });
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};
exports.add_admin_service_page = async (req, res) => {
  if (req.user) {
    res.render("addservice", { data: req.user });
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};
exports.add_admin_service = async (req, res) => {
  let data = await add_admin_service(req, res);

  if (data.sucess) {
    console.log(data.sucess);
    // req.flash("success","data add succesfully")
    res.redirect("/reservice");
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};

exports.update_user_page = async (req, res) => {
  if (req.user) {
    let data = {
      name: req.user.name,
      id: req.body.id,
    };
    let info = await userModel.findOne({ _id: req.body.id });

    res.render("updateservice", { data, searchdata: info });
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};

exports.update_service = async (req, res) => {
  let data = await update_service(req);
  if (data.sucess) {
    res.redirect("/filteruser");
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};

exports.resservice = async (req, res) => {
  res.locals.message = req.flash();
  let data = await resservice(req, res);
  if (data.sucess) {
    res.render("viewservice", { service: data.data, data, searchdata: {} });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};
exports.signout = async (req, res) => {
  let data = await signout(req, res);
  if (data.sucess) {
    res.redirect("/");
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

exports.profileupdate = async (req, res) => {
  res.render("profileupdate");
};

exports.update_profile = async (req, res) => {
  let data = await update_profile(req);
  if (data.sucess) {
    res.render("adminprofile", { data: data.data });
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};
exports.adminprofile = async (req, res) => {
  res.locals.message = req.flash();
  let data = await adminprofile(req, res);

  if (data.sucess) {
    res.render("adminprofile", { data: data.data });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};
exports.verify_otp = async (req, res) => {
  res.locals.message = req.flash();
  let data = await verify_otp(req, res);
  console.log(data);
  if (data.sucess) {
    res.render("adminlogin");
  } else {
    res.render("register");
  }
};

exports.change_pass_page = async (req, res) => {
  if (req.user) {
    res.render("changepass", { data: req.user, message: "" });
  } else {
    res.render("register");
  }
};

exports.change_pass = async (req, res) => {
  let data = await change_pass(req, res);
  if (data.sucess) {
    res.redirect("/signout");
  } else {
    res.render("changepass", { data: req.user, message: "invalid credential" });
  }
};

exports.filter_service = async (req, res) => {
  res.locals.message = req.flash();
  let data = await filter_service(req, res);
  if (data.sucess) {
    res.render("viewservice", {
      service: data.data,
      data,
      searchdata: req.body,
    });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

exports.transaction_view = async (req, res) => {
  res.locals.message = req.flash();
  let data = await transaction_view(req, res);
  if (data.sucess) {
    res.render("viewtransaction", {
      transaction: data.data,
      data,
      searchdata: {},
    });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

exports.filter_transaction = async (req, res) => {
  res.locals.message = req.flash();
  let data = await filter_transaction(req, res);
  if (data.sucess) {
    res.render("viewtransaction", {
      transaction: data.data,
      data,
      searchdata: req.body,
    });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

exports.user_view = async (req, res) => {
  res.locals.message = req.flash();
  let data = await user_view(req, res);
  if (data.sucess) {
    res.render("viewuser", { user: data.data, data, searchdata: {} });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

//user filter

exports.filter_user = async (req, res) => {
  res.locals.message = req.flash();
  let data = await filter_user(req, res);
  if (data.sucess) {
    res.render("viewuser", { user: data.data, data, searchdata: req.body });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

exports.filter_market = async (req, res) => {
  res.locals.message = req.flash();
  let data = await filter_market(req, res);
  if (data.sucess) {
    res.render("viewuser", { user: data.data, data, searchdata: req.body });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};

//mail page

exports.mailpage = async (req, res) => {
  res.render("mailpage", { data: req.user, to: req.body.email });
};

//mail send
exports.mailsend = async (req, res) => {
  let data = await mailsend(req);
  console.log(data);
  if (data.sucess) {
    res.redirect("/userview");
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};

//block

exports.block = async (req, res) => {
  let data = await block(req);
  if (data.sucess) {
    res.redirect("/userview");
  } else {
    res.send({ staus: 400, message: "not regisred", data: [], sucess: false });
  }
};

//USER

exports.registeruser = async (req, res) => {
  res.render("registeruser");
};

exports.register_user_save = async (req, res) => {
  let data = await register_user_save(req);
  if (data.sucess) {
    res.redirect("/filteruser");
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.otp_genrate = async (req, res) => {
  const otp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });

  res.render("otpmailpage", { data: req.user, otp });
};

exports.send_mail_otp = async (req, res) => {
  let data = await send_mail_otp(req);
  if (data) res.render("otpverifypage", { data, message: "" });
};
exports.otp_check = async (req, res) => {
  let data = await otp_check(req);
  console.log("datadsfdsfdfa", data);
  if (data.success) {
    res.render("otpverifypage", {
      message: "user is authrized",
      data: data.data,
    });
  } else {
    res.render("otpverifypage", {
      message: "user is not authrized",
      data: data.data,
    });
  }
};

exports.update_points_data = async (req, res) => {
  let data = await update_points_data(req);
  if (data.sucess) {
    res.redirect("/update_points");
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.update_points = async (req, res) => {
  console.log("req.body.id", req.body.id, "req.user", req.user);
  res.render("updatepoints", {
    searchdata: { id: req.body.id },
    data: req.user,
  });
};

exports.share_view = async (req, res) => {
  let data = await shareview(req, res);
  console.log("data", data);
  if (data.sucess) {
    res.render("viewshare", {
      searchdata: req.body,
      data: data.data,
      query: req.query,
    });
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};
exports.delete_user = async (req, res) => {
  let data = await delete_user(req, res);
  if (data.sucess) {
    res.redirect("/userview");
  } else {
    res.send({
      staus: 400,
      message: "not applicable service",
      data: [],
      sucess: false,
    });
  }
};
