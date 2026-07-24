import mongoose from "mongoose"

const folderSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder",
        default:null
    }
},
)

const Folder=mongoose.model("Folder",folderSchema)
export default Folder