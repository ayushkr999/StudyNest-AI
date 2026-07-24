import axiosInstance from "../utils/axios";
import { create } from "zustand";

axiosInstance.defaults.withCredentials = true;

export const useNoteStore=create((set,get)=>({
    notes:[],
    loading:false,
    error:null,

    fetchNotes:async()=>{
        try {
            set({loading:true,error:null})
            const res=await axiosInstance.get("/api/notes")
            set({notes:res.data.notes})
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to load notes"})
        }
        finally{
            set({loading:false})
        }
    },

    createNote:async(title, content = "", folder = null)=>{
        try {
            set({loading:true,error:null})
            const res=await axiosInstance.post("/api/notes",{title,content,folder})
            set({notes:[res.data.note,...get().notes]})
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to create note"})
        }
        finally{
            set({loading:false})
        }
    },

    updateNote:async(id,title,content,folder=null)=>{
        try {
            set({loading:true,error:null})
            const res=await axiosInstance.put(`/api/notes/${id}`,{title,content,folder})
            set({
                notes: get().notes.map(n =>
                  n._id === id ? res.data.note : n
                ),
            });
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to update note"})
        }
        finally{
            set({loading:false})
        }
    },

    deleteNote:async(id)=>{
        try {
            set({loading:true,error:null})
            await axiosInstance.delete(`/api/notes/${id}`)
            set({ notes: get().notes.filter(n => n._id !== id) });
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to delete note"})
        }
        finally{
            set({loading:false})
        }
    }
}))