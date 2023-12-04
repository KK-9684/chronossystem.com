const express = require("express");
const { userLogin, userForgetPassword, userResetPassword, userRemember } = require("../controllers/loginControllers");

const loginRouter = express.Router();

loginRouter.post("/login", userLogin);
loginRouter.post("/forget_password", userForgetPassword);
loginRouter.post("/reset_password", userResetPassword);
loginRouter.post("/remember", userRemember);

module.exports = loginRouter;