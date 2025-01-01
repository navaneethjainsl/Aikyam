'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send } from 'lucide-react';
import axios from 'axios'; // Ensure Axios is imported

export default function Chatbot() {
  const [message, setMessage] = useState(''); // Manages user input
  const [chatHistory, setChatHistory] = useState([]); // Stores the entire chat history
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of chat history on update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Function to handle message sending
  const sendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
      };

      // Add user message to chat history
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      const authToken = getCookie('authToken')
      console.log(authToken)

      try {
        // Send the message to the backend using Axios with headers
        const response = await axios.get('http://localhost:5000/api/user/chatbot', {
          headers: {
            // 'Accept': '*/*',
            // 'User-Agent': 'React App',
            'auth-token': authToken, // Replace with the actual token
          },
          params: {
            question: message, // Sending the user message as query parameter
          },
        });

        // Add bot's response to chat history
        const botResponse = {
          id: Date.now(),
          text: response.data.message, // Server response
          sender: 'bot',
        };
        setChatHistory((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);

        // Add an error message to the chat history
        const errorMessage = {
          id: Date.now(),
          text: 'Sorry, something went wrong. Please try again later.',
          sender: 'bot',
        };
        setChatHistory((prev) => [...prev, errorMessage]);
      }
    }
  };


  //Handles Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1">
        <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10 h-full flex flex-col">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400">New Chat</div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${msg.sender === 'user'
                      ? 'bg-purple-600 ml-auto'
                      : 'bg-[#2a3353] mr-auto'
                    } max-w-[70%]`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#2a3353] rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Send className="h-5 w-5" />
            </button>
            <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-64 p-6 bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl">
        <h3 className="font-semibold mb-4">Chat History</h3>
        <div className="space-y-2">
          {chatHistory
            .filter((msg) => msg.sender === 'user')
            .map((msg) => (
              <div key={msg.id} className="text-sm text-gray-400 truncate">
                {msg.text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
