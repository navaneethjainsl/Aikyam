import React from 'react';
import { PlayCircle, Rewind, FastForward, Image } from 'lucide-react';

export default function Multimedia() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">Multimedia Section</h2>
        <div className="space-y-4">
          <div className="h-2 bg-[#2a3353] rounded-full">
            <div className="h-2 w-1/3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
          </div>
          <div className="flex justify-center gap-4">
            <button className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors">
              <Rewind className="h-6 w-6" />
            </button>
            <button className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors">
              <PlayCircle className="h-6 w-6" />
            </button>
            <button className="p-3 hover:bg-[#2a3353] rounded-xl transition-colors">
              <FastForward className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-[#1c2444] rounded-xl overflow-hidden border border-white/10 backdrop-blur-xl">
            {/* Add content to the image section */}
            <div className="aspect-video bg-gradient-to-r from-purple-400 to-purple-200 flex items-center justify-center text-white text-lg font-semibold">
              <Image className="h-10 w-10 mr-2" /> Placeholder {item}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Image Title {item}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Article Title {item}</h3>
            <p className="text-gray-400">Short description of the article or blog post...</p>
            <a href="#media" className="text-purple-400 hover:underline mt-2 inline-block">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}
