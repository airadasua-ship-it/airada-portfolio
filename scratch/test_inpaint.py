import cv2
import numpy as np

def remove_cursor(img):
    # Cursor is white (>240, >240, >240) and black (<30, <30, <30)
    # But wait, character has white collar and black pupils!
    # Where does cursor appear?
    # Cursor is only outside the face or at the right cheek (x > 650 or y < 150 or x < 350 or y > 550)
    # Let's find cursor: it's a small connected component (< 500 pixels) of pure white + black outline!
    
    # 1. Background color is approx BGR [22, 27, 198]
    bg_bgr = np.array([22, 27, 198], dtype=np.float32)
    diff = np.linalg.norm(img.astype(np.float32) - bg_bgr, axis=2)
    is_bg = diff < 40 # background mask
    
    # In background regions, anything that is NOT red background is an artifact/cursor!
    # If a pixel in the outer area (e.g. x < 400 or x > 880 or y < 80 or y > 660) is white or black:
    h, w = img.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Outer area cursor removal:
    # Any pixel where diff > 40, but is surrounded by background:
    # Specifically cursor pixels:
    white_mask = (img[:, :, 0] > 230) & (img[:, :, 1] > 230) & (img[:, :, 2] > 230)
    black_mask = (img[:, :, 0] < 40) & (img[:, :, 1] < 40) & (img[:, :, 2] < 40)
    cursor_candidates = (white_mask | black_mask)
    
    # Exclude character body center (collar is at y: 550..660, x: 500..780; eyes are at y: 220..380, x: 520..760)
    safe_zone = np.ones((h, w), dtype=bool)
    # Protect eyes/glasses/teeth/collar
    safe_zone[180:480, 520:760] = False # face center
    safe_zone[530:720, 480:800] = False # collar/neck
    
    mask[(cursor_candidates & safe_zone)] = 255
    # Dilate mask slightly to cover antialiased borders
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask_dilated = cv2.dilate(mask, kernel)
    
    # Inpaint
    result = cv2.inpaint(img, mask_dilated, 5, cv2.INPAINT_TELEA)
    return result

# Test on f_122 and center_234
for name, path in [('f_122', 'scratch/test_poses/f_122.png'),
                   ('center_234', 'scratch/test_poses/center_234.png'),
                   ('up_198', 'scratch/test_poses/up_198.png'),
                   ('upright_136', 'scratch/test_poses/upright_136.png')]:
    im = cv2.imread(path)
    clean = remove_cursor(im)
    cv2.imwrite(f'scratch/test_poses/{name}_clean.png', clean)

print("Inpainting test complete")
