import Message from '../models/Message.js';

export const sentMessage = async (req , res) =>{
    const {conversation , sender , text} = req.body;
    try{
        const newMessage = new Message({conversation,sender,text});
        await newMessage.save();
        res.status(200).json(newMessage);

    }catch(err){
        res.status(500).json({message:err.message})
    }
}

export const getMessageByConversation = async (req , res) =>{
    const {conversationId} = req.params;
    try{
        const messages = await Message.find({conversation:conversationId}).populate('sender' , 'username');
        
        res.status(200).json(messages);

    }catch(err){
        res.status(500).json({message:err.message})
    }
}