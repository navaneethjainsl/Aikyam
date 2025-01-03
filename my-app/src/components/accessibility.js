import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

export default function AccessibilityTools() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploaded, setIsUploaded] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript);
      };

      setRecognition(recognition);
    } else {
      console.error('Speech recognition not supported');
    }
  }, []);

  const handleImageUpload = () => {
    if (isUploaded) {
      extractTextFromImage(isUploaded);
    } else {
      alert("Upload the image to extract the text content");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setIsUploaded(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const extractTextFromImage = (file) => {
    setIsProcessing(true);
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data: { text } }) => {
        setExtractedText(text);
        setIsProcessing(false);
      })
      .catch((err) => {
        console.error('Error during OCR:', err);
        setIsProcessing(false);
      });
  };

  const speakText = (text) => {
    if (text === "") {
      alert("Please Extract text first");
    } else {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
        setIsReading(true);
      } else {
        alert("Your browser does not support text-to-speech.");
      }
    }
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
        <h3 className="font-semibold mb-4">Upload Image</h3>
        <div className="flex gap-4">
          <input
            type="file"
            className="flex-1 px-4 py-3 bg-navy-700 rounded-xl border border-white/10"
            onChange={handleUpload}
          />
        </div>
      </div>

      {image && (
        <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
          <h3 className="font-semibold mb-4">Uploaded Image</h3>
          <img src={image} alt="Uploaded" className="w-32 h-32 object-cover rounded-xl" />
        </div>
      )}

      {extractedText && (
        <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
          <h3 className="font-semibold mb-4">Extracted Text</h3>
          <p className="text-sm">{extractedText}</p>
        </div>
      )}

      {transcript && (
        <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
          <h3 className="font-semibold mb-4">Transcribed Speech</h3>
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          onClick={handleImageUpload}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold text-sm">Extract Text - OCR</h3>
        </button>

        {!isReading ? (
          <button
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
            onClick={() => speakText(extractedText)}
          >
            <h3 className="font-semibold text-sm">Text-to-speech</h3>
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 rounded-xl hover:opacity-90 transition-opacity"
            onClick={stopReading}
          >
            <h3 className="font-semibold text-sm">Stop Reading</h3>
          </button>
        )}

        {!isListening ? (
          <button
            onClick={startListening}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          >
            <h3 className="font-semibold text-sm">Start Speech-to-Text</h3>
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 rounded-xl hover:opacity-90 transition-opacity"
          >
            <h3 className="font-semibold text-sm">Stop Speech-to-Text</h3>
          </button>
        )}

        {/* <button
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold text-sm">Frequency Compression</h3>
        </button> */}

        <button
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold text-sm">Interactive Learning</h3>
        </button>
      </div>
    </div>
  );
}

