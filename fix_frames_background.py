import cv2
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRAMES_DIR = os.path.join(BASE_DIR, 'frames')
PASTEL_RGB = (174, 198, 207)  # RGB for #AEC6CF
PASTEL_BGR = (PASTEL_RGB[2], PASTEL_RGB[1], PASTEL_RGB[0])
THRESHOLD = 60.0

if not os.path.isdir(FRAMES_DIR):
    print('Frames directory not found:', FRAMES_DIR)
    raise SystemExit(1)

# Load center to sample corner-average bg (if exists)
center_path = os.path.join(FRAMES_DIR, 'center.webp')
if os.path.exists(center_path):
    center = cv2.imread(center_path)
    h, w = center.shape[:2]
    corners = np.array([
        center[0, 0],
        center[0, w - 1],
        center[h - 1, 0],
        center[h - 1, w - 1]
    ], dtype=np.float32)
    bg_color = corners.mean(axis=0)
    print('Sampled center corner-average BGR:', bg_color.astype(int))
else:
    bg_color = None
    print('No center.webp to sample; using per-frame corner sampling')

files = sorted([f for f in os.listdir(FRAMES_DIR) if f.endswith('.webp')])
processed = 0
for fname in files:
    path = os.path.join(FRAMES_DIR, fname)
    img = cv2.imread(path)
    if img is None:
        print('Failed to read', path)
        continue
    h, w = img.shape[:2]
    # decide source bg color
    if bg_color is None:
        corners = np.array([
            img[0, 0],
            img[0, w - 1],
            img[h - 1, 0],
            img[h - 1, w - 1]
        ], dtype=np.float32)
        src_bg = corners.mean(axis=0)
    else:
        src_bg = bg_color
    # compute distance mask
    diff = img.astype(np.float32) - src_bg.reshape((1, 1, 3))
    dist = np.linalg.norm(diff, axis=2)
    mask = (dist < THRESHOLD).astype(np.uint8) * 255
    # expand mask a little
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=1)
    # blend: replace masked pixels with pastel
    pastel_bgr = np.array(PASTEL_BGR, dtype=np.uint8)
    img_fixed = img.copy()
    img_fixed[mask == 255] = pastel_bgr
    cv2.imwrite(path, img_fixed, [cv2.IMWRITE_WEBP_QUALITY, 92])
    replaced = int((mask == 255).sum())
    total = h * w
    pct = replaced / total * 100
    print(f'Fixed {fname}: replaced {replaced} pixels ({pct:.2f}%)')
    processed += 1

print('Processed', processed, 'frames in', FRAMES_DIR)
