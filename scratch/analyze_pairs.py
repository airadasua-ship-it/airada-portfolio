import cv2
import numpy as np

# Load the key poses
up = cv2.imread('scratch/test_poses/up_198.png')
upright = cv2.imread('scratch/test_poses/upright_136.png')
right = cv2.imread('scratch/test_poses/f_122.png')
downright = cv2.imread('scratch/test_poses/downright_152.png')
down = cv2.imread('scratch/test_poses/down_168.png')

# Let's inspect differences between adjacent poses
pairs = [
    ('UP to UP-RIGHT', up, upright),
    ('UP-RIGHT to RIGHT', upright, right),
    ('RIGHT to DOWN-RIGHT', right, downright),
    ('DOWN-RIGHT to DOWN', downright, down)
]

for name, im1, im2 in pairs:
    diff = cv2.absdiff(im1, im2)
    print(f"{name}: mean diff = {np.mean(diff):.2f}, face diff = {np.mean(diff[100:450, 480:800]):.2f}")
