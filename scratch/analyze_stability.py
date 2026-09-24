import cv2
import numpy as np

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')

# Let's inspect frame differences for the sweater/body (y: 480 to 720)
# across frames 85 to 238
frames = []
for f in range(85, 239):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if not ret: break
    frames.append(frame)

cap.release()

ref = frames[len(frames)-1] # neutral center frame around 230
body_diffs = []
head_diffs = []

for idx, fr in enumerate(frames):
    diff = cv2.absdiff(fr, ref)
    head_diff = np.mean(diff[100:450, 400:880])
    body_diff = np.mean(diff[500:700, 400:880])
    head_diffs.append(head_diff)
    body_diffs.append(body_diff)

print(f"Frames 85-238 analyzed: {len(frames)} frames")
print(f"Max head diff: {max(head_diffs):.2f}, avg head diff: {np.mean(head_diffs):.2f}")
print(f"Max body diff: {max(body_diffs):.2f}, avg body diff: {np.mean(body_diffs):.2f}")
