import React from 'react';

const AuthCard = ({
  title,
  children,
  error,
  success,
  className = ''
}) => {
  const cardClasses = [
    "bg-navy-blue-light backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10",
    "border border-gray-700/50",
    "animate-fade-in transform transition-all duration-500"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-blue overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-dark/20 rounded-full filter blur-3xl animate-float opacity-50"></div>
        <div className="absolute top-3/4 -right-20 w-60 h-60 bg-purple/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-purple-light/10 rounded-full filter blur-2xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Card */}
      <div className={`${cardClasses.join(' ')} ${className}`}>
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Error and success messages */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-900/20 border border-red-800 text-red-200 text-center animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-900/20 border border-green-800 text-green-200 text-center animate-fade-in">
            {success}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthCard;
