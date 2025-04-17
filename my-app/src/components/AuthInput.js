import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({
  icon,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  label,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  className = ''
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className={`relative group ${className}`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-navy-blue-dark text-white placeholder-gray-500 w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all duration-200 ease-in-out"
        />
        {isPassword && onTogglePassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
