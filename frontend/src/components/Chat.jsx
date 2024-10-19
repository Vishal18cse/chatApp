import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://chat-app-backend-seven-kappa.vercel.app');

function Chat({ token, conversationId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null); // Ref to track the end of the message list

  // Scroll to the bottom of the chat box
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);  // Ensures it runs after rendering completes
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `https://chat-app-backend-seven-kappa.vercel.app/api/messages/${conversationId}`,{},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
    socket.emit('join conversation', conversationId);

    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    return () => {
      socket.emit('leave conversation', conversationId);
      socket.off('chat message');
    };
  }, [conversationId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      console.log(messages);
      const response = await axios.post(
        `https://chat-app-backend-seven-kappa.vercel.app/api/messages`,
        {
          conversation: conversationId,
          sender: currentUserId,
          text: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit('chat message', response.data);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Chat</h2>
      <div style={styles.chatBox}>
        <ul style={styles.messageList}>
          {messages.map((msg) => (
            <li
              key={msg._id}
              style={{
                ...styles.messageItem,
                ...(msg.sender === currentUserId
                  ? styles.ownMessage
                  : styles.otherMessage),
              }}
            >
              {msg.sender.username}
              <span>{msg.text} </span>
              <sub>{formatTime(msg.createdAt)}</sub>
            </li>
          ))}
          <div ref={chatEndRef} /> 
        </ul>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '95vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  heading: {
    marginBottom: '10px',
    fontSize: '28px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  chatBox: {
    flex: 1,
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: 0,
    margin: 0,
  },
  messageItem: {
    listStyle: 'none',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  ownMessage: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  form: {
    display: 'flex',
    width: '100%',
    maxWidth: '400px',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Chat;
