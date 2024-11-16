import React from 'react';

export default function AccessibilityTools() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
        <h3 className="font-semibold mb-4">Upload Image</h3>
        <div className="flex gap-4">
          <input
            type="file"
            className="flex-1 px-4 py-3 bg-navy-700 rounded-xl border border-white/10"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
            Submit
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        {[
          'OCR Tool',
          'Text-to-speech',
          'Speech-to-Text',
          'Frequency Compression',
          'Interactive Learning'
        ].map((tool) => (
          <div key={tool} className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl ">
            <h3 className="font-semibold">{tool}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}