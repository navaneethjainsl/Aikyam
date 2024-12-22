import cv2
import mediapipe as mp
import csv
import copy
import itertools
import string
import os
import time
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands


# functions
def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]

    landmark_point = []

    # Keypoint
    for _, landmark in enumerate(landmarks.landmark):
        landmark_x = min(int(landmark.x * image_width), image_width - 1)
        landmark_y = min(int(landmark.y * image_height), image_height - 1)
        # landmark_z = landmark.z

        landmark_point.append([landmark_x, landmark_y])

    return landmark_point

def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)

    # Convert to relative coordinates
    base_x, base_y = 0, 0
    for index, landmark_point in enumerate(temp_landmark_list):
        if index == 0:
            base_x, base_y = landmark_point[0], landmark_point[1]

        temp_landmark_list[index][0] = temp_landmark_list[index][0] - base_x
        temp_landmark_list[index][1] = temp_landmark_list[index][1] - base_y

    # Convert to a one-dimensional list
    temp_landmark_list = list(
        itertools.chain.from_iterable(temp_landmark_list))

    # Normalization
    max_value = max(list(map(abs, temp_landmark_list)))

    def normalize_(n):
        return n / max_value

    temp_landmark_list = list(map(normalize_, temp_landmark_list))

    return temp_landmark_list

def logging_csv(letter, landmark_list):
    csv_path = 'keypoint.csv'
    with open(csv_path, 'a', newline="") as f:
        writer = csv.writer(f)
        writer.writerow([letter, *landmark_list])


alphabet = list(string.ascii_uppercase)
# alphabet +=  ['1','2','3','4','5','6','7','8','9']
# For static images:
# Directory where folders will be created
base_dir = 'images/data/'

# Categories (e.g., A-Z)
categories = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

# Create folders
# Create folders if they don't exist
for category in categories:
    folder_path = os.path.join(base_dir, category)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Created folder: {folder_path}")
    else:
        print(f"Folder already exists: {folder_path}")

print("Folder creation check complete!")

