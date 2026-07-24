import axiosInstance from "../utils/axios";
import { create } from "zustand";

axiosInstance.defaults.withCredentials = true;

export const useAIStore = create((set) => ({
  loading: false,
  result: "",
  error: null,

  runAIAction: async (folderId, action) => {
    try {
      set({ loading: true, error: null, result: "" });
      const res = await axiosInstance.post(
        `/api/ai/folder/${folderId}`,
        { action },
      );
      set({ result: res.data.result, loading: false });
    } 
    catch (err) {
      console.error("AI Action Error:", err);
      set({
        error: err.response?.data?.message || "Something went wrong",
      });
    }
    finally{
      set({ loading: false });
    }
  },

  clearResult: () => set({ result: "", error: null }),
}));
