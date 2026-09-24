import cv2
import os

cap = cv2.VideoCapture('<b>character.mp4<:b>/Character_tracking_cursor_animation_20260924223929.mp4')
os.makedirs('scratch/test_poses', exist_ok=True)

test_frames = {
    'center_234': 234,
    'right_120': 120,
    'right_122': 122,
    'upright_136': 136,
    'downright_152': 152,
    'down_168': 168,
    'down_172': 172,
    'up_198': 198,
    'up_202': 202
}

for name, f_num in test_frames.items():
    cap.set(cv2.CAP_PROP_POS_FRAMES, f_num)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f'scratch/test_poses/{name}.png', frame)

cap.release()
print("Saved test poses")
