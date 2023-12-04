const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const Chat = require("./models/chatModel");
const ChatUser = require("./models/chatUserModel");
const { Binary } = require("mongodb");
const cron = require("node-cron");
const fs = require("fs");

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: process.env.BASE_IMAGE_PATH,
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage, defParamCharset: 'utf8' });
const socketSessionMap = new Map();

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

const server = require("http").Server(app);
const io = socketio(server, {
  cors: {
    origin: "https://www.chronossystem.com",
  },
});

app.use(express.json());
app.use(require("./routes/loginRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/pdfRoute"));
app.use(require("./routes/videoRoute"));

app.get("/", function (req, res) {
  res.send(`Server is running on port: ${port}`);
});

// Set up a flag to track if the socket is turned on
let isSocketOn = false;

// Define a route to enter the chat room and turn on the socket
app.get("/chat", (req, res) => {
  // Set the flag to true
  isSocketOn = true;
});

io.on("connection", (socket) => {
  socket.on("register", (param) => {
    const name = param.username;
    const level = param.level;
    ChatUser.findOne({ name })
      .then((user) => {
        if (!user) {
          const newUser = new ChatUser({
            name,
            level,
            socket_id: socket.id,
          });
          newUser.save();
        } else {
          const updateUser = ChatUser.findByIdAndUpdate(user._id, {
            socket_id: socket.id,
          }).exec();
        }
        socket.emit("register", true);
      })
      .catch(() => {
        socket.emit("register", false);
      });
  });

  socket.on("more data", (data) => {
    const { name, count } = data;
    Chat.find({ $or: [{ sender: name }, { receiver: name }] })
      .sort({ created: -1 })
      .skip(count)
      .limit(10)
      .exec()
      .then((data) => {
        socket.emit("more data", { name: name, messages: data });
      })
      .catch(() => {
        socket.emit("more data", null);
      });
  });

  socket.on("user list", () => {
    Chat.aggregate([
      {
        $match: {
          level: "user",
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ])
      .then((data) => {
        socket.emit("user list", data);
      })
      .catch((err) => {
        socket.emit("user list", null);
      });
  });

  // Handle chat messages
  socket.on("chat message", (data) => {
    const { sender, receiver, level, message, image } = data;
    const imageName = `${Date.now()}`;
    const newMessage = new Chat({
      sender,
      receiver,
      level,
      message,
      image: image ? imageName : "",
    });
    if (image) {
      fs.writeFile(
        process.env.BASE_IMAGE_PATH + imageName,
        image,
        (error) => {}
      );
    }

    newMessage
      .save()
      .then((savedMessage) => {
        if (savedMessage) {
          //   socket.emit("chat message", savedMessage);
          io.emit("chat message", savedMessage);
          //   if (level === "user") {
          //     ChatUser.find({ $or: [{ level: "master" }, { level: "manager" }] })
          //       .exec()
          //       .then((users) => {
          //         if (users.length) {
          //           for (let i = 0; i < users.length; i++) {
          //             const socketId = socketSessionMap.get(sessionId);
          //             io.to(users[i].socket_id).emit(
          //               "chat message",
          //               savedMessage
          //             );
          //           }
          //         }
          //       });
          //   } else {
          //     ChatUser.findOne({ name: receiver })
          //       .exec()
          //       .then((user) => {
          //         if (user) {
          //           console.log(user.socket_id);

          //           socket.to(user.socket_id).emit("chat message", savedMessage);
          //         }
          //       });
          //   }
        } else {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("disconnect", () => {});
});

cron.schedule("0 0 * * *", () => {
  const currentDate = Date.now();
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  ChatUser.deleteMany({ created: { $lt: sixMonthsAgo } })
    .then(() => {
      console.log("Batch job completed successfully");
    })
    .catch((error) => {
      console.error("Error occurred during batch job:", error);
    });
});

const db_connection = require("./db/conn");

db_connection()
  .then(() => {
    try {
      server.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });
