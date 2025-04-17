import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mouse, Keyboard } from 'lucide-react';
import LandingPage from './components/Page';
import Sidebar from './components/Sidebar';
import SignLanguageDetector from './components/signLanguage';
import Chatbot from './components/Chatbot';
import Multimedia from './components/media';
import AccessibilityTools from './components/accessibility';
import JobsAndSchemes from './components/JobsSchemes';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import AIMotionIcon from './components/AiMotionIcon';

// Floating buttons component
function FloatingButtons({ toggleVoiceAssistant }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4">
      <button
        onClick={() => window.open('http://localhost:8501/?routes=start_mouse', '_blank')}
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Virtual Mouse"
      >
        <Mouse className="h-8 w-8 text-white" />
      </button>
      <button
        onClick={() => window.open('http://localhost:8501/?routes=start_keyboard', '_blank')}
        className="w-16 h-16 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Virtual Keyboard"
      >
        <Keyboard className="h-8 w-8 text-white" />
      </button>
      <button
        onClick={toggleVoiceAssistant}
        className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Open Voice Assistant"
      >
        <AIMotionIcon className="h-8 w-8 text-white z-10" />
      </button>
    </div>
  );
}

export default function App() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  // Determine current path using window.location
  const currentPath = window.location.pathname;
  const hideOnPaths = ['/', '/signin', '/signup'];
  const showFloating = !hideOnPaths.includes(currentPath);

  const toggleVoiceAssistant = () => setIsVoiceAssistantOpen(prev => !prev);

  return (
    <Router>
      <div className="flex h-screen bg-[#0f1535] text-white">
        <Sidebar enable={sidebar} />
        <main className="flex-1 overflow-auto">
          {showFloating && <FloatingButtons toggleVoiceAssistant={toggleVoiceAssistant} />}
          <VoiceAssistantModal
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
          <Routes>
            <Route path="/" element={<LandingPage setSidebar={setSidebar} />} />
            <Route path="/signLanguage" element={<SignLanguageDetector setSidebar={setSidebar} />} />
            <Route path="/chatbot" element={<Chatbot setSidebar={setSidebar} />} />
            <Route path="/multimedia" element={<Multimedia setSidebar={setSidebar} />} />
            <Route path="/accessibilityTools" element={<AccessibilityTools setSidebar={setSidebar} />} />
            <Route path="/jobsAndSchemes" element={<JobsAndSchemes setSidebar={setSidebar} />} />
            <Route path="/profile" element={<Profile setSidebar={setSidebar} />} />
            <Route path="/signup" element={<SignUp setSidebar={setSidebar} />} />
            <Route path="/signin" element={<SignIn setSidebar={setSidebar} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
