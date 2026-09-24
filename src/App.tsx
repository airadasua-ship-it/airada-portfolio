import React, { useState, useCallback } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { CharacterCanvas, TelemetryData } from './components/CharacterCanvas';
import { MagneticCursor } from './components/MagneticCursor';
import { Header } from './components/Header';
import { HeroContent } from './components/HeroContent';
import { TelemetryHUD } from './components/TelemetryHUD';
import { Modals } from './components/Modals';
import { sound } from './utils/audio';

const impactStats = [
  {
    value: '6+',
    label: 'Years Experience',
    detail: 'In content creation, translation, and administrative operations.',
  },
  {
    value: '<2%',
    label: 'Error Rate',
    detail: 'In translation and copywriting accuracy while preserving tone and nuance.',
  },
  {
    value: '60,000',
    label: 'Facebook Followers',
    detail: 'Grew the brand page from 0 to 60k within 3 months at Asia Alliance Partner.',
  },
  {
    value: '5+',
    label: 'Campaign Localizations',
    detail: 'Localized global campaigns for OWNDAYS including Hello Kitty, Stranger Things, and Disney Frozen.',
  },
  {
    value: 'HTML/CSS',
    label: 'Web & Automation',
    detail: 'Built campaign landing pages and workflows with Google Apps Script.',
  },
];

const workExperience = [
  {
    title: 'Content Writer & Translator',
    company: 'OWNDAYS (THAILAND) CO., LTD.',
    period: 'September 2024 – Present',
    description:
      'Localized and translated marketing and social media content from Japanese and English into Thai for campaigns including OWNDAYS x Hello Kitty, Stranger Things, DITA Lancier, Disney Frozen, and Zootopia. Formulated content strategy, directed creative teams, and built PR and landing pages using HTML/CSS with automated Google Apps Script forms.',
    results: ['Japanese / English to Thai localization', 'Campaign content strategy', 'PR + landing page development'],
  },
  {
    title: 'Japanese Coordinator',
    company: 'ASIA ALLIANCE PARTNER CO., LTD.',
    period: 'June 2021 – August 2024',
    description:
      'Created and translated news content from English and Japanese into Thai for website and internal communications, wrote articles about Thailand in Japanese for the company newspaper, and coordinated with the Japan Desk team to strengthen bilingual communication and audience engagement.',
    results: ['EN / JP to TH translation', 'Website and internal communications', 'Facebook growth from 0 to 60,000'],
  },
  {
    title: 'General Affairs Administrator',
    company: 'ASIA ALLIANCE PARTNER CO., LTD.',
    period: 'October 2019 – June 2021',
    description:
      'Managed general affairs and HR administrative operations, including documentation control, vendor coordination, meeting schedules, and company event support to maintain smooth and efficient organizational operations.',
    results: ['GA and HR support', 'Documentation management', 'Vendor and event coordination'],
  },
  {
    title: 'Product Planning',
    company: 'JTB (THAILAND) LIMITED',
    period: 'May 2018 – September 2019',
    description:
      'Created bespoke Thailand travel itineraries for Japanese clients and coordinated with hotels and transportation suppliers. Designed promotional brochures and leaflets in Japanese using Adobe Photoshop to support marketing and client-facing communications.',
    results: ['Japanese client itinerary planning', 'Supplier coordination', 'Japanese marketing design'],
  },
];

const languageProfiles = [
  {
    name: 'Thai',
    level: 'Native',
    detail: 'Professional communication, written clarity, and cultural nuance in business and marketing contexts.',
  },
  {
    name: 'English',
    level: 'TOEIC 755',
    detail: 'Strong written and spoken communication skills with a high standard of corporate messaging.',
  },
  {
    name: 'Japanese',
    level: 'JLPT N3',
    detail: 'Effective communication and coordination with Japanese stakeholders and bilingual business workflows.',
  },
];

const skillGroups = [
  {
    title: 'Content & Copywriting',
    items: ['Content Writing', 'Copywriting', 'Translation', 'Proofreading', 'Editing', 'Creative Writing'],
  },
  {
    title: 'Project & Admin Operations',
    items: ['JP / EN / TH Coordination', 'General Affairs', 'Documentation Control', 'Vendor Coordination', 'Meeting Scheduling', 'Event Support'],
  },
  {
    title: 'Tools & Digital Workflow',
    items: ['Microsoft Office', 'Canva', 'Photoshop', 'Google Apps Script', 'HTML / CSS', 'Typing 40 WPM'],
  },
];

