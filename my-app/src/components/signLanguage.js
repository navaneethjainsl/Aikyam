// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { Upload, Camera, X, Video, StopCircle } from 'lucide-react';

// export default function SignLanguageDetector() {
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [responseText, setResponseText] = useState('');

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   useEffect(() => {
//     handleCameraAccess();
//     const interval = setInterval(async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/prediction/');
//         setResponseText(response.data.prediction);
//       } catch (error) {
//         console.error('Error fetching prediction:', error);
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const handleCameraAccess = async () => {
//     try {
//       // Directly fetch the video stream from FastAPI backend
//       const videoStream = `http://localhost:8000/stream/`;
//       videoRef.current.srcObject = videoStream;
//       setIsCameraActive(true);
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//       alert('Unable to access camera. Please check your permissions.');
//     }
//   };

//   const handleStopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraActive(false);
//     setIsRecording(false);
//   };

//   const startRecording = () => {
//     if (streamRef.current) {
//       const mediaRecorder = new MediaRecorder(streamRef.current);
//       mediaRecorderRef.current = mediaRecorder;
//       chunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunksRef.current, { type: 'video/webm' });
//         const formData = new FormData();
//         formData.append('video', blob, 'recording.webm');

//         try {
//           const response = await axios.post('http://localhost:8000/api/detect', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//           setResponseText(response.data.result);
//           console.log('Backend Response:', response.data);
//         } catch (error) {
//           console.error('Error uploading video:', error);
//           alert('Error communicating with the backend.');
//         }
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   return (
//     <div className="space-y-4 grid gap-4">
//       <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
//         <h2 className="text-2xl font-bold mb-6">Sign Language Detector</h2>
//         <div className="w-full h-[350px] bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl flex items-center justify-center p-6 relative overflow-hidden">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted={!isRecording} // Mute video when recording
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="p-4 bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl mt-4">
//           <p className="text-gray-400">{responseText || 'Captioning display for text conversion'}</p>
//         </div>
//         <div className="grid gap-4 mt-4">
//           <button className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group">
//             <Upload className="mr-2 h-5 w-5 group-hover:text-purple-400" />
//             Upload Video
//           </button>
//           <button
//             className="w-full px-4 py-3 bg-[#2a3353] rounded-xl hover:bg-[#343e66] transition-colors flex items-center justify-center group"
//             onClick={isCameraActive ? handleStopCamera : handleCameraAccess}
//           >
//             {isCameraActive ? (
//               <>
//                 <X className="mr-2 h-5 w-5 group-hover:text-red-400" />
//                 Stop Camera
//               </>
//             ) : (
//               <>
//                 <Camera className="mr-2 h-5 w-5 group-hover:text-purple-400" />
//                 Access Camera
//               </>
//             )}
//           </button>
//           <div className="flex gap-4">
//             <button
//               className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
//                 isDetecting
//                   ? 'bg-gradient-to-r from-red-600 to-red-400'
//                   : 'bg-gradient-to-r from-purple-600 to-purple-400'
//               } hover:opacity-90`}
//               onClick={() => setIsDetecting(!isDetecting)}
//               disabled={!isCameraActive}
//             >
//               {isDetecting ? 'Stop Detection' : 'Start Detection'}
//             </button>
//             <button
//               className={`flex-1 px-4 py-3 rounded-xl transition-colors ${
//                 isRecording
//                   ? 'bg-gradient-to-r from-red-600 to-red-400'
//                   : 'bg-gradient-to-r from-green-600 to-green-400'
//               } hover:opacity-90`}
//               onClick={isRecording ? stopRecording : startRecording}
//               disabled={!isCameraActive}
//             >
//               {isRecording ? (
//                 <>
//                   <StopCircle className="mr-2 h-5 w-5" />
//                   Stop Recording
//                 </>
//               ) : (
//                 <>
//                   <Video className="mr-2 h-5 w-5" />
//                   Start Recording
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// version2

// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Camera, X, Video, StopCircle } from 'lucide-react';

// export default function SignLanguageDetector() {
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [responseText, setResponseText] = useState('No Prediction');
//   const [ws, setWs] = useState(null);

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   useEffect(() => {
//     handleCameraAccess();
    
//     // Set up WebSocket connection for real-time prediction updates
//     const socket = new WebSocket('ws://localhost:8000/ws');
//     socket.onopen = () => {
//       console.log('WebSocket connection established');
//     };
//     socket.onmessage = (event) => {
//       setResponseText(event.data);
//     };
//     socket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     setWs(socket);

//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, []);

//   const handleCameraAccess = async () => {
//     try {
//       // Directly fetch the video stream from FastAPI backend
//       const videoStream = `http://localhost:8000/stream/`;
//       videoRef.current.srcObject = videoStream;
//       setIsCameraActive(true);
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//       alert('Unable to access camera. Please check your permissions.');
//     }
//   };

//   const handleStopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraActive(false);
//     setIsRecording(false);
//   };

//   return (
//     <div className="space-y-4 grid gap-4">
//       <div className="p-6 rounded-xl bg-[#1c2444] backdrop-blur-xl border border-white/10">
//         <h2 className="text-2xl font-bold mb-6">Sign Language Detector</h2>
//         <div className="w-full h-[350px] bg-[#1c2444] rounded-xl border border-white/10 backdrop-blur-xl flex items-center justify-center p-6 relative overflow-hidden">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted={!isRecording} // Mute video while recording
//             className="h-full object-cover"
//           />
//         </div>
//         <div className="flex justify-between gap-4">
//           <button onClick={() => setIsDetecting(!isDetecting)} className="bg-[#33d9e7] rounded-lg px-8 py-3 font-medium text-xl w-full">
//             {isDetecting ? 'Stop Detecting' : 'Start Detecting'}
//           </button>
//         </div>
//         <h3 className="mt-4 text-xl text-center">{responseText}</h3>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";

// export default function SignLanguageDetector() {
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [responseText, setResponseText] = useState("");
//   const [detectedText, setDetectedText] = useState("");
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const wsRef = useRef(null);
//   const lastDetectedRef = useRef(""); // To store the last detected letter

//   useEffect(() => {
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const handleCameraAccess = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       streamRef.current = stream;
//       setIsCameraActive(true);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert("Unable to access camera. Please check your permissions.");
//     }
//   };

//   const handleStartDetection = () => {
//     if (!streamRef.current) return;
//     setIsDetecting(true);
//   };

//   useEffect(() => {
//     if (isDetecting) {
//       wsRef.current = new WebSocket("ws://localhost:8000/ws");
//       wsRef.current.onopen = () => {
//         console.log("WebSocket connected");
//       };
//       wsRef.current.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         alert("WebSocket connection failed. Check the backend server.");
//       };
//       wsRef.current.onmessage = (event) => {
//         const data = event.data;

//         if (data === "No hand detected") {
//           // Insert a space when "next" is detected
//           setDetectedText("No hand detected")
//           // setDetectedText((prev) => prev + " ");
//         } 
//         else if (data === "next") {
//           // Append the last detected character when no hand is detected
//           if (lastDetectedRef.current) {
//             setDetectedText((prev) => prev + lastDetectedRef.current);  
//           }
//         } else {
//           // Update detected text with the new character and update last detected letter
//           lastDetectedRef.current = data;
//           setDetectedText((prev) => prev + data);
//         }
//         setResponseText(data); // Update the response text for display
//       };

//       // Capture frames and send to backend
//       const canvas = document.createElement("canvas");
//       const video = videoRef.current;

//       const sendFrame = async () => {
//         if (!isDetecting || !video || !canvas || !wsRef.current) return;

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         const ctx = canvas.getContext("2d");

//         ctx.save();
//         ctx.scale(-1, 1); // Flip horizontally
//         ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Draw the video on the flipped canvas
//         ctx.restore();

//         const frameData = canvas.toDataURL("image/jpeg");

//         if (wsRef.current.readyState === WebSocket.OPEN) {
//           wsRef.current.send(frameData);
//         }

//         setTimeout(sendFrame, 100); // Send frames every 100ms
//       };
//       sendFrame();
//     }
//   }, [isDetecting]);

//   const handleStopDetection = () => {
//     setIsDetecting(false);
//     if (wsRef.current) {
//       wsRef.current.close();
//     }
//   };

//   const handleStopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraActive(false);
//     handleStopDetection();
//   };
  

//   return (
//     <div>
//       <h1>Sign Language Detector</h1>
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         className="video-preview"
//         style={{ transform: "scaleX(-1)" }} // Flip the video horizontally
//       />
//       <p>{responseText || "No prediction yet"}</p>
//       <textarea
//         value={detectedText === "No hand detected" ? "" : detectedText}
//         onChange={(e) => setDetectedText(e.target.value)} // Allow manual editing
//         rows={5}
//         cols={50}
//         placeholder="Detected text will appear here..."
//         style={{ color: 'black', backgroundColor: '#f0f0f0' }} // Change text color to black, background to light gray
//       />
//       <br />
//       <button onClick={isCameraActive ? handleStopCamera : handleCameraAccess}>
//         {isCameraActive ? "Stop Camera" : "Access Camera"}
//       </button>
//       <button onClick={isDetecting ? handleStopDetection : handleStartDetection} disabled={!isCameraActive}>
//         {isDetecting ? "Stop Detection" : "Start Detection"}
//       </button>
//     </div>
//   );
// }

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
