import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  FileText,
  Layers,
  Target,
  Shield,
  Check,
  Database,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const BusinessContextSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const contextConcepts = [
    {
      label: 'KPI DEFINITION',
      value: 'Fleet Maintenance Cost per Mile',
      detail: '$0.42 / mile',
      icon: Target,
      color: 'text-axio-red'
    },
    {
      label: 'BUSINESS RULE',
      value: 'Coolant temperature threshold',
      detail: '> 105°C → Shop Recall',
      icon: Shield,
      color: 'text-axio-red'
    },
    {
      label: 'OWNER',
      value: 'Asset Management',
      detail: '& Logistics Team',
      icon: Layers,
      color: 'text-white'
    },
    {
      label: 'FRESHNESS SLA',
      value: 'Real-time telemetry',
      detail: '5s synchronization',
      icon: Database,
      color: 'text-axio-cyan'
    },
    {
      label: 'SOP POLICY',
      value: 'Vehicle Group A',
      detail: 'Warranty Claim Protocol',
      icon: FileText,
      color: 'text-white'
    }
  ];

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
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
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
          opacity-[0.12]
          pointer-events-none
        "
      />

      {/* Red atmospheric glow */}

      <div
        className="
          absolute
          top-[18%]
          left-[8%]
          w-[500px]
          h-[350px]
          rounded-full
          bg-axio-red/[0.035]
          blur-[150px]
          pointer-events-none
        "
      />

      {/* Subtle cyan counter-glow */}

      <div
        className="
          absolute
          bottom-[20%]
          right-[5%]
          w-[400px]
          h-[300px]
          rounded-full
          bg-axio-cyan/[0.025]
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

          <div
            className="
              w-8
              h-px
              bg-axio-red
            "
          />

          <span
            className="
              font-mono
              text-[10px]
              sm:text-xs
              tracking-[0.22em]
              text-axio-red
              uppercase
              font-semibold
            "
          >
            02 · BUSINESS CONTEXT
          </span>

        </div>


        {/* ========================================================
            HERO TYPOGRAPHY
        ======================================================== */}

        <div
          className={`
            max-w-4xl

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
            DATA ISN'T ENOUGH.

            <br />

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
              CONTEXT GIVES IT MEANING.
            </span>
          </h2>

          <p
            className="
              mt-7
              max-w-2xl
              text-base
              sm:text-lg
              text-axio-text-secondary
              leading-relaxed
              font-sans
            "
          >
            AXIS understands what enterprise data{' '}
            <span
              className="
                text-white
                font-semibold
              "
            >
              means
            </span>{' '}
            to the business — not simply what a database column is
            called.
          </p>

        </div>


        {/* ========================================================
            MAIN INTELLIGENCE VISUAL
        ======================================================== */}

        <div className="relative mt-20">

          {/* ======================================================
              LEFT → RAW DATA
          ====================================================== */}

          <div
            className={`
              absolute
              hidden
              lg:block
              -left-16
              top-10
              w-[280px]

              transition-all
              duration-[1200ms]
              delay-200
              ease-[cubic-bezier(0.16,1,0.3,1)]

              ${isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
              }
            `}
          >

            <div
              className="
                text-[10px]
                font-mono
                tracking-[0.18em]
                uppercase
                text-axio-muted
                mb-5
              "
            >
              RAW ENTERPRISE DATA
            </div>

            <div
              className="
                font-mono
                text-xs
                text-axio-text-sub
                space-y-3
              "
            >

              <div>
                <span className="text-axio-muted">
                  table.
                </span>
                vehicle_maintenance
              </div>

              <div>
                <span className="text-axio-muted">
                  column.
                </span>
                m_cost
              </div>

              <div>
                <span className="text-axio-muted">
                  category.
                </span>
                4
              </div>

              <div>
                <span className="text-axio-muted">
                  telemetry.
                </span>
                105.7°C
              </div>

            </div>

          </div>


          {/* ======================================================
              CENTER AXIS CONTEXT
          ====================================================== */}

          <div
            className={`
              relative
              mx-auto
              max-w-3xl

              transition-all
              duration-[1300ms]
              delay-300
              ease-[cubic-bezier(0.16,1,0.3,1)]

              ${isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-16 scale-[0.97]'
              }
            `}
          >

            {/* Ambient ring */}

            <div
              className="
                absolute
                -inset-10
                rounded-full
                bg-axio-red/[0.025]
                blur-[70px]
                pointer-events-none
              "
            />

            {/* Main content */}

            <div
              className="
                relative
                py-12
                sm:py-16
                px-6
                sm:px-12
              "
            >

              {/* AXIS indicator */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  mb-8
                "
              >

                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-axio-red
                    shadow-[0_0_14px_rgba(255,48,70,0.7)]
                    animate-pulse
                  "
                />

                <span
                  className="
                    font-mono
                    text-[10px]
                    tracking-[0.22em]
                    text-axio-red
                    uppercase
                  "
                >
                  AXIS · BUSINESS CONTEXT
                </span>

              </div>


              {/* Question */}

              <div
                className="
                  text-center
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  font-display
                  font-semibold
                  text-white
                  leading-tight
                "
              >
                "Why did maintenance costs
                <br className="hidden sm:block" />
                increase in Vehicle Group A?"
              </div>


              {/* Divider */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-4
                  my-10
                "
              >

                <div
                  className="
                    h-px
                    w-20
                    bg-gradient-to-r
                    from-transparent
                    to-axio-red/40
                  "
                />

                <Sparkles
                  className="
                    w-4
                    h-4
                    text-axio-red
                  "
                />

                <div
                  className="
                    h-px
                    w-20
                    bg-gradient-to-l
                    from-transparent
                    to-axio-red/40
                  "
                />

              </div>


              {/* Contextual interpretation */}

              <div
                className="
                  text-center
                  max-w-2xl
                  mx-auto
                "
              >

                <p
                  className="
                    text-sm
                    sm:text-base
                    text-axio-text-secondary
                    leading-relaxed
                  "
                >
                  AXIS connects the question to approved KPI
                  definitions, operational rules, ownership,
                  freshness requirements, and organizational
                  knowledge before reasoning over the data.
                </p>

              </div>


              {/* Processing indicators */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-6
                  gap-y-3
                  mt-10
                  font-mono
                  text-[9px]
                  sm:text-[10px]
                  uppercase
                  tracking-wider
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-axio-muted
                  "
                >
                  <Check
                    className="
                      w-3
                      h-3
                      text-axio-red
                    "
                  />
                  Business Rules
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-axio-muted
                  "
                >
                  <Check
                    className="
                      w-3
                      h-3
                      text-axio-red
                    "
                  />
                  KPI Definitions
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-axio-muted
                  "
                >
                  <Check
                    className="
                      w-3
                      h-3
                      text-axio-red
                    "
                  />
                  Enterprise Knowledge
                </span>

              </div>

            </div>

          </div>


          {/* ======================================================
              RIGHT → BUSINESS MEANING
          ====================================================== */}

          <div
            className={`
              absolute
              hidden
              lg:block
              -right-10
              top-10
              w-[260px]

              transition-all
              duration-[1200ms]
              delay-300
              ease-[cubic-bezier(0.16,1,0.3,1)]

              ${isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-12'
              }
            `}
          >

            <div
              className="
                text-[10px]
                font-mono
                tracking-[0.18em]
                uppercase
                text-axio-red
                mb-5
              "
            >
              BUSINESS MEANING
            </div>

            <div
              className="
                space-y-4
                text-xs
                text-axio-text-sub
              "
            >

              <div>
                <span className="text-white">
                  Maintenance Cost
                </span>
                <br />
                Approved enterprise KPI
              </div>

              <div>
                <span className="text-white">
                  Vehicle Group A
                </span>
                <br />
                Organizational business domain
              </div>

              <div>
                <span className="text-white">
                  Warranty Protocol
                </span>
                <br />
                Applicable operational policy
              </div>

            </div>

          </div>

        </div>


        {/* ========================================================
            CONTEXT SIGNALS
        ======================================================== */}

        <div
          className={`
            mt-20
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
            gap-x-8
            gap-y-8

            transition-all
            duration-[1200ms]
            delay-500
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
            }
          `}
        >

          {contextConcepts.map(
            (concept, index) => {

              const Icon =
                concept.icon;

              return (
                <div
                  key={concept.label}
                  className="
                    group
                    relative
                    py-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >

                  {/* Top signal line */}

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      w-8
                      h-px
                      bg-axio-border
                      group-hover:bg-axio-red
                      group-hover:w-14
                      transition-all
                      duration-300
                    "
                  />

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-3
                    "
                  >

                    <Icon
                      className={`
                        w-3.5
                        h-3.5
                        ${concept.color}
                      `}
                    />

                    <span
                      className="
                        text-[9px]
                        font-mono
                        tracking-[0.14em]
                        text-axio-muted
                      "
                    >
                      {concept.label}
                    </span>

                  </div>

                  <div
                    className="
                      text-xs
                      text-white
                      font-medium
                      leading-relaxed
                    "
                  >
                    {concept.value}
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-axio-text-sub
                      mt-1
                      font-mono
                    "
                  >
                    {concept.detail}
                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* ========================================================
            BOTTOM MESSAGE
        ======================================================== */}

        <div
          className={`
            mt-20
            pt-8

            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-6

            transition-all
            duration-1000
            delay-700
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          <div
            className="
              flex
              items-center
              gap-3
              text-xs
              text-axio-muted
              font-mono
            "
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

            STRUCTURED DATA

            <ArrowRight
              className="
                w-3.5
                h-3.5
                text-axio-border
              "
            />

            BUSINESS CONTEXT

            <ArrowRight
              className="
                w-3.5
                h-3.5
                text-axio-border
              "
            />

            <span className="text-white">
              INTELLIGENT DECISION
            </span>

          </div>


          <div
            className="
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-axio-muted
              font-mono
            "
          >
            AXIS CONTEXT LAYER · READY
          </div>

        </div>

      </div>

    </section>
  );
};