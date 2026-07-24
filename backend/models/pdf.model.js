import mongoose from "mongoose"

const mongooseSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    textContent:{
        type:String,
        default:""
    }
},)

const Pdf=mongoose.model("Pdf",mongooseSchema)
export default Pdf