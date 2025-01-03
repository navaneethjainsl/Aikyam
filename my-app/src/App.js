import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Bell, Camera, MessageSquare, PlayCircle, Settings, User, Wrench, Briefcase, Search } from 'lucide-react';
import SignLanguageDetector from './components/signLanguage';
import Chatbot from './components/Chatbot.js';
import Multimedia from './components/media';
import AccessibilityTools from './components/accessibility';
import JobsAndSchemes from './components/JobsSchemes';
import './index.css'
import Profile from './components/Profile';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { Mic, X } from 'lucide-react'; // Import necessary icons
import VoiceAssistantModal from './components/VoiceAssistantModal.js';
import AIAnimation from './components/AIAnimation'; // Assuming AIAnimation is a separate component in components folder
// import AIMotionIcon from './AiMotionIcon'
import AIMotionIcon from './components/AiMotionIcon'; // Assuming AIMotionIcon is a separate component


function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Camera, label: 'Sign Language Detector', key: 'signLanguage' },
    { icon: MessageSquare, label: 'Chat Bot Assistance', key: 'chatbot' },
    { icon: PlayCircle, label: 'Multimedia', key: 'multimedia' },
    { icon: Wrench, label: 'Accessibility Tools', key: 'accessibilityTools' },
    { icon: Briefcase, label: 'Jobs & Schemes', key: 'jobsAndSchemes' },
    { icon: User, label: 'Profile', key: 'profile' },
  ];

  return (
    <aside className="w-64 bg-[#0f1535] border-r border-white/10 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Aikyam
        </h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <Link
                to={`/${item.key}`}
                className={`flex items-center py-2 px-4 rounded-lg transition-colors ${activeSection === item.key
                    ? 'bg-[#1c2444] text-purple-400'
                    : 'text-gray-300 hover:bg-[#1c2444]'
                  }`}
                onClick={() => setActiveSection(item.key)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#1c2444] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div> */}
        <div className="flex items-center justify-between mt-4">
          {/* <button className="p-2 hover:bg-[#1c2444] rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-[#1c2444] rounded-lg">
            <Settings className="h-5 w-5" />
          </button> */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg hover:opacity-90 transition-colors"
            onClick={() => navigate('/signup')}
          >
            <User className="h-3 w-3" />
            Sign Up
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg hover:opacity-90 transition-colors"
            onClick={() => navigate('/signin')}
          >
            <User className="h-3 w-3" />
            Sign In
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('signLanguage');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantOpen((prev) => !prev);
  };
  return (
    <Router>
      <div className="flex h-screen bg-[#0f1535] text-white">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 overflow-auto p-8">
          {/* Floating button to toggle Voice Assistant */}
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="fixed bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Open Voice Assistant"
          >
            <div className="absolute inset-0">
              <AIAnimation className="opacity-30" />
            </div>
            <AIMotionIcon className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10" />
          </button>

          {/* Voice Assistant Modal */}
          <VoiceAssistantModal
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
          />
          <Routes>
            <Route path="/signLanguage" element={<SignLanguageDetector />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/multimedia" element={<Multimedia />} />
            <Route path="/accessibilityTools" element={<AccessibilityTools />} />
            <Route path="/jobsAndSchemes" element={<JobsAndSchemes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}