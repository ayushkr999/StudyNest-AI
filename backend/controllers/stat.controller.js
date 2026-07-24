import Note from "../models/note.model.js";
import Pdf from "../models/pdf.model.js";
import User from "../models/user.model.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const notesCount = await Note.countDocuments({ user: userId });
    const pdfCount = await Pdf.countDocuments({ user: userId });
    const user = await User.findById(userId);
    const aiQueries = user?.aiQueries || 0;

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const notes = await Note.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo },
    }).select("createdAt");
    const pdfs = await Pdf.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo },
    }).select("createdAt");

    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD

      chartData.push({
        date: dateStr,
        notes: notes.filter(
          (n) => n.createdAt.toISOString().slice(0, 10) === dateStr
        ).length,
        pdfs: pdfs.filter(
          (p) => p.createdAt.toISOString().slice(0, 10) === dateStr
        ).length,
      });
    }

    res.json({ notesCount, pdfCount, aiQueries, chartData });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
