import cv2
import numpy as np

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')

# Let's crop the head/face region (e.g. y: 20 to 520, x: 450 to 830)
# and save each frame from 80 to 239 with 2-frame step
import os
os.makedirs('scratch/face_crops', exist_ok=True)

rows = []
cur_row = []
for f in range(80, 240, 2):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if not ret:
        break
    crop = frame[50:480, 480:800] # face area
    crop_small = cv2.resize(crop, (120, 160))
    cv2.putText(crop_small, f"{f}", (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    cur_row.append(crop_small)
    if len(cur_row) == 10:
        rows.append(np.hstack(cur_row))
        cur_row = []

if cur_row:
    while len(cur_row) < 10:
        cur_row.append(np.zeros_like(rows[0][:, :120]))
    rows.append(np.hstack(cur_row))

sheet = np.vstack(rows)
cv2.imwrite('scratch/face_sheet_80_240.jpg', sheet)
cap.release()
print("Saved face_sheet_80_240.jpg")
