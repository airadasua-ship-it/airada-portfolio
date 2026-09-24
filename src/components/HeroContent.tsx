import React from 'react';
import { ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroContentProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
  isDeadzone?: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onOpenResume,
  onOpenContact,
  isDeadzone = false,
}) => {
  return (
    <div className="absolute bottom-10 left-6 sm:left-10 md:bottom-14 md:left-16 z-30 max-w-sm pointer-events-auto flex flex-col items-start select-none">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/85 font-semibold">
          Hi, I&apos;m
        </span>
      </div>

      <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-white font-bold leading-[1.05] drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)] tracking-wide -ml-1">
        Airada
      </h1>
      <div className="mb-3 text-[10px] sm:text-xs uppercase tracking-[0.38em] text-white/75 font-medium">
        Suanjan
      </div>

      {isDeadzone && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/40 text-[10px] tracking-[0.2em] font-mono uppercase text-white my-1 backdrop-blur-md animate-fade-in">
          <Sparkles size={11} className="text-amber-300" />
          <span>Eye Contact Engaged</span>
        </div>
      )}

      <p className="max-w-[360px] text-xs sm:text-[13px] md:text-sm text-white/90 leading-relaxed font-light tracking-wide mt-2 mb-6">
        Copywriter &amp; translator blending brand storytelling, localization, and web content strategy for Japanese and English-to-Thai audiences.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onOpenResume();
          }}
          onMouseEnter={() => sound.playHover()}
          data-interactive="true"
          className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#c81f16] text-xs md:text-sm font-bold tracking-[0.15em] uppercase shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
        >
          <span>Resume</span>
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenContact();
          }}
          onMouseEnter={() => sound.playHover()}
          data-interactive="true"
          className="glass-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs md:text-sm font-semibold tracking-[0.15em] uppercase active:scale-95"
        >
          <MessageSquare size={14} className="opacity-80" />
          <span>Let&apos;s Talk</span>
        </button>
      </div>
    </div>
  );
};
