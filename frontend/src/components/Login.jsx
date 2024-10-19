import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://chat-app-backend-seven-kappa.vercel.app/api/auth/login', { username, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      console.log(response.data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={styles.input}
          required 
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={styles.input}
          required 
        />
        <button type="submit" style={styles.button}>Login</button>
        <Link to="/register" style={styles.link}>
          <button type="button" style={styles.secondaryButton}>Register</button>
        </Link>
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
    marginBottom: '10px',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    padding: '10px',
    fontSize: '18px',
    color: '#4CAF50',
    backgroundColor: '#fff',
    border: '1px solid #4CAF50',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    width:'100%',
  },
  link: {
    textDecoration: 'none',
    width:'100%',
  },
};

export default Login;
