import cv2
import numpy as np
import os

images = []
# Pick every 6th frame from 0 to 239 -> 40 frames
frames_to_show = list(range(0, 240, 6))
# 5 rows x 8 cols = 40 images
grid_rows = []
row = []

for idx, f_num in enumerate(frames_to_show):
    img_path = f'scratch/sample_frames/frame_{f_num:03d}.jpg'
    if not os.path.exists(img_path):
        # generate directly
        cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
        cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
        ret, frame = cap.read()
        cap.release()
        thumb = cv2.resize(frame, (160, 90))
    else:
        thumb = cv2.imread(img_path)
        thumb = cv2.resize(thumb, (160, 90))

    # Add frame number text
    cv2.putText(thumb, f"F:{f_num}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    row.append(thumb)
    if len(row) == 8:
        grid_rows.append(np.hstack(row))
        row = []

if row:
    while len(row) < 8:
        row.append(np.zeros_like(grid_rows[0][:, :160]))
    grid_rows.append(np.hstack(row))

contact_sheet = np.vstack(grid_rows)
cv2.imwrite('scratch/contact_sheet.jpg', contact_sheet)
print("Contact sheet saved to scratch/contact_sheet.jpg, size:", contact_sheet.shape)
