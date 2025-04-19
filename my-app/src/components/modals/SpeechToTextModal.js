import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Copy } from "lucide-react";
import { toast } from "sonner";

const SpeechToTextModal = ({ onClose, setSharedText }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("SpeechRecognition not supported in this browser");
      return;
    }

    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        const newText = transcript + finalTranscript + " ";
        setTranscript(newText);
      }
    };

    recognitionRef.current = recog;

    return () => {
      recog.stop();
      recog.onresult = null;
    };
  }, [transcript]);

  const start = () => {
    recognitionRef.current.start();
    setListening(true);
    toast.success("Listening started");
  };

  const stop = () => {
    recognitionRef.current.stop();
    setListening(false);
    toast.info("Listening stopped");
  };

  const clear = () => {
    setTranscript("");
  };

  const copyToSharedWorkspace = () => {
    if (transcript && setSharedText) {
      setSharedText(transcript);
      toast.success("Copied to shared workspace");
    } else {
      toast.error("No text to copy");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <Mic className="h-6 w-6" />
          <h2 className="text-xl font-bold">Speech to Text</h2>
        </div>
        <div className="bg-white/10 p-4 rounded mb-4 min-h-[120px] text-white">
          {transcript || "Speak now..."}
        </div>
        <div className="flex gap-4 flex-wrap">
          {!listening ? (
            <button
              onClick={start}
              className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              <MicOff className="mr-2 h-4 w-4" />
              Stop
            </button>
          )}
          <button
            onClick={clear}
            className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
          >
            Clear
          </button>
          <button
            onClick={copyToSharedWorkspace}
            className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]"
            disabled={!transcript}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Shared Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechToTextModal;
