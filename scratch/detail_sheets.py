import cv2
import numpy as np

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Let's save contact sheets for every 24 frames or examine motion
# Let's make contact sheets for:
# Sheet 1: 0 to 79 (every 2 frames)
# Sheet 2: 80 to 159 (every 2 frames)
# Sheet 3: 160 to 239 (every 2 frames)

def make_sheet(start_f, end_f, step, filename):
    rows = []
    current_row = []
    for f in range(start_f, end_f, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f)
        ret, frame = cap.read()
        if not ret:
            break
        thumb = cv2.resize(frame, (160, 90))
        cv2.putText(thumb, f"{f}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        current_row.append(thumb)
        if len(current_row) == 8:
            rows.append(np.hstack(current_row))
            current_row = []
    if current_row:
        while len(current_row) < 8:
            current_row.append(np.zeros_like(rows[0][:, :160]))
        rows.append(np.hstack(current_row))
    sheet = np.vstack(rows)
    cv2.imwrite(filename, sheet)

make_sheet(0, 80, 2, 'scratch/sheet_0_80.jpg')
make_sheet(80, 160, 2, 'scratch/sheet_80_160.jpg')
make_sheet(160, 240, 2, 'scratch/sheet_160_240.jpg')
cap.release()
print("Saved 3 sheets")
