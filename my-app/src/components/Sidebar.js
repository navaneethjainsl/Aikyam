import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Camera,
  MessageSquare,
  Wrench,
  Briefcase,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

export default function Sidebar({ enable }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const menuItems = [
    { icon: Camera, label: 'Sign Language Detector', path: '/signLanguage' },
    { icon: MessageSquare, label: 'Chat Bot Assistance', path: '/chatbot' },
    { icon: Wrench, label: 'Accessibility Tools', path: '/accessibilityTools' },
    { icon: Briefcase, label: 'Jobs & Schemes', path: '/jobsAndSchemes' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const menuItemVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    enable && (
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className={`${isCollapsed ? 'w-20' : 'w-72'} bg-dark border-r border-white/10 h-screen relative transition-all duration-300`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-purple-500 rounded-full p-1 text-white hover:bg-purple-600 transition-colors z-10"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-6 flex flex-col h-full">
          <div className="mb-8">
            <motion.h1
              className={`text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent ${isCollapsed ? 'text-center text-2xl' : ''
                }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isCollapsed ? 'A' : 'Aikyam'}
            </motion.h1>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-3">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 px-1.5 rounded-xl transition-colors ${location.pathname === item.path
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'text-gray-300 hover:bg-purple-500/5'
                      }`}
                  >
                    <motion.div
                      variants={menuItemVariants}
                      whileHover="hover"
                      className="flex items-center"
                    >
                      <item.icon
                        className={`h-5 w-5 ${location.pathname === item.path ? 'text-purple-400' : ''
                          }`}
                      />
                      {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 py-2.5 w-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity text-white font-medium shadow-lg shadow-purple-500/20`}
              onClick={() => {
                // clear all auth cookies
                Cookies.remove('authToken');
                Cookies.remove('username');
                Cookies.remove('successMessage');

                // now redirect to sign-in
                navigate('/');
              }}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && 'Sign Out'}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    )
  );
}
