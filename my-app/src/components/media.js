import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, Rewind, FastForward } from 'lucide-react';
import { X } from 'lucide-react'
import AIMotionIcon from './AiMotionIcon'
import axios from 'axios';

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

export default function Multimedia() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backendData, setBackendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const audioSrc = "/a1.mp3"; // Replace with your audio file path

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch("/multimedia"); // Replace with your API endpoint
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBackendData(data);
        console.log("Fetched backend data:", data); // Log fetched data
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const fastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">Multimedia</h2>
        <div className="space-y-4">
          <div className="h-2 bg-[#2a3353] rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors"
              onClick={rewind}
            >
              <Rewind className="h-6 w-6" />
            </button>
            <button
              className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors"
              onClick={togglePlayPause}
            >
              {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
            </button>
            <button
              className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors"
              onClick={fastForward}
            >
              <FastForward className="h-6 w-6" />
            </button>
          </div>
          <audio ref={audioRef} src={audioSrc} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : backendData.length > 0 ? (
          backendData.map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 mb-2">{item.description}</p>
              <a href={item.url} className="text-purple-400 hover:underline inline-block">Read more</a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">No data available</div>
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

