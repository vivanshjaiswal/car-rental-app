import mongoose from "mongoose"
const adminInviteSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    assignedEmail:{
        type:String,
        required:true
    },
    isUsed:{
        type:Boolean,
        default:false 
    }
}); 
const adminInvite=mongoose.model("adminInvite",adminInviteSchema);
export default adminInvite;