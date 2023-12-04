const express = require("express");
const { createVideo, getVideo, getVideoList, updateVideo, deleteVideo, uploadVideo } = require("../controllers/videoControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const videoRouter = express.Router();

videoRouter.use(authMiddleware);
videoRouter.post("/videos", getVideo);
videoRouter.post("/videos/create_video", createVideo);
videoRouter.post("/videos/get_video_list", getVideoList);
videoRouter.put("/videos/update_video/:id", updateVideo);
videoRouter.delete("/videos/delete_video/:id", deleteVideo);
videoRouter.post("/videos/upload_video", uploadVideo);

module.exports = videoRouter;