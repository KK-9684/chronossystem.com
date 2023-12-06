const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const ChatUser = require("../models/chatUserModel");
const Counter = require("../models/counterModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendgrid = require("@sendgrid/mail");
const createQRcode = require("../middlewares/createQRcode");

sendgrid.setApiKey(process.env.SENDGRID_PRIVATE_KEY);

const createUser = async (req, res) => {
  try {
    const { email, name, school, grade, level } = req.body;
    const is_exist = await User.findOne({ name });
    if (is_exist) {
      return res
        .status(400)
        .send({ status: "error", message: "Member already exists" });
    } else {
      const hashPassword = await bcrypt.hash("123456", 10);
      const newUser = await User.create({
        email,
        name,
        school,
        grade,
        password: hashPassword,
        level,
      });
      messageSender(newUser);
      return res
        .status(200)
        .send({
          data: newUser,
          status: "success",
          message: "Member add successful!",
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "問題が発生しました。後でもう一度お試しください。",
        status: "error",
      });
  }
};

const getUser = async (req, res) => {
  try {
    let { sort, order, page, limit } = req.body;

    page = +page || 1;
    limit = limit || 10;
    const _order = order ? order : 1;
    const skip = (page - 1) * limit;
    const _sort = sort ? sort : "created";
    const totalUser = await User.find().count();
    const totalPages = Math.ceil(totalUser / limit);
    const uuid = await Counter.findOne({ id: "uid" });
    const latestUid = uuid ? uuid.seq : 0;
    const result = await User.find({
      $or: [{ level: "user" }, { level: "manager" }],
    })
      .skip(skip)
      .limit(limit)
      .sort({ [_sort]: _order });

    return res.status(200).send({ result, totalPages, latestUid });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "問題が発生しました。後でもう一度お試しください。",
        status: "error",
      });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updateInfo = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateInfo, {
      new: true,
    });
    if (updatedUser) {
      return res
        .status(200)
        .send({ status: "success", message: "ユーザーが更新されました！" });
    } else {
      return res.status(400).send({
        status: "error",
        message: "ユーザーの更新に失敗しました",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: "問題が発生しました。後でもう一度お試しください。",
        status: "error",
      });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    await Chat.deleteMany({
      $or: [{ sender: deletedUser.name }, { receiver: deletedUser.name }],
    });
    await ChatUser.deleteMany({ name: deletedUser.name });
    if (deletedUser) {
      return res
        .status(200)
        .send({ status: "success", message: "ユーザーが削除されました！" });
    } else {
      return res.status(400).send({
        status: "error",
        message: "ユーザーの削除に失敗しました。",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "問題が発生しました。後でもう一度お試しください。",
        status: "error",
      });
  }
};

const sendResetLink = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (user) {
      messageSender(user);
    }
    return res.status(200).json({ msg: "success!" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "問題が発生しました。後でもう一度お試しください。" });
  }
};

const messageSender = async (user) => {
  const resetToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "600s" }
  );
  const image_name = await createQRcode(
    `${process.env.RESET_PATH + resetToken}`
  );
  console.log(image_name);
  const message = {
    to: user.email,
    from: process.env.SUPPORT_MAIL,
    templateId: process.env.SENDGRID_TEMPLETE_ID_REGISTER,
    dynamic_template_data: {
      email: user.email,
      reset_link: `${process.env.RESET_PATH + resetToken}`,
      image_name: image_name,
    },
  };

  try {
    await sendgrid.send(message);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "問題が発生しました。後でもう一度お試しください。" });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  sendResetLink,
};
