import cv2
import numpy as np

def erase_cursor(img):
    # Find white pixels of cursor
    # The cursor consists of pixels where R>200, G>200, B>200
    # Wait, the character's collar has white pixels at y > 530, x in 450..820
    # And eyes have tiny reflections
    h, w = img.shape[:2]
    white_mask = ((img[:, :, 0] > 190) & (img[:, :, 1] > 190) & (img[:, :, 2] > 190)).astype(np.uint8) * 255
    
    # Exclude collar and eyes:
    # Eyes are in y: 220..380, x: 500..780
    # Collar is in y: 520..720, x: 450..830
    white_mask[220:380, 500:780] = 0
    white_mask[520:720, 450:830] = 0
    
    # Connected components
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(white_mask)
    
    clean = img.copy()
    bg_color = [22, 27, 198] # BGR
    
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        # Cursor arrow is between 40 and 600 pixels
        if 30 <= area <= 800:
            x = stats[i, cv2.CC_STAT_LEFT]
            y = stats[i, cv2.CC_STAT_TOP]
            w_box = stats[i, cv2.CC_STAT_WIDTH]
            h_box = stats[i, cv2.CC_STAT_HEIGHT]
            
            # Dilate bounding box slightly (pad by 8 px) to cover black outline and shadow
            y1 = max(0, y - 8)
            y2 = min(h, y + h_box + 8)
            x1 = max(0, x - 8)
            x2 = min(w, x + w_box + 8)
            
            # Check if this region is in background (surrounding pixels are red)
            # Fill with background color or inpaint
            patch_mask = np.zeros((h, w), dtype=np.uint8)
            patch_mask[y1:y2, x1:x2] = 255
            # Inpaint using TELEA with radius 5
            clean = cv2.inpaint(clean, patch_mask, 5, cv2.INPAINT_TELEA)
            # If in outer background, also set directly to bg_color
            if x1 < 400 or x2 > 880 or y1 < 100 or y2 > 650:
                clean[y1:y2, x1:x2] = bg_color
                
    return clean

# Test on 234 and 122 and 198
for f in [234, 122, 198, 136, 152, 168]:
    cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, fr = cap.read()
    cap.release()
    c = erase_cursor(fr)
    cv2.imwrite(f'scratch/test_poses/fixed_{f}.png', c)

print("Saved fixed poses")
