import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';

export default function SignLanguageDetector() {
  const [isDetecting, setIsDetecting] = useState(false);

  return (
    <div className="space-y-4 grid gap-4">
      <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">Sign Language Detector</h2>
        <div className="w-[1139px] h-[350px] bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl flex items-center justify-center p-6">
          <p className="text-gray-400">Live Video feed area</p>
        </div>
      <div className="p-4 bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl">
        <p className="text-gray-400">Captioning display for text conversion</p>
      </div>
        <div className="grid gap-4">
          <button className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group">
            <Upload className="mr-2 h-5 w-5 group-hover:text-purple-400" />
            Upload Video
          </button>
          <button className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group">
            <Camera className="mr-2 h-5 w-5 group-hover:text-purple-400" />
            Access Camera
          </button>
          <div className="flex gap-4">
            <button 
              className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                isDetecting 
                  ? 'bg-gradient-to-r from-red-600 to-red-400'
                  : 'bg-gradient-to-r from-purple-600 to-purple-400'
              } hover:opacity-90`}
              onClick={() => setIsDetecting(!isDetecting)}
            >
              {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}