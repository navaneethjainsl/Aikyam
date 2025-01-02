import React, { useState, useRef, useEffect } from 'react'
import { User, Mail, Calendar, Moon, Sun, Bell, ChevronDown, X } from 'lucide-react'
import AIMotionIcon from './AiMotionIcon'
import VoiceAssistantModal from './VoiceAssistantModal';

const Switch = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
)

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
)

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

    // setCanvasSize()
    // window.addEventListener('resize', setCanvasSize)

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

    // animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`w-full h-full ${className || ''}`} aria-hidden="true" />
}

export default function Profile() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [fontSize, setFontSize] = useState('medium')
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>
      
      <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-purple-600 rounded-full p-3 mr-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">John Doe</h2>
            <div className="flex items-center text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              <p>john.doe@example.com</p>
            </div>
          </div>
        </div>
        <div className="flex items-center text-gray-300 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <p>Member since: January 1, 2023</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:opacity-90 transition-colors">
          Edit Profile
        </button>
      </div>

      {/* <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Accessibility Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="flex items-center space-x-2 text-white">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span>Dark Mode</span>
            </label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="font-size" className="flex items-center space-x-2 text-white">
              <span>Font Size</span>
            </label>
            <Select
              value={fontSize}
              onChange={setFontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1c2444] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Notifications</h2>
        <div className="flex items-center justify-between">
          <label htmlFor="notifications" className="flex items-center space-x-2 text-white">
            <Bell className="h-5 w-5" />
            <span>Enable Notifications</span>
          </label>
          <Switch
            id="notifications"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </div> */}

      {/* Voice Assistant Button */}
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
      {/* {isVoiceAssistantOpen && (
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
      )} */}
      
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </div>
  )
}

