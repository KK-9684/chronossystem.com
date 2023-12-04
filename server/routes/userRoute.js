const express = require("express");
const { createUser, getUser, updateUser, deleteUser, sendResetLink} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.use(authMiddleware);
userRouter.post("/users", getUser);
userRouter.post("/users/create_user", createUser);
userRouter.put("/users/update_user/:id", updateUser);
userRouter.delete("/users/delete_user/:id", deleteUser);
userRouter.post("/users/send_reset_link", sendResetLink);

module.exports = userRouter;