import React, { useState } from 'react';
import axios from 'axios';

const Keyboard = () => {
  const [finalText, setFinalText] = useState("");

  const startKeyboard = async () => {
    try {
      const res = await axios.get('http://localhost:8000/start_keyboard'); // Use '/start_keyboard'
      console.log(res.data); // Log the response
    } catch (error) {
      console.error("Error starting keyboard:", error);
    }
  };
  

  const stopKeyboard = async () => {
    try {
      await axios.get('http://localhost:8000/stop_keyboard');
      fetchFinalText();  // Fetch final text after stopping the keyboard
    } catch (error) {
      console.error("Error stopping keyboard:", error);
    }
  };

  const fetchFinalText = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_text');
      setFinalText(response.data.finalText);
    } catch (error) {
      console.error("Error fetching final text:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <p style={styles.text}>{finalText}</p>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={startKeyboard} style={styles.button}>Start Keyboard</button>
        <button onClick={stopKeyboard} style={styles.button}>Stop Keyboard</button>
      </div>
      <div style={styles.keyboardContainer}>
        {/* Render the virtual keyboard here */}
        {/* Example of a few keys */}
        <div style={styles.keyRow}>
          <button style={styles.key}>Q</button>
          <button style={styles.key}>W</button>
          <button style={styles.key}>E</button>
          <button style={styles.key}>R</button>
        </div>
        {/* Add more rows as needed */}
      </div>
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
    backgroundColor: '#282c34',
  },
  textContainer: {
    marginBottom: '20px',
  },
  text: {
    fontSize: '36px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    fontSize: '16px',
    margin: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  keyboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  keyRow: {
    display: 'flex',
    marginBottom: '10px',
  },
  key: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '20px',
    fontSize: '20px',
    margin: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Keyboard;
