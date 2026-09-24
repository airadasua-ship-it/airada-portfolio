import cv2
import numpy as np

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
thumbs = []
for f in range(140, 160):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if not ret: break
    crop = frame[50:480, 480:800]
    t = cv2.resize(crop, (120, 160))
    cv2.putText(t, f"{f}", (5, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    thumbs.append(t)

cap.release()
row1 = np.hstack(thumbs[:10])
row2 = np.hstack(thumbs[10:])
cv2.imwrite('scratch/frames_140_159.jpg', np.vstack([row1, row2]))
print("Saved frames_140_159.jpg")
