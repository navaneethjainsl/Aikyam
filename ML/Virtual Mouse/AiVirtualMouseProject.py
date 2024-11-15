import cv2
import numpy as np
# import cvzone
from cvzone.HandTrackingModule import HandDetector
import time
import pyautogui

##########################
wCam, hCam = 640, 480
frameR = 100  # Frame Reduction
camOff = 90
smoothening = 4
scrollAmount = 50  
#########################

pTime = 0
plocX, plocY = 0, 0
clocX, clocY = 0, 0
dragging = False

cap = cv2.VideoCapture(0)
cap.set(3, wCam)
cap.set(4, hCam)
detector = HandDetector(detectionCon=0.8)
wScr, hScr = pyautogui.size()  # Get the screen size

while True:
    # 1. Find hand Landmarks
    success, img = cap.read()

    if not success:
        break
    
    p=[]

    hands, img = detector.findHands(img)  # Draw hand landmarks on the image
    # lmList = detector.findPosition(img, draw=False)  # Get landmark positions and bounding box

    if hands:
        
        lmList = hands[0]['lmList']  # Landmarks list for the first hand
        bboxInfo = hands[0]['bbox']  # Bounding box info for the first hand
        
        # x1, y1 = lmList[8][:2]  # Index finger tip
        # x2, y2 = lmList[4][:2]  # Index finger
        # x3, y3 = lmList[5][:2]  # Thumb finger tip

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
