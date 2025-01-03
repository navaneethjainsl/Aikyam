# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import cv2
# import mediapipe as mp
# import numpy as np
# import pandas as pd
# import string
# from tensorflow.keras.models import load_model
# import copy
# import itertools
# import threading
# import queue
# import asyncio

# # Load the saved model
# model = load_model("model2.h5")

# # Mediapipe hands setup
# mp_drawing = mp.solutions.drawing_utils
# mp_hands = mp.solutions.hands

# # Alphabet setup with 'NEXT' added alphabetically
# alphabet = list(string.ascii_uppercase)
# alphabet.insert(alphabet.index('N') + 1, "NEXT")  # Insert 'NEXT' after 'N'

# app = FastAPI()

# # Global variables
# current_frame = None
# predicted_label = "No Prediction"
# frame_queue = queue.Queue(maxsize=10)  # Queue to store frames
# websocket_clients = set()  # Set to store WebSocket clients

# # Function to capture frames continuously
# def capture_frames():
#     """Capture frames continuously in a separate thread."""
#     global current_frame, predicted_label

#     cap = cv2.VideoCapture(0)
#     cap.set(cv2.CAP_PROP_FPS, 60)  # Set FPS to 60 if supported by the camera

#     with mp_hands.Hands(
#             model_complexity=0,
#             max_num_hands=1,
#             min_detection_confidence=0.5,
#             min_tracking_confidence=0.5) as hands:
        
#         while True:
#             success, frame = cap.read()
#             if not success:
#                 continue

#             # Flip and process the frame
#             frame = cv2.flip(frame, 1)
#             image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             results = hands.process(image)

#             if results.multi_hand_landmarks:
#                 for hand_landmarks in results.multi_hand_landmarks:
#                     landmark_list = calc_landmark_list(frame, hand_landmarks)
#                     pre_processed_landmark_list = pre_process_landmark(landmark_list)

#                     # Predict using the model
#                     predicted_label = predict(pre_processed_landmark_list)

#                     # Draw landmarks
#                     mp_drawing.draw_landmarks(
#                         frame,
#                         hand_landmarks,
#                         mp_hands.HAND_CONNECTIONS,
#                         mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
#                         mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
#                     )
#             else:
#                 predicted_label = "No hand detected"

#             # Add prediction text to the frame
#             current_frame = cv2.putText(
#                 frame,
#                 f'Prediction: {predicted_label}',
#                 (10, 50),
#                 cv2.FONT_HERSHEY_SIMPLEX,
#                 1,
#                 (0, 255, 0),
#                 2,
#                 cv2.LINE_AA
#             )

#             # Put the frame in the queue (only if the queue has space)
#             if not frame_queue.full():
#                 frame_queue.put(frame)

#     cap.release()

# # Function to predict gesture
# def predict(pre_processed_landmark_list):
#     """Synchronous prediction to avoid lag caused by async calls."""
#     global predicted_label

#     df = pd.DataFrame(pre_processed_landmark_list).transpose()
#     predictions = model.predict(df, verbose=0)
#     predicted_class = np.argmax(predictions, axis=1)
#     predicted_label = alphabet[predicted_class[0]]

#     return predicted_label

# # Functions to process landmarks
# def calc_landmark_list(image, landmarks):
#     """Calculate normalized landmark coordinates."""
#     image_width, image_height = image.shape[1], image.shape[0]
#     landmark_point = []
#     for _, landmark in enumerate(landmarks.landmark):
#         landmark_x = min(int(landmark.x * image_width), image_width - 1)
#         landmark_y = min(int(landmark.y * image_height), image_height - 1)
#         landmark_point.append([landmark_x, landmark_y])
#     return landmark_point