def capture_images_on_keypress(base_dir, alphabet):
    # Access the webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    print("Press 'c' to capture an image, or 'q' to skip to the next letter.")

    try:
        for letter in alphabet:
            letter_dir = os.path.join(base_dir, letter)
            os.makedirs(letter_dir, exist_ok=True)  # Ensure folder exists

            # Find the next available index for this letter
            existing_images = [int(f.split('.')[0]) for f in os.listdir(letter_dir) if f.endswith('.jpg') and f.split('.')[0].isdigit()]
            next_index = max(existing_images, default=-1) + 1

            print(f"\nCapturing images for letter '{letter}'")
            print(f"Starting from index {next_index}. Press 'c' to save, 'q' to skip.")

            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Error: Failed to capture frame.")
                    break

                # Display the live video feed
                cv2.putText(frame, f"Capturing for '{letter}' - Press 'c' to save, 'q' to skip", 
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                cv2.imshow("Image Capture", frame)

                # Wait for key press
                key = cv2.waitKey(1) & 0xFF

                if key == ord('c'):  # Save the image on 'c'
                    image_path = os.path.join(letter_dir, f"{next_index}.jpg")
                    cv2.imwrite(image_path, frame)
                    print(f"Image saved: {image_path}")
                    next_index += 1

                elif key == ord('q'):  # Skip to the next letter
                    print(f"Skipping letter '{letter}'...")
                    break

    except KeyboardInterrupt:
        print("\nProcess interrupted.")

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("Webcam released and windows closed.")


# ====== NEW SECTION: CAPTURE IMAGES AND STORE IN FOLDERS ======
# def capture_images_for_alphabet(alphabet, num_images, save_interval=2):
#     # Define the folder where images will be saved
#     target_folder = os.path.join('images/data', alphabet)
    
#     # Create the folder if it doesn't exist
#     os.makedirs(target_folder, exist_ok=True)
    
#     # Access the webcam (default is 0)
#     cap = cv2.VideoCapture(0)
#     if not cap.isOpened():
#         print("Error: Could not access the webcam.")
#         return

#     print(f"Starting image capture for alphabet '{alphabet}'.")
#     print(f"Capturing {num_images} images. Press Ctrl+C to stop.")

#     count = 0
#     try:
#         while count < num_images:
#             # Read a frame from the webcam
#             ret, frame = cap.read()
#             if not ret:
#                 print("Error: Failed to capture image.")
#                 break
            
#             # Save the frame to the target folder with a unique filename
#             image_path = os.path.join(target_folder, f"{alphabet}_{count}.jpg")
#             cv2.imwrite(image_path, frame)
#             print(f"Captured and saved: {image_path}")
#             count += 1
            
#             # Wait for a specified interval before capturing the next image
#             time.sleep(save_interval)  # Adjust interval (in seconds) as needed

#     except KeyboardInterrupt:
#         print("\nCapture interrupted by user.")

#     # Release the camera and clean up
#     cap.release()
#     print(f"Image capture complete! Total images captured: {count}")


# Prompt user to capture images for a specific alphabet
# if __name__ == "__main__":
#     user_input = input("Do you want to capture images? (y/n): ").strip().lower()
    
#     if user_input == 'y':
#         alphabet_input = input("Enter the alphabet for which images need to be captured: ").strip().upper()
#         num_images_input = int(input(f"Enter the number of images to capture for '{alphabet_input}': ").strip())
        
#         capture_images_for_alphabet(alphabet_input, num_images_input)

address = 'images/data/'
IMAGE_FILES = []
for i in alphabet:
  for j in range(1302):
    # image_filename = f"{i} ({j}).jpg"
    # print(image_filename)
    IMAGE_FILES.append(address+i+'/'+str(j)+'.jpg')
    # IMAGE_FILES.append(address+i+'/'+ image_filename)
with mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5) as hands:
  for idx, file in enumerate(IMAGE_FILES):
    # Read an image, flip it around y-axis for correct handedness output (see
    # above).
    image = cv2.flip(cv2.imread(file), 1)
    # Convert the BGR image to RGB before processing.
    if image is None:
            print(f"Error: Could not read image {file}. Skipping...")
            continue
    # Flip the image and process dimensions
    image = cv2.flip(image, 1)
    image_height, image_width, _ = image.shape  # Get image dimensions
    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    # Print handedness and draw hand landmarks on the image.
    # print('Handedness:', results.multi_handedness)
    if not results.multi_hand_landmarks:
        print(f"No landmarks detected in {file}. Skipping...")
        continue
    else:
        print("Landmark detected")
    # image_height, image_width, _ = image.shape
    annotated_image = image.copy()
    for hand_landmarks, handedness in zip(results.multi_hand_landmarks,results.multi_handedness):
        landmark_list = calc_landmark_list(annotated_image, hand_landmarks)
        # Conversion to relative coordinates / normalized coordinates
        pre_processed_landmark_list = pre_process_landmark(landmark_list)
        logging_csv(file[12],pre_processed_landmark_list)
    
    # print(pre_processed_landmark_list)
    # print(len(pre_processed_landmark_list))
    # mp_drawing.draw_landmarks(
    #       annotated_image,
    #       hand_landmarks,
    #       mp_hands.HAND_CONNECTIONS,
    #       mp_drawing_styles.get_default_hand_landmarks_style(),
    #       mp_drawing_styles.get_default_hand_connections_style())
    # cv2.imwrite(
    #     '/tmp/annotated_image' + str(idx) + '.png', cv2.flip(annotated_image, 1))
    # # Draw hand world landmarks.
    # if not results.multi_hand_world_landmarks:
    #   continue
    # for hand_world_landmarks in results.multi_hand_world_landmarks:
    #   mp_drawing.plot_landmarks(
    #     hand_world_landmarks, mp_hands.HAND_CONNECTIONS, azimuth=5)