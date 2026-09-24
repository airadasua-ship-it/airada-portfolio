import cv2
import numpy as np
import os

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
    # Identify bright pixels (cursor arrow)
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

frame_cache = {}
def get_clean_frame(f_num):
    if f_num not in frame_cache:
        cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
        ret, fr = cap.read()
        if not ret:
            raise ValueError(f"Failed to read frame {f_num}")
        frame_cache[f_num] = erase_cursor(fr)
    return frame_cache[f_num]

plan = {}
# Sector 1: 0..8 (RIGHT to DOWN-RIGHT)
sec1_frames = [124, 145, 146, 147, 148, 149, 150, 151, 152]
for idx, f in enumerate(sec1_frames):
    plan[idx] = (f, False)

# Sector 2: 8..16 (DOWN-RIGHT to DOWN)
sec2_frames = [152, 154, 156, 158, 160, 162, 164, 166, 168]
for idx, f in enumerate(sec2_frames):
    plan[8 + idx] = (f, False)

# Sector 3: 16..24 (DOWN to DOWN-LEFT, mirror)
for idx in range(9):
    plan[16 + idx] = (sec2_frames[8 - idx], True)

# Sector 4: 24..32 (DOWN-LEFT to LEFT, mirror)
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

# Sector 5: 32..40 (LEFT to UP-LEFT, mirror)
for idx in range(8):
    plan[32 + idx] = (sec8_frames[7 - idx], True)
plan[40] = (136, True)

# Sector 6: 40..48 (UP-LEFT to UP, mirror)
for idx in range(9):
    plan[40 + idx] = (sec7_frames[8 - idx], True)
plan[48] = (194, False)

# Target directories
out_dirs = ['public/frames', 'dist/frames']
for d in out_dirs:
    os.makedirs(d, exist_ok=True)

print("Exporting 64 WebP frames (quality=92)...")
for i in range(64):
    f_num, flip = plan[i]
    fr = get_clean_frame(f_num)
    if flip:
        fr = cv2.flip(fr, 1)
    
    # Save webp
    for d in out_dirs:
        out_path = os.path.join(d, f"frame_{i}.webp")
        cv2.imwrite(out_path, fr, [cv2.IMWRITE_WEBP_QUALITY, 92])

# Export center frame (Frame 234)
center_fr = get_clean_frame(234)
for d in out_dirs:
    cv2.imwrite(os.path.join(d, "center.webp"), center_fr, [cv2.IMWRITE_WEBP_QUALITY, 92])
cv2.imwrite("public/center.webp", center_fr, [cv2.IMWRITE_WEBP_QUALITY, 92])

cap.release()
print("Successfully exported all 64 frames and center.webp to public/frames/!")
