import React, { useEffect, useRef, useState } from 'react';

export const ScrollTypography = () => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  const steps = [
    {
      title: 'DATA',
      subtitle: 'Trusted Enterprise Foundation',
      color: 'text-white',
      glow: 'rgba(255,255,255,0.08)',
    },
    {
      title: 'CONTEXT',
      subtitle: 'Business Definitions & Rules',
      color: 'text-axio-cyan',
      glow: 'rgba(32,214,210,0.10)',
    },
    {
      title: 'INTELLIGENCE',
      subtitle: 'AXIS Multi-Agent Reasoning',
      color: 'text-axio-red',
      glow: 'rgba(255,48,70,0.16)',
    },
    {
      title: 'DECISION',
      subtitle: 'Root Cause & Recommendations',
      color: 'text-amber-400',
      glow: 'rgba(251,191,36,0.10)',
    },
    {
      title: 'ACTION',
      subtitle: 'Controlled Autonomous Execution',
      color: 'text-emerald-400',
      glow: 'rgba(52,211,153,0.10)',
    },
  ];

  /* ================================================================
     SCROLL PROGRESS
  ================================================================= */

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const section = containerRef.current;

      if (!section) {
        ticking = false;
        return;
      }

      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      /*
       * The amount of scroll available while the section
       * remains pinned.
       */
      const scrollableDistance =
        section.offsetHeight - viewportHeight;

      if (scrollableDistance <= 0) {
        ticking = false;
        return;
      }

      /*
       * How far the user has travelled through this section.
       */
      const travelled =
        Math.max(0, -rect.top);

      /*
       * Clamp to 0 → 1.
       */
      const progress =
        Math.max(
          0,
          Math.min(
            1,
            travelled / scrollableDistance
          )
        );

      setScrollProgress(progress);

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      rafRef.current =
        requestAnimationFrame(
          updateProgress
        );
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      handleScroll
    );

    updateProgress();

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );

      window.removeEventListener(
        'resize',
        handleScroll
      );

      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, []);

  /* ================================================================
     STAGE POSITIONING

     We deliberately give each stage a full section of scroll
     instead of making them switch too quickly.

     The five stages occupy:
     
     DATA          0.00 → 0.20
     CONTEXT       0.20 → 0.40
     INTELLIGENCE  0.40 → 0.60
     DECISION      0.60 → 0.80
     ACTION        0.80 → 1.00

     This means ACTION is not finished until the pinned section
     itself reaches its end.
  ================================================================= */

  const stageCount = steps.length;

  const stageWidth =
    1 / stageCount;

  /* ================================================================
     CURRENT STAGE
  ================================================================= */

  const currentStep = Math.min(
    stageCount - 1,
    Math.floor(
      scrollProgress * stageCount
    )
  );

  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <section
      ref={containerRef}
      className="
        relative
        h-[500vh]
        bg-axio-bg
      "
    >

      {/* ==========================================================
          STICKY VIEWPORT

          This is what prevents the next section from appearing
          until the complete typography animation has finished.
      ========================================================== */}

      <div
        className="
          sticky
          top-0
          h-screen
          flex
          items-center
          justify-center
          overflow-hidden
          px-4
        "
      >

        {/* ========================================================
            TECHNICAL GRID
        ======================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-tech-grid
            opacity-25
            pointer-events-none
          "
        />


        {/* ========================================================
            DARK VIGNETTE
        ======================================================== */}

        <div
          className="
            absolute
            inset-0
            pointer-events-none
            bg-[radial-gradient(circle_at_center,transparent_15%,rgba(3,5,8,0.82)_100%)]
          "
        />


        {/* ========================================================
            RED AMBIENT GLOW
        ======================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[620px]
            h-[340px]
            bg-axio-red/[0.045]
            rounded-full
            blur-[150px]
            pointer-events-none
          "
        />


        {/* ========================================================
            MAIN CONTENT
        ======================================================== */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-6xl
            mx-auto
            text-center
          "
        >

          {/* ======================================================
              LABEL
          ====================================================== */}

          <div
            className="
              font-tech
              text-xs
              text-axio-muted
              uppercase
              tracking-[0.25em]
              mb-5
              font-semibold
            "
          >
            TRANSFORMATIONAL ARCHITECTURE LOOP
          </div>


          {/* ======================================================
              TYPOGRAPHY WINDOW
          ====================================================== */}

          <div
            className="
              relative
              min-h-[190px]
              sm:min-h-[240px]
              lg:min-h-[280px]
              flex
              items-center
              justify-center
              my-6
            "
          >

            {steps.map((step, idx) => {

              /*
               * The center of each stage.
               *
               * DATA          = 0.10
               * CONTEXT       = 0.30
               * INTELLIGENCE  = 0.50
               * DECISION      = 0.70
               * ACTION        = 0.90
               */

              const stageCenter =
                (idx + 0.5) *
                stageWidth;

              const diff =
                scrollProgress -
                stageCenter;

              const distance =
                Math.abs(diff);


              /*
               * ORIGINAL-STYLE ACTIVE WINDOW
               *
               * The active word remains visible over
               * a reasonable portion of the scroll.
               */

              const activeRange =
                stageWidth * 0.42;

              const isActive =
                distance <
                activeRange;


              /*
               * Fade the previous/next words.
               */

              const opacity =
                Math.max(
                  0.08,
                  1 -
                  distance *
                  4.5
                );


              /*
               * Scale distant words down.
               */

              const scale =
                Math.max(
                  0.70,
                  1 -
                  distance *
                  0.9
                );


              /*
               * Vertical movement.
               *
               * This creates the "coming from below /
               * leaving upward" feeling.
               */

              const translateY =
                diff * 110;


              /*
               * Blur distant words.
               */

              const blur =
                Math.min(
                  distance * 15,
                  10
                );


              /*
               * Active stage receives the cinematic
               * enlargement.
               */

              const finalScale =
                isActive
                  ? 1.045
                  : scale;


              const finalOpacity =
                isActive
                  ? 1
                  : opacity;


              const finalBlur =
                isActive
                  ? 0
                  : blur;


              return (
                <div
                  key={step.title}
                  className={`
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    pointer-events-none
                    ${step.color}
                  `}
                  style={{
                    opacity:
                      finalOpacity,

                    transform: `
                      translateY(${translateY}px)
                      scale(${finalScale})
                    `,

                    filter:
                      `blur(${finalBlur}px)`,

                    transition:
                      'opacity 180ms ease-out, transform 180ms ease-out, filter 180ms ease-out',

                    textShadow:
                      isActive
                        ? `0 0 55px ${step.glow}`
                        : 'none',

                    zIndex:
                      isActive
                        ? 10
                        : 1,
                  }}
                >

                  {/* ==============================================
                      MAIN WORD
                  ============================================== */}

                  <h2
                    className="
                      font-display
                      text-6xl
                      sm:text-8xl
                      lg:text-9xl
                      font-black
                      tracking-tight
                      uppercase
                      select-none
                      leading-[0.85]
                      whitespace-nowrap
                    "
                  >
                    {step.title}
                  </h2>


                  {/* ==============================================
                      SUBTITLE
                  ============================================== */}

                  <p
                    className="
                      font-sans
                      text-sm
                      sm:text-base
                      font-semibold
                      tracking-wider
                      uppercase
                      mt-4
                      text-axio-text-sub
                    "
                  >
                    {step.subtitle}
                  </p>

                </div>
              );
            })}

          </div>


          {/* ======================================================
              PROGRESS BAR
          ====================================================== */}

          <div
            className="
              relative
              max-w-3xl
              mx-auto
              h-px
              bg-white/[0.07]
              mt-8
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-px
                bg-axio-red
                shadow-[0_0_10px_rgba(255,48,70,0.5)]
              "
              style={{
                width:
                  `${scrollProgress * 100}%`,
              }}
            />

          </div>


          {/* ======================================================
              STAGE PILLS
          ====================================================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
              sm:gap-4
              mt-7
              font-sans
              text-xs
            "
          >

            {steps.map((step, idx) => {

              const stageStart =
                idx * stageWidth;

              const stageCenter =
                stageStart +
                stageWidth / 2;

              const reached =
                scrollProgress >=
                stageStart;

              const active =
                Math.abs(
                  scrollProgress -
                  stageCenter
                ) <
                stageWidth * 0.42;

              return (
                <React.Fragment
                  key={step.title}
                >

                  <div
                    className={`
                      px-3.5
                      py-1.5
                      rounded-md
                      flex
                      items-center
                      gap-2
                      transition-all
                      duration-300

                      ${active
                        ? `
                            bg-axio-card
                            text-white
                            shadow-lg
                            shadow-axio-red/10
                          `
                        : reached
                          ? `
                            bg-axio-card/60
                            text-white/75
                          `
                          : `
                            bg-axio-panel/50
                            text-axio-muted
                          `
                      }
                    `}
                  >

                    <span
                      className={`
                        rounded-full
                        transition-all
                        duration-300

                        ${active
                          ? `
                              w-2
                              h-2
                              bg-axio-red
                              shadow-[0_0_9px_rgba(255,48,70,0.7)]
                            `
                          : reached
                            ? `
                              w-2
                              h-2
                              bg-axio-red/60
                            `
                            : `
                              w-2
                              h-2
                              bg-axio-muted
                            `
                        }
                      `}
                    />

                    <span>
                      {step.title}
                    </span>

                  </div>


                  {idx <
                    steps.length - 1 && (
                      <span
                        className={`
                        text-sm
                        transition-colors
                        duration-300

                        ${reached
                            ? 'text-axio-red/60'
                            : 'text-axio-border'
                          }
                      `}
                      >
                        →
                      </span>
                    )}

                </React.Fragment>
              );
            })}

          </div>


          {/* ======================================================
              CURRENT STAGE
          ====================================================== */}

          <p
            className="
              text-[9px]
              sm:text-[10px]
              font-sans
              text-axio-muted/50
              mt-7
              font-medium
              uppercase
              tracking-[0.2em]
            "
          >
            {String(currentStep + 1).padStart(2, '0')}
            {' / '}
            {String(steps.length).padStart(2, '0')}
            {' · '}
            AXIOGO INTELLIGENCE FLOW
          </p>


          {/* ======================================================
              SMALL SCROLL LINE
          ====================================================== */}

          <div
            className="
              mt-5
              flex
              justify-center
              pointer-events-none
            "
          >
            <div
              className="
                w-px
                h-6
                bg-gradient-to-b
                from-axio-red/40
                to-transparent
              "
            />
          </div>

        </div>
      </div>

    </section>
  );
};