const Pdf = require("../models/pdfModel");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Counter = require("../models/counterModel");

const storage = multer.diskStorage({
    destination: process.env.BASE_FRONT_PATH,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage, defParamCharset: 'utf8' });

const createPDF = async (req, res) => {
    try {
        const { problem, unit, type, url } = req.body;
        const is_exist = await Pdf.findOne({ problem, unit, type });
        if (is_exist) {
            return res
                .status(400)
                .send({ status: "error", message: "PDF はすでに存在します。" });
        } else {
            const newPdf = await Pdf.create({
                problem,
                unit,
                type,
                url
            });
            return res.status(200).send({ data: newPdf, status: "success", message: "PDFファイルが追加されました！" });
        }
    } catch (err) {
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

const getPDF = async (req, res) => {
    try {
        let { sort, order, page, limit } = req.body;
        page = + page || 1;
        limit = + limit || 10;
        const _order = order ? order : 1;
        const skip = (page - 1) * limit;
        const _sort = sort ? sort : "created";
        
        const totalPdf = await Pdf.find().count();
        const totalPages = Math.ceil(totalPdf / limit);
        const ppid = await Counter.findOne({id:"pid"});
        const latestPid = ppid ? ppid.seq: 0;
        const result = await Pdf.find()
            .skip(skip)
            .limit(limit)
            .sort({ [_sort]: _order });
    
        return res.status(200).send({ result, totalPages, latestPid });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" });
    }
};

const getOnePDF = async (req, res) => {
    try {
        const {problem, unit, type} = req.body;
        const result = await Pdf.findOne({problem, unit, type});
        return res.status(200).send( {result} );
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" });
    }
};

const get_pdfData = async (req, res) => {
    try {
        const {problem, unit, type} = req.query;
        const result = await Pdf.findOne({problem, unit, type});
        const parentDir = path.dirname(__dirname);
        // const pdfPath = path.join( path.dirname(parentDir), "client/src/assets/pdfs" + result.url);
        const pdfPath = path.join( path.dirname(parentDir), "xxxs/" + result.url);
        res.sendFile(pdfPath);
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "error" });
    }
};

const updatePDF = async (req, res) => {
    try {
        const id = req.params.id;
        const updateInfo = req.body;
        const selectedPdf = await Pdf.findById(id);

        if (selectedPdf.url !== req.body.url) {
            fs.unlinkSync( process.env.BASE_FRONT_PATH + selectedPdf.url);
        }

        const updatedPdf = await Pdf.findByIdAndUpdate(
            id,
            updateInfo,
            { new: true }
        );
        
        if (updatedPdf) {
            return res
                .status(200)
                .send({ status: "success", message: "PDFファイルを更新しました!" });
        } else {
            return res.status(400).send({
                status: "error",
                message: "PDFファイルの更新に失敗しました。",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

const deletePDF = async (req, res) => {
    try {
        const id = req.params.id;
        const selectedPdf = await Pdf.findById(id);
        if (selectedPdf) {
            fs.unlinkSync( process.env.BASE_FRONT_PATH + selectedPdf.url );
        }
        const deletedPdf = await Pdf.findByIdAndDelete(id);
    
        if (deletedPdf) {
            return res
                .status(200)
                .send({status: "success", message: "PDF ファイルが削除されました!" });
        } else {
            return res.status(400).send({
                status: "error",
                message: "PDFファイルの削除に失敗しました",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

const uploadPDF = async (req, res) => {
    try {
        upload.single('file')(req, res, (err) => {
            if (err) {
              return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: 'error' });
            }
            return res.status(200).send({ status: 'success', message: 'PDFファイルをアップロードしました!' });
        });
    } catch (error) {
        return res.status(500).json({ message: "問題が発生しました。後でもう一度お試しください。", status: "error" });
    }
};

module.exports = {
    createPDF,
    getPDF,
    getOnePDF,
    updatePDF,
    deletePDF,
    uploadPDF,
    get_pdfData
};
