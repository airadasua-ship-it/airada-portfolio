"""
extract_webp_frames.py

Extract 64 evenly-spaced WebP frames + center.webp from the source MP4.
Writes frames into BASE_DIR/frames (script's sibling "frames" directory).
"""

import cv2
import numpy as np
import os
import sys
import math

# Use script directory as base so the script works regardless of current working dir
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Try to locate the provided video in a few likely places relative to this script
possible_paths = [
    os.path.join(BASE_DIR, 'Woman_following_cursor_with_eyes_20260925205703.mp4'),
    os.path.join(BASE_DIR, 'character.mp4'),
    os.path.join(BASE_DIR, 'character_mp4', 'Woman_following_cursor_with_eyes_20260925205703.mp4'),
]

video_path = None
for p in possible_paths:
    if os.path.exists(p):
        video_path = p
        break

if video_path is None:
    # fallback: find first mp4 under BASE_DIR
    for root, dirs, files in os.walk(BASE_DIR):
        for f in files:
            if f.lower().endswith('.mp4'):
                video_path = os.path.join(root, f)
                break
        if video_path:
            break

if video_path is None:
    print('No mp4 video found near script location. Aborting.')
    sys.exit(1)

cap = cv2.VideoCapture(video_path)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 1280)
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 720)

print(f'Using video: {video_path} ({frame_count} frames, {fps} fps, {width}x{height})')

def erase_cursor(img):
    # Gentle inpaint of bright cursor-like artefacts
    h, w = img.shape[:2]
    white_mask = ((img[:, :, 0] > 220) & (img[:, :, 1] > 220) & (img[:, :, 2] > 220)).astype(np.uint8) * 255
    # Heuristic: protect central face area (approx)
    cy1 = int(h * 0.15)
    cy2 = int(h * 0.75)
    cx1 = int(w * 0.25)
    cx2 = int(w * 0.75)
    white_mask[cy1:cy2, cx1:cx2] = 0

    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(white_mask)
    clean = img.copy()
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        if 5 <= area <= 5000:
            x = stats[i, cv2.CC_STAT_LEFT]
            y = stats[i, cv2.CC_STAT_TOP]
            w_box = stats[i, cv2.CC_STAT_WIDTH]
            h_box = stats[i, cv2.CC_STAT_HEIGHT]
            y1 = max(0, y - 6)
            y2 = min(h, y + h_box + 6)
            x1 = max(0, x - 6)
            x2 = min(w, x + w_box + 6)
            patch_mask = np.zeros((h, w), dtype=np.uint8)
            patch_mask[y1:y2, x1:x2] = 255
            try:
                clean = cv2.inpaint(clean, patch_mask, 3, cv2.INPAINT_TELEA)
            except Exception:
                pass
    return clean

def read_frame(n):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(n))
    ret, fr = cap.read()
    if not ret:
        raise RuntimeError(f'Failed to read frame {n}')
    return fr

# Prepare output dir under BASE_DIR/frames
out_dir = os.path.join(BASE_DIR, 'frames')
if os.path.exists(out_dir):
    # clean old frames
    for f in os.listdir(out_dir):
        if f.endswith('.webp') or f.endswith('.png') or f.startswith('frame_') or f == 'center.webp':
            try:
                os.remove(os.path.join(out_dir, f))
            except Exception:
                pass
else:
    os.makedirs(out_dir, exist_ok=True)

print('Scanning video for hands-down (neutral) frames...')

# Heuristics: face center relative to frame (assumed from prior work)
face_cx = int(width * 0.50)
face_cy = int(height * 0.43)
face_w = int(width * 0.36)
face_h = int(height * 0.46)

def skin_mask(img_bgr):
    img_ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(img_ycrcb)
    # skin heuristics in YCrCb
    mask = ((cr >= 135) & (cr <= 180) & (cb >= 85) & (cb <= 135)).astype(np.uint8) * 255
    # morphological clean
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, kernel, iterations=1)
    return mask

