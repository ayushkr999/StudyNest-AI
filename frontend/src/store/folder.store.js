import axiosInstance from "../utils/axios";
import { create } from "zustand";

axiosInstance.defaults.withCredentials = true;

export const useFolderStore=create((set,get)=>({
    folders:[],
    loading:false,
    error:null,

    fetchFolders:async()=>{
        try {
            set({loading:true,error:null})
            const res=await axiosInstance.get("/api/folders")
            set({folders:res.data.folders})
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to load folders"})
        }
        finally{
            set({loading:false})
        }
    },

    createFolder:async(name,parent=null)=>{
        try {
            const res=await axiosInstance.post("/api/folders",{name,parent})
            set({folders:[res.data.folder,...get().folders]})
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to create folder"})
        }
        finally{
            set({loading:false})
        }
    },

    updateFolder:async(id,name)=>{
        try {
            const res=await axiosInstance.put(`/api/folders/${id}`,{name})
            set({
                folders: get().folders.map(f =>
                  f._id === id ? res.data.folder : f
                ),
            });
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to update folder"})
        }
        finally{
            set({loading:false})
        }
    },

    deleteFolder:async(id)=>{
        try {
            await axiosInstance.delete(`/api/folders/${id}`)
            set({
                folders: get().folders.filter(f => f._id !== id),
            });
        } 
        catch (error) {
            set({error:error.response?.data?.message || "Failed to delete folder"})
        }
        finally{
            set({loading:false})
        }
    },
}))