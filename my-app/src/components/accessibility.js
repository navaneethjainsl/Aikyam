import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function AccessibilityTools() {
  const [image, setImage] = useState(null); // State to hold the image URL
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReading, setIsReading] = useState(false); // Track whether text is being read

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create URL for image preview
      setImage(imageUrl); // Store the image URL in state
      extractTextFromImage(file);
    }
  };

  // Extract text from the uploaded image using Tesseract.js OCR
  const extractTextFromImage = (file) => {
    setIsProcessing(true);
    Tesseract.recognize(
      file,
      'eng', // language code (can be changed to other languages)
      {
        logger: (m) => console.log(m), // You can log the progress here if needed
      }
    )
      .then(({ data: { text } }) => {
        setExtractedText(text); // Set the extracted text to state
        setIsProcessing(false); // Stop processing
      })
      .catch((err) => {
        console.error('Error during OCR:', err);
        setIsProcessing(false); // Stop processing if there's an error
      });
  };

  // Function to trigger Text-to-Speech conversion
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices()[0];
      utterance.rate = 1; // Adjust speech speed if needed
      utterance.pitch = 1; // Adjust pitch if needed
      utterance.volume = 1; // Max volume
      speechSynthesis.speak(utterance);
      setIsReading(true); // Set reading state to true
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  // Function to stop the reading
  const stopReading = () => {
    speechSynthesis.cancel(); // Cancel the ongoing speech
    setIsReading(false); // Set reading state to false
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
        <h3 className="font-semibold mb-4">Upload Image</h3>
        <div className="flex gap-4">
          <input
            type="file"
            className="flex-1 px-4 py-3 bg-navy-700 rounded-xl border border-white/10"
            onChange={handleImageUpload}
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
            Submit
          </button>
        </div>
      </div>

      {/* Display the uploaded image */}
      {image && (
        <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
          <h3 className="font-semibold mb-4">Uploaded Image</h3>
          <img src={image} alt="Uploaded" className="w-full rounded-xl" />
        </div>
      )}

      {/* Display extracted text */}
      {extractedText && (
        <div className="p-6 rounded-xl bg-navy-800 backdrop-blur-xl border border-white/10">
          <h3 className="font-semibold mb-4">Extracted Text</h3>
          <p>{extractedText}</p>
        </div>
      )}

      {/* Text-to-Speech Buttons */}
      {extractedText && !isReading && (
        <button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => speakText(extractedText)} // Trigger TTS when clicked
        >
          Read Text Aloud
        </button>
      )}
      
      {isReading && (
        <button
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={stopReading} // Stop TTS when clicked
        >
          Stop Reading
        </button>
      )}

      {/* OCR Tool and Other Features */}
      <div className="grid grid-cols-3 gap-4">
        {[
          'OCR Tool',
          'Text-to-speech',
          'Speech-to-Text',
          'Frequency Compression',
          'Interactive Learning',
        ].map((tool) => (
          <div
            key={tool}
            className="p-6 bg-navy-800 rounded-xl border border-white/10 backdrop-blur-xl"
          >
            <h3 className="font-semibold">{tool}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
