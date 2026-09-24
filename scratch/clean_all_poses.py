import cv2
import numpy as np

def clean_frame(frame):
    img = frame.copy()
    h, w = img.shape[:2]
    
    # 1. Any white/black cursor outside the protected character region:
    # Character body/face region to protect:
    # Face: y 120..500, x 500..780
    # Shirt/collar: y 500..720, x 420..860
    
    # In background (everywhere else):
    # Any pixel where BGR is not near [22, 27, 198]
    bg_bgr = np.array([22, 27, 198], dtype=np.float32)
    diff = np.linalg.norm(img.astype(np.float32) - bg_bgr, axis=2)
    
    # Outside mask
    outside = np.ones((h, w), dtype=bool)
    outside[140:500, 480:800] = False # face
    outside[500:720, 380:900] = False # body/collar
    
    # Pixels outside character that deviate from background by > 35
    # (cursor, cursor shadow, edge artifacts)
    bad_pixels = outside & (diff > 35)
    
    # Also in the region x > 1000 or x < 350 or y < 100, replace bad pixels with exact background color
    # Because background is purely solid!
    img[bad_pixels] = [22, 27, 198]
    
    # Smooth the border around bad pixels to avoid sharp edges
    mask_bad = bad_pixels.astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask_dilated = cv2.dilate(mask_bad, kernel)
    
    # For any remaining small white cursor fragments near the edge of hair (e.g. x: 800..1050, y: 300..450):
    hair_margin = np.zeros((h, w), dtype=bool)
    hair_margin[250:420, 780:1050] = True
    white_cursor = hair_margin & ((img[:, :, 0] > 220) & (img[:, :, 1] > 220) & (img[:, :, 2] > 220))
    if np.any(white_cursor):
        w_mask = cv2.dilate(white_cursor.astype(np.uint8) * 255, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        img = cv2.inpaint(img, w_mask, 5, cv2.INPAINT_TELEA)

    return img

# Test clean_frame on 122, 136, 152, 168, 198, 234
cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
for f in [122, 136, 152, 168, 198, 234]:
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, fr = cap.read()
    cl = clean_frame(fr)
    cv2.imwrite(f'scratch/test_poses/cleaned_{f}.png', cl)
cap.release()
print("Cleaned test poses saved")
