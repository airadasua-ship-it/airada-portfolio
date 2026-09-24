import React, { useEffect, useState, useRef } from 'react';

export const MagneticCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [data-interactive]');
        setIsHovering(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Spring/lerp loop for trailing aura ring
    const loop = () => {
      // Direct dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Smooth trailing ring (lerp factor 0.18)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${
          isClicking ? 0.8 : isHovering ? 1.9 : 1
        })`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible, isHovering, isClicking]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Trailing Aura Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-white/80 transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out will-change-transform ${
          isHovering
            ? 'w-12 h-12 bg-white/20 border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] backdrop-invert-0'
            : 'w-8 h-8 bg-transparent border-white/50 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
        }`}
      />

      {/* Center Crisp Glowing Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-white transition-[transform,opacity] duration-75 will-change-transform shadow-[0_0_12px_rgba(255,255,255,1)] ${
          isClicking ? 'w-1.5 h-1.5' : isHovering ? 'w-2 h-2 opacity-90' : 'w-2 h-2'
        }`}
      />
    </div>
  );
};
