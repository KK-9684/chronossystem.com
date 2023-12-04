const Video = require("../models/videoModel");
const axios = require('axios');
const { Vimeo } = require('@vimeo/vimeo');
const Counter = require("../models/counterModel");

const headers = {
    Authorization: `bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
};

const createVideo = async (req, res) => {
    try {
        const { problem, unit, vno, url, vimeoID} = req.body;
        const is_exist = await Video.findOne({ problem, unit, vno });
        if (is_exist) {
            return res
                .status(400)
                .send({ status: "error", message: "動画はすでに存在します。" });
        } else {
            const newVideo = await Video.create({
                problem,
                unit,
                vno,
                url,
                vimeoID
            });
            return res.status(200).send({data:newVideo, status: "success", message: "動画ファイルが追加されました！" });
        }
    } catch (err) {
        return res.status(500).json({ message: '問題が発生しました。後でもう一度お試しください。', status: "error" });
    }
};

const getVideo = async (req, res) => {
    try {
        let { sort, order, page, limit } = req.body;
        page = + page || 1;
        limit = + limit || 10;
        const _order = order ? order : 1;
        const skip = (page - 1) * limit;
        const _sort = sort ? sort : "created";
        
        const totalVideo = await Video.find().count();
        const totalPages = Math.ceil(totalVideo / limit);
        const vvid = await Counter.findOne({id:"vid"});
        const latestVid = vvid ? vvid.seq: 0;
        const result = await Video.find()
            .skip(skip)
            .limit(limit)
            .sort({ [_sort]: _order });
    
        return res.status(200).send({ result, totalPages, latestVid });
    } catch (error) {
        return res.status(500).json({ message: '問題が発生しました。後でもう一度お試しください。', status: "error" });
    }
};

const getVideoList = async (req, res) => {
    try {
        const {problem, unit} = req.body;
        const result = await Video.find({problem, unit}).sort({vno: 1});
        return res.status(200).send( {result} );
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" });
    }
};

const updateVideo = async (req, res) => {
    try {
        const id = req.params.id;
        const updateInfo = req.body;

        const selectedVideo = await Video.findOne({_id:id});
        if (selectedVideo.vno !== updateInfo.vno) {
            const is_exist = await Video.findOne({ problem:updateInfo.problem, unit:updateInfo.unit, vno:updateInfo.vno});
            if (is_exist) {
                await Video.findByIdAndUpdate(
                    is_exist._id,
                    { vno: selectedVideo.vno},
                    { new: true }
                );
            }
        }
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            updateInfo,
            { new: true }
        );

        if (updatedVideo) {
            return res
                .status(200)
                .send({ status: "success", message: "動画を更新しました!" });
        } else {
            return res.status(400).send({
                status: "error",
                message: "動画の更新に失敗しました",
            });
        }    
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: '問題が発生しました。後でもう一度お試しください。', status: "error" });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const id = req.params.id;
        const selectedVideo = await Video.findById(id);
        if (selectedVideo) {
            const client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);
            const response = await client.request({
                method: 'DELETE',
                path: `/videos/${selectedVideo.vimeoID}?fields=uri`
            });
            if (response.statusCode === 204) {
                const deletedVideo = await Video.findByIdAndDelete(id);
                if (deletedVideo) {
                    return res
                        .status(200)
                        .send({status: "success", message: "動画は削除されました!" });
                } else {
                    return res.status(400).send({
                        status: "error",
                        message: "動画を削除できませんでした",
                    });
                }
            } else {
                return res
                    .status(400)
                    .send({status: "error", message: "Vimeoリクエストエラー!" });
            }
        } else {
            return res
                .status(400)
                .send({status: "error", message: "動画を削除できませんでした。" });
        }    
    } catch (err) {
        return res.status(500).json({ message: '問題が発生しました。後でもう一度お試しください。', status: "error" });
    }
};

const uploadVideo = async (req, res) => {
    try {
        const size = req.body.size;
        const name = req.body.name;
        const id = req.body.id;
        const body = {
            name: name,
            upload: {
                approach: 'tus',
                size,
            },
            privacy: {
                view: 'anybody',
                embed: 'public',
            },
            embed: {
                color: '#4338CA',
            },
        };

        if (id) {
            const selectedVideo = await Video.findById(id);

            if (selectedVideo.vimeoID !== req.body.vimeoID) {
                const client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);
                await client.request({
                    method: 'DELETE',
                    path: `/videos/${selectedVideo.vimeoID}?fields=uri`
                });
            }
        }

        const response = await axios.post(
            process.env.VIMEO_API_URL,
            body,
            { headers }
        );
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ message: '問題が発生しました。後でもう一度お試しください。', status: "error" });
    }
}

module.exports = {
    createVideo,
    getVideo,
    getVideoList,
    updateVideo,
    deleteVideo,
    uploadVideo,
};
