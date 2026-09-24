import React, { useState } from 'react';
import { TelemetryData } from './CharacterCanvas';
import { Compass, Activity, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface TelemetryHUDProps {
  telemetry: TelemetryData | null;
  autoPatrol: boolean;
  onToggleAutoPatrol: () => void;
  onSelectManualAngle: (angle: number | null) => void;
}

const COMPASS_POINTS = [
  { label: 'N (UP)', angle: 270 },
  { label: 'NE', angle: 315 },
  { label: 'E (RIGHT)', angle: 0 },
  { label: 'SE', angle: 45 },
  { label: 'S (DOWN)', angle: 90 },
  { label: 'SW', angle: 135 },
  { label: 'W (LEFT)', angle: 180 },
  { label: 'NW', angle: 225 },
];

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  telemetry,
  autoPatrol,
  onToggleAutoPatrol,
  onSelectManualAngle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!telemetry) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2 pointer-events-auto select-none">
      {/* Expanded Compass Control Pad */}
      {isExpanded && (
        <div className="glass-card p-4 rounded-2xl mb-1 flex flex-col gap-3 min-w-[240px] animate-fade-in border border-white/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 flex items-center gap-1.5">
              <Compass size={12} className="text-white" />
              Direction Testing
            </span>
            <span className="text-[9px] font-mono text-white/60">360° Circular Lerp</span>
          </div>

          {/* 3x3 Compass Grid */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            {/* Row 1: NW, N, NE */}
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(225);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              UP-L
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(270);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              UP
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(315);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              UP-R
            </button>

            {/* Row 2: W, CENTER, E */}
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(180);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              LEFT
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(null); // Return to mouse tracking / center
              }}
              className="px-2 py-1.5 rounded-lg bg-white text-[#c61b16] text-[10px] font-mono font-bold transition-all hover:scale-105 shadow-md"
            >
              MOUSE
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(0);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              RIGHT
            </button>

            {/* Row 3: SW, S, SE */}
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(135);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              DN-L
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(90);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              DOWN
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectManualAngle(45);
              }}
              className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-[10px] font-mono text-white font-semibold transition-all hover:scale-105"
            >
              DN-R
            </button>
          </div>

          {/* Auto Patrol Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleAutoPatrol();
            }}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
              autoPatrol
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {autoPatrol ? <Pause size={12} /> : <Play size={12} />}
            <span>{autoPatrol ? 'STOP AUTO ORBIT' : 'AUTO ORBIT GAZE'}</span>
          </button>
        </div>
      )}

      {/* Compact Status Pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            setIsExpanded(!isExpanded);
          }}
          className="glass-btn px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-mono tracking-wide text-white/90 hover:text-white"
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                telemetry.isDeadzone
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping'
                  : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
              }`}
            />
            <span className="font-bold">
              {telemetry.isDeadzone ? 'EYE CONTACT' : `${telemetry.angleDeg}°`}
            </span>
          </div>

          <span className="text-white/40">|</span>

          <span className="text-[10px] text-white/70 hidden sm:inline-block">
            {telemetry.isDeadzone ? 'NEUTRAL' : `FRAME #${telemetry.frameIndex}`}
          </span>

          <span className="text-white/40 hidden sm:inline-block">|</span>

          <span className="text-[10px] text-emerald-300 font-semibold">
            ~35ms • {telemetry.fps} FPS
          </span>

          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </div>
  );
};
