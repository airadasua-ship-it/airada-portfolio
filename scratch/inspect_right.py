import cv2
import os

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
for f in range(114, 126):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f'scratch/test_poses/f_{f}.png', frame)
cap.release()
print("Saved 114 to 125")
