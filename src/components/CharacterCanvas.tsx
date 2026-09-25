import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../utils/audio';

export interface TelemetryData {
  angleDeg: number;
  compassDir: string;
  isDeadzone: boolean;
  frameIndex: number;
  fps: number;
  cursorX: number;
  cursorY: number;
  isOverriding: boolean;
}

interface CharacterCanvasProps {
  onTelemetryUpdate?: (data: TelemetryData) => void;
  manualOverrideAngle?: number | null; // in degrees, null when tracking mouse
  autoPatrol?: boolean;
}

const TOTAL_FRAMES = 64;
const BG_COLOR = '#AEC6CF'; // pastel blue background applied globally
const LERP_FACTOR = 0.26; // tracks in ~35ms with zero lag (user specified ~0.26)

const COMPASS_NAMES = [
  'EAST [RIGHT]',
  'SOUTH-EAST [DOWN-RIGHT]',
  'SOUTH [DOWN]',
  'SOUTH-WEST [DOWN-LEFT]',
  'WEST [LEFT]',
  'NORTH-WEST [UP-LEFT]',
  'NORTH [UP]',
  'NORTH-EAST [UP-RIGHT]'
];

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({
  onTelemetryUpdate,
  manualOverrideAngle = null,
  autoPatrol = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Store preloaded images
  const framesRef = useRef<HTMLImageElement[]>([]);
  const centerFrameRef = useRef<HTMLImageElement | null>(null);

  // Internal tracking state
  const mousePosRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
  });
  const currentAngleRef = useRef<number>(0);
  const wasInDeadzoneRef = useRef<boolean>(false);
  const patrolAngleRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);

  // Shortest path circular angle lerp
  const lerpAngle = (current: number, target: number, factor: number): number => {
    let diff = (target - current) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    return current + diff * factor;
  };

  // Preload all 64 frames + center frame into memory
  useEffect(() => {
    let count = 0;
    const frames: HTMLImageElement[] = [];

    // Preload center frame
    const centerImg = new Image();
    centerImg.src = '/frames/center.webp';
    centerImg.onload = () => {
      count++;
      setLoadedCount(count);
      if (count === TOTAL_FRAMES + 1) setIsReady(true);
    };
    centerFrameRef.current = centerImg;

    // Preload 64 directional frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${i}.webp`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES + 1) setIsReady(true);
      };
      frames.push(img);
    }
    framesRef.current = frames;
  }, []);

  // Mouse and touch tracking listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      mousePosRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Main 60 FPS requestAnimationFrame rendering loop
  useEffect(() => {
    if (!isReady) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Adjust canvas resolution for razor-sharp Retina rendering
      const targetW = Math.round(W * dpr);
      const targetH = Math.round(H * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 100vw 100vh object-fit: cover calculations
      const videoAspect = 1280 / 720;
      const screenAspect = W / H;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (screenAspect > videoAspect) {
        drawW = W;
        drawH = W / videoAspect;
        drawX = 0;
        drawY = (H - drawH) / 2;
      } else {
        drawH = H;
        drawW = H * videoAspect;
        drawX = (W - drawW) / 2;
        drawY = 0;
      }

      // Exact face center in screen coordinates
      const faceCenterX = drawX + drawW * 0.50;
      const faceCenterY = drawY + drawH * 0.43;

      // Deadzone radius: 12% of minimum screen dimension
      const deadzoneRadius = Math.min(W, H) * 0.12;

      let targetAngle = currentAngleRef.current;
      let isInDeadzone = false;

      if (autoPatrol) {
        // Smoothly orbit in a circle
        patrolAngleRef.current = (patrolAngleRef.current + 0.015) % (Math.PI * 2);
        targetAngle = patrolAngleRef.current;
      } else if (manualOverrideAngle !== null) {
        targetAngle = (manualOverrideAngle * Math.PI) / 180;
      } else {
        const dx = mousePosRef.current.x - faceCenterX;
        const dy = mousePosRef.current.y - faceCenterY;
        const dist = Math.hypot(dx, dy);

        if (dist < deadzoneRadius) {
          isInDeadzone = true;
        } else {
          targetAngle = Math.atan2(dy, dx);
        }
      }

      // Play soft chime when entering deadzone
      if (isInDeadzone && !wasInDeadzoneRef.current) {
        sound.playEyeContact();
      }
      wasInDeadzoneRef.current = isInDeadzone;

      // Shortest-path angular lerp with factor 0.26 (~35ms zero-lag response)
      currentAngleRef.current = lerpAngle(currentAngleRef.current, targetAngle, LERP_FACTOR);

      // Choose crisp frame
      let imgToDraw: HTMLImageElement | null = null;
      let activeFrameIdx = 0;

      if (isInDeadzone && centerFrameRef.current) {
        imgToDraw = centerFrameRef.current;
      } else {
        // Map smoothed angle to 0..63.
        // Frames in the sprite are arranged opposite to the angular sign, so
        // invert the frame index mapping so the character looks TOWARD the cursor.
        const normAngle = ((currentAngleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const rawIdx = Math.round((normAngle / (Math.PI * 2)) * TOTAL_FRAMES) % TOTAL_FRAMES;
        activeFrameIdx = (TOTAL_FRAMES - rawIdx) % TOTAL_FRAMES;
        imgToDraw = framesRef.current[activeFrameIdx] || centerFrameRef.current;
      }

      // Draw EXACTLY ONE crisp frame at 100% opacity. NO alpha blending!
      if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
        // Only fill background when a solid BG_COLOR is required
        if (BG_COLOR !== 'transparent') {
          ctx.fillStyle = BG_COLOR;
          ctx.fillRect(0, 0, W, H);
        } else {
          // clear the canvas to transparent before drawing
          ctx.clearRect(0, 0, W, H);
        }
        ctx.drawImage(imgToDraw, drawX, drawY, drawW, drawH);
      }

      ctx.restore();

      // FPS calculation & Telemetry update
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFpsTimeRef.current >= 500) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      if (onTelemetryUpdate) {
        const currentDeg = Math.round(((((currentAngleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * 180) / Math.PI);
        const compassSector = Math.round(currentDeg / 45) % 8;
        onTelemetryUpdate({
          angleDeg: currentDeg,
          compassDir: COMPASS_NAMES[compassSector],
          isDeadzone: isInDeadzone,
          frameIndex: isInDeadzone ? -1 : activeFrameIdx,
          fps: fpsRef.current,
          cursorX: mousePosRef.current.x,
          cursorY: mousePosRef.current.y,
          isOverriding: manualOverrideAngle !== null || autoPatrol,
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isReady, manualOverrideAngle, autoPatrol, onTelemetryUpdate]);

  return (
    <div style={{ zIndex: 2 }} className="absolute inset-0 w-full h-full overflow-hidden bg-[transparent] select-none pointer-events-none">
      {/* Loading Screen */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-[#FFFFFF]">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
            <div className="h-7 w-7 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          </div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] font-semibold text-white/80">
            Loading Character Experience
          </p>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-150 rounded-full"
              style={{ width: `${Math.round((loadedCount / (TOTAL_FRAMES + 1)) * 100)}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-white/60 mt-2 font-mono">
            {loadedCount} / {TOTAL_FRAMES + 1} frames
          </span>
        </div>
      )}

      {/* Rock-solid Motionless Canvas (NO 3D CSS transforms) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover transform-none will-change-transform"
        style={{
          background: BG_COLOR,
          touchAction: 'manipulation',
        }}
      />
    </div>
  );
};
