import React, { useState, useRef, useEffect } from "react";
import { Camera, Copy, Volume2, Play, Pause } from "lucide-react";
import io from "socket.io-client";

export default function SignLanguageDetector({ setSidebar }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [responseTextAlphabets, setResponseTextAlphabets] = useState("");
  const [responseTextWords, setResponseTextWords] = useState("");
  const [detectedTextAlphabets, setDetectedTextAlphabets] = useState("");
  const [detectedTextWords, setDetectedTextWords] = useState("");
  const [mode, setMode] = useState("alphabets");
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const detectionInterval = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const lastDetectedRef = useRef("");
  const handDetectedRef = useRef(false);

  setSidebar(true);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Stop the camera if still running on unmount
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Stop the camera when the tab becomes hidden (e.g., switching tabs in the nav)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop camera and detection
        handleStopCamera();
        handleStopDetection();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Because the video element is always rendered,
        // videoRef.current will not be null.
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const handleStopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    stopWebSocket();
  };

  const startWebSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000");

      socketRef.current.on("prediction", (data) => {
        if (data === "NEXT") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextAlphabets("NEXT");
            if (lastDetectedRef.current) {
              setResponseTextAlphabets((prev) => `${prev}${lastDetectedRef.current}`);
            }
          }
        } else if (data === "No hand detected") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextAlphabets("No hand detected");
            setResponseTextAlphabets((prev) => `${prev} `);
          }
        } else {
          handDetectedRef.current = false;
          setDetectedTextAlphabets(data);
          lastDetectedRef.current = data;
        }
      });

      socketRef.current.on("prediction_words", (data) => {
        if (data === "NEXT") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextWords("NEXT");
            if (lastDetectedRef.current) {
              setResponseTextWords((prev) => `${prev}${lastDetectedRef.current}`);
            }
          }
        } else if (data === "No hand detected") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextWords("No hand detected");
            if (lastDetectedRef.current) {
              setResponseTextWords((prev) => `${prev} ${lastDetectedRef.current}`);
            }
          }
        } else {
          handDetectedRef.current = false;
          setDetectedTextWords(data);
          lastDetectedRef.current = data;
        }
      });
    }
  };

  const stopWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const handleStartDetection = () => {
    if (!isCameraActive) return;

    startWebSocket();
    setIsDetecting(true);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    detectionInterval.current = setInterval(() => {
      if (videoRef.current && socketRef.current) {
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip the image horizontally
        context.save(); // Save the current state
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore(); // Restore to original state

        const frameData = canvas.toDataURL("image/jpeg");
        socketRef.current.emit("video_frame", frameData);
      }
    }, 700); // Send frames every 700ms
  };

  const handleStartDetection2 = () => {
    if (!isCameraActive) return;

    startWebSocket();
    setIsDetecting(true);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    detectionInterval.current = setInterval(() => {
      if (videoRef.current && socketRef.current) {
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip the image horizontally
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();

        const frameData = canvas.toDataURL("image/jpeg");
        socketRef.current.emit("video_frame2", frameData);
      }
    }, 700);
  };

  const handleStopDetection = () => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    stopWebSocket();
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    handleStopDetection();
  };

  const copyToClipboard = () => {
    const text = mode === "alphabets" ? responseTextAlphabets : responseTextWords;
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch(err => {
        console.error("Could not copy text: ", err);
      });
  };

  const speakText = () => {
    const text = mode === "alphabets" ? responseTextAlphabets : responseTextWords;
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue text-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4 text-white">
            {mode === "alphabets" ? "DETECT ALPHABETS" : mode === "words" ? "DETECT WORDS" : "SIGN LANGUAGE DETECTION"}
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Our advanced sign language detection converts signs to text and speech in real-time, helping bridge communication gaps.
          </p>
        </div>

        {!mode && (
          <div className="flex justify-center gap-6 mb-10 mt-12">
            <button
              onClick={() => handleModeChange("alphabets")}
              className="bg-aikyam-purple text-white px-8 py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Alphabets
            </button>
            <button
              onClick={() => handleModeChange("words")}
              className="bg-aikyam-purple text-white px-8 py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Words
            </button>
          </div>
        )}

        {mode && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md overflow-hidden border border-gray-700">
              <button
                onClick={() => handleModeChange("alphabets")}
                className={`px-8 py-2 text-sm font-medium ${mode === "alphabets" ? "bg-aikyam-purple text-white" : "bg-gray-800 text-gray-300"}`}
              >
                Alphabet Signs
              </button>
              <button
                onClick={() => handleModeChange("words")}
                className={`px-8 py-2 text-sm font-medium ${mode === "words" ? "bg-aikyam-purple text-white" : "bg-gray-800 text-gray-300"}`}
              >
                Word Signs
              </button>
            </div>
          </div>
        )}

        {mode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side: Camera feed */}
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
              <div className="relative bg-gray-900 aspect-video">
                {/* Always render the video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transform scaleX(-1) ${!isCameraActive && "hidden"}`}
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="flex justify-center mb-2">
                      <Camera size={48} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-4">Camera is currently turned off</p>
                    <button
                      onClick={handleCameraAccess}
                      className="bg-aikyam-purple text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Turn On Camera
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-2 p-3 bg-gray-800">
                <button
                  onClick={isCameraActive ? handleStopCamera : handleCameraAccess}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  title={isCameraActive ? "Stop Camera" : "Start Camera"}
                >
                  <Camera size={20} className="text-gray-300" />
                </button>
                <button
                  onClick={
                    isDetecting
                      ? handleStopDetection
                      : mode === "alphabets"
                        ? handleStartDetection
                        : handleStartDetection2
                  }
                  disabled={!isCameraActive}
                  className={`p-2 rounded-full ${!isCameraActive
                      ? 'bg-gray-700 cursor-not-allowed opacity-50'
                      : isDetecting
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-aikyam-purple hover:opacity-90'
                    } transition-colors`}
                  title={isDetecting ? "Stop Detection" : "Start Detection"}
                >
                  {isDetecting ? (
                    <Pause size={20} className="text-white" />
                  ) : (
                    <Play size={20} className="text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Right side: Detection results */}
            <div className="space-y-6">
              {/* Detected Text */}
              <div className="bg-gray-800 rounded-xl shadow-md p-5 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Detected Text</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={18} className="text-gray-300" />
                    </button>
                    <button
                      onClick={speakText}
                      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 size={18} className="text-gray-300" />
                    </button>
                  </div>
                </div>

                <div className="min-h-32 bg-gray-900 rounded-lg p-4">
                  {!isCameraActive ? (
                    <p className="text-center text-gray-500 py-10">Turn on the camera to begin</p>
                  ) : !isDetecting ? (
                    <p className="text-center text-gray-500 py-10">Press the play button to start detection</p>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-gray-400">
                        Current: <span className="font-medium text-aikyam-purple">{mode === "alphabets" ? detectedTextAlphabets : detectedTextWords}</span>
                      </p>
                      <div className="bg-gray-800 border border-gray-700 rounded p-3 min-h-16 text-white">
                        {mode === "alphabets" ? responseTextAlphabets : responseTextWords}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-xl shadow-md p-5 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">Instructions</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-aikyam-purple/20 text-aikyam-purple rounded-full flex items-center justify-center text-sm font-medium mr-2">1</span>
                    <span className="text-gray-300">Position yourself in front of the camera with good lighting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-aikyam-purple/20 text-aikyam-purple rounded-full flex items-center justify-center text-sm font-medium mr-2">2</span>
                    <span className="text-gray-300">Ensure your hands are clearly visible within the frame</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-aikyam-purple/20 text-aikyam-purple rounded-full flex items-center justify-center text-sm font-medium mr-2">3</span>
                    <span className="text-gray-300">Make sign gestures slowly and clearly for best results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-aikyam-purple/20 text-aikyam-purple rounded-full flex items-center justify-center text-sm font-medium mr-2">4</span>
                    <span className="text-gray-300">Keep a neutral background to improve detection accuracy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
