import cv2  # OpenCV lib
from cvzone.HandTrackingModule import HandDetector  # Relies on MediaPipe lib
from time import sleep
import numpy as np
import cvzone
from pynput.keyboard import Controller

cap = cv2.VideoCapture(0)  # VideoCapture object with id number 0

# Set the camera resolution
cap.set(3, 1280)  # 3 is for width
cap.set(4, 720)  # 4 is for height

offset = 20

detector = HandDetector(detectionCon=0.8)  # Higher detectionCon improves accuracy
keys = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
        ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]]
finalText = ""

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
    cv2.imshow("Captured Image", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print(finalText)
        break

    # Close the window when the user presses 'q'
    # cv2.waitKey(1) 
cap.release()
cv2.destroyAllWindows()