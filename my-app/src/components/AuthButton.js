import React from 'react';

const AuthButton = ({
  type = 'button',
  className = '',
  children,
  onClick,
  isLoading = false
}) => {
  const baseClasses = [
    "w-full flex justify-center items-center py-3 px-4",
    "border border-transparent rounded-lg shadow-sm text-base font-medium text-white",
    "relative overflow-hidden",
    "bg-gradient-to-r from-purple to-purple-light hover:from-purple-dark hover:to-purple",
    "transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple",
    "transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
  ];

  if (isLoading) {
    baseClasses.push("opacity-80 cursor-not-allowed");
  }

  return (
    <button
      type={type}
      className={`${baseClasses.join(' ')} ${className}`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-light to-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

export default AuthButton;
