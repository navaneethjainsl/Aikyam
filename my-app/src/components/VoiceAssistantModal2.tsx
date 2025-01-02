// import React from 'react'
// import { Mic, X } from 'lucide-react'
// import AiMotionAnimation from './AiMotionAnimation.tsx'

// interface VoiceAssistantModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-[#1c2444] rounded-lg p-6 w-80 relative overflow-hidden">
//         <AiMotionAnimation className="absolute inset-0 opacity-30" />
//         <div className="relative z-10">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-white">Voice Assistant</h2>
//             <button onClick={onClose} className="text-gray-400 hover:text-white">
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="flex flex-col items-center">
//             <Mic className="h-16 w-16 text-purple-500 mb-4" />
//             <p className="text-white text-center">Listening... Speak your command</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceAssistantModal

