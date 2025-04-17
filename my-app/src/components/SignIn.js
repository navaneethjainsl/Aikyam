import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

axios.defaults.withCredentials = true;

const Login = ({ setSidebar }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (setSidebar) {
      setSidebar(false);
    }
  }, [setSidebar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const backendUrl = 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/auth/login`, formData);

      if (response.data.success) {
        Cookies.set('username', formData.username, { expires: 7 });
        Cookies.set('successMessage', 'Login successful!', { expires: 7 });
        Cookies.set('authToken', response.data.authtoken || '', { expires: 7 });

        setSuccess('Login successful!');

        setTimeout(() => {
          navigate('/profile');
        }, 800);
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Invalid credentials or server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Sign In to Aikyam" error={error} success={success}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          icon={<Mail size={20} />}
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          label="Username"
        />

        <AuthInput
          icon={<Lock size={20} />}
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          label="Password"
          isPassword
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple focus:ring-purple-light border-gray-500 rounded transition-colors"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#forgot-password" className="font-medium text-purple-light hover:text-purple transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Sign In
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-purple-light hover:text-purple transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
};

export default Login;
