import cv2
import numpy as np

def flow_morph(im1, im2, alpha):
    """
    Morphs between im1 and im2 at parameter alpha in [0, 1]
    using bidirectional dense optical flow for zero-ghosting interpolation.
    """
    if alpha <= 0.0: return im1.copy()
    if alpha >= 1.0: return im2.copy()
    
    gray1 = cv2.cvtColor(im1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(im2, cv2.COLOR_BGR2GRAY)
    
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    flow_1to2 = dis.calc(gray1, gray2, None)
    flow_2to1 = dis.calc(gray2, gray1, None)
    
    h, w = im1.shape[:2]
    grid_x, grid_y = np.meshgrid(np.arange(w), np.arange(h))
    
    # Forward warp
    map1_x = (grid_x + alpha * flow_1to2[:, :, 0]).astype(np.float32)
    map1_y = (grid_y + alpha * flow_1to2[:, :, 1]).astype(np.float32)
    warp1 = cv2.remap(im1, map1_x, map1_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    
    # Backward warp
    map2_x = (grid_x + (1.0 - alpha) * flow_2to1[:, :, 0]).astype(np.float32)
    map2_y = (grid_y + (1.0 - alpha) * flow_2to1[:, :, 1]).astype(np.float32)
    warp2 = cv2.remap(im2, map2_x, map2_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    
    # Blend warped images
    blended = cv2.addWeighted(warp1, 1.0 - alpha, warp2, alpha, 0)
    return blended

# Test morphing between UP and UP-RIGHT
up = cv2.imread('scratch/test_poses/up_198.png')
upright = cv2.imread('scratch/test_poses/upright_136.png')

steps = []
for a in np.linspace(0, 1, 7):
    m = flow_morph(up, upright, a)
    thumb = cv2.resize(m, (160, 90))
    cv2.putText(thumb, f"{a:.2f}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    steps.append(thumb)

sheet = np.hstack(steps)
cv2.imwrite('scratch/morph_test.jpg', sheet)
print("Morph test saved to scratch/morph_test.jpg")