export function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [manualAngle, setManualAngle] = useState<number | null>(null);
  const [autoPatrol, setAutoPatrol] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const handleTelemetryUpdate = useCallback((data: TelemetryData) => {
    setTelemetry(data);
  }, []);

  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  const handleSectionNavigation = (sectionId: string | null) => {
    if (!sectionId) return;
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-white/20 selection:text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CharacterCanvas
          onTelemetryUpdate={handleTelemetryUpdate}
          manualOverrideAngle={manualAngle}
          autoPatrol={autoPatrol}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.28),rgba(0,0,0,0.9))]" />
      </div>

      <Header
        activeTab={activeSection}
        onSelectTab={handleSectionNavigation}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <div className="relative z-10">
        <section id="hero" className="relative min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-start pt-8">
            <HeroContent
              onOpenResume={() => setActiveModal('resume')}
              onOpenContact={() => setActiveModal('contact')}
              isDeadzone={telemetry?.isDeadzone}
            />
          </div>
        </section>

        <section id="impact" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#94A3B8]">Impact Highlights</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Measurable Results & Key Achievements</h2>
            </div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#E2E8F0]">
              Performance Snapshot
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {impactStats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-3xl font-bold leading-none text-white md:text-4xl">{stat.value}</div>
                <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">{stat.label}</div>
                <p className="mt-3 text-sm leading-relaxed text-[#E2E8F0]">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#94A3B8]">About Me</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Professional Overview</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#E2E8F0]">
                I am Airada Suanjan, a multilingual content writer, translator, and marketing administrator with a strong background in Japanese, English, and Thai communication. My work is centered on clear messaging, accurate localization, and business-ready documentation that supports smooth project execution.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#E2E8F0]">
                I combine content strategy, proofreading, and cross-functional coordination to deliver polished communications across digital campaigns, internal operations, and customer-facing materials while preserving brand tone and cultural nuance.
              </p>
            </div>

            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#94A3B8]">
                <Languages size={14} className="text-white" />
                Language Skills
              </div>
              <div className="space-y-4">
                {languageProfiles.map((language) => (
                  <div key={language.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-semibold text-white">{language.name}</span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#E2E8F0]">
                        {language.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#E2E8F0]">{language.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#94A3B8]">Career History</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Work Experience Timeline</h2>
          </div>

          <div className="space-y-6">
            {workExperience.map((role, index) => (
              <div key={role.title} className="relative grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-6 lg:grid-cols-[180px_1fr] lg:items-start">
                <div className="relative flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white">
                    <BriefcaseBusiness size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#94A3B8]">{role.period}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#E2E8F0]">Role {index + 1}</div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{role.title}</h3>
                      <p className="mt-1 text-sm text-[#94A3B8]">{role.company}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-base leading-7 text-[#E2E8F0]">{role.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.results.map((result) => (
                      <span key={result} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#E2E8F0]">
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#94A3B8]">Capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Core Skills & Software Tools</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#94A3B8]">
                  <Wrench size={14} className="text-white" />
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-[#E2E8F0]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#94A3B8]">
                <GraduationCap size={14} className="text-white" />
                Education
              </div>
              <h3 className="text-2xl font-semibold text-white">Bachelor of Arts</h3>
              <p className="mt-3 text-base text-[#E2E8F0]">Business Japanese, Faculty of Liberal Arts</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Panyapiwat Institute of Management | GPA 3.77 | First-Class Honors, Gold Medal</p>
            </div>

            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#94A3B8]">
                <Globe2 size={14} className="text-white" />
                Direct Contact
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <Mail size={18} className="text-white" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">Email</div>
                    <a href="mailto:airadasua@gmail.com" className="text-sm font-medium text-white hover:text-[#E2E8F0]">
                      airadasua@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <Phone size={18} className="text-white" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">Phone</div>
                    <a href="tel:+66917109191" className="text-sm font-medium text-white hover:text-[#E2E8F0]">
                      (+66)091-710-9191
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <MapPin size={18} className="text-white" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">Location</div>
                    <p className="text-sm font-medium text-white">Bangkok, Thailand</p>
                    <p className="text-xs text-[#94A3B8]">Open to Remote / Hybrid / Onsite</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('contact')}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowUpRight size={14} />
                Let&apos;s Talk
              </button>
            </div>
          </div>
        </section>
      </div>

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

      <MagneticCursor />
      <Modals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </main>
  );
}

export default App;
