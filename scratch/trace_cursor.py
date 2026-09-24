import cv2
import numpy as np

# Let's inspect where the cursor was in each frame from 110 to 238
# Since the cursor tracked the mouse, finding the cursor position (x, y)
# in each frame reveals the exact path that was animated!
cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')

cursor_positions = {}
for f in range(110, 239):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if not ret: break
    # Find white pixels of cursor
    # White is (B>220, G>220, R>220)
    # Cursor is outside the collar (y < 530 or x < 400 or x > 880)
    h, w = frame.shape[:2]
    # mask collar
    safe_f = frame.copy()
    safe_f[530:720, 480:800] = 0 # collar
    safe_f[200:450, 560:720] = 0 # eyes/glasses reflections
    
    wh = np.argwhere((safe_f[:, :, 0] > 220) & (safe_f[:, :, 1] > 220) & (safe_f[:, :, 2] > 220))
    if len(wh) > 10:
        cy = np.median(wh[:, 0])
        cx = np.median(wh[:, 1])
        cursor_positions[f] = (cx, cy, len(wh))

cap.release()
print(f"Detected cursor in {len(cursor_positions)} frames")
for f in sorted(cursor_positions.keys())[::5]:
    cx, cy, cnt = cursor_positions[f]
    print(f"F{f:03d}: Cursor at ({cx:.1f}, {cy:.1f})")
