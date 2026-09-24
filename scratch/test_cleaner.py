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

def clean_cursor_and_bg(img):
    """
    Cleans any mouse cursor artifact from the frame.
    The cursor is pure white with a black outline and small footprint.
    Collar is at y: 530..720, x: 450..830.
    Eyes/face reflections are at y: 200..380, x: 500..780.
    """
    h, w = img.shape[:2]
    # Identify bright pixels (white of cursor)
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
            
            # Dilate bounding box by 8 px to cover the black border and drop shadow
            y1 = max(0, y - 8)
            y2 = min(h, y + h_box + 8)
            x1 = max(0, x - 8)
            x2 = min(w, x + w_box + 8)
            
            patch_mask = np.zeros((h, w), dtype=np.uint8)
            patch_mask[y1:y2, x1:x2] = 255
            clean = cv2.inpaint(clean, patch_mask, 5, cv2.INPAINT_TELEA)
            
    return clean

print("Inpainter defined")
