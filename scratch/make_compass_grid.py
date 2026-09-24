import cv2
import numpy as np

right = cv2.imread('scratch/test_poses/right_122.png')
left = cv2.flip(right, 1)

upright = cv2.imread('scratch/test_poses/upright_136.png')
upleft = cv2.flip(upright, 1)

downright = cv2.imread('scratch/test_poses/downright_152.png')
downleft = cv2.flip(downright, 1)

center = cv2.imread('scratch/test_poses/center_234.png')
up = cv2.imread('scratch/test_poses/up_198.png')
down = cv2.imread('scratch/test_poses/down_168.png')

# 8 compass directions:
# Layout in a 3x3 compass grid:
# [ UP-LEFT   ] [    UP    ] [  UP-RIGHT  ]
# [   LEFT    ] [  CENTER  ] [   RIGHT    ]
# [ DOWN-LEFT ] [   DOWN   ] [ DOWN-RIGHT ]

def resize_thumb(im, text):
    t = cv2.resize(im, (320, 180))
    cv2.putText(t, text, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    return t

grid = np.vstack([
    np.hstack([resize_thumb(upleft, "UP-LEFT (flipped 136)"), resize_thumb(up, "UP (198)"), resize_thumb(upright, "UP-RIGHT (136)")]),
    np.hstack([resize_thumb(left, "LEFT (flipped 122)"), resize_thumb(center, "CENTER (234)"), resize_thumb(right, "RIGHT (122)")]),
    np.hstack([resize_thumb(downleft, "DOWN-LEFT (flipped 152)"), resize_thumb(down, "DOWN (168)"), resize_thumb(downright, "DOWN-RIGHT (152)")])
])

cv2.imwrite('scratch/compass_8_directions.jpg', grid)
print("Saved compass_8_directions.jpg")
