// src/Sidebar.js
import React from 'react';
import { Button, Typography } from "@mui/material";
import { AccessibilityNew, Chat, Campaign, AutoFixHigh, Article } from "@mui/icons-material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import SidebarImage from "./img/SidebarHelpImage.png";
import { motion } from "framer-motion";
// Update SidebarButton to accept a `to` prop
function SidebarButton({ icon, label, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}> {/* Wrap Button in Link */}
      <Button
        variant="outlined"
        startIcon={icon}
        fullWidth
        className="justify-start text-white font-bold bg-white/70 backdrop-blur-sm hover:bg-gray-200"
      >
        {label}
      </Button>
    </Link>
  );
}

function Sidebar() {
  return (
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
  );
}

export default Sidebar;
