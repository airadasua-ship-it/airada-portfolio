import React from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string | null;
  onSelectTab: (tab: string | null) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  soundEnabled,
  onToggleSound,
}) => {
  const navItems = [
    { id: 'impact', label: 'IMPACT' },
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full glass-nav shadow-2xl transition-all duration-300"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-[10px] sm:text-[11px] tracking-[0.28em] font-bold uppercase text-white/90">
            AIRADA SUANJAN
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(isActive ? null : item.id);
                }}
                onMouseEnter={() => sound.playHover()}
                data-interactive="true"
                className={`relative px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] transition-all duration-300 border ${
                  isActive
                    ? 'border-white/70 bg-white text-black shadow-[0_2px_12px_rgba(255,255,255,0.2)]'
                    : 'border-white/30 text-white/85 hover:border-white hover:bg-white hover:text-black'
                }`}
              >
                [{item.label}]
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pl-2 border-l border-white/15">
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            onMouseEnter={() => sound.playHover()}
            data-interactive="true"
            title={soundEnabled ? 'Mute micro-haptics' : 'Enable micro-haptics'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-black hover:bg-white transition-all duration-200 border border-white/20 hover:border-white"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="opacity-50" />}
          </button>
        </div>
      </nav>
    </header>
  );
};
