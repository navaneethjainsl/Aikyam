import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function AccessibilityTools() {
  const [image, setImage] = useState(null); // State to hold the image URL
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploaded, setIsUploaded] = useState(null);
  const [isReading, setIsReading] = useState(false); // Track whether text is being read

  // Handle image upload
  const handleImageUpload = () => {
    // const file = e.target.files[0];
    if (isUploaded) {
      // const imageUrl = URL.createObjectURL(isUploaded); // Create URL for image preview
      // setImage(imageUrl); // Store the image URL in state
      extractTextFromImage(isUploaded);
    }
    else{
      alert("Upload the image to extract the text content")
    }
  };
  const handleUpload = (e) => {
    setIsUploaded(e.target.files[0]);
    if (isUploaded) {
      const imageUrl = URL.createObjectURL(isUploaded); // Create URL for image preview
      setImage(imageUrl); // Store the image URL in state
      // extractTextFromImage(isUploaded);
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
    if (text === ""){
      alert("Please Extract text first")
    }
    else{
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
            onChange={handleUpload}
          />
          {/* <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity">
            Submit
          </button> */}
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
      {/* {extractedText && !isReading && (
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
      )} */}

      {/* OCR Tool and Other Features */}
      <div className="grid grid-cols-3 gap-4">
        {/* {[
          'OCR Tool',
          'Text-to-speech',
          'Speech-to-Text',
          'Frequency Compression',
          'Interactive Learning',
        ].map((tool) => ( */}
        <button
          key={'OCR Tool'}
          onClick={handleImageUpload}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold">{'Extract Text - OCR'}</h3>
        </button>
        {/* <button
          key={'Text-to-speech'}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold">{'Text-to-speech'}</h3>
        </button> */}
        {/* Text-to-Speech Buttons */}
        {!isReading && (
          <button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={() => speakText(extractedText)} // Trigger TTS when clicked
          >
            <h3 className="font-semibold">{'Text-to-speech'}</h3>
          </button>
        )}

        {isReading && (
          <button
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-400 rounded-xl hover:opacity-90 transition-opacity"
          onClick={stopReading} // Stop TTS when clicked
          >
            <h3 className="font-semibold">{'Stop Reading'}</h3>
            
          </button>
        )}
        <button
          key={'Speech-to-Text'}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold">{'Speech-to-Text'}</h3>
        </button>
        <button
          key={'Interactive Learning'}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl hover:opacity-90 transition-opacity"
        >
          <h3 className="font-semibold">{'Interactive Learning'}</h3>
        </button>
        {/* ))} */}
      </div>
    </div>
  );
}
