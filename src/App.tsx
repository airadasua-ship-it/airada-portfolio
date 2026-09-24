import React, { useState, useCallback } from 'react';
import { CharacterCanvas, TelemetryData } from './components/CharacterCanvas';
import { MagneticCursor } from './components/MagneticCursor';
import { Header } from './components/Header';
import { HeroContent } from './components/HeroContent';
import { TelemetryHUD } from './components/TelemetryHUD';
import { Modals } from './components/Modals';
import { sound } from './utils/audio';

export function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [manualAngle, setManualAngle] = useState<number | null>(null);
  const [autoPatrol, setAutoPatrol] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleTelemetryUpdate = useCallback((data: TelemetryData) => {
    setTelemetry(data);
  }, []);

  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#000000] text-[#FFFFFF] select-none">
      {/* 1. Full-Screen Canvas Character Renderer (Motionless body, zero-ghosting, 60fps) */}
      <CharacterCanvas
        onTelemetryUpdate={handleTelemetryUpdate}
        manualOverrideAngle={manualAngle}
        autoPatrol={autoPatrol}
      />

      {/* 2. Floating Frosted-Glass Header Navigation Pill Centered At Top */}
      <Header
        activeTab={activeModal}
        onSelectTab={(tab) => setActiveModal(tab)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* 3. Hero Typography (Bottom-Left) */}
      <HeroContent
        onOpenResume={() => setActiveModal('resume')}
        onOpenContact={() => setActiveModal('contact')}
        isDeadzone={telemetry?.isDeadzone}
      />

      {/* 4. Luxury Telemetry & Compass HUD (Bottom-Right) */}
      <TelemetryHUD
        telemetry={telemetry}
        autoPatrol={autoPatrol}
        onToggleAutoPatrol={() => {
          setAutoPatrol(!autoPatrol);
          setManualAngle(null);
        }}
        onSelectManualAngle={(angle) => {
          setManualAngle(angle);
          setAutoPatrol(false);
        }}
      />

      {/* 5. Custom Magnetic Glowing Cursor */}
      <MagneticCursor />

      {/* 6. Modals for Work, About, Contact, Resume */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </main>
  );
}

export default App;
