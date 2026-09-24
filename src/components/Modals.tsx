import React, { useState } from 'react';
import { X, Mail, Check, Copy, Download, Award, Briefcase, GraduationCap, Phone, MapPin, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export const Modals: React.FC<ModalsProps> = ({ activeModal, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!activeModal) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('airadasua@gmail.com');
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-fade-in pointer-events-auto">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 text-white border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.6)] z-10 custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95"
          data-interactive="true"
        >
          <X size={18} />
        </button>

        {activeModal === 'work' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/60">
                Selected Experience
              </span>
              <h2 className="text-3xl font-bold font-editorial mt-1 text-white">Portfolio Highlights</h2>
              <p className="text-sm text-white/70 mt-1">
                Content marketing, localization, and digital storytelling for Japanese and English audiences.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Content Writer & Translator',
                  company: 'OWNDAYS Thailand',
                  period: 'Sep 2024 – Present',
                  desc: 'Localized marketing and social media content from Japanese and English into Thai, created campaign and product copy, built PR pages using HTML/CSS, and improved workflow efficiency with AI and automation tools.',
                  tags: ['JP/EN → TH', 'Campaign Copy', 'Web Content', 'SEO Basics'],
                },
                {
                  title: 'Japanese Coordinator',
                  company: 'Asia Alliance Partner',
                  period: 'Oct 2019 – Aug 2024',
                  desc: 'Translated news and articles, managed website content, wrote Japanese-language articles, and coordinated directly with Japanese stakeholders to keep communication accurate and culturally relevant.',
                  tags: ['Translation', 'Stakeholder Management', 'Website Content', 'Japanese Articles'],
                },
                {
                  title: 'Product Planning',
                  company: 'JTB Thailand',
                  period: 'May 2018 – Sep 2019',
                  desc: 'Developed bespoke travel plans for Japanese clients, coordinated with suppliers, and conducted market research to support product strategy and client-facing planning.',
                  tags: ['Travel Planning', 'Market Research', 'Supplier Coordination', 'Bespoke Itineraries'],
                },
              ].map((proj, idx) => (
                <div
                  key={idx}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-mono">
                    <span>{proj.company}</span>
                    <span>{proj.period}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mt-2">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/90"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModal === 'about' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/60">
                About Me
              </span>
              <h2 className="text-3xl font-bold font-editorial mt-1 text-white">Airada Suanjan</h2>
            </div>

            <div className="prose text-sm text-white/85 leading-relaxed space-y-4">
              <p>
                Creative and detail-oriented copywriter and translator with 6+ years of experience in content marketing, localization, and web content development.
              </p>
              <p>
                I specialize in translating Japanese and English into Thai with a focus on natural, culturally relevant communication. My work balances brand voice, clarity, and accuracy while supporting end-to-end content projects from planning and copywriting to execution.
              </p>
              <p>
                I enjoy collaborating across teams, managing campaigns, and creating content that feels authentic to the audience while staying consistent with brand direction.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Core Strengths
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Content Copywriting',
                  'Social Media Copy',
                  'Product Copywriting',
                  'Translation & Localization',
                  'Proofreading & Editing',
                  'HTML / CSS Basics',
                  'SEO Basics',
                  'Content Strategy',
                  'AI Productivity Workflow',
                ].map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/90 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'contact' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/60">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold font-editorial mt-1 text-white">Open to opportunities</h2>
              <p className="text-sm text-white/70 mt-1">
                Based in Bangkok, Thailand and available for remote, hybrid, or onsite roles.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Email</div>
                    <div className="text-sm font-mono font-semibold text-white">airadasua@gmail.com</div>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  data-interactive="true"
                  className="px-3.5 py-2 rounded-xl bg-white text-[#c81f16] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">Phone</div>
                  <a href="tel:+66917109191" className="text-sm font-mono font-semibold text-white hover:text-amber-200">091-710-9191</a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/60">Location</div>
                  <div className="text-sm font-medium text-white">Khlong Toei, Bangkok, Thailand</div>
                </div>
              </div>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-400/30 flex items-center justify-center mx-auto mb-3 text-emerald-300">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Message Sent</h3>
                <p className="text-xs text-white/80 mt-1">
                  Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  setContactSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">
                    Project / Opportunity
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell me about your project or role..."
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  data-interactive="true"
                  className="w-full py-3.5 rounded-xl bg-white text-[#c81f16] font-bold text-xs tracking-[0.2em] uppercase shadow-lg hover:shadow-white/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {activeModal === 'resume' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/60">
                  Curriculum Vitae
                </span>
                <h2 className="text-3xl font-bold font-editorial mt-1 text-white">Airada Suanjan</h2>
                <p className="text-xs text-white/70 font-mono">Copywriter &amp; Translator</p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  window.print();
                }}
                data-interactive="true"
                className="px-4 py-2 rounded-xl bg-white text-[#c81f16] text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <Download size={14} />
                <span>Save PDF</span>
              </button>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-3 flex items-center gap-2">
                <Briefcase size={14} /> Professional Experience
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white">Content Writer &amp; Translator</h4>
                      <p className="text-xs text-amber-300 font-mono">OWNDAYS Thailand</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">Sep 2024 – Present</span>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Localized marketing and social media content from Japanese and English into Thai, created campaign and product copy, built PR pages using HTML/CSS, and improved workflow efficiency with AI and automation tools.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white">Japanese Coordinator</h4>
                      <p className="text-xs text-amber-300 font-mono">Asia Alliance Partner</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">Oct 2019 – Aug 2024</span>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Translated news and articles from English/Japanese into Thai, managed website content, wrote Japanese-language articles, and coordinated directly with Japanese stakeholders across multiple communication streams.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white">Product Planning</h4>
                      <p className="text-xs text-amber-300 font-mono">JTB Thailand</p>
                    </div>
                    <span className="text-[10px] font-mono text-white/50">May 2018 – Sep 2019</span>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Developed bespoke travel plans for Japanese clients, coordinated with suppliers, and conducted market research to support product strategy and customer experience planning.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-3 flex items-center gap-2">
                <GraduationCap size={14} /> Education &amp; Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-xs text-white">Business Japanese</h4>
                  <p className="text-[11px] text-white/70">Panyapiwat Institute of Management</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <Award size={13} /> Languages
                  </h4>
                  <p className="text-[11px] text-white/70">Thai (Native), English (TOEIC 755), Japanese (JLPT N3)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
