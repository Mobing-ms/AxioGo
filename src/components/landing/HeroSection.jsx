import React, { useEffect, useRef } from 'react';
import { DataParticleCanvas } from '../common/DataParticleCanvas';
import {
  Bot,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play,
} from 'lucide-react';

/* ================================================================
   SCROLL REVEAL HOOK
================================================================ */

const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('scroll-reveal-visible');

          // Reveal once instead of replaying every time
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
};

/* ================================================================
   HERO SECTION
================================================================ */

export const HeroSection = ({ onAskAxis, onExplore }) => {
  /* ==============================================================
     SCROLL REFS
  ============================================================== */

  const statusRef = useScrollReveal();

  const headlineRef = useScrollReveal();

  const subtitleRef = useScrollReveal();

  const buttonsRef = useScrollReveal();

  const metricOneRef = useScrollReveal();
  const metricTwoRef = useScrollReveal();
  const metricThreeRef = useScrollReveal();
  const metricFourRef = useScrollReveal();

  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-axio-bg
        flex
        items-center
        justify-center
      "
    >
      {/* ============================================================
          DATA PARTICLE / GRID BACKGROUND
      ============================================================ */}

      <DataParticleCanvas />

      {/* ============================================================
          DARK ATMOSPHERIC OVERLAY
      ============================================================ */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(5,8,12,0.25)_45%,rgba(5,8,12,0.88)_100%)]
        "
      />

      {/* ============================================================
          PRIMARY RED RADIAL GLOW
      ============================================================ */}

      <div
        className="
          absolute
          top-[18%]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[400px]
          rounded-full
          bg-axio-red/[0.075]
          blur-[150px]
          pointer-events-none
        "
      />

      {/* ============================================================
          SECONDARY RED GLOW
      ============================================================ */}

      <div
        className="
          absolute
          top-[35%]
          left-[25%]
          w-[350px]
          h-[300px]
          rounded-full
          bg-axio-red/[0.025]
          blur-[120px]
          pointer-events-none
        "
      />

      {/* ============================================================
          SUBTLE CYAN AMBIENT ACCENT
      ============================================================ */}

      <div
        className="
          absolute
          top-[30%]
          right-[20%]
          w-[280px]
          h-[220px]
          rounded-full
          bg-axio-cyan/[0.018]
          blur-[120px]
          pointer-events-none
        "
      />

      {/* ============================================================
          HERO CONTENT
      ============================================================ */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-28
          text-center
        "
      >
        {/* ==========================================================
            STATUS PILL
        ========================================================== */}

        <div
          ref={statusRef}
          className="
            scroll-reveal
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-2
            rounded-full
            bg-white/[0.025]
            backdrop-blur-sm
            mb-9
            shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          "
          style={{
            transitionDelay: '0ms',
          }}
        >
          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-axio-red
              shadow-[0_0_10px_rgba(255,48,70,0.7)]
              animate-pulse
            "
          />

          <span
            className="
              font-tech
              text-[10px]
              sm:text-xs
              text-axio-text-sub
              uppercase
              tracking-[0.12em]
              font-semibold
            "
          >
            AXIOGO · TURNING ENTERPRISE DATA INTO INTELLIGENT ACTION
          </span>

          <span
            className="
              text-white/[0.12]
              font-sans
              mx-1
            "
          >
            |
          </span>

          <span
            className="
              font-tech
              text-[10px]
              sm:text-xs
              text-axio-red
              font-medium
              flex
              items-center
              gap-1
            "
          >
            <Sparkles className="w-3.5 h-3.5" />

            AXIS · AI ASSISTANT
          </span>
        </div>

        {/* ==========================================================
            MAIN HERO HEADLINE
        ========================================================== */}

        <h1
          ref={headlineRef}
          className="
            scroll-reveal
            font-display
            text-4xl
            sm:text-6xl
            lg:text-7xl
            font-extrabold
            tracking-[-0.035em]
            text-white
            mb-7
            leading-[1.04]
          "
          style={{
            transitionDelay: '100ms',
          }}
        >
          FROM ENTERPRISE DATA

          <br />

          <span
            className="
      text-transparent
      bg-clip-text
      bg-gradient-to-r
      from-axio-red
      via-red-400
      to-white
      drop-shadow-[0_0_35px_rgba(255,48,70,0.12)]
    "
          >
            TO INTELLIGENT DECISIONS
          </span>
        </h1>

        {/* ==========================================================
            SUBTITLE
        ========================================================== */}

        <p
          ref={subtitleRef}
          className="
            scroll-reveal
            max-w-2xl
            mx-auto
            text-base
            sm:text-lg
            text-axio-text-secondary
            mb-10
            leading-relaxed
            font-sans
            font-normal
          "
          style={{
            transitionDelay: '180ms',
          }}
        >
          Go beyond enterprise data with AI that understands your business, reveals insights, and drives intelligent action.
        </p>

        {/* ==========================================================
            ACTION CTAs
        ========================================================== */}

        <div
          ref={buttonsRef}
          className="
            scroll-reveal
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
            mb-16
            font-tech
          "
          style={{
            transitionDelay: '260ms',
          }}
        >
          {/* ASK AXIS */}

          <button
            onClick={onAskAxis}
            className="
              group
              w-full
              sm:w-auto
              flex
              items-center
              justify-center
              gap-2.5
              px-8
              py-4
              bg-axio-red
              hover:bg-red-600
              text-white
              text-sm
              font-bold
              rounded-lg
              shadow-[0_12px_35px_rgba(255,48,70,0.18)]
              hover:shadow-[0_15px_45px_rgba(255,48,70,0.28)]
              transition-all
              duration-300
              transform
              hover:scale-[1.03]
            "
          >
            <Bot
              className="
                w-5
                h-5
                text-white
              "
            />

            <span>
              ASK AXIS
            </span>

            <ArrowRight
              className="
                w-4
                h-4
                group-hover:translate-x-1
                transition-transform
              "
            />
          </button>

          {/* EXPLORE AXIOGO */}

          <button
            onClick={onExplore}
            className="
              group
              w-full
              sm:w-auto
              flex
              items-center
              justify-center
              gap-2
              px-7
              py-4
              bg-white/[0.025]
              hover:bg-white/[0.045]
              text-white
              text-sm
              font-semibold
              rounded-lg
              transition-all
              duration-300
            "
          >
            <Play
              className="
                w-4
                h-4
                text-axio-red
                group-hover:scale-110
                transition-transform
              "
            />

            <span>
              EXPLORE AXIOGO
            </span>
          </button>
        </div>

        {/* ==========================================================
            FLOATING TELEMETRY METRIC CARDS
        ========================================================== */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            max-w-4xl
            mx-auto
            text-left
            font-sans
          "
        >
          {/* ========================================================
              CARD 1 — ENTERPRISE FLEET
          ======================================================== */}

          <div
            ref={metricOneRef}
            className="
              scroll-reveal
              group
              p-4
              bg-white/[0.025]
              backdrop-blur-md
              rounded-xl
              hover:bg-white/[0.04]
              transition-all
              duration-300
            "
            style={{
              transitionDelay: '0ms',
            }}
          >
            <div
              className="
                text-[10px]
                text-axio-muted
                uppercase
                tracking-[0.12em]
                font-semibold
              "
            >
              ENTERPRISE FLEET
            </div>

            <div
              className="
                font-display
                text-2xl
                font-bold
                text-white
                mt-1
              "
            >
              128,320
            </div>

            <div
              className="
                text-[10px]
                text-axio-green
                flex
                items-center
                gap-1.5
                mt-1
                font-medium
              "
            >
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-axio-green
                "
              />

              ACTIVE UNITS
            </div>
          </div>

          {/* ========================================================
              CARD 2 — DATABRICKS
          ======================================================== */}

          <div
            ref={metricTwoRef}
            className="
              scroll-reveal
              group
              p-4
              bg-white/[0.025]
              backdrop-blur-md
              rounded-xl
              hover:bg-white/[0.04]
              transition-all
              duration-300
            "
            style={{
              transitionDelay: '100ms',
            }}
          >
            <div
              className="
                text-[10px]
                text-axio-muted
                uppercase
                tracking-[0.12em]
                font-semibold
              "
            >
              DATABRICKS SYNC
            </div>

            <div
              className="
                font-display
                text-2xl
                font-bold
                text-white
                mt-1
              "
            >
              GOLD LAYER
            </div>

            <div
              className="
                text-[10px]
                text-axio-text-sub
                mt-1
              "
            >
              DELTA LAKE PIPELINE
            </div>
          </div>

          {/* ========================================================
              CARD 3 — AXIS AGENTS
          ======================================================== */}

          <div
            ref={metricThreeRef}
            className="
              scroll-reveal
              group
              p-4
              bg-white/[0.025]
              backdrop-blur-md
              rounded-xl
              hover:bg-white/[0.04]
              transition-all
              duration-300
            "
            style={{
              transitionDelay: '200ms',
            }}
          >
            <div
              className="
                text-[10px]
                text-axio-muted
                uppercase
                tracking-[0.12em]
                font-semibold
              "
            >
              AXIS AGENTS
            </div>

            <div
              className="
                font-display
                text-2xl
                font-bold
                text-axio-red
                mt-1
              "
            >
              6 SPECIALIZED
            </div>

            <div
              className="
                text-[10px]
                text-axio-text-sub
                mt-1
              "
            >
              ORCHESTRATED
            </div>
          </div>

          {/* ========================================================
              CARD 4 — SECURITY
          ======================================================== */}

          <div
            ref={metricFourRef}
            className="
              scroll-reveal
              group
              p-4
              bg-white/[0.025]
              backdrop-blur-md
              rounded-xl
              hover:bg-white/[0.04]
              transition-all
              duration-300
            "
            style={{
              transitionDelay: '300ms',
            }}
          >
            <div
              className="
                text-[10px]
                text-axio-muted
                uppercase
                tracking-[0.12em]
                font-semibold
              "
            >
              SECURITY STATUS
            </div>

            <div
              className="
                font-display
                text-2xl
                font-bold
                text-white
                mt-1
              "
            >
              ENFORCED
            </div>

            <div
              className="
                text-[10px]
                text-axio-green
                flex
                items-center
                gap-1.5
                mt-1
                font-medium
              "
            >
              <ShieldCheck
                className="
                  w-3.5
                  h-3.5
                  text-axio-green
                "
              />

              RBAC AUDITED
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SCROLL REVEAL STYLES
      ============================================================ */}

      <style>{`

        /* ----------------------------------------------------------
           INITIAL STATE
        ---------------------------------------------------------- */

        .scroll-reveal {
          opacity: 0;
          transform:
            translateY(48px)
            scale(0.985);
          filter: blur(7px);

          transition:
            opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ----------------------------------------------------------
           VISIBLE STATE
        ---------------------------------------------------------- */

        .scroll-reveal-visible {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
          filter: blur(0);
        }

        /* ----------------------------------------------------------
           ACCESSIBILITY
        ---------------------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {

          .scroll-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

        }

        /* ----------------------------------------------------------
           MOBILE
        ---------------------------------------------------------- */

        @media (max-width: 640px) {

          .scroll-reveal {
            transform:
              translateY(28px)
              scale(0.99);

            filter: blur(4px);

            transition-duration: 0.7s;
          }

          .scroll-reveal-visible {
            transform:
              translateY(0)
              scale(1);
          }

        }

      `}</style>
    </section>
  );
};