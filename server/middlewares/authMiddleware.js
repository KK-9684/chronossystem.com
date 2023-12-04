const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
   return res.status(401).send("まずログインしてください");
  }

  const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
      if (err) {
        res.status(401).send({message:"タスクを完了するにはログインしてください。"});
      } else {
        req.body.userId = decoded.userId; 
        try {
          const result = await User.findOne({_id: decoded.userId});
          if (result) {
          } else {
            res.status(401).send({message:"登録されたユーザーではありません。"});
          }
        } catch (error) {
          res.status(500).send({message:"サーバーにアクセスできません。"});
        }
        next();
      }
    });
  }

module.exports = authMiddleware;
