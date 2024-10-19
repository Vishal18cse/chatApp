import React from 'react'
import { useState , useEffect } from 'react'
import axios from 'axios';

function Conversation({token,setConversationId }) {
  const [conversations , setConversations] = useState([]);

  useEffect(()=>{
    const fetchConversation = async ()=>{
      try{
        const response = await axios.get('http://chat-app-backend-seven-kappa.vercel.app/api/conversations' , {
          headers:{
            'Authorization': `Bearer ${token}`
          }
        })
        setConversations(response.data);
      }catch(err){
        console.log(err);
      }
    }
    fetchConversation();

  },[token])
  return (
    <div>
      {
        conversations.map((conversation)=>(
          <div key={conversation._id} onClick={()=>{setConversationId(conversation._id)}}>
            {conversation.title}
          </div>
        ))
      }
      
    </div>
  )
}

export default Conversation;
