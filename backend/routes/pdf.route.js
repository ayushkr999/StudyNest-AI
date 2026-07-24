import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../utils/upload.js";
import {
  chatWithPDF,
  clearPDFChat,
  uploadPDF,
  getPDFs,
} from "../controllers/pdf.controller.js";
const router = express.Router();

router.post("/upload", protectRoute, upload.single("pdf"), uploadPDF);
router.get("/", protectRoute, getPDFs);
router.post("/:pdfId/chat", protectRoute, chatWithPDF);
router.post("/:pdfId/clear-chat", protectRoute, clearPDFChat);

export default router;
