import React, { useState } from 'react'
import { User, Mail, Calendar, Moon, Sun, Bell, ChevronDown } from 'lucide-react'

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

export default function Profile() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [fontSize, setFontSize] = useState('medium')

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

      <div className="bg-[#1c2444] rounded-lg shadow-lg p-6 mb-6">
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
      </div>
    </div>
  )
}