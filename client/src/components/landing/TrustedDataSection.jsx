import React, { useEffect, useRef, useState } from 'react';
import {
  Database,
  CheckCircle2,
  ArrowRight,
  Server,
  Cpu,
  ShieldCheck,
  Layers,
  Activity
} from 'lucide-react';

export const TrustedDataSection = () => {
  const [activeStage, setActiveStage] = useState('GOLD');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const pipelineStages = [
    {
      id: 'DATASET',
      label: 'RAW INGESTION',
      sub: 'Parquet / CSV / Streams',
      status: 'Complete',
      accent: 'green',
      description:
        'Enterprise automotive IoT telemetry, SAP work orders, and fuel card logs.'
    },
    {
      id: 'BRONZE',
      label: 'INTAKE / BRONZE',
      sub: 'Databricks Volume Intake',
      status: 'Complete',
      accent: 'green',
      description:
        'Raw immutable data lakehouse tables stored securely inside enterprise cloud.'
    },
    {
      id: 'SILVER',
      label: 'FORGE / SILVER',
      sub: 'Standardized Delta Lake',
      status: 'Processing',
      accent: 'red',
      description:
        'Schema enforcement, null handling, unit normalization, and deduplication.'
    },
    {
      id: 'GOLD',
      label: 'INSIGHT / GOLD',
      sub: 'Business Aggregates',
      status: 'Complete',
      accent: 'cyan',
      description:
        'Trusted analytics-ready tables for vehicle telemetry, maintenance, and claims.'
    },
    {
      id: 'CATALOG',
      label: 'DATA CATALOG',
      sub: 'Unity Catalog Sync',
      status: 'Complete',
      accent: 'green',
      description:
        'AxioGo metadata indexing, freshness tracking, and security labeling.'
    },
    {
      id: 'ANALYTICS',
      label: 'AXIOGO INTELLIGENCE',
      sub: 'AXIS & Decision Engine',
      status: 'Active',
      accent: 'red',
      description:
        'Natural language reasoning over trusted business context and analytics.'
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
        threshold: 0.08,
        rootMargin: '0px 0px -90px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const selectedStage = pipelineStages.find(
    stage => stage.id === activeStage
  );

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

      {/* Main red atmosphere */}

      <div
        className="
          absolute
          top-[15%]
          left-1/2
          -translate-x-1/2
          w-[750px]
          h-[420px]
          rounded-full
          bg-axio-red/[0.025]
          blur-[160px]
          pointer-events-none
        "
      />

      {/* Subtle cyan atmosphere */}

      <div
        className="
          absolute
          bottom-[15%]
          right-[-5%]
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

          <span className="w-8 h-px bg-axio-red" />

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

            <Database className="w-3.5 h-3.5" />

            01 · DATA ENGINEERING LAYER

          </div>

          <span className="w-8 h-px bg-axio-red" />

        </div>


        {/* ========================================================
            HEADLINE
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

            TRUSTED

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
              DATA.
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
              leading-relaxed
              font-sans
            "
          >
            AxioGo sits{' '}
            <span
              className="
                text-white
                font-semibold
                underline
                decoration-axio-red
                decoration-2
                underline-offset-4
              "
            >
              ABOVE
            </span>{' '}
            the existing enterprise Databricks Lakehouse foundation —
            honoring enterprise security without duplicating raw storage.
          </p>

        </div>


        {/* ========================================================
            ARCHITECTURE FLOW
        ======================================================== */}

        <div
          className={`
            relative
            mt-20

            transition-all
            duration-[1200ms]
            delay-200
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-14'
            }
          `}
        >

          {/* Architecture label */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-10
            "
          >

            <Activity
              className="
                w-3.5
                h-3.5
                text-axio-red
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
              ARCHITECTURE BOUNDARY
            </span>

          </div>


          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[1fr_auto_1fr]
              gap-10
              lg:gap-12
              items-center
            "
          >

            {/* ====================================================
                DATABRICKS
            ==================================================== */}

            <div
              className="
                relative
                py-8
                group
              "
            >

              {/* Top line */}

              <div
                className="
                  absolute
                  top-0
                  left-0
                  right-0
                  h-px
                  bg-gradient-to-r
                  from-axio-border
                  via-axio-border
                  to-transparent
                  group-hover:from-axio-cyan/50
                  transition-all
                  duration-500
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-5
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-white/[0.025]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-500
                    group-hover:bg-axio-cyan/[0.06]
                    group-hover:scale-110
                  "
                >

                  <Server
                    className="
                      w-5
                      h-5
                      text-axio-cyan
                      opacity-70
                      group-hover:opacity-100
                    "
                  />

                </div>

                <div>

                  <div
                    className="
                      font-mono
                      text-[9px]
                      text-axio-muted
                      uppercase
                      tracking-[0.14em]
                      mb-1
                    "
                  >
                    EXISTING FOUNDATION
                  </div>

                  <h3
                    className="
                      font-display
                      text-base
                      sm:text-lg
                      font-bold
                      text-white
                    "
                  >
                    EXISTING DATABRICKS FOUNDATION
                  </h3>

                </div>

              </div>


              <p
                className="
                  text-xs
                  sm:text-sm
                  text-axio-text-secondary
                  leading-relaxed
                  font-sans
                  max-w-xl
                  mb-6
                "
              >
                Remains the data-engineering platform. Handles ETL,
                Delta Lake, Unity Catalog, and raw Spark compute.
              </p>


              <div
                className="
                  space-y-3
                  font-mono
                  text-[10px]
                  sm:text-xs
                  text-axio-text-sub
                "
              >

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="
                      w-3.5
                      h-3.5
                      text-emerald-400
                      shrink-0
                    "
                  />
                  Bronze / Silver / Gold Lakehouse Storage
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="
                      w-3.5
                      h-3.5
                      text-emerald-400
                      shrink-0
                    "
                  />
                  Spark Jobs & Scheduled Pipelines
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="
                      w-3.5
                      h-3.5
                      text-emerald-400
                      shrink-0
                    "
                  />
                  Enterprise Governance & Encryption
                </div>

              </div>

            </div>


            {/* ====================================================
                SECURE CONNECTOR
            ==================================================== */}

            <div
              className="
                flex
                lg:flex-col
                items-center
                justify-center
                gap-4
              "
            >

              <div
                className="
                  relative
                  w-12
                  h-12
                  rounded-full
                  bg-axio-red/[0.07]
                  flex
                  items-center
                  justify-center
                "
              >

                <span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-axio-red/20
                    animate-pulse
                  "
                />

                <ArrowRight
                  className="
                    w-5
                    h-5
                    text-axio-red
                    rotate-90
                    lg:rotate-0
                  "
                />

              </div>

              <span
                className="
                  font-mono
                  text-[9px]
                  text-axio-muted
                  uppercase
                  tracking-[0.16em]
                "
              >
                SECURE CONNECTOR
              </span>

            </div>


            {/* ====================================================
                AXIOGO
            ==================================================== */}

            <div
              className="
                relative
                py-8
                group
              "
            >

              <div
                className="
                  absolute
                  top-0
                  left-0
                  right-0
                  h-px
                  bg-gradient-to-r
                  from-axio-red
                  via-axio-border
                  to-transparent
                  group-hover:via-axio-red
                  transition-all
                  duration-500
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-5
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-axio-red/[0.07]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-500
                    group-hover:bg-axio-red/[0.12]
                    group-hover:scale-110
                    group-hover:shadow-[0_0_25px_rgba(255,48,70,0.12)]
                  "
                >

                  <Cpu
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
                      font-mono
                      text-[9px]
                      text-axio-red
                      uppercase
                      tracking-[0.14em]
                      mb-1
                    "
                  >
                    DECISION LAYER
                  </div>

                  <h3
                    className="
                      font-display
                      text-base
                      sm:text-lg
                      font-bold
                      text-white
                    "
                  >
                    AXIOGO DECISION LAYER
                  </h3>

                </div>

              </div>


              <p
                className="
                  text-xs
                  sm:text-sm
                  text-axio-text-secondary
                  leading-relaxed
                  font-sans
                  max-w-xl
                  mb-6
                "
              >
                Adds business context, AXIS multi-agent intelligence,
                conversational query, and controlled autonomous actions.
              </p>


              <div
                className="
                  space-y-3
                  font-mono
                  text-[10px]
                  sm:text-xs
                  text-axio-text-sub
                "
              >

                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="
                      w-3.5
                      h-3.5
                      text-axio-red
                      shrink-0
                    "
                  />
                  AXIS Multi-Agent Reasoning
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="
                      w-3.5
                      h-3.5
                      text-axio-red
                      shrink-0
                    "
                  />
                  Business Context & RAG Index
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="
                      w-3.5
                      h-3.5
                      text-axio-red
                      shrink-0
                    "
                  />
                  Controlled Autonomous Execution
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================================
            PIPELINE
        ======================================================== */}

        <div
          className={`
            relative
            mt-28

            transition-all
            duration-[1200ms]
            delay-300
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-14'
            }
          `}
        >

          {/* Pipeline header */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-12
            "
          >

            <span
              className="
                w-8
                h-px
                bg-axio-border
              "
            />

            <h3
              className="
                font-mono
                text-[9px]
                sm:text-[10px]
                font-bold
                text-axio-muted
                uppercase
                tracking-[0.18em]
              "
            >
              LIVE PIPELINE PROGRESSION
            </h3>

            <span
              className="
                w-8
                h-px
                bg-axio-border
              "
            />

          </div>


          {/* ======================================================
              PIPELINE NODES
          ====================================================== */}

          <div
            className="
              relative
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-6
              gap-x-6
              gap-y-8
            "
          >

            {/* Connecting line */}

            <div
              className="
                hidden
                lg:block
                absolute
                top-[13px]
                left-[8%]
                right-[8%]
                h-px
                bg-gradient-to-r
                from-axio-border
                via-axio-red/40
                to-axio-border
                pointer-events-none
              "
            />

            {pipelineStages.map(
              (stage, index) => {

                const isSelected =
                  activeStage === stage.id;

                const isRed =
                  stage.accent === 'red';

                const isCyan =
                  stage.accent === 'cyan';

                const isGreen =
                  stage.accent === 'green';

                return (
                  <button
                    key={stage.id}
                    onClick={() =>
                      setActiveStage(stage.id)
                    }
                    className={`
                      group
                      relative
                      text-left
                      focus:outline-none

                      transition-all
                      duration-[700ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]

                      ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                      }
                    `}
                    style={{
                      transitionDelay:
                        `${400 + index * 90}ms`
                    }}
                  >

                    {/* Node */}

                    <div
                      className="
                        relative
                        z-10
                        w-7
                        h-7
                        mb-5
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <div
                        className={`
                          w-2.5
                          h-2.5
                          rounded-full
                          transition-all
                          duration-500

                          ${isSelected
                            ? `
                                bg-axio-red
                                shadow-[0_0_14px_rgba(255,48,70,0.7)]
                                scale-125
                              `
                            : isRed
                              ? `
                                  bg-axio-red/60
                                `
                              : isCyan
                                ? `
                                    bg-axio-cyan/50
                                  `
                                : `
                                    bg-emerald-400/50
                                  `
                          }
                        `}
                      />

                    </div>


                    {/* Stage label */}

                    <div
                      className={`
                        font-mono
                        text-[10px]
                        sm:text-xs
                        font-bold
                        tracking-[0.08em]
                        mb-2
                        transition-colors
                        duration-300

                        ${isSelected
                          ? 'text-white'
                          : 'text-axio-text-secondary group-hover:text-white'
                        }
                      `}
                    >
                      {stage.label}
                    </div>


                    {/* Sub */}

                    <div
                      className="
                        text-[9px]
                        sm:text-[10px]
                        text-axio-muted
                        font-mono
                        truncate
                        mb-3
                      "
                    >
                      {stage.sub}
                    </div>


                    {/* Status */}

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        font-mono
                        text-[8px]
                        uppercase
                        tracking-[0.1em]

                        ${isSelected
                          ? 'text-axio-red'
                          : isGreen
                            ? 'text-emerald-400/60'
                            : isCyan
                              ? 'text-axio-cyan/60'
                              : 'text-axio-muted'
                        }
                      `}
                    >

                      <span
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full

                          ${stage.status === 'Active'
                            ? 'bg-axio-red animate-pulse'
                            : stage.status === 'Processing'
                              ? 'bg-axio-red animate-pulse'
                              : isGreen
                                ? 'bg-emerald-400'
                                : isCyan
                                  ? 'bg-axio-cyan'
                                  : 'bg-axio-muted'
                          }
                        `}
                      />

                      {stage.status}

                    </div>


                    {/* Active underline */}

                    <div
                      className={`
                        absolute
                        bottom-[-8px]
                        left-0
                        h-px
                        bg-axio-red
                        shadow-[0_0_8px_rgba(255,48,70,0.5)]
                        transition-all
                        duration-500

                        ${isSelected
                          ? 'w-8'
                          : 'w-0 group-hover:w-5'
                        }
                      `}
                    />

                  </button>
                );
              }
            )}

          </div>


          {/* ======================================================
              SELECTED STAGE
          ====================================================== */}

          {selectedStage && (
            <div
              className="
                relative
                mt-12
                py-6
                px-1
                animate-[fadeIn_400ms_ease-out]
              "
            >

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    shrink-0
                  "
                >

                  <span
                    className="
                      w-1.5
                      h-1.5
                      rounded-full
                      bg-axio-red
                      shadow-[0_0_8px_rgba(255,48,70,0.7)]
                    "
                  />

                  <span
                    className="
                      font-mono
                      text-[9px]
                      text-axio-red
                      uppercase
                      tracking-[0.14em]
                      font-bold
                    "
                  >
                    STAGE DETAILS · {activeStage}
                  </span>

                </div>

                <span
                  className="
                    hidden
                    sm:block
                    text-axio-border
                  "
                >
                  /
                </span>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    text-axio-text-secondary
                    font-sans
                    leading-relaxed
                  "
                >
                  {selectedStage.description}
                </p>

              </div>

            </div>
          )}

        </div>


        {/* ========================================================
            FINAL SIGNAL
        ======================================================== */}

        <div
          className={`
            flex
            items-center
            justify-center
            gap-3
            mt-12

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
            TRUSTED DATA → BUSINESS CONTEXT → AXIS INTELLIGENCE
          </span>

        </div>

      </div>

    </section>
  );
};