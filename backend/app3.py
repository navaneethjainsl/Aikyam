from flask import Flask
from flask_socketio import SocketIO
import base64
import cv2
import numpy as np
# from your_model import load_model, make_prediction  # Replace with your model's code

from tensorflow.keras.models import load_model
import mediapipe as mp
import numpy as np
import pandas as pd
from PIL import Image
import cv2
import string
import copy
import itertools
from io import BytesIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
# model = load_model()  # Load your ML model here

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

def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
    for index, landmark_point in enumerate(temp_landmark_list):
        temp_landmark_list[index][0] -= base_x
        temp_landmark_list[index][1] -= base_y
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list)))
    return [n / max_value for n in temp_landmark_list]

def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_point = []
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point

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

@socketio.on("video_frame")
def handle_video_frame(data):
    # Decode the base64 image
    # header, encoded = data.split(",", 1)
    # img_data = base64.b64decode(encoded)
    # np_arr = np.frombuffer(img_data, np.uint8)
    # frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Make prediction
    prediction = process_frame(data)  # Your prediction logic here

    # Send prediction back to frontend
    socketio.emit("prediction", prediction)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8000)