def hands_near_face(img):
    # Compute skin pixels in cheek regions; if substantial, treat as hands present
    h, w = img.shape[:2]
    mask = skin_mask(img)
    # define left/right cheek boxes relative to assumed face center
    fw = face_w
    fh = face_h
    lx1 = max(0, face_cx - int(fw * 0.9))
    lx2 = max(0, face_cx - int(fw * 0.25))
    rx1 = min(w, face_cx + int(fw * 0.25))
    rx2 = min(w, face_cx + int(fw * 0.9))
    y1 = max(0, face_cy - int(fh * 0.15))
    y2 = min(h, face_cy + int(fh * 0.45))
    left_box = mask[y1:y2, lx1:lx2]
    right_box = mask[y1:y2, rx1:rx2]
    left_count = int(np.sum(left_box > 0))
    right_count = int(np.sum(right_box > 0))
    # relative to box area
    box_area = max(1, (y2 - y1) * max(1, lx2 - lx1))
    box_area_r = max(1, (y2 - y1) * max(1, rx2 - rx1))
    left_ratio = left_count / box_area
    right_ratio = right_count / box_area_r
    # if either cheek contains >6% skin pixels, consider hands present
    return (left_ratio > 0.06) or (right_ratio > 0.06)

# Collect candidate frames and mark hands-down frames
valid_frames = []
all_indices = list(range(frame_count))
for fi in all_indices:
    try:
        fr = read_frame(fi)
    except RuntimeError:
        continue
    fr_clean = erase_cursor(fr)
    try:
        if not hands_near_face(fr_clean):
            valid_frames.append((fi, fr_clean))
    except Exception:
        # on any failure, conservatively include the frame
        valid_frames.append((fi, fr_clean))

if len(valid_frames) == 0:
    print('No hands-down frames found; falling back to even sampling.')
    indices = np.linspace(0, max(0, frame_count - 1), 64, dtype=int)
    # Read all sampled frames
    sampled = []
    for fi in indices:
        fr = read_frame(fi)
        fr = erase_cursor(fr)
        sampled.append((fi, fr))

    # Choose center frame (middle of video) and rotate sequence so center is frame_0
    center_idx = frame_count // 2 if frame_count > 0 else indices[0]
    # find nearest sampled index to center_idx
    idx_positions = [abs(fi - center_idx) for fi, _ in sampled]
    nearest_pos = int(np.argmin(idx_positions)) if len(idx_positions) > 0 else 0
    ordered = [fr for _, fr in sampled]
    ordered = ordered[nearest_pos:] + ordered[:nearest_pos]

    # enforce pastel background on sampled frames and write
    def hex_to_bgr(hexstr):
        hexstr = hexstr.lstrip('#')
        r = int(hexstr[0:2], 16)
        g = int(hexstr[2:4], 16)
        b = int(hexstr[4:6], 16)
        return (b, g, r)

    pastel_bgr = hex_to_bgr('AEC6CF')
    # compute corner avg from center frame (best available)
    center_fr = read_frame(center_idx)
    center_fr = erase_cursor(center_fr)
    corners = [
        center_fr[0, 0].astype(int),
        center_fr[0, -1].astype(int),
        center_fr[-1, 0].astype(int),
        center_fr[-1, -1].astype(int),
    ]
    corner_avg = np.mean(corners, axis=0).astype(int)

    def replace_background_with_pastel(img, threshold=40):
        diff = np.linalg.norm(img.astype(int) - corner_avg.reshape((1, 1, 3)), axis=2)
        mask_bg = diff < threshold
        out = img.copy()
        out[mask_bg] = pastel_bgr
        return out

    for i, fr in enumerate(ordered):
        fr_clean = replace_background_with_pastel(erase_cursor(fr), threshold=36)
        out_path = os.path.join(out_dir, f'frame_{i}.webp')
        cv2.imwrite(out_path, fr_clean, [cv2.IMWRITE_WEBP_QUALITY, 92])

    # save center.webp from true center frame
    center_fr_clean = replace_background_with_pastel(center_fr, threshold=36)
    cv2.imwrite(os.path.join(out_dir, 'center.webp'), center_fr_clean, [cv2.IMWRITE_WEBP_QUALITY, 92])
    print('Saved center.webp (fallback rotated so center => frame_0)')
