import React, { useEffect, useRef, useState } from 'react';
import { Mic, X, StopCircle } from 'lucide-react'; // Import StopCircle icon
import AiMotionAnimation from './AiMotionAnimation';
import axios from 'axios';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support Speech Recognition or Speech Synthesis.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript.trim();
      }
      setQuery(transcript);
    };

    recognition.onend = () => {
      sendQueryToBackend(query);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [query]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const sendQueryToBackend = async (query) => {
    try {
      const authToken = getCookie('authToken')
      console.log(authToken);

      const response = await axios.get('http://localhost:5000/api/user/voice/assistant', {
        headers: {
          // 'Accept': '*/*',
          // 'User-Agent': 'React App',
          'auth-token': authToken, // Replace with the actual token
        },
        params: {
          query: query
        },
      });
      console.log(response.data.message)

      const data = response.data.message;
      console.log(data);

      const utterance = new SpeechSynthesisUtterance(data);
      utterance.lang = 'en-US';
      utterance.voice = synthRef.current.getVoices().find(voice => voice.lang === 'en-US');

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e.error);
      };
      utterance.onend = () => {
        console.log('Speech synthesis finished');
      };

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error communicating with the backend:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      synthRef.current.cancel();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c2444]/90 backdrop-blur-xl rounded-lg p-6 w-96 relative overflow-hidden">
        {/* <div className="absolute inset-0">
          <AiMotionAnimation className="opacity-20" />
        </div> */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Voice Assistant</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center ${isListening ? 'bg-red-600' : 'bg-purple-600'
                }`}
            >
              <Mic className="h-8 w-8 text-white" />
            </button>
            <p className="text-white mt-4">{isListening ? 'Listening...' : 'Press the mic to speak'}</p>
            <p className="text-white text-center mt-2">{query}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
