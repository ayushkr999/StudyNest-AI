import Pdf from "../models/pdf.model.js";
import User from "../models/user.model.js";
import ChatUtil from "../utils/chat.util.js";
import fs from "fs";
import path from "path";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const { originalname, filename, path: filePath } = req.file;
    const userId = req.user._id;

    let extractedText = "";
    try {

      const dataBuffer = fs.readFileSync(filePath);

      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");


      const uint8Array = new Uint8Array(dataBuffer);

      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useSystemFonts: true,
      });

      const pdfDocument = await loadingTask.promise;

      let allText = "";
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        allText += pageText + "\n\n";
      }

      extractedText = allText.trim();



      if (!extractedText || extractedText.trim().length === 0) {
        console.warn("PDF text is empty or contains only whitespace");
        extractedText =
          "PDF appears to be empty or contains no extractable text.";
      } else {

      }
    } catch (extractError) {
      console.error("Error extracting PDF text:", extractError);
      console.error("Error details:", {
        message: extractError.message,
        stack: extractError.stack,
      });
      extractedText =
        "Error extracting text from PDF. Please try uploading again.";
    }

    const pdfDoc = await Pdf.create({
      user: userId,
      title: originalname.replace(".pdf", ""),
      fileUrl: `/uploads/${filename}`,
      textContent: extractedText,
    });

    // Initialize vector store for semantic search
    try {
      await ChatUtil.initializePDFVectorStore(pdfDoc._id.toString(), extractedText);
    } catch (vectorError) {
      console.error("Vector store initialization failed:", vectorError);
      // Continue anyway - will fall back to full text search
    }

    res.json({
      success: true,
      pdfId: pdfDoc._id,
      title: pdfDoc.title,
      message: "PDF uploaded and text extracted successfully",
    });
  } catch (error) {
    console.error("Upload PDF Error:", error);
    res.status(500).json({ message: "Failed to upload PDF" });
  }
};

export const getPDFs = async (req, res) => {
  try {
    const userId = req.user._id;
    const pdfs = await Pdf.find({ user: userId }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    console.error("Get PDFs Error:", error);
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
};

export const chatWithPDF = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const pdf = await Pdf.findById(pdfId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (!pdf.user.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (
      !pdf.textContent ||
      pdf.textContent ===
      "Error extracting text from PDF. Please try uploading again."
    ) {
      return res.status(400).json({
        message:
          "PDF text extraction failed. Please try uploading the PDF again or contact support.",
      });
    }

    const aiResponse = await ChatUtil.chatWithHistory({
      pdfId,
      userId,
      pdfText: pdf.textContent,
      userMessage: message,
    });

    await User.findByIdAndUpdate(userId, { $inc: { aiQueries: 1 } });

    res.json({ result: aiResponse });
  } catch (err) {
    console.error("PDF Chat Error:", err);
    res.status(500).json({ message: err.message || "Failed to get AI response" });
  }
};

export const clearPDFChat = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user._id;

    ChatUtil.clearChatHistory(pdfId, userId);
    res.json({ message: "Chat history cleared successfully" });
  } catch (err) {
    console.error("Clear Chat Error:", err);
    res.status(500).json({ message: "Failed to clear chat history" });
  }
};
