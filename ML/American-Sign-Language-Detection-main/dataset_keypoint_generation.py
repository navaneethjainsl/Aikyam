import cv2
import mediapipe as mp
import csv
import copy
import itertools
import string
import os

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
def logging_csv(letter, landmark_list):
    csv_path = 'keypoint.csv'
    with open(csv_path, 'a', newline="") as f:
        writer = csv.writer(f)
        writer.writerow([letter, *landmark_list])

# Function to capture images and process them
def capture_images_and_process(letter, folder_path):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    with mp_hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5) as hands:
        existing_images = [int(f.split('.')[0]) for f in os.listdir(folder_path) if f.endswith('.jpg') and f.split('.')[0].isdigit()]
        next_index = max(existing_images, default=-1) + 1

        print(f"\nCapturing images for letter '{letter}'")
        print(f"Starting from index {next_index}. Press 'c' to capture, 'q' to skip.")

        while next_index < 1301:
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to capture frame.")
                break

            frame = cv2.flip(frame, 1)  # Flip the frame horizontally

            cv2.putText(frame, f"Capturing for '{letter}' - Press 'c' to save, 'q' to skip", 
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.imshow("Image Capture", frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('c'):  # Save image and immediately process
                image_path = os.path.join(folder_path, f"{next_index}.jpg")
                cv2.imwrite(image_path, frame)
                print(f"Image saved: {image_path}")

                # Process the saved image immediately
                image = cv2.imread(image_path)
                if image is not None:
                    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
                    if results.multi_hand_landmarks:
                        for hand_landmarks in results.multi_hand_landmarks:
                            landmark_list = calc_landmark_list(image, hand_landmarks)
                            processed_landmarks = pre_process_landmark(landmark_list)
                            logging_csv(letter, processed_landmarks)
                            print(f"Processed landmarks for image: {image_path}")
                next_index += 1

            elif key == ord('q'):  # Skip to the next letter
                print(f"Skipping letter '{letter}'.")
                break

    cap.release()
    cv2.destroyAllWindows()
    print("Webcam released and windows closed.")

# Main function to check folders and capture data
def main():
    base_dir = 'images/data/'
    categories = [chr(i) for i in range(ord('A'), ord('Z') + 1)] + ['NEXT']  # Include 'NEXT' as a category
    for category in categories:
        folder_path = os.path.join(base_dir, category)
        os.makedirs(folder_path, exist_ok=True)  # Ensure the folder exists

        # Check if the folder is empty
        if not any(os.scandir(folder_path)):
            print(f"\nFolder for '{category}' is empty. Starting image capture...")
            capture_images_and_process(category, folder_path)
        else:
            print(f"Folder for '{category}' already contains images. Skipping...")

if __name__ == "__main__":
    main()