# def pre_process_landmark(landmark_list):
#     """Normalize the landmark list."""
#     temp_landmark_list = copy.deepcopy(landmark_list)
#     base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
#     for index, landmark_point in enumerate(temp_landmark_list):
#         temp_landmark_list[index][0] -= base_x
#         temp_landmark_list[index][1] -= base_y
#     temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
#     max_value = max(list(map(abs, temp_landmark_list)))
#     return [n / max_value for n in temp_landmark_list]

# @app.on_event("startup")
# def startup_event():
#     """Start the background frame capture task."""
#     capture_thread = threading.Thread(target=capture_frames)
#     capture_thread.daemon = True  # This ensures the thread will exit when the main program exits
#     capture_thread.start()

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     """WebSocket endpoint for real-time communication with clients."""
#     await websocket.accept()
#     websocket_clients.add(websocket)
    
#     try:
#         while True:
#             # Send predictions to the client in real-time
#             await websocket.send_text(predicted_label)
#     except WebSocketDisconnect:
#         websocket_clients.remove(websocket)

# @app.get("/")
# def root():
#     return {"message": "Welcome to the Real-Time Sign Language Detection API!"}

# @app.get("/stream/") 
# def stream_video():
#     """API endpoint to stream video with predictions."""
#     def generate_frames():
#         while True:
#             if not frame_queue.empty():
#                 frame = frame_queue.get()
#                 _, buffer = cv2.imencode('.jpg', frame)
#                 yield (b'--frame\r\n'
#                        b'Content-Type: image/jpeg\r\n\r\n' +
#                        buffer.tobytes() + b'\r\n')

#     return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, port=8000)


import base64
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
import mediapipe as mp
import numpy as np
import pandas as pd
from PIL import Image
import cv2
import string
import copy
import itertools
from pathlib import Path
import subprocess
import uvicorn
from io import BytesIO
import threading
from cvzone.HandTrackingModule import HandDetector
from pynput.keyboard import Controller
from time import sleep
import asyncio
from fastapi.middleware.cors import CORSMiddleware

import cv2  # OpenCV lib
from cvzone.HandTrackingModule import HandDetector  # Relies on MediaPipe lib
from time import sleep
import numpy as np
import cvzone
from pynput.keyboard import Controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize variables
finalText = ""

