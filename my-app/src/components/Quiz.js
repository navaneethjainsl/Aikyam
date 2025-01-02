import React, { useState, useRef, useEffect } from "react";

export default function Quiz() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedText, setDetectedText] = useState(""); // Define detectedText state here
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const wsRef = useRef(null);
  const lastDetectedRef = useRef(""); // To store the last detected letter

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check your permissions.");
    }
  };

  const handleStartDetection = () => {
    if (!streamRef.current) return;
    setIsDetecting(true);
  };

  useEffect(() => {
    if (isDetecting) {
      // Initialize WebSocket connection
      wsRef.current = new WebSocket("ws://localhost:8000/rs");
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
      };
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        alert("WebSocket connection failed. Check the backend server.");
      };
      wsRef.current.onmessage = (event) => {
        const data = event.data;

        if (data === "No hand detected") {
          // Handle no hand detection
          console.log("No hand detected");
          setDetectedText((prev) => prev + lastDetectedRef.current);
          lastDetectedRef.current = "";
        } else if (data === "next") {
          // Handle next frame detection (space in this case)
          console.log("Next frame detected");
          if (lastDetectedRef.current) {
            setDetectedText((prev) => prev + " ");
            lastDetectedRef.current = "";
          }
        } else {
          // Update detected letter
          lastDetectedRef.current = data;
          setDetectedText((prev) => prev + data);
        }
      };

      // Capture frames from the camera and send them to the backend
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      const sendFrame = async () => {
        if (!isDetecting || !video || !canvas || !wsRef.current) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        ctx.save();
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Draw the flipped video on canvas
        ctx.restore();

        const frameData = canvas.toDataURL("image/jpeg"); // Base64 image

        // Send frame to WebSocket server
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(frameData);
        }

        setTimeout(sendFrame, 100); // Continue sending frames every 100ms
      };
      
      sendFrame();
    }
  }, [isDetecting]);

  const handleStopDetection = () => {
    setIsDetecting(false);
    if (wsRef.current) {
      wsRef.current.close();
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
    handleStopDetection();
  };

  return (
    <div>
      <h1>Sign Language Quiz</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        className="video-preview"
        style={{ transform: "scaleX(-1)" }} // Flip the video horizontally
      />
      <p>{detectedText || "No prediction yet"}</p>
      <textarea
        value={detectedText}
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
