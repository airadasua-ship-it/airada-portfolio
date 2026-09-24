import cv2
import numpy as np
import os

video_path = '<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4'
cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

os.makedirs('scratch/sample_frames', exist_ok=True)

# Save every 5th frame as a small thumbnail
for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    if i % 4 == 0 or i >= total_frames - 10:
        thumb = cv2.resize(frame, (320, 180))
        cv2.imwrite(f'scratch/sample_frames/frame_{i:03d}.jpg', thumb, [cv2.IMWRITE_JPEG_QUALITY, 85])

cap.release()
print(f"Sampled frames saved to scratch/sample_frames")
