import React, { useState, useEffect, useRef } from "react";
import { FileText, Headphones, Mic, MicOff, BookOpen, Image, ArrowRight, X, Loader2, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import Tesseract from "tesseract.js";

const tools = [
  {
    id: 1,
    title: "OCR Technology",
    description: "Extract text from images and documents effortlessly",
    icon: <Image className="h-6 w-6 text-white" />
  },
  {
    id: 2,
    title: "Text to Speech",
    description: "Convert written text to spoken words",
    icon: <Headphones className="h-6 w-6 text-white" />
  },
  {
    id: 3,
    title: "Speech to Text",
    description: "Convert spoken words to written text instantly",
    icon: <Mic className="h-6 w-6 text-white" />
  },
  {
    id: 4,
    title: "Interactive Learning",
    description: "Access educational resources with interactive features",
    icon: <BookOpen className="h-6 w-6 text-white" />
  }
];

const ToolsContent = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onClick={() => setActiveModal(tool.id)}
          />
        ))}
      </div>

      {activeModal === 1 && <OCRModal onClose={() => setActiveModal(null)} />}
      {activeModal === 2 && <TextToSpeechModal onClose={() => setActiveModal(null)} />}
      {activeModal === 3 && <SpeechToTextModal onClose={() => setActiveModal(null)} />}
      {activeModal === 4 && <InteractiveLearningModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};

const ToolCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover:bg-white/15 cursor-pointer"
  >
    <div className="h-12 w-12 bg-[#7E69AB]/25 flex items-center justify-center rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 mb-4">{description}</p>
    <button className="inline-flex items-center text-[#9b87f5] hover:text-[#7E69AB]" onClick={onClick}>
      <span>Explore</span>
      <ArrowRight className="ml-1 h-4 w-4" />
    </button>
  </div>
);

const OCRModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = e => {
    const f = e.target.files[0];
    setFile(f);
    setImageSrc(URL.createObjectURL(f));
  };

  const extractText = () => {
    if (!file) return toast.error("Upload an image first");
    setLoading(true);
    toast.info("Processing...");
    Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
        toast.success("Text extracted");
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed OCR");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h2 className="text-xl font-bold">OCR Technology</h2>
        </div>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFile} className="w-full p-2 bg-white/5 rounded" />
          <button
            onClick={extractText}
            className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <span>Extract Text</span>}
          </button>
          {imageSrc && <img src={imageSrc} alt="upload" className="max-h-64 object-contain" />}
          {text && <pre className="bg-white/10 p-4 rounded text-gray-300 whitespace-pre-wrap">{text}</pre>}
        </div>
      </div>
    </div>
  );
};

const TextToSpeechModal = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!input) return toast.error("Enter text");
    const utter = new SpeechSynthesisUtterance(input);
    speechSynthesis.speak(utter);
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    toast.success("Speaking");
  };

  const stop = () => { speechSynthesis.cancel(); setSpeaking(false); toast.info("Stopped"); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <Headphones className="h-6 w-6" />
          <h2 className="text-xl font-bold">Text to Speech</h2>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-40 p-2 bg-white/5 rounded mb-4"
          placeholder="Type text..."
        />
        <div className="flex gap-4">
          {!speaking ? (
            <button onClick={speak} className="flex items-center px-4 py-2 bg-[#7E69AB] rounded hover:bg-[#6E59A5]">
              <Play className="mr-2 h-4 w-4" /> Speak
            </button>
          ) : (
            <button onClick={stop} className="flex items-center px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              <Pause className="mr-2 h-4 w-4" /> Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SpeechToTextModal = ({ onClose }) => {
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
      // Loop through all new results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      // Only append if we got some finalized text
      if (finalTranscript.trim()) {
        setTranscript((prev) => prev + finalTranscript + " ");
      }
    };

    recognitionRef.current = recog;

    return () => {
      recog.stop();
      recog.onresult = null;
    };
  }, []);

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

  const clear = () => setTranscript("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <Mic className="h-6 w-6" />
          <h2 className="text-xl font-bold">Speech to Text</h2>
        </div>

        <div className="bg-white/10 p-4 rounded mb-4 min-h-[120px]">
          {transcript || "Speak now..."}
        </div>

        <div className="flex gap-4">
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
        </div>
      </div>
    </div>
  );
};

const InteractiveLearningModal = ({ onClose }) => {
  const [quizOn, setQuizOn] = useState(false);
  const toggleQuiz = () => {
    setQuizOn(prev => !prev);
    window.open(`http://localhost:8501/?routes=${quizOn ? "stop" : "start_quiz"}`, '_blank');
    toast[quizOn ? 'info' : 'success'](quizOn ? 'Quiz stopped' : 'Quiz started');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1A1F2C] text-white p-6 rounded-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl font-bold">Interactive Learning</h2>
        </div>
        <p className="mb-6 text-gray-300">
          Access personalized content and quizzes designed for different learning styles.
        </p>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['Personalized Content','Interactive Quizzes','Progress Tracking','Accessible Format'].map(label => (
            <div key={label} className="p-4 bg-white/5 rounded border border-white/10">
              <p className="text-white">{label}</p>
            </div>
          ))}
        </div> */}
        <button onClick={toggleQuiz} className={`px-6 py-2 rounded text-white ${quizOn ? 'bg-red-600 hover:bg-red-700' : 'bg-[#7E69AB] hover:bg-[#6E59A5]'}`}>
          {quizOn ? 'Stop Quiz' : 'Start Interactive Quiz'}
        </button>
      </div>
    </div>
  );
};

export default ToolsContent;
