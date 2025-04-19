import React, { useState, useEffect } from "react";
import { BookOpen, X, Copy } from "lucide-react";
import { toast } from "sonner";

// Braille conversion map
const brailleMap = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
  'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
  'z': '⠵', '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒',
  '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦',
  '9': '⠔', ' ': ' ', '.': '⠲', ',': '⠂', '!': '⠖',
  '?': '⠦', ';': '⠆', ':': '⠒', '"': '⠦', "'": '⠄',
  '-': '⠤', '(': '⠦', ')': '⠴', '[': '⠦', ']': '⠴'
};

const BrailleModal = ({ onClose, text = "", onCopyToBraille }) => {
  const [inputText, setInputText] = useState("");
  const [brailleText, setBrailleText] = useState("");

  useEffect(() => {
    if (text) {
      setInputText(text);
    }
  }, [text]);

  const convertToBraille = () => {
    const result = inputText
      .toLowerCase()
      .split('')
      .map(char => brailleMap[char] || char)
      .join('');
    setBrailleText(result);
    toast.success("Text converted to Braille");
  };

  const copyToSharedWorkspace = () => {
    if (brailleText && onCopyToBraille) {
      onCopyToBraille(brailleText);
      toast.success("Braille copied to shared workspace");
    } else {
      toast.error("No Braille text to copy");
    }
  };

  const copyFromSharedWorkspace = () => {
    if (text) {
      setInputText(text);
      toast.success("Copied from shared workspace");
    } else {
      toast.error("Shared workspace is empty");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl font-bold">Braille Converter</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-300 mb-2">Text to convert:</p>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-40 p-4 bg-white/5 rounded text-white resize-none"
              placeholder="Enter text to convert to Braille..."
            />
          </div>
          
          <div>
            <p className="text-gray-300 mb-2">Braille output:</p>
            <div className="w-full h-40 p-4 bg-white/10 rounded text-white overflow-auto">
              {brailleText || "Braille will appear here..."}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={convertToBraille}
            className="px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]"
          >
            Convert to Braille
          </button>
          
          <button 
            onClick={copyToSharedWorkspace}
            className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]"
            disabled={!brailleText}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy to Shared Workspace
          </button>
          
          <button 
            onClick={copyFromSharedWorkspace}
            className="flex items-center px-4 py-2 border border-white/20 rounded hover:bg-white/10"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy from Shared Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrailleModal;
