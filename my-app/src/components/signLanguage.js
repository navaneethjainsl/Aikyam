import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, Camera, X, Video, StopCircle } from 'lucide-react';

export default function SignLanguageDetector() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [responseText, setResponseText] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      // Cleanup function to stop the stream when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure the video starts playing
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your permissions.');
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');

        try {
          const response = await axios.post('http://your-backend-endpoint/api/detect', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setResponseText(response.data.result);
          console.log('Backend Response:', response.data);
        } catch (error) {
          console.error('Error uploading video:', error);
          alert('Error communicating with the backend.');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4 grid gap-4">
      <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6">Sign Language Detector</h2>
        <div className="w-full h-[350px] bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl flex items-center justify-center p-6 relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={!isRecording} // Mute video when recording
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl mt-4">
          <p className="text-gray-400">{responseText || 'Captioning display for text conversion'}</p>
        </div>
        <div className="grid gap-4 mt-4">
          <button className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group">
            <Upload className="mr-2 h-5 w-5 group-hover:text-purple-400" />
            Upload Video
          </button>
          <button
            className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group"
            onClick={isCameraActive ? handleStopCamera : handleCameraAccess}
          >
            {isCameraActive ? (
              <>
                <X className="mr-2 h-5 w-5 group-hover:text-red-400" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5 group-hover:text-purple-400" />
                Access Camera
              </>
            )}
          </button>
          <div className="flex gap-4">
            <button
              className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                isDetecting
                  ? 'bg-gradient-to-r from-red-600 to-red-400'
                  : 'bg-gradient-to-r from-purple-600 to-purple-400'
              } hover:opacity-90`}
              onClick={() => setIsDetecting(!isDetecting)}
              disabled={!isCameraActive}
            >
              {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-gradient-to-r from-red-600 to-red-400'
                  : 'bg-gradient-to-r from-green-600 to-green-400'
              } hover:opacity-90`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isCameraActive}
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Video className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
