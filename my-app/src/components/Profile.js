// import React, { useState, useRef, useEffect } from 'react';
// import { User, Mail, ChevronDown } from 'lucide-react';
// import AIMotionIcon from './AiMotionIcon';  // Ensure correct import for AIMotionIcon
// import VoiceAssistantModal from './VoiceAssistantModal';  // Ensure correct import for VoiceAssistantModal
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const Switch = ({ id, checked, onChange }) => (
//   <label htmlFor={id} className="flex items-center cursor-pointer">
//     <div className="relative">
//       <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
//       <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
//       <div
//         className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
//           checked ? 'transform translate-x-6' : ''
//         }`}
//       ></div>
//     </div>
//   </label>
// );

// const Select = ({ value, onChange, options }) => (
//   <div className="relative">
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="appearance-none bg-[#1c2444] text-white border border-white/10 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
//     >
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//     <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//   </div>
// );

// const AIAnimation = ({ className }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const setCanvasSize = () => {
//       const { width, height } = canvas.getBoundingClientRect();
//       canvas.width = width * window.devicePixelRatio;
//       canvas.height = height * window.devicePixelRatio;
//       ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
//     };

//     let animationFrameId;
//     let angle = 0;
//     let pulseScale = 0;

//     const animate = () => {
//       const { width, height } = canvas.getBoundingClientRect();
//       const centerX = width / 2;
//       const centerY = height / 2;
//       const radius = Math.min(width, height) * 0.35;

//       ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
//       ctx.fillRect(0, 0, width, height);

//       pulseScale = Math.sin(angle * 2) * 0.1 + 0.9;

//       ctx.beginPath();
//       ctx.arc(centerX, centerY, radius * pulseScale, 0, Math.PI * 2);
//       ctx.lineWidth = radius * 0.15;
//       ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
//       ctx.stroke();

//       angle += 0.01;
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return <canvas ref={canvasRef} className={`w-full h-full ${className || ''}`} aria-hidden="true" />;
// };

// export default function Profile() {
//   const [darkMode, setDarkMode] = useState(true);
//   const [notifications, setNotifications] = useState(true);
//   const [fontSize, setFontSize] = useState('medium');
//   const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     return null;
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const authToken = getCookie('authToken');
//         if (!authToken) throw new Error('Auth token is missing');

//         const response = await axios.post(
//           'http://localhost:5000/api/auth/getuser',
//           {},
//           {
//             headers: {
//               'auth-token': authToken,
//             },
//           }
//         );

//         console.log(response)

//         if (response.status !== 200) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         setUserData(response.data.user);
//       } catch (error) {
//         console.error('Error fetching user data:', error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (isLoading) {
//     return <p className="text-white">Loading profile data...</p>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>

//       {/* Profile Information */}
//       <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
//         <div className="flex items-center mb-4">
//           <div className="bg-purple-600 rounded-full p-3 mr-4">
//             <User className="h-8 w-8 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold text-white">
//               {userData.name || 'Guest User'}
//             </h2>
//             <div className="flex items-center text-gray-300">
//               <Mail className="h-4 w-4 mr-2" />
//               <p>{userData.username || 'No Email Provided'}</p>
//             </div>
//           </div>
//         </div>
//         <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:opacity-90 transition-colors">
//           Edit Profile
//         </button>
//       </div>

//       {/* Voice Assistant Button */}
//       {/* <button
//         onClick={() => setIsVoiceAssistantOpen(true)}
//         className="fixed bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg overflow-hidden hover:opacity-90 transition-opacity"
//         aria-label="Open Voice Assistant"
//       > */}
//         {/* <div className="absolute inset-0">
//           <AIAnimation className="opacity-30" />
//         </div>
//         <AIMotionIcon className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10" />
//       </button> */}

//       {/* Voice Assistant Modal */}
//       <VoiceAssistantModal
//         isOpen={isVoiceAssistantOpen}
//         onClose={() => setIsVoiceAssistantOpen(false)}
//       />
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, ChevronDown, Edit } from 'lucide-react';  // Import Edit icon
import axios from 'axios';
import Cookies from 'js-cookie';

const Switch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}
      ></div>
    </div>
  </label>
);

const Select = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-[#1c2444] text-white border border-white/10 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
  </div>
);

const AIAnimation = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    let animationFrameId;
    let angle = 0;
    let pulseScale = 0;

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      pulseScale = Math.sin(angle * 2) * 0.1 + 0.9;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * pulseScale, 0, Math.PI * 2);
      ctx.lineWidth = radius * 0.15;
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
      ctx.stroke();

      angle += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className || ''}`} aria-hidden="true" />;
};

export default function Profile( {setSidebar} ) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [aboutMe, setAboutMe] = useState('Write about yourself');
  const aboutMeInputRef = useRef(null);
  setSidebar(true);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = getCookie('authToken');
        if (!authToken) throw new Error('Auth token is missing');

        const response = await axios.post(
          'http://localhost:5000/api/auth/getuser',
          {},
          {
            headers: {
              'auth-token': authToken,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setAboutMe(aboutMeInputRef.current.value);  // Save edited content
  };

  if (isLoading) {
    return <p className="text-white">Loading profile data...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>

      {/* Profile Information */}
      <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-600 rounded-full p-3 mr-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {userData.name || 'Guest User'}
            </h2>
            <div className="flex items-center text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              <p>{userData.username || 'No Email Provided'}</p>
            </div>
          </div>
        </div>
        {/* <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:opacity-90 transition-colors">
          Edit Profile
        </button> */}
      </div>

      {/* About Me Section */}
      <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">About Me</h3>
          <button onClick={handleEditClick} className="text-purple-500">
            <Edit className="h-5 w-5" />
          </button>
        </div>
        {isEditing ? (
          <textarea
            ref={aboutMeInputRef}
            className="w-full h-32 p-2 text-white bg-[#1c2444] border border-white/10 rounded-lg"
            defaultValue={aboutMe}
            onBlur={handleSave}  // Save on blur
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Save on Enter key press
          />
        ) : (
          <p className="text-gray-300">{aboutMe}</p>
        )}
      </div>
    </div>
  );
}
