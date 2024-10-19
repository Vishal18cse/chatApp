import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    Conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    text:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
})

export default mongoose.model('Message' , messageSchema)