keyboard_thread = None
# Function to run the virtual keyboard
@app.get('/startkeyboard')
def run_keyboard():
        
    cap = cv2.VideoCapture(0)  # VideoCapture object with id number 0

    # Set the camera resolution
    cap.set(3, 1280)  # 3 is for width
    cap.set(4, 720)  # 4 is for height

    offset = 20

    detector = HandDetector(detectionCon=0.8)  # Higher detectionCon improves accuracy
    keys = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
            ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]]
    finalText = "hi"

    keyboard = Controller()


    defaultColor = (200, 200, 225)  # Soft lavender blue for default
    hoverColor = (100, 150, 250)    # Light periwinkle for hover
    clickedColor = (255, 100, 100)  # Coral red for clicked


    def drawAll(img, buttonList):  
        for button in buttonList:
            x, y = button.pos
            w, h = button.size
            cvzone.cornerRect(img, (button.pos[0], button.pos[1], button.size[0], button.size[1]), 20, rt=0)
            cv2.rectangle(img, button.pos , (x + w, y + h), defaultColor, cv2.FILLED)
            cv2.putText(img, button.text, (x + 20, y + 65),
                        cv2.FONT_HERSHEY_PLAIN, 4, (255, 255, 255), 4)
        return img

    class Button():
        def __init__(self, pos, text, size=[85, 85]):
            self.pos = pos
            self.size = size
            self.text = text

    buttonList = []
    # for i in range(len(keys)):
    for i, row in enumerate(keys):
        for j, key in enumerate(keys[i]):
            # Position "SPACE" and "BACKSPACE" differently by checking row index
            # if i == len(keys) - 1:  # If it's the last row (the one with SPACE and BACKSPACE)
            #     buttonList.append(Button([100 * j + 200, 400], key, size=[300, 85]))
            # else:
            #     buttonList.append(Button([100 * j + 50, 100 * i + 50], key))
            buttonList.append(Button([100 * j + 50, 100 * i + 50], key))

    # Special row for space and backspace
    buttonList.append(Button([150, 400], "SPACE", [400, 85]))  # Larger width for space bar
    buttonList.append(Button([700, 400], "BACKSPACE", [500, 85]))  # Larger width for backspace


    # Boilerplate to run webcam feed
    while True:
        success, img = cap.read()

        if not success:
            break
        img = cv2.flip(img, 1)
        # Find hands and landmarks
        hands, img = detector.findHands(img, flipType=False)  # Detect hands and draw landmarks on the image
        
        img= drawAll(img, buttonList)

        if hands and len(hands[0]['lmList']) > 8:
            lmList = hands[0]['lmList']  # Landmarks list for the first hand
            bboxInfo = hands[0]['bbox']  # Bounding box info for the first hand
            # print("Landmarks:", lmList)  # Print landmarks for debugging
            # print("Bounding Box Info:", bboxInfo)  # Print bounding box info for debugging

            # hand= hands[0]
            # x, y, w, h = hand['bbox']
            # x_min = x - offset
            # y_min = y - offset
            # x_max = x + w + offset
            # y_max = y + h + offset


            # cv2.rectangle(img, (x_min, y_min ), (x_max, y_max), (255, 0, 255), 4)

            if lmList:
                for button in buttonList:
                    x, y = button.pos
                    w, h = button.size

                    # hover?
                    if x < lmList[8][0] < x + w and y < lmList[8][1] < y + h:
                        
                        cv2.rectangle(img, (x - 5, y - 5), (x + w + 5, y + h + 5), hoverColor, cv2.FILLED)
                        cv2.putText(img, button.text, (x + 20, y + 65),
                                cv2.FONT_HERSHEY_PLAIN, 4, (255, 255, 255), 4)
                    
                        p1 = lmList[4]  # 4th landmark (index of the tip of the thumb finger)
                        p2 = lmList[8]  # 8th landmark (index of the tip of the index finger)
                        p3 = lmList[5]  # 5th landmark (index of the base of the thumb finger)
                        # print("Points")
                        # print(p1)
                        # print(p2)
                        # print(p3)
                        # Check if the landmarks are in the expected format (i.e., (x, y) tuples)
                        # if isinstance(p1, (tuple, list)) and len(p1) == 2 and isinstance(p2, (tuple, list)) and len(p2) == 2:
                        #     l, midpoint = detector.findDistance(8, 12, img)
                        #     print("Distance between landmarks 8 and 12:", l)
                        # else:
                        #     l = 1000
                        #     print("Landmarks are not in the expected format:", p1, p2)
                        l = ((p1[0]- p3[0])**2 + (p1[1]-p3[1])**2)** 0.5
                        
                        print(l)

                    # when clicked
                        if l < 20:
                            if button.text == "SPACE":
                                finalText += " "  # Add a space
                            elif button.text == "BACKSPACE":
                                finalText = finalText[:-1]  # Remove the last character
                            else:
                                # keyboard.press(button.text)
                                finalText += button.text  # Add regular character

                            # Visual feedback
                            cv2.rectangle(img, button.pos, (x + w, y + h), clickedColor, cv2.FILLED)
                            cv2.putText(img, button.text, (x + 20, y + 65),
                                    cv2.FONT_HERSHEY_PLAIN, 4, clickedColor, 4)
                                
                            print(finalText)
                            sleep(0.15)

        # cv2.rectangle(img, (50, 350), (700, 450), (175, 0, 175), cv2.FILLED)
        # cv2.putText(img, finalText, (60, 430), cv2.FONT_HERSHEY_PLAIN, 5, (255, 255, 255), 5)

        cv2.rectangle(img, (50, 550), (1200, 650), (175, 0, 175), cv2.FILLED)
        cv2.putText(img, finalText, (60, 620), cv2.FONT_HERSHEY_PLAIN, 5, clickedColor, 5)

        # Show the captured image in a window
        # cv2.imshow("Captured Image", img)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        print(finalText)
        #     break

        # Close the window when the user presses 'q'
        # cv2.waitKey(1) 
    cap.release()
    cv2.destroyAllWindows()

