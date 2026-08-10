import React, { useEffect, useRef } from 'react';
import {
  Bot,
  ArrowRight,
  Database,
  ShieldCheck,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const AboutView = ({ setActivePage }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll('.about-reveal');

    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-axio-bg"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-axio-red/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute top-[35%] right-[-180px] w-[450px] h-[450px] bg-axio-red/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute bottom-[-200px] left-[-150px] w-[400px] h-[400px] bg-axio-cyan/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle center glow */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-axio-red/5 blur-[100px] rounded-full pointer-events-none" />

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32">

        {/* =====================================================
            TITLE
        ====================================================== */}

        <div
          className="
            about-reveal
            opacity-0
            translate-y-8
            transition-all
            duration-1000
            ease-out
            [&.is-visible]:opacity-100
            [&.is-visible]:translate-y-0
            text-center
            mb-16
          "
        >
          {/* Label */}

          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-axio-red shadow-[0_0_10px_rgba(255,48,70,0.7)]" />

            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-axio-red uppercase">
              ABOUT AXIOGO
            </span>
          </div>

          {/* Heading */}

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
            ENTERPRISE AI{' '}
            <span
              className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-axio-red
                via-red-400
                to-white
              "
            >
              DECISION INTELLIGENCE
            </span>
          </h1>

          {/* Subtitle */}

          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed max-w-2xl mx-auto">
            AxioGo combines enterprise Databricks data engineering, business
            context, AXIS multi-agent intelligence, and controlled autonomous
            action into a single command center.
          </p>
        </div>

        {/* =====================================================
            CENTRAL PRODUCT LOOP
        ====================================================== */}

        <div
          className="
            about-reveal
            opacity-0
            translate-y-10
            transition-all
            duration-1000
            delay-150
            ease-out
            [&.is-visible]:opacity-100
            [&.is-visible]:translate-y-0
            relative
            mb-16
          "
        >
          {/* Ambient red glow */}

          <div className="absolute inset-0 bg-axio-red/3 blur-[80px] rounded-full pointer-events-none" />

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-axio-panel/60
              backdrop-blur-xl
              shadow-[0_30px_80px_rgba(0,0,0,0.35)]
            "
          >
            {/* Top accent */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-axio-red to-transparent opacity-70" />

            <div className="p-7 sm:p-10">

              {/* Section heading */}

              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-axio-red" />

                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-[0.18em] text-center">
                  THE AXIOGO CENTRAL PRODUCT LOOP
                </h2>

                <div className="w-8 h-px bg-gradient-to-l from-transparent to-axio-red" />
              </div>

              {/* =================================================
                  FLOW
              ================================================== */}

              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                {/* Trusted Data */}

                <div
                  className="
                    group
                    w-full
                    lg:flex-1
                    p-5
                    rounded-xl
                    bg-axio-bg/60
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-axio-card
                  "
                >
                  <Database className="w-5 h-5 text-white mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />

                  <span className="text-xs font-bold text-white tracking-wider">
                    TRUSTED DATA
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-axio-muted rotate-90 lg:rotate-0 shrink-0" />

                {/* Business Context */}

                <div
                  className="
                    group
                    w-full
                    lg:flex-1
                    p-5
                    rounded-xl
                    bg-axio-bg/60
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-axio-card
                  "
                >
                  <ShieldCheck className="w-5 h-5 text-white mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />

                  <span className="text-xs font-bold text-white tracking-wider">
                    BUSINESS CONTEXT
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-axio-muted rotate-90 lg:rotate-0 shrink-0" />

                {/* AXIS */}

                <div
                  className="
                    group
                    relative
                    w-full
                    lg:flex-1
                    p-5
                    rounded-xl
                    bg-axio-red/10
                    text-center
                    shadow-[0_0_40px_rgba(255,48,70,0.08)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-axio-red/15
                  "
                >
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-axio-red to-transparent" />

                  <Cpu className="w-5 h-5 text-axio-red mx-auto mb-3" />

                  <span className="text-xs font-bold text-white tracking-wider">
                    AXIS ENGINE
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-axio-muted rotate-90 lg:rotate-0 shrink-0" />

                {/* Decision */}

                <div
                  className="
                    group
                    w-full
                    lg:flex-1
                    p-5
                    rounded-xl
                    bg-axio-bg/60
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-axio-card
                  "
                >
                  <CheckCircle2 className="w-5 h-5 text-white mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />

                  <span className="text-xs font-bold text-white tracking-wider">
                    DECISION
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-axio-muted rotate-90 lg:rotate-0 shrink-0" />

                {/* Controlled Action */}

                <div
                  className="
                    group
                    w-full
                    lg:flex-1
                    p-5
                    rounded-xl
                    bg-axio-red/5
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-axio-red/10
                  "
                >
                  <Bot className="w-5 h-5 text-axio-red mx-auto mb-3" />

                  <span className="text-xs font-bold text-white tracking-wider">
                    CONTROLLED ACTION
                  </span>
                </div>

              </div>

              {/* Flow indicator */}

              <div className="mt-10 flex justify-center">
                <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.18em] text-axio-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-axio-red animate-pulse" />
                  DATA → CONTEXT → INTELLIGENCE → DECISION → ACTION
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            CTA
        ====================================================== */}

        <div
          className="
            about-reveal
            opacity-0
            translate-y-8
            transition-all
            duration-1000
            delay-300
            ease-out
            [&.is-visible]:opacity-100
            [&.is-visible]:translate-y-0
            text-center
          "
        >
          <button
            onClick={() => setActivePage('dashboard')}
            className="
              group
              relative
              inline-flex
              items-center
              gap-3
              px-8
              py-4
              bg-axio-red
              hover:bg-red-500
              text-white
              font-bold
              text-xs
              tracking-wide
              rounded-lg
              shadow-[0_15px_45px_rgba(255,48,70,0.18)]
              hover:shadow-[0_20px_55px_rgba(255,48,70,0.28)]
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <span>OPEN COMMAND CENTER DASHBOARD</span>

            <ArrowRight
              className="
                w-4 h-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>

      </div>
    </section>
  );
};