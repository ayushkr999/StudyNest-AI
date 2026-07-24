import Note from "../models/note.model.js";
export const createNote=async(req,res)=>{
    try {
        const {title,content,folder}=req.body
        if(!title){
            return res.status(400).json({success:false,message:"title is required"})
        }
        const note=await Note.create({
            title,
            content: content || "",
            folder:folder || null,
            user:req.user._id
        });
        return res.status(201).json({success:true,note})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const getNotes=async(req,res)=>{
    try {
        const notes=await Note.find({user:req.user._id}).sort({updatedAt:-1});
        return res.status(200).json({success:true,notes})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const updateNote=async(req,res)=>{
    try {
        const {id}=req.params
        const {title,content,folder}=req.body

        const note=await Note.findOneAndUpdate(
            {_id:id,user:req.user._id},
            {title,content,folder:folder || null},
            {new:true}
        );

        if(!note){
            return res.status(404).json({success:false,message:"Note not found"})
        }

        return res.status(200).json({success:true,note})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export const deleteNote=async(req,res)=>{
    try {
        const {id}=req.params
        const note=await Note.findOneAndDelete({_id:id,user:req.user._id})

        if(!note){
            return res.status(404).json({success:false,message:"Note not found"})
        }

        return res.status(200).json({success:true})
    } 
    catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
