import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie

axios.defaults.withCredentials = true;

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear existing errors

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      console.log('Submitting form data:', formData);

      // Use .env variable for backend URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });

      console.log('Response from backend:', response.data);
      console.log('Response from backend:', response.data.authtoken);

      if (response.data.success) {
        setSuccess('Registration successful!');
        setError('');
        
        // Set a cookie after successful registration
        Cookies.set('username', formData.username, { expires: 7 });  // Store username in cookie for 7 days
        Cookies.set('successMessage', 'Registration successful!', { expires: 7 });
        Cookies.set('authToken', response.data.authtoken, { expires: 7 });

        const username = Cookies.get('username');
        const successMessage = Cookies.get('successMessage');
        console.log(username, successMessage);


        // Clear form data
        setFormData({ name: '', username: '', password: '', confirmPassword: '' });
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-blue-800">
      <div className="bg-[#1c2444] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Sign Up for Aikyam
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={formData.name}
                onChange={handleChange}
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
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
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-[#0f1535] text-white placeholder-gray-500 w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
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
  );
}
