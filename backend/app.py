from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import string
from tensorflow.keras.models import load_model
import copy
import itertools
import threading
import queue

# Load the saved model
model = load_model("model2.h5")

# Mediapipe hands setup
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

# Alphabet setup with 'NEXT' added alphabetically
alphabet = list(string.ascii_uppercase)
alphabet.insert(alphabet.index('N') + 1, "NEXT")  # Insert 'NEXT' after 'N'

app = FastAPI()

# Global variables
current_frame = None
predicted_label = "No Prediction"
frame_queue = queue.Queue(maxsize=10)  # Queue to store frames

# Function to capture frames continuously
def capture_frames():
    """Capture frames continuously in a separate thread."""
    global current_frame, predicted_label

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FPS, 60)  # Set FPS to 60 if supported by the camera

    with mp_hands.Hands(
            model_complexity=0,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5) as hands:
        
        while True:
            success, frame = cap.read()
            if not success:
                continue

            # Flip and process the frame
            frame = cv2.flip(frame, 1)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(image)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmark_list = calc_landmark_list(frame, hand_landmarks)
                    pre_processed_landmark_list = pre_process_landmark(landmark_list)

                    # Predict using the model
                    predicted_label = predict(pre_processed_landmark_list)

                    # Draw landmarks
                    mp_drawing.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                        mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2)
                    )
            else:
                predicted_label = "No hand detected"

            # Add prediction text to the frame
            current_frame = cv2.putText(
                frame,
                f'Prediction: {predicted_label}',
                (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
                cv2.LINE_AA
            )

            # Put the frame in the queue (only if the queue has space)
            if not frame_queue.full():
                frame_queue.put(frame)

    cap.release()

# Function to predict gesture
def predict(pre_processed_landmark_list):
    """Synchronous prediction to avoid lag caused by async calls."""
    global predicted_label

    df = pd.DataFrame(pre_processed_landmark_list).transpose()
    predictions = model.predict(df, verbose=0)
    predicted_class = np.argmax(predictions, axis=1)
    predicted_label = alphabet[predicted_class[0]]

    return predicted_label

# Functions to process landmarks
def calc_landmark_list(image, landmarks):
    """Calculate normalized landmark coordinates."""
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_point = []
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point

def pre_process_landmark(landmark_list):
    """Normalize the landmark list."""
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
    for index, landmark_point in enumerate(temp_landmark_list):
        temp_landmark_list[index][0] -= base_x
        temp_landmark_list[index][1] -= base_y
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list)))
    return [n / max_value for n in temp_landmark_list]

@app.on_event("startup")
def startup_event():
    """Start the background frame capture task."""
    capture_thread = threading.Thread(target=capture_frames)
    capture_thread.daemon = True  # This ensures the thread will exit when the main program exits
    capture_thread.start()

@app.get("/")
def root():
    return {"message": "Welcome to the Real-Time Sign Language Detection API!"}

@app.get("/stream/")
def stream_video():
    """API endpoint to stream video with predictions."""
    def generate_frames():
        while True:
            if not frame_queue.empty():
                frame = frame_queue.get()
                _, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' +
                       buffer.tobytes() + b'\r\n')

    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/prediction/")
def get_prediction():
    """API endpoint to fetch the latest prediction."""
    return {"prediction": predicted_label}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
