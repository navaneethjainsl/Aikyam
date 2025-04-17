import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const Signup = ({ setSidebar }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const backendUrl = 'http://localhost:5000';

      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        name: formData.name,
        username: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess('Registration successful!');
        setError('');

        Cookies.set('username', formData.username, { expires: 7 });
        Cookies.set('successMessage', 'Registration successful!', { expires: 7 });
        Cookies.set('authToken', response.data.authtoken || '', { expires: 7 });

        setFormData({ name: '', username: '', password: '', confirmPassword: '' });

        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { color: 'bg-gray-300', width: 'w-0', text: '' };

    if (password.length < 6)
      return { color: 'bg-red-500', width: 'w-1/4', text: 'Weak' };
    if (password.length < 8)
      return { color: 'bg-orange-500', width: 'w-2/4', text: 'Fair' };
    if (password.length < 10 || !/[!@#$%^&*]/.test(password))
      return { color: 'bg-yellow-500', width: 'w-3/4', text: 'Good' };

    return { color: 'bg-green-500', width: 'w-full', text: 'Strong' };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <AuthCard title="Sign Up for Aikyam" error={error} success={success}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          icon={<User size={20} />}
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          label="Full Name"
        />

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

        <div className="space-y-1">
          <AuthInput
            icon={<Lock size={20} />}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            label="Password"
            isPassword
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* {formData.password && (
            <div className="pt-1 space-y-1">
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-500 ease-in-out ${strength.width}`}></div>
              </div>
              <p className="text-xs text-right text-gray-400">{strength.text}</p>
            </div>
          )} */}
        </div>

        <AuthInput
          icon={<Lock size={20} />}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          label="Confirm Password"
          isPassword
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <AuthButton type="submit" isLoading={isLoading}>
          Create Account
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          to="/signin"
          className="font-medium text-purple-light hover:text-purple transition-colors"
        >
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
};

export default Signup;
