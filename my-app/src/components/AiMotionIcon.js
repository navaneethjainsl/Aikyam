import React from 'react'

interface AIMotionIconProps {
  className?: string
}

const AIMotionIcon: React.FC<AIMotionIconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-40"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
        className="animate-pulse"
      />
      <path
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-60"
      />
      <path
        d="M15.5 8.5l-7 7M8.5 8.5l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-40"
      />
    </svg>
  )
}

export default AIMotionIcon
