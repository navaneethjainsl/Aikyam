import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';

export default function Chatbot() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1">
        <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">New Chat
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#2a3353] rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
              <Send className="h-5 w-5" />
            </button>
            <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-64 p-6 bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl">
        <h3 className="font-semibold mb-4">Chat History</h3>
        {/* Chat history would go here */}
      </div>
    </div>
  );
}