import cv2
import numpy as np

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Let's save a collage of frames 0 to 240 with hands vs without hands
# Frames 0 to 76: hands on cheeks.
# Frames 82 to 239: hands are DOWN!
print(f"Total frames: {total}")
# Let's inspect frames 80 to 239 in single-frame detail to see what directions exist
cap.release()
