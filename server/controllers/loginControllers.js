const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendgrid = require("@sendgrid/mail");
const {encryptoData, decryptoData, encryptoRemember } = require("../middlewares/cryptoMiddleware");
const createQRcode = require("../middlewares/createQRcode");

sendgrid.setApiKey(process.env.SENDGRID_PRIVATE_KEY);

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({ email:email });
            if (user) {
                let hash = user.password;
                bcrypt.compare(password, hash, function (err, result) {
                    if (err) {
                        return res.status(500).send({ status: "error", message: "問題が発生しました。後でもう一度お試しください。" });
                    }
                    if (result) {
                        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, level:user.level }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
                        return res.status(200).send({ status: "success", message: "ログイン成功！", token: token, user: encryptoRemember({email:email, password:password}) });
                    } else {
                        return res.status(401).send({ status: "error", message: "無効な資格情報。" });
                    }
                });
            } else {
                return res.status(401).send({ status: "error", message: "未登録ユーザー。" });
            }
        } else {
            return res.status(400).send({ status: "error", message: "全て必須項目です。" });
        }
    } catch (err) {
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

const userForgetPassword = async (req, res) => {
    try {
        const param = req.body.user;
        const user = await User.findOne({ email: param });
        if (user) {
            const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "600s" });
            const image_name = await createQRcode(`${process.env.RESET_PATH + resetToken}`);
    
            const message = {
                to: user.email,
                from: process.env.SUPPORT_MAIL,
                templateId: process.env.SENDGRID_TEMPLETE_ID_RESET,
                dynamic_template_data: {
                    email: user.email,
                    reset_link: `${process.env.RESET_PATH + resetToken}`,
                    image_name: image_name
                },
            };

            try {
                await sendgrid.send(message);
                return res.status(201).json({ msg: "メールを確認してください。" });
            } catch (error) {
                return res.status(500).json({ error });
            }

        } else {
            return res.status(401).send({ status: "error", message: "未登録ユーザー。" });
        }
    } catch (err) {
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

const userResetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const hashPassword = await bcrypt.hash(password, 10);
        const key = req.body.key;
        jwt.verify(key, process.env.JWT_SECRET_KEY, async function (err, decoded) {
            if (err) {
                return res.status(401).send({message:"error!"});
            } else {
                await User.findByIdAndUpdate(
                    decoded.userId,
                    { password: hashPassword },
                    { new: true }
                );
                return res.status(201).send({message:"success"});
            }
        });
    } catch (error) {
        return res.status(400).json(error);
    }
}

const userRemember = (req, res) => {
    const {remember} = req.body;
    return res.status(200).json(JSON.parse(decryptoData(remember)));
}

module.exports = {
    userLogin,
    userForgetPassword,
    userResetPassword,
    userRemember
};
