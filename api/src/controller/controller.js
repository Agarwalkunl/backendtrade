let {
  register_user_save,
  login_user,
  mcx,
  signout,

  mcxBuyOrSell,
  buyOrSell,
  user_trades_type,
  cancel_stocks,
  update_password,
} = require("./../service/service");

//USER

exports.register_user_save = async (req, res) => {
  let data = await register_user_save(req);
  console.log(req.body.email);
  if (data.sucess) {
    res.render("otpsend", { data: data.data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.login_user = async (req, res) => {
  let data = await login_user(req);
  if (data.success) {
    res.send({ message: "login successfully", status: 200, data: data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};
exports.signout = async (req, res) => {
  let data = await signout(req);
  if (data.sucess) {
    res.send({ message: "logout successfully", status: 200, data: data });
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.mcx = async (req, res) => {
  let data = await mcx(req);
  if (data.sucess) {
    res.json(data);
  } else {
    res.json(data);
  }
};

exports.buying = async (req, res) => {
  let data = await buyOrSell(req);
  if (data.sucess) {
    return res.json(data);
  } else {
    return res.json(data);
  }
};

exports.mcxBuyOrSell = async (req, res) => {
  let data = await mcxBuyOrSell(req);
  if (data.sucess) {
    return res.json(data);
  } else {
    return res.json(data);
  }
};

exports.tradeShare = async (req, res) => {
  let data = await buyOrSell(req);
  if (data.sucess) {
    return res.josn(data);
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.user_trades_type = async (req, res) => {
  let data = await user_trades_type(req);
  if (data.sucess) {
    return res.json(data);
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};
exports.cancel_stocks = async (req, res) => {
  let data = await cancel_stocks(req);
  if (data.sucess) {
    return res.json(data);
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};

exports.update_password = async (req, res) => {
  let data = await update_password(req);

  if (data.success) {
    return res.json(data);
  } else {
    res.send({ staus: 400, message: data.message, data: [], sucess: false });
  }
};
