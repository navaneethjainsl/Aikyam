import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { GraduationCap, Clock, MapPin, Users, Banknote } from 'lucide-react';
import AIMotionIcon from './AiMotionIcon'

const AIAnimation = ({ className }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    let animationFrameId
    let angle = 0
    let pulseScale = 0

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.35

      // Clear canvas with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // Update pulse
      pulseScale = Math.sin(angle * 2) * 0.1 + 0.9

      // Draw main ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * pulseScale, 0, Math.PI * 2)
      ctx.lineWidth = radius * 0.15
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)'
      ctx.stroke()

      // Draw glowing effects
      for (let i = 0; i < 36; i++) {
        const a = (i * Math.PI * 2) / 36 + angle
        const gradient = ctx.createLinearGradient(
          centerX + Math.cos(a) * radius * 0.5,
          centerY + Math.sin(a) * radius * 0.5,
          centerX + Math.cos(a) * radius * 1.5,
          centerY + Math.sin(a) * radius * 1.5
        )

        // Create gradient with purple and blue
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0)')
        gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.3)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * pulseScale, a, a + Math.PI / 18)
        ctx.lineWidth = radius * 0.15
        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      // Rotating particles
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI * 2) / 12 + angle * 2
        const x = centerX + Math.cos(a) * radius * pulseScale
        const y = centerY + Math.sin(a) * radius * pulseScale
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.1)
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)')
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)')
        
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.05, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      angle += 0.01
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className || ''}`} aria-hidden="true" />
}

export default function JobsAndSchemes() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)  
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const authToken = getCookie('authToken')

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    setActiveTab('jobs');
    axios
      .get('http://localhost:5000/api/user/jobs', {
        headers: {
          'auth-token': authToken,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Jobs data:', response.data.message);
          setJobs(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  const fetchSchemes = () => {
    setLoading(true);
    setActiveTab('schemes');
    axios
      .get('http://localhost:5000/api/user/schemes', {
        headers: {
          'auth-token': authToken,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log('Schemes data:', response.data.message);
          setSchemes(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching schemes:', error);
        setLoading(false);
      });
  };

  const redirectToExternalPage = (link) => {
    window.location.href = link;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-6 py-3 rounded-xl transition-colors ${
            activeTab === 'jobs'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={fetchJobs}
        >
          Fetch Jobs
        </button>
        <button
          className={`px-6 py-3 rounded-xl transition-colors ${
            activeTab === 'schemes'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={fetchSchemes}
        >
          Fetch Schemes
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'jobs' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : jobs.length === 0 ? (
                <p className="text-white">No jobs available right now.</p>
              ) : (
                jobs.map((job, index) => (
                  <div
                    key={index}
                    className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl flex flex-col"
                  >
                    <div className="flex-1 mb-4 space-y-2">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <p className="text-sm text-gray-300">{job.company}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Banknote className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <p className="text-sm">{job.description}</p>
                    </div>
                    <button
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
                      onClick={() => redirectToExternalPage(job.link)}
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === 'schemes' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : schemes.length === 0 ? (
                <p className="text-white">No schemes available right now.</p>
              ) : (
                schemes.map((scheme, index) => (
                  <div
                    key={index}
                    className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl flex flex-col"
                  >
                    <div className="flex-1 mb-4 space-y-2">
                      <h4 className="font-semibold text-lg">{scheme.title}</h4>
                      <p className="text-sm text-gray-300">{scheme.organization}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        Eligibility: {scheme.eligibility}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Benefits: {scheme.benefits}
                      </div>
                      <p className="text-sm">{scheme.description}</p>
                    </div>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
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

      {isVoiceAssistantOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1c2444]/90 backdrop-blur-xl rounded-lg p-6 w-96 relative overflow-hidden">
            <div className="absolute inset-0">
              <AIAnimation className="opacity-20" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Voice Assistant</h2>
                <button 
                  onClick={() => setIsVoiceAssistantOpen(false)}
                  className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
                  <AIMotionIcon className="h-12 w-12 text-purple-500 relative z-10" />
                </div>
                <p className="text-white text-center">Listening... Speak your command</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

