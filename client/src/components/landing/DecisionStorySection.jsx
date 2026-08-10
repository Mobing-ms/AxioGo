import React, { useEffect, useRef, useState } from 'react';
import {
  HelpCircle,
  Search,
  Lightbulb,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const DecisionStorySection = ({ onOpenActions }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const decisionStages = [
    {
      num: '01',
      question: 'WHAT HAPPENED?',
      title: 'Metrics & Telemetry Detection',
      content:
        'Maintenance expenditure spiked by +14.2% ($42,850) over the last 30 days across heavy-duty transports.',
      badge: 'METRICS DETECTED',
      icon: Search
    },
    {
      num: '02',
      question: 'WHY DID IT HAPPEN?',
      title: 'Root Cause & Statistical Isolation',
      content:
        'AXIS Analytics Agent isolated 28 coolant hose kit (CH-8820) failures occurring between 45k-60k miles in Vehicle Group A.',
      badge: 'ROOT CAUSE ISOLATED',
      icon: HelpCircle
    },
    {
      num: '03',
      question: 'WHAT SHOULD WE DO?',
      title: 'Prescriptive Recommendation',
      content:
        'Issue preventative thermal recall for remaining 45 units in Vehicle Group A and file supplier warranty claims.',
      badge: 'RECOMMENDATION SYNTHESIZED',
      icon: Lightbulb
    },
    {
      num: '04',
      question: 'CAN AXIOGO ACT?',
      title: 'Controlled Autonomous Action',
      content:
        'AXIS Workflow Agent prepares shop bay reservations and supplier notifications. Pauses for human authorization if high-risk.',
      badge: 'CONTROLLED ACTION READY',
      icon: Zap
    }
  ];

  /* ================================================================
     SCROLL REVEAL
  ================================================================= */

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -90px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-screen
        py-32
        sm:py-40
        bg-axio-bg
        overflow-hidden
      "
    >

      {/* ==========================================================
          AMBIENT BACKGROUND
      ========================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-tech-grid
          opacity-[0.08]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-[18%]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[400px]
          rounded-full
          bg-axio-red/[0.025]
          blur-[150px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[10%]
          right-[5%]
          w-[350px]
          h-[300px]
          rounded-full
          bg-axio-cyan/[0.012]
          blur-[140px]
          pointer-events-none
        "
      />


      {/* ==========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ========================================================
            SECTION LABEL
        ======================================================== */}

        <div
          className={`
            flex
            items-center
            justify-center
            gap-3
            mb-8

            transition-all
            duration-1000
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          <span
            className="
              w-8
              h-px
              bg-axio-red
            "
          />

          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[10px]
              sm:text-xs
              tracking-[0.2em]
              text-axio-red
              uppercase
              font-semibold
            "
          >

            <Zap
              className="
                w-3.5
                h-3.5
              "
            />

            05 · DECISION INTELLIGENCE PROGRESSION

          </div>

          <span
            className="
              w-8
              h-px
              bg-axio-red
            "
          />

        </div>


        {/* ========================================================
            HEADING
        ======================================================== */}

        <div
          className={`
            text-center
            max-w-4xl
            mx-auto

            transition-all
            duration-[1100ms]
            delay-100
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
            }
          `}
        >

          <h2
            className="
              font-display
              text-4xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
              leading-[0.95]
              text-white
            "
          >

            FROM INSIGHT

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
              TO CONTROLLED ACTION.
            </span>

          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-7
              text-base
              sm:text-lg
              text-axio-text-secondary
              font-sans
              leading-relaxed
            "
          >
            AxioGo doesn't stop at charts. It guides enterprise
            teams through the complete decision workflow.
          </p>

        </div>


        {/* ========================================================
            DECISION PROGRESSION
        ======================================================== */}

        <div
          className="
            relative
            mt-24
          "
        >

          {/* ======================================================
              CONNECTING PROGRESS LINE
          ====================================================== */}

          <div
            className="
              hidden
              lg:block
              absolute
              top-[27px]
              left-[12.5%]
              right-[12.5%]
              h-px
              bg-gradient-to-r
              from-axio-border
              via-axio-red/30
              to-axio-border
              pointer-events-none
            "
          />

          {/* Active progress */}

          <div
            className="
              hidden
              lg:block
              absolute
              top-[27px]
              left-[12.5%]
              h-px
              bg-axio-red
              shadow-[0_0_8px_rgba(255,48,70,0.45)]
              transition-all
              duration-700
              pointer-events-none
            "
            style={{
              width: `${(activeStep / 3) * 75}%`
            }}
          />


          {/* ======================================================
              STAGES
          ====================================================== */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-x-10
              gap-y-14
            "
          >

            {decisionStages.map(
              (stage, idx) => {

                const Icon =
                  stage.icon;

                const isActive =
                  activeStep === idx;

                const isComplete =
                  idx < activeStep;

                return (
                  <div
                    key={stage.num}
                    onClick={() =>
                      setActiveStep(idx)
                    }
                    className={`
                      group
                      relative
                      cursor-pointer

                      transition-all
                      duration-[900ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]

                      ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-14'
                      }
                    `}
                    style={{
                      transitionDelay:
                        `${250 + idx * 120}ms`
                    }}
                  >

                    {/* ==================================================
                        STEP NODE
                    ================================================== */}

                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-center
                        w-14
                        h-14
                        mb-8
                      "
                    >

                      {/* Outer glow */}

                      <div
                        className={`
                          absolute
                          inset-0
                          rounded-full
                          transition-all
                          duration-500

                          ${isActive
                            ? `
                                bg-axio-red/[0.10]
                                shadow-[0_0_35px_rgba(255,48,70,0.18)]
                                scale-110
                              `
                            : `
                                bg-white/[0.02]
                                group-hover:bg-axio-red/[0.06]
                              `
                          }
                        `}
                      />

                      {/* Number */}

                      <div
                        className={`
                          relative
                          w-10
                          h-10
                          rounded-full
                          flex
                          items-center
                          justify-center
                          font-mono
                          text-xs
                          font-bold
                          transition-all
                          duration-500

                          ${isActive
                            ? `
                                bg-axio-red
                                text-white
                                shadow-[0_0_20px_rgba(255,48,70,0.35)]
                              `
                            : isComplete
                              ? `
                                  bg-axio-red/[0.12]
                                  text-axio-red
                                `
                              : `
                                  bg-white/[0.035]
                                  text-axio-muted
                                  group-hover:text-white
                                `
                          }
                        `}
                      >

                        {isComplete ? (
                          <CheckCircle2
                            className="
                              w-4
                              h-4
                            "
                          />
                        ) : (
                          stage.num
                        )}

                      </div>

                    </div>


                    {/* ==================================================
                        STAGE CONTENT
                    ================================================== */}

                    <div
                      className={`
                        transition-all
                        duration-500

                        ${isActive
                          ? 'translate-y-[-3px]'
                          : 'group-hover:translate-y-[-2px]'
                        }
                      `}
                    >

                      {/* Question */}

                      <div
                        className={`
                          font-mono
                          text-[10px]
                          tracking-[0.15em]
                          uppercase
                          font-bold
                          mb-3
                          transition-colors
                          duration-300

                          ${isActive
                            ? 'text-axio-red'
                            : 'text-axio-muted group-hover:text-axio-red'
                          }
                        `}
                      >
                        {stage.question}
                      </div>


                      {/* Title */}

                      <h3
                        className="
                          font-display
                          text-base
                          sm:text-lg
                          font-bold
                          text-white
                          leading-tight
                          mb-3
                        "
                      >
                        {stage.title}
                      </h3>


                      {/* Content */}

                      <p
                        className="
                          text-xs
                          sm:text-sm
                          text-axio-text-secondary
                          font-sans
                          leading-relaxed
                          max-w-[260px]
                        "
                      >
                        {stage.content}
                      </p>


                      {/* Status */}

                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          mt-6
                          font-mono
                          text-[9px]
                          tracking-[0.12em]
                          uppercase
                          transition-all
                          duration-300

                          ${isActive
                            ? 'text-axio-red opacity-100'
                            : 'text-axio-muted opacity-60 group-hover:opacity-100'
                          }
                        `}
                      >

                        <span
                          className={`
                            w-1.5
                            h-1.5
                            rounded-full
                            transition-all
                            duration-300

                            ${isActive
                              ? `
                                  bg-axio-red
                                  shadow-[0_0_8px_rgba(255,48,70,0.7)]
                                `
                              : `
                                  bg-axio-muted
                                `
                            }
                          `}
                        />

                        {stage.badge}

                      </div>

                    </div>


                    {/* ==================================================
                        ACTIVE UNDERLINE
                    ================================================== */}

                    <div
                      className={`
                        absolute
                        bottom-[-18px]
                        left-0
                        h-px
                        bg-axio-red
                        shadow-[0_0_8px_rgba(255,48,70,0.5)]
                        transition-all
                        duration-500

                        ${isActive
                          ? 'w-12'
                          : 'w-0 group-hover:w-6'
                        }
                      `}
                    />

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* ========================================================
            ACTION CENTER CTA
        ======================================================== */}

        <div
          className={`
            relative
            mt-24

            transition-all
            duration-[1100ms]
            delay-[850ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }
          `}
        >

          {/* Ambient glow */}

          <div
            className="
              absolute
              inset-0
              bg-axio-red/[0.025]
              blur-[60px]
              pointer-events-none
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-8
              py-8
            "
          >

            {/* Left content */}

            <div
              className="
                flex
                items-center
                gap-5
                text-center
                sm:text-left
              "
            >

              <div
                className="
                  hidden
                  sm:flex
                  w-11
                  h-11
                  rounded-full
                  bg-axio-red/[0.08]
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <Zap
                  className="
                    w-5
                    h-5
                    text-axio-red
                  "
                />

              </div>

              <div>

                <div
                  className="
                    text-sm
                    sm:text-base
                    font-display
                    font-bold
                    text-white
                    mb-1
                  "
                >
                  READY TO EXECUTE APPROVED DECISIONS?
                </div>

                <div
                  className="
                    text-xs
                    sm:text-sm
                    text-axio-text-secondary
                    font-sans
                  "
                >
                  Explore the Autonomous Action Center with
                  human-in-the-loop authorization.
                </div>

              </div>

            </div>


            {/* CTA */}

            <button
              onClick={onOpenActions}
              className="
                group
                shrink-0
                flex
                items-center
                gap-3
                px-6
                py-3.5
                bg-axio-red
                hover:bg-red-600
                text-white
                font-mono
                text-xs
                font-bold
                rounded-md
                shadow-[0_0_25px_rgba(255,48,70,0.16)]
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >

              <span>
                GO TO ACTION CENTER
              </span>

              <ArrowRight
                className="
                  w-4
                  h-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </button>

          </div>

        </div>


        {/* ========================================================
            FOOTER SIGNAL
        ======================================================== */}

        <div
          className={`
            flex
            items-center
            justify-center
            gap-3
            mt-10

            transition-all
            duration-1000
            delay-[1000ms]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
            }
          `}
        >

          <span
            className="
              w-1.5
              h-1.5
              rounded-full
              bg-axio-red
              shadow-[0_0_8px_rgba(255,48,70,0.6)]
            "
          />

          <span
            className="
              font-mono
              text-[9px]
              sm:text-[10px]
              text-axio-muted
              uppercase
              tracking-[0.18em]
            "
          >
            DETECT → EXPLAIN → RECOMMEND → EXECUTE
          </span>

        </div>

      </div>

    </section>
  );
};