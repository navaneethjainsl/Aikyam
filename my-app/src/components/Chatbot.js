
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// VoiceIcon component displays animated sound wave bars
function VoiceIcon({ isListening }) {
  return (
    <div className={`relative w-6 h-6 rounded-full ${isListening ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-center gap-[2px]">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-[2px] bg-white rounded-full transition-all duration-200 ${isListening
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

export default function Chatbot({ setSidebar }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  // const [activeTab, setActiveTab] = useState('chatbot');
  const chatContainerRef = useRef(null);

  setSidebar(true);

  // Initialize welcome message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          id: Date.now(),
          text: "Hello! I'm your Aikyam assistant. How can I help you today?",
          sender: 'bot',
          time: formatTime(new Date())
        }
      ]);
    }
  }, []);

  // Format time as HH:MM AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
        time: formatTime(new Date())
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          const partValue = parts.pop();
          if (partValue) {
            return partValue.split(';').shift();
          }
        }
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
        console.log("response.data.message")
        console.log(response.data.message)
        const botResponse = {
          id: Date.now(),
          text: response.data.message,
          sender: 'bot',
          time: formatTime(new Date())
        };
        setChatHistory((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);

        const errorMessage = {
          id: Date.now(),
          text: 'Sorry, something went wrong. Please try again later.',
          sender: 'bot',
          time: formatTime(new Date())
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
    <div className="container mx-auto max-w-5xl px-4 py-8 bg-navy-blue">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Interactive Assistant</h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Get instant assistance, find information, and explore Aikyam's features through our intelligent
          assistant.
        </p>
      </div>

      {/* <div className="mx-auto bg-[#1c2444] rounded-xl overflow-hidden border border-white/10 mb-6">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'chatbot' ? 'bg-[#2a3353] text-white' : 'text-gray-400 hover:bg-[#232b4d]'
            }`}
            onClick={() => setActiveTab('chatbot')}
          >
            Chatbot
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'multimedia' ? 'bg-[#2a3353] text-white' : 'text-gray-400 hover:bg-[#232b4d]'
            }`}
            onClick={() => setActiveTab('multimedia')}
          >
            Multimedia
          </button>
        </div>
      </div> */}

      <div className="bg-[#1c2444] border border-white/10 rounded-xl">
        <div className="p-4 border-b border-white/10 flex items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <h2 className="font-medium">Aikyam Assistant</h2>
              <p className="text-sm text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 h-[500px] overflow-y-auto p-4"
        >
          <div className="space-y-6">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col max-w-[75%]">
                  {msg.sender === 'bot' && (
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">
                        🤖
                      </div>
                      <span className="text-sm font-medium">Assistant</span>
                    </div>
                  )}
                  <pre
                    className={`p-3 rounded-lg whitespace-pre-wrap break-words ${msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#2a3353] text-white'
                      }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </pre>
                  <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          {interimTranscript && (
            <div className="text-sm text-gray-400 italic mb-2">
              {interimTranscript}...
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#2a3353] rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full hover:opacity-90 transition-all ${isListening
                  ? 'bg-purple-600'
                  : 'bg-[#2a3353] border border-white/10'
                }`}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={sendMessage}
              className="p-3 bg-purple-600 rounded-full hover:opacity-90 transition-opacity"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
