import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

export default function SignLanguageDetector() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [detectedText, setDetectedText] = useState("");
  const detectionInterval = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const lastDetectedRef = useRef(""); // To store the last detected letter
  const handDetectedRef = useRef(false);

  let last = ""

  useEffect(() => {
    return () => {
      // Cleanup WebSocket connection on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    return () => {
      // Cleanup WebSocket connection on unmount
      lastDetectedRef.current = "";
    };
  }, [responseText]);

  const handleCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
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
            setDetectedText("NEXT");
            if (lastDetectedRef.current) {
              setResponseText((prev) => `${prev}${lastDetectedRef.current}`);
              // lastDetectedRef.current = "";
            }
          }
        } else if (data === "No hand detected") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedText("No hand detected");
            setResponseText((prev) => `${prev} `);
          }
        } else {
          handDetectedRef.current = false;
          setDetectedText(data);
          lastDetectedRef.current = data; // Update last detected letter
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
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameData = canvas.toDataURL("image/jpeg");
        socketRef.current.emit("video_frame", frameData);
      }
    }, 700); // Send frames every 100ms
  };

  const handleStopDetection = () => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    stopWebSocket();
  };  

  return (
    <div>
      <h1>Sign Language Detector</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        className="video-preview"
        style={{ width: "100%", transform: "scaleX(-1)" }} // Flip the video horizontally
      />
      <p>{detectedText || "No prediction yet"}</p>
      <textarea
        value={responseText}
        onChange={(e) => setDetectedText(e.target.value)} // Allow manual editing
        rows={5}
        cols={50}
        placeholder="Detected text will appear here..."
        style={{ color: 'black', backgroundColor: '#f0f0f0' }} // Change text color to black, background to light gray
      />
      <br />
      <button onClick={isCameraActive ? handleStopCamera : handleCameraAccess}>
        {isCameraActive ? "Stop Camera" : "Access Camera"}
      </button>
      <button onClick={isDetecting ? handleStopDetection : handleStartDetection} disabled={!isCameraActive}>
        {isDetecting ? "Stop Detection" : "Start Detection"}
      </button>
    </div>
  );
}
