import React, { useState } from 'react';
import axios from 'axios';

const CreateConversation = ({ token, setConversationId , onConversationCreated  }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:4000/api/conversations', 
        { participants: [username] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setConversationId(response.data._id);
      onConversationCreated();
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Conversation</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter participant username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={styles.input}
          required 
        />
        <button type="submit" style={styles.button}>Create Conversation</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '32px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default CreateConversation;
