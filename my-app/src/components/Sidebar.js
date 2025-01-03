// // src/Sidebar.js
// import React from 'react';
// import { Button, Typography } from "@mui/material";
// import { AccessibilityNew, Chat, Campaign, AutoFixHigh, Article } from "@mui/icons-material";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import SidebarImage from "./img/SidebarHelpImage.png";
// import { motion } from "framer-motion";
// // Update SidebarButton to accept a `to` prop
// function SidebarButton({ icon, label, to }) {
//   return (
//     <Link to={to} style={{ textDecoration: 'none' }}> {/* Wrap Button in Link */}
//       <Button
//         variant="outlined"
//         startIcon={icon}
//         fullWidth
//         className="justify-start text-white font-bold bg-white/70 backdrop-blur-sm hover:bg-gray-200"
//       >
//         {label}
//       </Button>
//     </Link>
//   );
// }

// function Sidebar({sidebar}) {
//   console.log(sidebar)
//   return ( sidebar &&
//     <motion.aside
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ duration: 0.7 }}
//       className="bg-white/80 backdrop-blur-lg w-64 p-6 shadow-xl rounded-lg m-4 relative"
//       style={{
//         backgroundColor: "black",
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//         color: '#444'
//       }}
//     >
//       <Typography variant="h5" className="mb-6 font-bold text-gray-900">
//         Accessibility Tab
//       </Typography>
//       <div className="space-y-4">
//         <SidebarButton
//           icon={<AccessibilityNew />}
//           label="Sign Language Detector"
//           to="/Sign" // Link to the /sign page
//         />
//         <SidebarButton icon={<Chat />} label="Chat Bot Assistance" to="/" />
//         <SidebarButton icon={<Campaign />} label="Multimedia" />
//         <SidebarButton icon={<AutoFixHigh />} label="Accessibility" to="/Accessibility" />
//         <SidebarButton icon={<Article />} label="Jobs & Schemes" />
//       </div>
//     </motion.aside>
//   );
// }

// export default Sidebar;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Camera, MessageSquare, PlayCircle, Settings, User, Wrench, Briefcase, Search } from 'lucide-react';


export default function Sidebar({enable}) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Camera, label: 'Sign Language Detector', path: '/signLanguage' },
    { icon: MessageSquare, label: 'Chat Bot Assistance', path: '/chatbot' },
    { icon: PlayCircle, label: 'Multimedia', path: '/multimedia' },
    { icon: Wrench, label: 'Accessibility Tools', path: '/accessibilityTools' },
    { icon: Briefcase, label: 'Jobs & Schemes', path: '/jobsAndSchemes' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  const [activeSection, setActiveSection] = useState('signLanguage');

  return (enable &&
    <aside className="w-64 bg-[#0f1535] border-r border-white/10 p-4 flex flex-col">
      {/* <img src="/img/cardimgfree.png" alt="Example" /> */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Aikyam
        </h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}

                className={`flex items-center py-2 px-4 rounded-lg transition-colors ${location.pathname === item.path

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