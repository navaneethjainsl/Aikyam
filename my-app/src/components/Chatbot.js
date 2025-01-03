'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

function VoiceIcon({ isListening }) {
  return (
    <div className={`relative w-6 h-6 rounded-full bg-black flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-center gap-[2px]">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-[2px] bg-white rounded-full transition-all duration-200 ${
              isListening 
                ? 'animate-soundwave' 
                : 'h-2'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentInterimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            setMessage(finalTranscript.trim());
            setInterimTranscript('');
          } else {
            currentInterimTranscript += transcript;
          }
        }
        
        setInterimTranscript(currentInterimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      setRecognition(recognition);
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      const authToken = getCookie('authToken');

      try {
        const response = await axios.get('http://localhost:5000/api/user/chatbot', {
          headers: {
            'auth-token': authToken,
          },
          params: {
            question: message,
          },
        });

        const botResponse = {
          id: Date.now(),
          text: response.data.message,
          sender: 'bot',
        };
        setChatHistory((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);

        const errorMessage = {
          id: Date.now(),
          text: 'Sorry, something went wrong. Please try again later.',
          sender: 'bot',
        };
        setChatHistory((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
      setMessage('');
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
                  className={`p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 ml-auto'
                      : 'bg-[#2a3353] mr-auto'
                  } max-w-[70%]`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col gap-2">
            {interimTranscript && (
              <div className="text-sm text-gray-400 italic">
                {interimTranscript}...
              </div>
            )}
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
              <button 
                onClick={toggleListening}
                className={`p-3 rounded-xl hover:opacity-90 transition-all ${
                  isListening 
                    ? 'bg-purple-600' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-400'
                }`}
              >
                <VoiceIcon isListening={isListening} />
              </button>
            </div>
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

