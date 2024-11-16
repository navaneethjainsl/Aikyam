import React from 'react';

function MainContent() {
  return (
    <div className="flex flex-col flex-grow p-8 space-y-8">
      <div className="flex space-x-6">
        <button className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow hover:bg-blue-600 transition duration-200">
          Upload Video
        </button>
        <button className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow hover:bg-blue-600 transition duration-200">
          Access Camera
        </button>
      </div>
      <div className="flex space-x-6">
        <button className="bg-green-500 text-white py-3 px-6 rounded-lg shadow hover:bg-green-600 transition duration-200">
          Start
        </button>
        <button className="bg-red-500 text-white py-3 px-6 rounded-lg shadow hover:bg-red-600 transition duration-200">
          Stop
        </button>
      </div>
      <div className="flex-grow p-8 border-4 border-blue-400 bg-blue-50 rounded-lg shadow-lg flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-xl font-semibold">Live Video Feed Area</p>
        <p className="text-gray-700">Captioning display for text conversion</p>
      </div>
    </div>
  );
}

export default MainContent;
