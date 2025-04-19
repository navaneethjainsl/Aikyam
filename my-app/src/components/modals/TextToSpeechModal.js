import React, { useState } from "react";
import { Headphones, X, Play, Pause, Copy } from "lucide-react";
import { toast } from "sonner";

const TextToSpeechModal = ({ onClose, sharedText = "" }) => {
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!text) return toast.error("Enter text");
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    toast.success("Speaking");
  };

  const stop = () => { 
    speechSynthesis.cancel(); 
    setSpeaking(false); 
    toast.info("Stopped"); 
  };

  const copyFromSharedWorkspace = () => {
    if (sharedText) {
      setText(sharedText);
      toast.success("Copied from shared workspace");
    } else {
      toast.error("Shared workspace is empty");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <Headphones className="h-6 w-6" />
          <h2 className="text-xl font-bold">Text to Speech</h2>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 bg-white/5 rounded mb-4 text-white"
          placeholder="Type text to convert to speech..."
        />
        
        <div className="flex gap-4 flex-wrap">
          {!speaking ? (
            <button onClick={speak} className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]">
              <Play className="mr-2 h-4 w-4" /> Speak
            </button>
          ) : (
            <button onClick={stop} className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              <Pause className="mr-2 h-4 w-4" /> Stop
            </button>
          )}
          
          <button onClick={copyFromSharedWorkspace} className="flex items-center px-4 py-2 border border-white/20 rounded hover:bg-white/10">
            <Copy className="mr-2 h-4 w-4" /> Copy from Shared Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechModal;
