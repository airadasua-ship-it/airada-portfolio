import cv2
import glob

# Check frames 118 to 124
for f in [118, 120, 122, 124]:
    im = cv2.imread(f'scratch/test_poses/f_{f}.png')
    # Let's crop around face x: 700 to 1150, y: 250 to 550
    crop = im[250:550, 700:1150]
    cv2.imwrite(f'scratch/test_poses/crop_{f}.png', crop)

print("Saved crops")
