import streamlit as st
import streamlit as st
import cv2
import numpy as np
from cvzone.HandTrackingModule import HandDetector
import pyautogui
import tempfile
import os
import time
import csv
import cvzone
import random
from time import sleep
from pynput.keyboard import Controller

cap = cv2.VideoCapture(0)
temp_dir = tempfile.TemporaryDirectory()

# Define the pages as functions
def start_mouse():

    # Streamlit Configuration
    st.title("AI Virtual Mouse Project")
    st.write("Control your computer with hand gestures!")

    wCam, hCam = 640, 480
    frameR = 100  # Frame Reduction
    camOff = 90
    smoothening = 4
    scrollAmount = 50  

    # Temporary directory for saving video capture
    temp_video_path = os.path.join(temp_dir.name, "output.avi")

    # Variables
    pTime = 0
    plocX, plocY = 0, 0
    clocX, clocY = 0, 0
    dragging = False

    # Webcam Setup
    # cap = cv2.VideoCapture(0)
    cap.set(3, wCam)
    cap.set(4, hCam)
    detector = HandDetector(detectionCon=0.8)
    wScr, hScr = pyautogui.size()

    stframe = st.empty()

    while True:
        success, img = cap.read()

        if not success:
            st.warning("Failed to access webcam. Please ensure your webcam is connected.")
            break

        p=[]

        hands, img = detector.findHands(img)  # Draw hand landmarks on the image

        if hands:
            lmList = hands[0]['lmList']
            bboxInfo = hands[0]['bbox'] 
            # x, y = lmList[8][:2]

            for i in range(0, len(lmList)):
                p.append(tuple(lmList[i][:2]))

            # 3. Check which fingers are up
            fingers = detector.fingersUp(hands[0])  # List of fingers up (0 or 1 for each finger)
            
            cv2.rectangle(img, (frameR, frameR - camOff), (wCam - frameR, hCam - frameR - camOff), (255, 0, 255), 2)

            dist45 = ((p[4][0]-p[5][0])**2 + (p[4][1]-p[5][1])**2)**0.5
            # print(dist45)

            # Moving Mode
            # if fingers[1] == 1 and fingers[2] == 0 and fingers[3] == 0 and fingers[4] == 0:
            if fingers[1] == 1 :
                # Convert Coordinates
                print("move")
                print((p[8][0], p[8][1]))

                x12 = np.interp(p[8][0], (frameR, wCam - frameR), (0, wScr))
                y12 = np.interp(p[8][1], (frameR - camOff, hCam - frameR - camOff), (0, hScr))
                
                # Smoothen Values
                clocX = plocX + (x12 - plocX) / smoothening
                clocY = plocY + (y12 - plocY) / smoothening

                # Move Mouse
                pyautogui.moveTo(wScr - clocX, clocY)
                cv2.circle(img, p[8], 15, (255, 0, 255), cv2.FILLED)
                plocX, plocY = clocX, clocY

            if dragging:
                if fingers[1] == 1 and fingers[2] == 1 and fingers[3] == 1 and fingers[4] == 1:
                    pass
                else:
                    pyautogui.mouseUp()  # Release the mouse (stop dragging)
                    dragging = False
                    print("Stop dragging")
            else:
                if fingers[1] == 1 and fingers[2] == 1 and fingers[3] == 1 and fingers[4] == 1:
                    dragging = True
                    pyautogui.mouseDown()  # Press the mouse down (start dragging)
                    print("Start dragging")

                # 8. Both Index and Thumb fingers are up : Clicking Mode
                if dist45 < 35 and fingers[1] == 1 and fingers[2] == 0 and fingers[3] == 0 and fingers[4] == 0:
                    # Click mouse 
                    print("clicked")
                    cv2.circle(img, p[8], 15, (0, 255, 0), cv2.FILLED)
                    pyautogui.click()

                if fingers[1] == 1 and fingers[2] == 1 and fingers[3] == 0 and fingers[4] == 0 :
                    print("Scrolling")
                    dist0412 = ((p[8][0]-p[12][0])**2 + (p[8][1]-p[12][1])**2)**0.5
                    print("dist0412", dist0412)
                    scrollSpeed = (dist0412 - 15)/30
                    print("scrollSpeed", scrollSpeed)
                    if dist45 < 35:
                        pyautogui.scroll(int(scrollAmount + scrollAmount*scrollSpeed))
                    else:
                        pyautogui.scroll(int(-scrollAmount - scrollAmount*scrollSpeed))

                    cv2.circle(img, p[8], 15, (0, 255, 0), cv2.FILLED)

                if fingers[1] == 1 and fingers[2] == 1 and fingers[3] == 1 and fingers[4] == 0:
                    print("Zooming")
                    print("dist35:", dist45)
                    if dist45 > 35:
                        # Zoom in
                        pyautogui.keyDown("ctrl")
                        pyautogui.scroll(scrollAmount)  # Scroll up for zoom in
                        pyautogui.keyUp("ctrl")
                        cv2.circle(img, p[8], 15, (0, 255, 255), cv2.FILLED)  # Yellow circle for zoom-in
                    elif dist45 < 35:
                        # Zoom out
                        pyautogui.keyDown("ctrl")
                        pyautogui.scroll(-scrollAmount)  # Scroll down for zoom out
                        pyautogui.keyUp("ctrl")
                        cv2.circle(img, p[8], 15, (0, 0, 255), cv2.FILLED)  # Red circle for zoom-out

                if fingers[1] == 1 and fingers[2] == 0 and fingers[3] == 0 and fingers[4] == 1:
                    print("Double Click")
                    pyautogui.doubleClick()
                    cv2.circle(img, p[8], 15, (255, 0, 0), cv2.FILLED)
                    time.sleep(1)

        # 11. Frame Rate
        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime
        cv2.putText(img, str(int(fps)), (20, 50), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 3)
        
        # 12. Display
        cv2.imshow("Image", img)
        cv2.waitKey(1)

    cap.release()
    temp_dir.cleanup()

