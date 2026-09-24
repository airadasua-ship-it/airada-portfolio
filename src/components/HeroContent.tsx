import React from 'react';
import { ArrowUpRight, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroContentProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onOpenFeaturedProjects: () => void;
  isDeadzone?: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onOpenResume,
  onOpenContact,
  onOpenFeaturedProjects,
  isDeadzone = false,
}) => {
  return (
    <div className="pointer-events-auto relative z-10 mx-auto grid w-full max-w-7xl items-center gap-4 lg:grid-cols-[minmax(320px,430px)_1fr] lg:items-center">
      <div className="w-full max-w-[430px] select-none rounded-3xl border border-white/10 bg-black/22 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8 lg:ml-2 lg:mt-10 lg:justify-self-start lg:bg-black/18">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E2E8F0]">
          <span className="inline-flex h-2 w-2 rounded-full bg-white" />
          <span>Creative Copywriter &amp; Translator</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Airada Suanjan
        </h1>

        <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-[#E2E8F0] sm:text-[13px]">
          Content Writer &amp; Translator | Marketing &amp; Admin Specialist
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-[#E2E8F0]">
          <MapPin size={16} className="text-white" />
          <span>Bangkok, Thailand • Open to Remote / Hybrid / Onsite</span>
        </div>

        {isDeadzone && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
            <Sparkles size={11} className="text-white" />
            <span>Eye Contact Engaged</span>
          </div>
        )}

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#E2E8F0] sm:text-[15px]">
          Versatile Copywriter &amp; Translator with 6+ years of experience in content creation, JP/EN to TH translation, and administrative operations.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => {
              sound.playClick();
              onOpenResume();
            }}
            onMouseEnter={() => sound.playHover()}
            data-interactive="true"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            <span>Explore Experience</span>
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenFeaturedProjects();
            }}
            onMouseEnter={() => sound.playHover()}
            data-interactive="true"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0]/30 bg-[#E2E8F0]/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            <span>Featured Works</span>
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenContact();
            }}
            onMouseEnter={() => sound.playHover()}
            data-interactive="true"
            className="glass-btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
          >
            <MessageSquare size={14} className="opacity-80" />
            <span>Get In Touch</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block" aria-hidden="true" />
    </div>
  );
};
