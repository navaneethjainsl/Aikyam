import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

export default function SignLanguageDetector() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [responseTextAlphabets, setResponseTextAlphabets] = useState(""); // For Alphabets
  const [responseTextWords, setResponseTextWords] = useState(""); // For Words
  const [detectedTextAlphabets, setDetectedTextAlphabets] = useState(""); // For Alphabets
  const [detectedTextWords, setDetectedTextWords] = useState(""); // For Words
  const [mode, setMode] = useState(null); // To track whether user selects Alphabets or Words
  const detectionInterval = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const lastDetectedRef = useRef(""); // To store the last detected letter
  const handDetectedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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
          lastDetectedRef.current = data; // Update last detected letter
        }
      });
      
      socketRef.current.on("prediction_words", (data) => {
        if (data === "NEXT") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextWords("NEXT");
            setResponseTextWords((prev) => `${prev}${lastDetectedRef.current}`);
          }
        } else if (data === "No hand detected") {
          if (!handDetectedRef.current) {
            handDetectedRef.current = true;
            setDetectedTextWords("No hand detected");
            setResponseTextWords((prev) => `${prev} `);
          }
        } else {
          handDetectedRef.current = false;
          setDetectedTextWords(data);
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
    }, 700); // Send frames every 700ms
  };

  const handleStartDetection2 = () => {
    if (!isCameraActive) return;

    console.log("inside 2")
    
    startWebSocket();
    setIsDetecting(true);

    console.log("inside 2.1")
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    console.log("inside 2.2")
    
    detectionInterval.current = setInterval(() => {
      console.log("inside 2.3")
      if (videoRef.current && socketRef.current) {
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip the image horizontally
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameData = canvas.toDataURL("image/jpeg");
        socketRef.current.emit("video_frame2", frameData);
      }
    }, 700); // Send frames every 700ms
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
  };

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      {/* Display Sign Language Detection header */}
      <h1 style={{ fontSize: "48px", marginBottom: "40px" }}>
        {mode === "alphabets" ? "DETECT ALPHABETS" : mode === "words" ? "DETECT WORDS" : "SIGN LANGUAGE DETECTION"}
      </h1>

      {/* Show buttons for Alphabets and Words */}
      {!mode && (
        <div className="button-container" style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
          <button
            onClick={() => handleModeChange("alphabets")}
            className="mode-button"
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "20px 40px",
              fontSize: "24px",
              borderRadius: "8px",
            }}
          >
            Alphabets
          </button>
          <button
            onClick={() => handleModeChange("words")}
            className="mode-button"
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "20px 40px",
              fontSize: "24px",
              borderRadius: "8px",
            }}
          >
            Words
          </button>
        </div>
      )}

      {/* Display camera access and detection buttons only if Alphabets mode is selected */}
      {mode === "alphabets" && (
        <div>
          <button
            onClick={() => setMode(null)}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "10px 20px",
              fontSize: "18px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            &larr; Back
          </button>

          <video
            ref={videoRef}
            autoPlay
            muted
            className="video-preview"
            style={{ width: "100%", transform: "scaleX(-1)" }} // Flip the video horizontally
          />
          <p>{detectedTextAlphabets || "No prediction yet"}</p>
          <textarea
            value={responseTextAlphabets}
            onChange={(e) => setResponseTextAlphabets(e.target.value)} // Allow manual editing
            rows={5}
            cols={50}
            placeholder="Detected text will appear here..."
            style={{
              color: "black",
              backgroundColor: "#f0f0f0",
              marginTop: "20px",
            }}
          />
          <br />
          <button
            onClick={isCameraActive ? handleStopCamera : handleCameraAccess}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "15px 30px",
              fontSize: "20px",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            {isCameraActive ? "Stop Camera" : "Access Camera"}
          </button>
          <br />
          <button
            onClick={isDetecting ? handleStopDetection : handleStartDetection}
            disabled={!isCameraActive}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "15px 30px",
              fontSize: "20px",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            {isDetecting ? "Stop Detection" : "Start Detection"}
          </button>
        </div>
      )}

      {/* Display camera access and detection buttons only if Words mode is selected */}
      {mode === "words" && (
        <div>
          <button
            onClick={() => setMode(null)}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "10px 20px",
              fontSize: "18px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            &larr; Back
          </button>

          <video
            ref={videoRef}
            autoPlay
            muted
            className="video-preview"
            style={{ width: "100%", transform: "scaleX(-1)" }} // Flip the video horizontally
          />
          <p>{detectedTextWords || "No prediction yet"}</p>
          <textarea
            value={responseTextWords}
            onChange={(e) => setResponseTextWords(e.target.value)} // Allow manual editing
            rows={5}
            cols={50}
            placeholder="Detected text will appear here..."
            style={{
              color: "black",
              backgroundColor: "#f0f0f0",
              marginTop: "20px",
            }}
          />
          <br />
          <button
            onClick={isCameraActive ? handleStopCamera : handleCameraAccess}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "15px 30px",
              fontSize: "20px",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            {isCameraActive ? "Stop Camera" : "Access Camera"}
          </button>
          <br />
          <button
            onClick={isDetecting ? handleStopDetection : handleStartDetection2}
            disabled={!isCameraActive}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              padding: "15px 30px",
              fontSize: "20px",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            {isDetecting ? "Stop Detection" : "Start Detection"}
          </button>
        </div>
      )}
    </div>
  );
}
