import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1535]">
      <div className="bg-[#1c2444] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Sign Up for Aikyam
        </h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                
              />
            </div>
          </div>
          <div>
            <label htmlFor="UserName" className="block text-sm font-medium text-gray-300 mb-1">
              UserName
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="UserName"
                name="UserName"
                type="Name"
                autoComplete="UserName"
                required
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={20} />
                ) : (
                  <Eye className="text-gray-400" size={20} />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={20} />
                ) : (
                  <Eye className="text-gray-400" size={20} />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-purple-400 hover:text-purple-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}