@app.get("/start_keyboard")
def start_keyboard():
    global keyboard_thread
    if keyboard_thread is None or not keyboard_thread.is_alive():
        keyboard_thread = threading.Thread(target=run_keyboard)
        keyboard_thread.start()
    return JSONResponse(content={"message": "Keyboard started"})

# Stop the keyboard (you might need more sophisticated stopping, for example, signal handling)
@app.get("/stop_keyboard")
def stop_keyboard():
    # To stop the OpenCV capture and exit the loop gracefully, you would need additional handling.
    # For simplicity, this example just informs the user.
    return JSONResponse(content={"message": "Keyboard stopped"})

# Route to fetch the final text
@app.get("/get_text")
def get_text():
    return JSONResponse(content={"finalText": finalText})

# Load the model and setup Mediapipe
model = load_model("model2.h5")
mp_hands = mp.solutions.hands
alphabet = list(string.ascii_uppercase)
alphabet.insert(alphabet.index('N') + 1, "NEXT")

def predict_landmarks(landmarks):
    """Predict the sign language alphabet from landmarks."""
    df = pd.DataFrame(landmarks).transpose()
    predictions = model.predict(df, verbose=0)
    predicted_class = np.argmax(predictions, axis=1)
    return alphabet[predicted_class[0]]

def process_frame(image_data):
    """Process incoming frame data for prediction."""
    try:
        print("hi process frame")
        img = Image.open(BytesIO(base64.b64decode(image_data.split(",")[1])))
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        with mp_hands.Hands(
            model_complexity=0,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        ) as hands:
            results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmark_list = calc_landmark_list(frame, hand_landmarks)
                    pre_processed_landmark_list = pre_process_landmark(landmark_list)
                    return predict_landmarks(pre_processed_landmark_list)
    except Exception as e:
        print(f"Error processing frame: {e}")
    return "No hand detected"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("hello @app.websocket")
    await websocket.accept()
    print("hello @app.websocket 1")
    try:
        while True:
            print("hello @app.websocket 2")
            data = await websocket.receive_text()
            print("hello @app.websocket 3")
            prediction = process_frame(data)
            await websocket.send_text(prediction)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error in WebSocket communication: {e}")

@app.websocket("/rs")
async def quiz_endpoint(websocket: WebSocket):
    print("WebSocket connected")
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()

            if data == "start_quiz":
                # When 'start_quiz' command is received, start the quiz process
                quiz_script_path = Path("../ML/Virtualquiz/quiz.py").resolve()

                # Run the quiz script asynchronously in a subprocess
                process = await asyncio.create_subprocess_exec(
                    sys.executable, str(quiz_script_path), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
                )

                # Collect the output asynchronously
                stdout, stderr = await process.communicate()

                # Check if the process ran successfully and send back the result
                if process.returncode == 0:
                    await websocket.send_text(f"Quiz Completed:\n{stdout}")
                else:
                    await websocket.send_text(f"Quiz Error:\n{stderr}")
            
            else:
                # Handle any other command or data here
                await websocket.send_text("Invalid command.")
    
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"Error in WebSocket communication: {e}")

# Helper functions for landmark processing
def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_point = []
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point

def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
    for index, landmark_point in enumerate(temp_landmark_list):
        temp_landmark_list[index][0] -= base_x
        temp_landmark_list[index][1] -= base_y
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list)))
    return [n / max_value for n in temp_landmark_list]

if __name__ == "__main__":
    # Start the keyboard process in a separate thread
    # threading.Thread(target=run_keyboard, daemon=True).start()

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

