import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Message from '../models/Message.js';


export const createConversation = async(req, res)=>{
    try{
        const {participants}= req.body;

        const users = await User.find({username:{$in:participants}});

        if(users.length !== participants.length){
            return res.status(404).json({message:"one or more user not found"});
        }

        const participantId = users.map(user=>user._id);
    
        const conversation = new Conversation({participants:participantId});
        await conversation.save();
        res.status(201).json(conversation);

    }catch(err){
        res.status(500).json({message:err.message})
    }
};

export const getConversationByUser = async (req,res)=>{
    try{
        const userId = req.user._id;
        const conversations =await Conversation.find({participants:userId});

        res.status(200).json(conversations);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

//localhost:5000/api/conversation/get-messages/1122
export const getMessagesByConversation = async (req, res) =>{
    const {conversationId}= req.params;
    try{
        const message = await Message.find({conversation:conversationId}).populate('sender' , 'username');

        res.status(200).json(message);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};