else:
    print(f'Found {len(valid_frames)} hands-down frames out of {frame_count} total')
    # choose neutral center: frame with minimal skin on cheeks (recompute ratios)
    min_score = None
    neutral_idx = 0
    for idx, (fi, fr) in enumerate(valid_frames):
        try:
            mask = skin_mask(fr)
            h, w = fr.shape[:2]
            fw = face_w
            fh = face_h
            lx1 = max(0, face_cx - int(fw * 0.9))
            lx2 = max(0, face_cx - int(fw * 0.25))
            rx1 = min(w, face_cx + int(fw * 0.25))
            rx2 = min(w, face_cx + int(fw * 0.9))
            y1 = max(0, face_cy - int(fh * 0.15))
            y2 = min(h, face_cy + int(fh * 0.45))
            left_count = int(np.sum(mask[y1:y2, lx1:lx2] > 0))
            right_count = int(np.sum(mask[y1:y2, rx1:rx2] > 0))
            score = left_count + right_count
        except Exception:
            score = 0
        if min_score is None or score < min_score:
            min_score = score
            neutral_idx = idx

    neutral_frame = valid_frames[neutral_idx][1]
    # Save center.webp (neutral, hands-down)
    neutral_clean = erase_cursor(neutral_frame)
    cv2.imwrite(os.path.join(out_dir, 'center.webp'), neutral_clean, [cv2.IMWRITE_WEBP_QUALITY, 92])
    print(f'Saved center.webp from frame #{valid_frames[neutral_idx][0]} (neutral hands-down)')

    # Prepare ordered list of BGR frames starting from neutral
    ordered = [vf[1] for vf in valid_frames]
    # rotate so neutral is first
    ordered = ordered[neutral_idx:] + ordered[:neutral_idx]

    src_count = len(ordered)

    # Convert pastel hex to BGR tuple
    def hex_to_bgr(hexstr):
        hexstr = hexstr.lstrip('#')
        r = int(hexstr[0:2], 16)
        g = int(hexstr[2:4], 16)
        b = int(hexstr[4:6], 16)
        return (b, g, r)

    pastel_bgr = hex_to_bgr('AEC6CF')

    # Compute neutral corner-average for background masking
    corners = [
        neutral_clean[0, 0].astype(int),
        neutral_clean[0, -1].astype(int),
        neutral_clean[-1, 0].astype(int),
        neutral_clean[-1, -1].astype(int),
    ]
    corner_avg = np.mean(corners, axis=0).astype(int)

    def replace_background_with_pastel(img, threshold=40):
        # Replace pixels similar to corner_avg with pastel_bgr
        diff = np.linalg.norm(img.astype(int) - corner_avg.reshape((1, 1, 3)), axis=2)
        mask_bg = diff < threshold
        out = img.copy()
        out[mask_bg] = pastel_bgr
        return out

    print('Synthesizing 64-frame circular sequence (interpolating if needed)...')
    for i in range(64):
        if src_count == 1:
            synth = ordered[0].copy()
        else:
            # continuous position across the circular source list
            pos = (i * src_count) / 64.0
            idx0 = int(math.floor(pos)) % src_count
            idx1 = (idx0 + 1) % src_count
            alpha = pos - math.floor(pos)
            f0 = ordered[idx0].astype(np.float32)
            f1 = ordered[idx1].astype(np.float32)
            synth = cv2.addWeighted(f0, 1.0 - alpha, f1, alpha, 0.0).astype(np.uint8)

        synth = erase_cursor(synth)
        synth = replace_background_with_pastel(synth, threshold=36)
        out_path = os.path.join(out_dir, f'frame_{i}.webp')
        cv2.imwrite(out_path, synth, [cv2.IMWRITE_WEBP_QUALITY, 92])

    cap.release()
    print('Wrote 64 frames to', out_dir)
    print('Final pastel enforced as #AEC6CF for background areas')
