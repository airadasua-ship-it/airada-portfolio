import cv2
import numpy as np
import os
from PIL import Image

video_path = '<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4'
if not os.path.exists(video_path):
    for root, dirs, files in os.walk('.'):
        for f in files:
            if f.endswith('.mp4'):
                video_path = os.path.join(root, f)
                break

cap = cv2.VideoCapture(video_path)

def erase_cursor(img):
    h, w = img.shape[:2]
    # White pixels of cursor
    white_mask = ((img[:, :, 0] > 185) & (img[:, :, 1] > 185) & (img[:, :, 2] > 185)).astype(np.uint8) * 255
    # Protect face and collar
    white_mask[180:400, 480:800] = 0
    white_mask[520:720, 440:840] = 0
    
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(white_mask)
    clean = img.copy()
    
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        if 20 <= area <= 1200:
            x = stats[i, cv2.CC_STAT_LEFT]
            y = stats[i, cv2.CC_STAT_TOP]
            w_box = stats[i, cv2.CC_STAT_WIDTH]
            h_box = stats[i, cv2.CC_STAT_HEIGHT]
            
            y1 = max(0, y - 8)
            y2 = min(h, y + h_box + 8)
            x1 = max(0, x - 8)
            x2 = min(w, x + w_box + 8)
            
            patch_mask = np.zeros((h, w), dtype=np.uint8)
            patch_mask[y1:y2, x1:x2] = 255
            clean = cv2.inpaint(clean, patch_mask, 5, cv2.INPAINT_TELEA)
            
    return clean

# Cache frames from video
frame_cache = {}
def get_clean_frame(f_num):
    if f_num not in frame_cache:
        cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
        ret, fr = cap.read()
        if not ret:
            raise ValueError(f"Failed to read frame {f_num}")
        frame_cache[f_num] = erase_cursor(fr)
    return frame_cache[f_num]

# 64 frames mapping:
# 0..8: RIGHT to DOWN-RIGHT
# 8..16: DOWN-RIGHT to DOWN
# 16..24: DOWN to DOWN-LEFT (mirror)
# 24..32: DOWN-LEFT to LEFT (mirror)
# 32..40: LEFT to UP-LEFT (mirror)
# 40..48: UP-LEFT to UP (mirror)
# 48..56: UP to UP-RIGHT
# 56..63: UP-RIGHT to RIGHT

plan = {}
# Sector 1: 0..8
sec1_frames = [124, 145, 146, 147, 148, 149, 150, 151, 152]
for idx, f in enumerate(sec1_frames):
    plan[idx] = (f, False)

# Sector 2: 8..16
sec2_frames = [152, 154, 156, 158, 160, 162, 164, 166, 168]
for idx, f in enumerate(sec2_frames):
    plan[8 + idx] = (f, False)

# Sector 3: 16..24 (mirror of sec2 reversed)
for idx in range(9):
    plan[16 + idx] = (sec2_frames[8 - idx], True)

# Sector 4: 24..32 (mirror of sec1 reversed)
for idx in range(9):
    plan[24 + idx] = (sec1_frames[8 - idx], True)

# Sector 7: 48..56 (UP to UP-RIGHT)
sec7_frames = [194, 192, 190, 188, 186, 185, 184, 138, 136]
for idx, f in enumerate(sec7_frames):
    plan[48 + idx] = (f, False)

# Sector 8: 56..63 (UP-RIGHT to RIGHT)
sec8_frames = [136, 134, 132, 130, 128, 126, 125, 124]
for idx, f in enumerate(sec8_frames):
    plan[56 + idx] = (f, False)

# Sector 5: 32..40 (mirror of sec8)
for idx in range(8):
    plan[32 + idx] = (sec8_frames[7 - idx], True)
plan[40] = (136, True)

# Sector 6: 40..48 (mirror of sec7 reversed)
for idx in range(9):
    plan[40 + idx] = (sec7_frames[8 - idx], True)
plan[48] = (194, False)

os.makedirs('scratch/64_test', exist_ok=True)
all_64 = []
for i in range(64):
    f_num, flip = plan[i]
    fr = get_clean_frame(f_num)
    if flip:
        fr = cv2.flip(fr, 1)
    all_64.append(fr)
    # Save preview
    thumb = cv2.resize(fr, (160, 90))
    cv2.putText(thumb, f"{i}:{f_num}{'M' if flip else ''}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
    cv2.imwrite(f'scratch/64_test/frame_{i:02d}.jpg', thumb)

# Save center frame
center_fr = get_clean_frame(234)
cv2.imwrite('scratch/64_test/center.jpg', center_fr)

# Create 8x8 contact sheet of all 64 frames
grid_rows = []
for r in range(8):
    row_imgs = [cv2.imread(f'scratch/64_test/frame_{r*8 + c:02d}.jpg') for c in range(8)]
    grid_rows.append(np.hstack(row_imgs))
cv2.imwrite('scratch/sheet_all_64.jpg', np.vstack(grid_rows))

cap.release()
print("Extracted and generated sheet_all_64.jpg successfully")
