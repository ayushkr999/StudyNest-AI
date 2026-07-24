import { create } from "zustand";
import axiosInstance from "../utils/axios";

axiosInstance.defaults.withCredentials = true;

export const usePDFChatStore = create((set, get) => ({
  uploadedPDFs: [], 
  selectedPDF: null,
  chatHistory: [], 
  loading: false,
  error: null,

  fetchPDFs: async () => {
    try {
      const res = await axiosInstance.get(`/api/pdfs`);
      set({ uploadedPDFs: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      set({ loading: true });
      const res = await axiosInstance.post(`/api/pdfs/upload`, formData);
      set((state) => ({
        uploadedPDFs: [...state.uploadedPDFs, { _id: res.data.pdfId, title: res.data.title }],
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.response?.data?.message || "Upload failed" });
    }
  },

  selectPDF: (pdf) => {
    set({ selectedPDF: pdf, chatHistory: [] });
  },

  sendMessage: async (message) => {
    const { selectedPDF, chatHistory } = get();
    if (!selectedPDF) return;
    set({ chatHistory: [...chatHistory, { role: "user", content: message }], loading: true });

    try {
      const res = await axiosInstance.post(
        `/api/pdfs/${selectedPDF._id}/chat`,
        { message },
      );

      set((state) => ({
        chatHistory: [...state.chatHistory, { role: "ai", content: res.data.result }],
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.response?.data?.message || "AI response failed" });
    }
  },

  clearChat: async () => {
    const { selectedPDF } = get();
    if (!selectedPDF) return;
    try {
      await axiosInstance.post(`/api/pdfs/${selectedPDF._id}/clear-chat`, {}, );
      set({ chatHistory: [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
