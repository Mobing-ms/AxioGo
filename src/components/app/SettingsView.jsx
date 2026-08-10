import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';
import {
  Settings,
  User,
  Bell,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const SettingsView = () => {
  const { currentRole, currentUser } = useAuth();

  const [voiceSpeed, setVoiceSpeed] = useState('1.0x');
  const [emailNotifs, setEmailNotifs] = useState(true);

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.settings-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('settings-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-[0.08] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-axio-red/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-axio-red/[0.025] rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="settings-scroll-reveal settings-reveal mb-10">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-axio-red/20 blur-xl rounded-full" />

                  <div className="relative w-9 h-9 rounded-xl bg-axio-red/10 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-axio-red" />
                  </div>

                </div>

                <span className="text-[9px] text-axio-red font-bold tracking-[0.2em] uppercase">
                  AXIOGO · CONFIGURATION
                </span>

                <RoleBadge role={currentRole} />

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                USER & ENTERPRISE{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  SETTINGS
                </span>

              </h1>

              <p className="max-w-2xl mt-5 text-sm sm:text-base text-axio-text-secondary leading-relaxed font-sans">
                Configure your AxioGo workspace, AXIS voice preferences,
                and enterprise notification behavior.
              </p>

            </div>

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/20 to-transparent" />

        </section>

        {/* ========================================================
            SETTINGS CONTENT
        ======================================================== */}

        <div className="space-y-5">

          {/* ======================================================
              USER PROFILE
          ====================================================== */}

          <section
            className="settings-scroll-reveal settings-reveal relative overflow-hidden rounded-2xl bg-axio-panel/45 backdrop-blur-xl"
            style={{ transitionDelay: '100ms' }}
          >

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent" />

            <div className="p-6 sm:p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-axio-red" />
                </div>

                <div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.18em] uppercase mb-1">
                    IDENTITY
                  </div>

                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                    User Profile & Credentials
                  </h2>

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Full Name */}

                <div>

                  <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      readOnly
                      value={currentUser.name}
                      className="
                        w-full
                        bg-white/[0.025]
                        rounded-xl
                        px-4 py-3
                        text-white
                        text-xs
                        font-sans
                        focus:outline-none
                      "
                    />

                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                    Enterprise Email
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      readOnly
                      value={currentUser.email}
                      className="
                        w-full
                        bg-white/[0.025]
                        rounded-xl
                        px-4 py-3
                        text-white
                        text-xs
                        font-sans
                        focus:outline-none
                      "
                    />

                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />

                  </div>

                </div>

              </div>

              <div className="flex items-center gap-2 mt-5 text-[9px] text-axio-muted uppercase tracking-wider">

                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

                Enterprise identity verified

              </div>

            </div>

          </section>

          {/* ======================================================
              VOICE AI
          ====================================================== */}

          <section
            className="settings-scroll-reveal settings-reveal relative overflow-hidden rounded-2xl bg-axio-panel/45 backdrop-blur-xl"
            style={{ transitionDelay: '180ms' }}
          >

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-axio-red/40 to-transparent" />

            <div className="p-6 sm:p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-axio-red" />
                </div>

                <div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.18em] uppercase mb-1">
                    AXIS · VOICE
                  </div>

                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                    Voice AI Preferences
                  </h2>

                </div>

              </div>

              <div className="max-w-md">

                <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                  AXIS TTS Speech Rate
                </label>

                <select
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(e.target.value)}
                  className="
                    w-full
                    bg-white/[0.025]
                    rounded-xl
                    px-4 py-3
                    text-white
                    text-xs
                    font-sans
                    focus:outline-none
                    focus:ring-1
                    focus:ring-axio-red/50
                    transition-all
                  "
                >

                  <option>
                    0.8x (Slower)
                  </option>

                  <option>
                    1.0x (Normal)
                  </option>

                  <option>
                    1.2x (Faster)
                  </option>

                </select>

              </div>

              <div className="flex items-center gap-2 mt-5 text-[9px] text-axio-muted uppercase tracking-wider">

                <Sparkles className="w-3.5 h-3.5 text-axio-red" />

                AXIS voice response behavior

              </div>

            </div>

          </section>

          {/* ======================================================
              NOTIFICATIONS
          ====================================================== */}

          <section
            className="settings-scroll-reveal settings-reveal relative overflow-hidden rounded-2xl bg-axio-panel/45 backdrop-blur-xl"
            style={{ transitionDelay: '260ms' }}
          >

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-axio-red/40 to-transparent" />

            <div className="p-6 sm:p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-axio-red" />
                </div>

                <div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.18em] uppercase mb-1">
                    ENTERPRISE ALERTS
                  </div>

                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                    Notification Preferences
                  </h2>

                </div>

              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                <div>

                  <div className="text-xs text-white font-semibold mb-1">
                    High-Risk Autonomous Action Alerts
                  </div>

                  <p className="text-[10px] text-axio-muted font-sans leading-relaxed max-w-xl">
                    Receive email alerts when AXIS identifies high-risk
                    autonomous action triggers requiring enterprise
                    authorization.
                  </p>

                </div>

                {/* Custom Toggle */}

                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifs}
                  onClick={() => setEmailNotifs((prev) => !prev)}
                  className={`
    relative
    shrink-0
    w-12
    h-6
    rounded-full
    transition-all
    duration-300
    focus:outline-none
    ${emailNotifs
                      ? 'bg-axio-red shadow-[0_0_20px_rgba(255,48,70,0.18)]'
                      : 'bg-white/[0.10]'
                    }
  `}
                >
                  <span
                    className={`
      absolute
      left-1
      top-1
      w-4
      h-4
      rounded-full
      bg-white
      shadow-sm
      transition-transform
      duration-300
      ease-out
      ${emailNotifs
                        ? 'translate-x-6'
                        : 'translate-x-0'
                      }
    `}
                  />
                </button>

              </div>

              <div className="flex items-center gap-2 mt-5 text-[9px] uppercase tracking-wider">

                <span
                  className={`
                    w-1.5
                    h-1.5
                    rounded-full
                    ${emailNotifs
                      ? 'bg-emerald-400'
                      : 'bg-axio-muted'
                    }
                  `}
                />

                <span
                  className={
                    emailNotifs
                      ? 'text-emerald-400'
                      : 'text-axio-muted'
                  }
                >
                  {emailNotifs
                    ? 'EMAIL ALERTS ENABLED'
                    : 'EMAIL ALERTS DISABLED'}
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`

        .settings-reveal {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(4px);

          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .settings-reveal.settings-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {

          .settings-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

        }

      `}</style>

    </div>
  );
};