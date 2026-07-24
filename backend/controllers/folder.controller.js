import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";

export const createFolder=async(req,res)=>{
    try {
        const {name,parent}=req.body
        if(!name){
            return res.status(400).json({success:false,message:"Name is required"})
        }
        const folder=await Folder.create({
            name,
            parent: parent || null,
            user:req.user._id
        });
        return res.status(201).json({success:true,folder})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const getFolders=async(req,res)=>{
    try {
        const folders=await Folder.find({user:req.user._id}).sort({updatedAt:-1});
        return res.status(200).json({success:true,folders})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const updateFolder=async(req,res)=>{
    try {
        const {id}=req.params
        const {name}=req.body

        const folder=await Folder.findOneAndUpdate(
            {_id:id,user:req.user._id},
            {name},
            {new:true}
        );

        if(!folder){
            return res.status(404).json({success:false,message:"Folder not found"})
        }

        return res.status(200).json({success:true,folder})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const deleteFolder=async(req,res)=>{
    try {
        const {id}=req.params
        const folder=await Folder.findOneAndDelete({_id:id,user:req.user._id})

        if(!folder){
            return res.status(404).json({success:false,message:"Folder not found"})
        }

        // Unassign notes from this folder
        await Note.updateMany({ folder: id, user: req.user._id }, { folder: null });

        return res.status(200).json({success:true})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}