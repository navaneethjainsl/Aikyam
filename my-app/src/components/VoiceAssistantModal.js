// import React, { useEffect, useRef, useState } from 'react';
// import { Mic, X } from 'lucide-react'; // Import necessary icons
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const VoiceAssistantModal = ({ isOpen, onClose }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [query, setQuery] = useState('');
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
//       alert('Sorry, your browser does not support Speech Recognition or Speech Synthesis.');
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.continuous = false;
//     recognition.interimResults = true;

//     recognition.onresult = (event) => {
//       let transcript = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         transcript += event.results[i][0].transcript.trim();
//       }
//       setQuery(transcript);

//       // Send the transcript directly to the backend
//       sendQueryToBackend(transcript);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   const sendQueryToBackend = async (query) => {
//     try {
//       const authToken = getCookie('authToken');

//       const response = await axios.get('http://localhost:5000/api/user/voice/assistant', {
//         headers: {
//           'auth-token': authToken, // Replace with the actual token
//         },
//         params: {
//           query: query,
//         },
//       });

//       const data = response.data.message.trim(); // Trim extra whitespace for consistent comparison
//       console.log(data)
//       // Handle navigation first
//       if (data === 'T1') {
//         navigate('/signLanguage');
//         synthRef.current.cancel();
//         return; // Exit function after navigation
//       } else if (data === 'T2') {
//         navigate('/chatbot');
//         synthRef.current.cancel();
//         return;
//       } else if (data === 'T3') {
//         navigate('/multimedia');
//         synthRef.current.cancel();
//         return;
//       } else if (data === 'T4') {
//         navigate('/accessibilityTools');
//         synthRef.current.cancel();
//         return;
//       } else if (data === 'T5') {
//         navigate('/jobsAndSchemes');
//         synthRef.current.cancel();
//         return;
//       }
      
//         // If no navigation is required, synthesize speech
//         if (data){ 
//           // else{
//           const utterance = new SpeechSynthesisUtterance(data);
//           utterance.lang = 'en-US';
//           utterance.voice = synthRef.current.getVoices().find((voice) => voice.lang === 'en-US');
  
//           utterance.onerror = (e) => {
//             console.error('Speech synthesis error:', e.error);
//           };
//           utterance.onend = () => {
//             console.log('Speech synthesis finished');
//           };
//           synthRef.current.speak(utterance);
//         }
      

//     } catch (error) {
//       console.error('Error communicating with the backend:', error);
//     }
//   };

//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       synthRef.current.cancel();
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const stopSpeaking = () => {
//     synthRef.current.cancel();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-[#1c2444]/90 backdrop-blur-xl rounded-lg p-6 w-96 relative overflow-hidden">
//         <div className="relative z-10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-white">Voice Assistant</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="flex flex-col items-center">
//             <button
//               onClick={toggleListening}
//               className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center ${
//                 isListening ? 'bg-red-600' : 'bg-purple-600'
//               }`}
//             >
//               <Mic className="h-8 w-8 text-white" />
//             </button>
//             <p className="text-white mt-4">{isListening ? 'Listening...' : 'Press the mic to speak'}</p>
//             <button
//               onClick={stopSpeaking}
//               className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
//               style={{
//                 marginTop: '8px',
//                 transition: 'background-color 0.3s ease',
//                 cursor: 'pointer',
//               }}
//             >
//               Stop
//             </button>
//             <p className="text-white text-center mt-2">{query}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceAssistantModal;


import React, { useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react'; // Import necessary icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VoiceAssistantModal = ({ isOpen, onClose, isListen }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [isRequestInProgress, setIsRequestInProgress] = useState(false); // Flag to prevent multiple requests
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support Speech Recognition or Speech Synthesis.');
      return;
    }
   

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;  // Disable interim results to prevent multiple requests

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript.trim();
      }
      setQuery(transcript);

      // Send the transcript directly to the backend
      sendQueryToBackend(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (isOpen && recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isOpen]);

  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const sendQueryToBackend = async (query) => {
    if (isRequestInProgress) return; // Prevent sending multiple requests
    setIsRequestInProgress(true); // Set the flag to true

    try {
      const authToken = getCookie('authToken');
      const response = await axios.get('http://localhost:5000/api/user/voice/assistant', {
        headers: {
          'auth-token': authToken, // Replace with the actual token
        },
        params: {
          query: query,
        },
      });

      const data = response.data.message.trim(); // Trim extra whitespace for consistent comparison
      console.log(data);

      // Cancel any ongoing speech synthesis before starting a new one
      synthRef.current.cancel();

      // Handle navigation first
      if (data === 'T1') {
        navigate('/signLanguage');
        return; // Exit function after navigation
      } else if (data === 'T2') {
        navigate('/chatbot');
        return;
      } else if (data === 'T3') {
        navigate('/multimedia');
        return;
      } else if (data === 'T4') {
        navigate('/accessibilityTools');
        return;
      } else if (data === 'T5') {
        navigate('/jobsAndSchemes');
        return;
      }
      
      // If no navigation is required, synthesize speech
      if (data) {
        const utterance = new SpeechSynthesisUtterance(data);
        utterance.lang = 'en-US';
        utterance.voice = synthRef.current.getVoices().find((voice) => voice.lang === 'en-US');

        utterance.onerror = (e) => {
          console.error('Speech synthesis error:', e.error);
        };
        utterance.onend = () => {
          console.log('Speech synthesis finished');
        };
        synthRef.current.speak(utterance);
      }

    } catch (error) {
      console.error('Error communicating with the backend:', error);
    } finally {
      setIsRequestInProgress(false); // Reset the flag once the request completes
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

  const stopSpeaking = () => {
    synthRef.current.cancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c2444]/90 backdrop-blur-xl rounded-lg p-6 w-96 relative overflow-hidden">
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
              className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center ${
                isListening ? 'bg-red-600' : 'bg-purple-600'
              }`}
            >
              <Mic className="h-8 w-8 text-white" />
            </button>
            <p className="text-white mt-4">{isListening ? 'Listening...' : 'Press the mic to speak'}</p>
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
              style={{
                marginTop: '8px',
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
              }}
            >
              Stop
            </button>
            <p className="text-white text-center mt-2">{query}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
