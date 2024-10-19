import { useState ,useRef } from 'react';
import {BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom';
//components
import Chat from './components/Chat';
import Conversation from './components/Conversation';
import CreateConversation from './components/CreateConversation';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [token , setToken]= useState(localStorage.getItem('token') || '');
  const [conversationId , setConversationId] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const chatSectionRef = useRef(null); 

  const handleConversationCreated = () => {
    // Scroll to the chat section
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <Router>
      <Routes>
      {
      !token?(
        <>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login setToken={setToken}/>}/>
          <Route path='*' element={<Navigate to='/login'/>}/>
        </>
      ):(
        <>
        <Route path='/create-conversation' element={
          <>
          <CreateConversation token={token} setConversationId={setConversationId} onConversationCreated={handleConversationCreated} />
          <Conversation token={token} setConversationId={setConversationId} currentUserId={currentUserId}/> 
          {
            conversationId &&(
              <div ref={chatSectionRef}> {/* Add the ref here */}
              <Chat token={token} conversationId={conversationId} currentUserId={currentUserId}/>
              </div>
            )
          }
          </>
        }/>
        
        <Route path='*' element={<Navigate to='/create-conversation'/>}/>

        </>
      )
    } 
      </Routes>
    </Router>
  )
}

export default App
