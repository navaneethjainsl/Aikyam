import cv2
import mediapipe as mp
import csv
import copy
import itertools
import os

# Initialize Mediapipe Hands
mp_hands = mp.solutions.hands

# Function to calculate landmark list
def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_point = []
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        landmark_point.append([landmark_x, landmark_y])
    return landmark_point

# Normalize landmarks
def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0][0], temp_landmark_list[0][1]
    for index, landmark_point in enumerate(temp_landmark_list):
        temp_landmark_list[index][0] -= base_x
        temp_landmark_list[index][1] -= base_y
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list)))
    return [n / max_value for n in temp_landmark_list]

# Log data to CSV
def logging_csv(word, landmark_list):
    csv_path = 'keypoints_words.csv'
    with open(csv_path, 'a', newline="") as f:
        writer = csv.writer(f)
        writer.writerow([word, *landmark_list])

# List of Words
words = [
    "Hello", "Stop", "Calm Down", "Okay", "Fine", "Where", "Why", "Telephone", "Father", "Mother", "Water", "Love", "Money", "I'm/ I am", "I love you", "I hate you", "Yes", "Sorry"
]

# Create directories for words
base_dir = 'images/words/'
for word in words:
    folder_path = os.path.join(base_dir, word.replace(" ", "_"))
    os.makedirs(folder_path, exist_ok=True)

# Capture and process images for words
def capture_images_and_process(base_dir, words):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    with mp_hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5) as hands:
        for word in words:
            word_dir = os.path.join(base_dir, word.replace(" ", "_"))
            existing_images = [int(f.split('.')[0]) for f in os.listdir(word_dir) if f.endswith('.jpg') and f.split('.')[0].isdigit()]
            next_index = max(existing_images, default=-1) + 1

            print(f"\nCapturing images for word '{word}'")
            print(f"Starting from index {next_index}. Press 's' to capture, 'q' to skip.")

            while next_index < 1301:  # Collect 1300 images per word
                ret, frame = cap.read()
                if not ret:
                    print("Error: Failed to capture frame.")
                    break

                frame = cv2.flip(frame, 1)  # Flip the frame horizontally
                cv2.putText(frame, f"Word: '{word}' - Press 's' to save, 'q' to skip", 
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                cv2.imshow("Image Capture", frame)

                key = cv2.waitKey(1) & 0xFF
                if key == ord('s'):  # Save image and process
                    image_path = os.path.join(word_dir, f"{next_index}.jpg")
                    cv2.imwrite(image_path, frame)
                    print(f"Image saved: {image_path}")

                    # Process the saved image
                    image = cv2.imread(image_path)
                    if image is not None:
                        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
                        if results.multi_hand_landmarks:
                            for hand_landmarks in results.multi_hand_landmarks:
                                landmark_list = calc_landmark_list(image, hand_landmarks)
                                processed_landmarks = pre_process_landmark(landmark_list)
                                logging_csv(word, processed_landmarks)
                                print(f"Processed landmarks for: {image_path}")
                    next_index += 1

                elif key == ord('q'):  # Skip word
                    print(f"Skipping word '{word}'.")
                    break

    cap.release()
    cv2.destroyAllWindows()
    print("Webcam released and windows closed.")

if __name__ == "__main__":
    capture_images_and_process(base_dir, words)