def start_keyboard():
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

# def stop_keyboard():
#     st.title("Contact Page")
#     st.write("This is the Contact Page. Reach out to us!")

def start_quiz():
    cap.set(3, 1280)
    cap.set(4, 720)
    detector = HandDetector(detectionCon=0.8)

    defaultColor = (200, 200, 225)  # Soft lavender blue for default
    hoverColor = (100, 150, 250)    # Light periwinkle for hover
    clickedColor = (255, 100, 100)  # Coral red for clicked

    class MCQ():
        def __init__(self, data):
            self.question = data[0]
            self.choice1 = data[1]
            self.choice2 = data[2]
            self.choice3 = data[3]
            self.choice4 = data[4]
            self.answer = int(data[5])

            self.userAns = None

        def update(self, cursor, bboxs):

            for x, bbox in enumerate(bboxs):
                x1, y1, x2, y2 = bbox
                if x1 < cursor[0] < x2 and y1 < cursor[1] < y2:
                    self.userAns = x + 1
                    cv2.rectangle(img, (x1, y1), (x2, y2), hoverColor, cv2.FILLED)

    # Import csv file data
    pathCSV = "Mcqs.csv"
    with open(pathCSV, newline='\n') as f:
        reader = csv.reader(f)
        dataAll = list(reader)[1:]

    # Select 10 random questions
    dataAll = random.sample(dataAll, 10)

    # Create Object for each MCQ
    mcqList = [MCQ(q) for q in dataAll]
    # for q in dataAll:
    #     mcqList.append(MCQ(q))

    print("Total MCQ Objects Created:", len(mcqList))

    qNo = 0
    qTotal = len(dataAll)

    while True:
        success, img = cap.read()
        img = cv2.flip(img, 1)
        hands, img = detector.findHands(img, flipType=False)

        if qNo < qTotal:
            mcq = mcqList[qNo]

            img, bbox = cvzone.putTextRect(img, mcq.question, [100, 100], 2, 2, offset=50, border=5)
            img, bbox1 = cvzone.putTextRect(img, mcq.choice1, [100, 250], 2, 2, offset=50, border=5)
            img, bbox2 = cvzone.putTextRect(img, mcq.choice2, [400, 250], 2, 2, offset=50, border=5)
            img, bbox3 = cvzone.putTextRect(img, mcq.choice3, [100, 400], 2, 2, offset=50, border=5)
            img, bbox4 = cvzone.putTextRect(img, mcq.choice4, [400, 400], 2, 2, offset=50, border=5)

            if hands:
                lmList = hands[0]['lmList']
                cursor = lmList[8]
                # length, info = detector.findDistance(lmList[8][:2], lmList[12][:2])
                p1 = lmList[4]
                p3 = lmList[5]
                length = ((p1[0]- p3[0])**2 + (p1[1]-p3[1])**2)** 0.5
                print(length)

                if length < 20:
                    mcq.update(cursor, [bbox1, bbox2, bbox3, bbox4])
                    if mcq.userAns is not None:
                        time.sleep(0.3)
                        qNo += 1
        else:
            score = 0
            for mcq in mcqList:
                if mcq.answer == mcq.userAns:
                    score += 1
            score = round((score / qTotal) * 100, 2)
            img, _ = cvzone.putTextRect(img, "Quiz Completed", [250, 300], 2, 2, offset=50, border=5)
            img, _ = cvzone.putTextRect(img, f'Your Score: {score}%', [700, 300], 2, 2, offset=50, border=5)

        # Draw Progress Bar
        barValue = 150 + (950 // qTotal) * qNo
        cv2.rectangle(img, (150, 600), (barValue, 650), (0, 255, 0), cv2.FILLED)
        cv2.rectangle(img, (150, 600), (1100, 650), clickedColor, 5)
        img, _ = cvzone.putTextRect(img, f'{round((qNo / qTotal) * 100)}%', [1130, 635], 2, 2, offset=16)

        cv2.imshow("Img", img)
        cv2.waitKey(1)


def stop():
    cap.release()
    temp_dir.cleanup()
    cv2.destroyAllWindows()


# Simulate routing with a sidebar
# st.sidebar.title("Navigation")
# route = st.sidebar.radio("Go to", ["Home", "About", "Contact"])

query_params = st.query_params
print(query_params)
# print(query_params["routes"])
route =  query_params.get("routes", ["/"])
print(route)

# Render the selected page
if route == "start_mouse":
    start_mouse()
elif route == "stop":
    stop()
elif route == "stop_mouse":
    stop()
elif route == "start_keyboard":
    start_keyboard()
elif route == "stop_keyboard":
    stop()
elif route == "start_quiz":
    start_quiz()
elif route == "stop_quiz":
    stop()



