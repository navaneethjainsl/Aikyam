import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Camera, MessageSquare, PlayCircle, Settings, User, Wrench, Briefcase, Search } from 'lucide-react';
import LandingPage from './components/Page';
import Sidebar from './components/Sidebar';
import SignLanguageDetector from './components/signLanguage';
import Chatbot from './components/Chatbot.js';
import Multimedia from './components/media';
import AccessibilityTools from './components/accessibility';
import JobsAndSchemes from './components/JobsSchemes';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { Mic, Mouse, Keyboard, X } from 'lucide-react'; // Import necessary icons
import VoiceAssistantModal from './components/VoiceAssistantModal.js';
import AIAnimation from './components/AIAnimation'; // Assuming AIAnimation is a separate component in components folder
// import AIMotionIcon from './AiMotionIcon'
import AIMotionIcon from './components/AiMotionIcon'; // Assuming AIMotionIcon is a separate component





export default function App() {
  const [activeSection, setActiveSection] = useState('signLanguage');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isListen, setIsListen] = useState(false)
  const [sidebar, setSidebar] = useState(false);

  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantOpen((prev) => !prev);
    setIsListen((prev) => !prev);
  };
  return (
    <Router>
      <div className="flex h-screen bg-[#0f1535] text-white">
        <Sidebar enable={sidebar}/>
        <main className="flex-1 overflow-auto p-8">
          {/* Container for floating buttons */}
          <div className="fixed bottom-4 right-4 flex flex-col gap-4">
            {/* Voice Assistant Button */}
            <button
              onClick={toggleVoiceAssistant}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Open Voice Assistant"
            >
              <AIMotionIcon className="h-8 w-8 text-white z-10" />
            </button>

            {/* Virtual Mouse Button */}
            <button
              onClick={() => window.open('http://localhost:8501/?routes=start_mouse', '_blank')}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Virtual Mouse"
            >
              <Mouse className="h-8 w-8 text-white" />
            </button>

            {/* Virtual Keyboard Button */}
            <button
              onClick={() => window.open('http://localhost:8501/?routes=start_keyboard', '_blank')}
              className="w-16 h-16 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Virtual Keyboard"
            >
              <Keyboard className="h-8 w-8 text-white" />
            </button>

          </div>

          {/* Voice Assistant Modal */}
          <VoiceAssistantModal
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
          <Routes>
            <Route path="/" element={<LandingPage setSidebar={setSidebar}/>} />
            <Route path="/signLanguage" element={<SignLanguageDetector setSidebar={setSidebar}/>} />
            <Route path="/chatbot" element={<Chatbot setSidebar={setSidebar}/>} />
            <Route path="/multimedia" element={<Multimedia setSidebar={setSidebar}/>} />
            <Route path="/accessibilityTools" element={<AccessibilityTools setSidebar={setSidebar}/>} />
            <Route path="/jobsAndSchemes" element={<JobsAndSchemes setSidebar={setSidebar}/>} />
            <Route path="/profile" element={<Profile setSidebar={setSidebar}/>} />
            <Route path="/signup" element={<SignUp setSidebar={setSidebar}/>} />
            <Route path="/signin" element={<SignIn setSidebar={setSidebar}/>} />
          </Routes>
        </main>
      </div>

    </Router>
  );
}
