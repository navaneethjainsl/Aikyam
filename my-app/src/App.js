/*import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Button, Card, Typography, Avatar, IconButton } from "@mui/material";
import { AccessibilityNew, Chat, Campaign, AutoFixHigh, Article } from "@mui/icons-material";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import './index.css';
import bgImage from './components/img/background-body-admin.png';
import cardImg from './components/img/billing-background-card.png';

// Import the new Sign Language Detector page
import Sign from './components/sign'; // Import the renamed Sign component
import Accessibility from "./components/accessibility";
import Profile from "./components/Profile";
import Multimedia from "./components/media";

function App() {
  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Router>
      <Sidebar/>

        {/* <Sidebar>
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-white/80 backdrop-blur-lg w-64 p-6 shadow-xl rounded-lg m-4 relative"
            style={{
              backgroundColor: "black",
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              color: '#444'
            }}
          >
            <Typography variant="h5" className="mb-6 font-bold text-gray-900">
              Accessibility Tab
            </Typography>
            <div className="space-y-4">
              <SidebarButton
                icon={<AccessibilityNew />}
                label="Sign Language Detector"
                to="/Sign" // Link to the /sign page
              />
              <SidebarButton icon={<Chat />} label="Chat Bot Assistance" to="/" />
              <SidebarButton icon={<Campaign />} label="Multimedia" />
              <SidebarButton icon={<AutoFixHigh />} label="Accessibility" to="/Accessibility" />
              <SidebarButton icon={<Article />} label="Jobs & Schemes" />
            </div>
          </motion.aside>
        </Sidebar>

        <main className="flex-1 p-10 space-y-10">
          <motion.div
            className="flex justify-between items-center p-4 rounded-lg bg-white/40 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" className="font-extrabold text-gray-800">Welcome to Aikyam</Typography>
            <div className="flex space-x-4">
              <Button variant="outlined" color="primary" className="hover:bg-blue-50">Sign Up</Button>
              <Button variant="contained" color="primary">Sign In</Button>
            </div>
          </motion.div>

          
          <div className="flex space-x-8">
            <Card className="p-6 flex items-center justify-center w-1/4 h-56 shadow-md bg-white/80 backdrop-blur-lg">
              <Avatar sx={{ width: 120, height: 120 }} src="path-to-avatar.jpg" />
              <Typography variant="body1" className="mt-4 text-gray-700 font-semibold">User Avatar</Typography>
            </Card>
            <div className="flex-1 space-y-4">
              <Card sx={{ width: 800, height: 50 }} className="p-4 shadow-sm bg-white/80 backdrop-blur-lg text-gray-800 font-semibold">Short Information Box</Card>
              <Card sx={{ width: 800, height: 120 }} className="p-4 h-24 shadow-sm bg-white/80 backdrop-blur-lg text-gray-800 font-semibold">Long Information Box</Card>
              <div className="flex space-x-4" style={{ backgroundImage: `url(${cardImg})` }}>
                <Card className="p-4 flex-1 h-16 shadow-sm bg-white/80 backdrop-blur-lg text-gray-800 font-semibold"></Card>
                <Card className="p-4 flex-1 h-16 shadow-sm bg-white/80 backdrop-blur-lg text-gray-800 font-semibold"></Card>
                <Card className="p-4 flex-1 h-16 shadow-sm bg-white/80 backdrop-blur-lg text-gray-800 font-semibold"></Card>
              </div>
            </div>
          </div>


          <div className="flex space-x-4">
            <ToolCard title="OCR Tool" icon={<AccessibilityNew />} />
            <ToolCard title="Text-to-Speech" icon={<Chat />} />
            <ToolCard title="Speech-to-Text" icon={<Campaign />} />
          </div>


          <IconButton
            sx={{ width: 200, height: 100 }}
            className="fixed bg-white text-blue-500 shadow-lg hover:bg-gray-200"
            component={motion.div}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => alert("Chatbot activated!")}
            style={{
              boxShadow: "0px 8px 15px rgba(10, 10, 10, 0.2)",
              color: "white",
              backgroundImage: `url(${cardImg})`
            }}
          >
            <FaRobot size={30} />
          </IconButton>
        </main> }

        /*<Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Routes>

      </Router>
    </div>
  );
}


function SidebarButton({ icon, label, to }) {
  return (
    <Link to={to}>
      <Button
        variant="outlined"
        startIcon={icon}
        fullWidth
        className="justify-start font-semibold text-gray-800 bg-white/80 backdrop-blur-lg hover:bg-gray-200 shadow-md"
      >
        {label}
      </Button>
    </Link>
  );
}


function ToolCard({ title, icon }) {
  return (
    <Card className="flex flex-col items-center justify-center p-4 h-32 text-gray-800 shadow-lg bg-white/80 backdrop-blur-lg space-y-2">
      {icon}
      <Typography variant="body1" className="font-semibold">{title}</Typography>
    </Card>
  );
}

export default App;*/


import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from 'react-router-dom';
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
                className={`flex items-center py-2 px-4 rounded-lg transition-colors ${
                  activeSection === item.key
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#1c2444] rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="p-2 hover:bg-[#1c2444] rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-[#1c2444] rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg hover:opacity-90 transition-colors"
            onClick={() => navigate('/signin')}
          >
            <User className="h-5 w-5" />
            Sign In
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('signLanguage');

  return (
    <Router>
      <div className="flex h-screen bg-[#0f1535] text-white">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 overflow-auto p-8">
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