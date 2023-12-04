const express = require("express");
const { createPDF, getPDF, getOnePDF, updatePDF, deletePDF, uploadPDF, get_pdfData} = require("../controllers/pdfControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const pdfRouter = express.Router();

pdfRouter.use(authMiddleware);
pdfRouter.post("/pdfs", getPDF);
pdfRouter.get("/pdf_data", get_pdfData);
pdfRouter.post("/pdfs/create_pdf", createPDF);
pdfRouter.post("/pdfs/get_pdf", getOnePDF);
pdfRouter.put("/pdfs/update_pdf/:id", updatePDF);
pdfRouter.delete("/pdfs/delete_pdf/:id", deletePDF);
pdfRouter.post("/pdfs/upload", uploadPDF);

module.exports = pdfRouter;