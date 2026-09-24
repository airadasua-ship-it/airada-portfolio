import cv2
import numpy as np

# Check cursor template or color detection
# The red background is roughly: R: 190-210, G: 20-35, B: 15-30
# The mouse cursor has pure white (255, 255, 255) and black border (0, 0, 0)
f = cv2.imread('scratch/test_poses/upright_136.png')
# Find pixels far from red background that are white
bg_color = np.array([22, 27, 198]) # BGR
diff = cv2.absdiff(f, bg_color)
diff_sum = np.sum(diff, axis=2)

# Cursor is in background area (where character is not)
# Character is roughly center x: 300..980, y: 50..720
# But let's check cursor in f_122.png
f122 = cv2.imread('scratch/test_poses/f_122.png')
diff122 = cv2.absdiff(f122, bg_color)
print("upright_136 cursor area:", np.where((f[:, :, 0] > 240) & (f[:, :, 1] > 240) & (f[:, :, 2] > 240)))
