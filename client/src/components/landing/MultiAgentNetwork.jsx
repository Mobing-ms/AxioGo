import React, { useEffect, useRef, useState } from 'react';
import { AXIS_AGENTS } from '../../services/axisService';
import {
  Cpu,
  BookOpen,
  Code,
  BarChart3,
  FileText,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const MultiAgentNetwork = () => {
  const [activeWorkflow, setActiveWorkflow] =
    useState('MAINTENANCE');

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /* ================================================================
     ICON MAPPING
  ================================================================= */

  const agentIcons = {
    agent_coord: Cpu,
    agent_know: BookOpen,
    agent_code: Code,
    agent_analytic: BarChart3,
    agent_report: FileText,
    agent_flow: Zap
  };

  /* ================================================================
     WORKFLOW ACTIVATION
  ================================================================= */

  const workflowActivationMap = {
    MAINTENANCE: [
      'agent_coord',
      'agent_know',
      'agent_code',
      'agent_analytic'
    ],

    REPORT: [
      'agent_coord',
      'agent_know',
      'agent_code',
      'agent_analytic',
      'agent_report'
    ],

    WORKFLOW: [
      'agent_coord',
      'agent_analytic',
      'agent_flow'
    ]
  };

  const currentActiveSet =
    workflowActivationMap[activeWorkflow] ||
    workflowActivationMap.MAINTENANCE;


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


  /* ================================================================
     RENDER
  ================================================================= */

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

      {/* Red central atmosphere */}

      <div
        className="
          absolute
          top-[25%]
          left-1/2
          -translate-x-1/2
          w-[750px]
          h-[450px]
          rounded-full
          bg-axio-red/[0.025]
          blur-[160px]
          pointer-events-none
        "
      />

      {/* Very subtle cyan atmosphere */}

      <div
        className="
          absolute
          bottom-[15%]
          left-[5%]
          w-[300px]
          h-[250px]
          rounded-full
          bg-axio-cyan/[0.012]
          blur-[130px]
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

            <Sparkles
              className="
                w-3.5
                h-3.5
              "
            />

            04 · PURPOSEFUL MULTI-AGENT INTELLIGENCE

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

            EXACTLY SIX

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
              SPECIALIZED AGENTS.
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
            One unified AXIS intelligence orchestrating six
            purpose-built agents.
          </p>

        </div>


        {/* ========================================================
            WORKFLOW SWITCHER
        ======================================================== */}

        <div
          className={`
            mt-16
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-5

            transition-all
            duration-[1000ms]
            delay-200

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          <span
            className="
              font-mono
              text-[9px]
              sm:text-[10px]
              uppercase
              tracking-[0.16em]
              text-axio-muted
              font-semibold
            "
          >
            SIMULATE WORKFLOW
          </span>


          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-5
              font-mono
              text-[10px]
              sm:text-xs
            "
          >

            {/* Maintenance */}

            <button
              onClick={() =>
                setActiveWorkflow('MAINTENANCE')
              }
              className={`
                relative
                py-2
                transition-all
                duration-300

                ${activeWorkflow === 'MAINTENANCE'
                  ? 'text-white'
                  : 'text-axio-text-secondary hover:text-white'
                }
              `}
            >

              Maintenance Analysis

              {activeWorkflow === 'MAINTENANCE' && (
                <span
                  className="
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-px
                    bg-axio-red
                    shadow-[0_0_8px_rgba(255,48,70,0.6)]
                  "
                />
              )}

            </button>


            {/* Report */}

            <button
              onClick={() =>
                setActiveWorkflow('REPORT')
              }
              className={`
                relative
                py-2
                transition-all
                duration-300

                ${activeWorkflow === 'REPORT'
                  ? 'text-white'
                  : 'text-axio-text-secondary hover:text-white'
                }
              `}
            >

              Report Synthesis

              {activeWorkflow === 'REPORT' && (
                <span
                  className="
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-px
                    bg-axio-red
                    shadow-[0_0_8px_rgba(255,48,70,0.6)]
                  "
                />
              )}

            </button>


            {/* Workflow */}

            <button
              onClick={() =>
                setActiveWorkflow('WORKFLOW')
              }
              className={`
                relative
                py-2
                transition-all
                duration-300

                ${activeWorkflow === 'WORKFLOW'
                  ? 'text-white'
                  : 'text-axio-text-secondary hover:text-white'
                }
              `}
            >

              Controlled Action

              {activeWorkflow === 'WORKFLOW' && (
                <span
                  className="
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-px
                    bg-axio-red
                    shadow-[0_0_8px_rgba(255,48,70,0.6)]
                  "
                />
              )}

            </button>

          </div>

        </div>


        {/* ========================================================
            AGENT NETWORK
        ======================================================== */}

        <div
          className={`
            relative
            mt-20

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

          {/* Architecture label */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
              px-1
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
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
                  font-mono
                  text-[9px]
                  sm:text-[10px]
                  text-axio-muted
                  uppercase
                  tracking-[0.15em]
                "
              >
                ORCHESTRATION ARCHITECTURE
              </span>

            </div>


            <span
              className="
                hidden
                sm:block
                font-mono
                text-[9px]
                text-axio-border
                uppercase
                tracking-wider
              "
            >
              COORDINATOR TOPOLOGY
            </span>

          </div>


          {/* ======================================================
              AGENT GRID
          ====================================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-x-12
              gap-y-2
            "
          >

            {AXIS_AGENTS.map(
              (agent, index) => {

                const IconComp =
                  agentIcons[agent.id] || Cpu;

                const isActive =
                  currentActiveSet.includes(
                    agent.id
                  );

                return (
                  <div
                    key={agent.id}
                    className={`
                      group
                      relative
                      min-h-[170px]
                      py-7
                      transition-all
                      duration-[700ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]

                      ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                      }

                      ${isActive
                        ? ''
                        : 'opacity-40'
                      }
                    `}
                    style={{
                      transitionDelay:
                        `${350 + index * 90}ms`
                    }}
                  >

                    {/* Top technical line */}

                    <div
                      className={`
                        absolute
                        top-0
                        left-0
                        right-0
                        h-px
                        transition-all
                        duration-500

                        ${isActive
                          ? `
                              bg-gradient-to-r
                              from-axio-red/60
                              via-axio-border
                              to-transparent
                            `
                          : `
                              bg-axio-border/40
                            `
                        }

                        group-hover:from-axio-red/60
                      `}
                    />


                    {/* Agent number */}

                    <div
                      className="
                        absolute
                        top-7
                        right-0
                        font-mono
                        text-[9px]
                        text-axio-border
                        group-hover:text-axio-red/50
                        transition-colors
                      "
                    >
                      0{index + 1}
                    </div>


                    {/* Icon */}

                    <div
                      className={`
                        relative
                        w-11
                        h-11
                        rounded-full
                        flex
                        items-center
                        justify-center
                        mb-5
                        transition-all
                        duration-500

                        ${isActive
                          ? `
                              bg-axio-red/[0.08]
                              text-axio-red
                              shadow-[0_0_25px_rgba(255,48,70,0.08)]
                            `
                          : `
                              bg-white/[0.025]
                              text-axio-muted
                            `
                        }

                        group-hover:scale-110
                        group-hover:-translate-y-1
                      `}
                    >

                      <IconComp
                        className="
                          w-5
                          h-5
                          transition-all
                          duration-300
                        "
                      />

                    </div>


                    {/* Agent name */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-2
                      "
                    >

                      <h3
                        className={`
                          font-display
                          text-sm
                          font-bold
                          transition-colors
                          duration-300

                          ${isActive
                            ? 'text-white'
                            : 'text-axio-text-secondary'
                          }

                          group-hover:text-white
                        `}
                      >
                        {agent.name}
                      </h3>

                      <ArrowRight
                        className={`
                          w-3
                          h-3
                          transition-all
                          duration-300

                          ${isActive
                            ? 'text-axio-red'
                            : 'text-axio-border'
                          }

                          opacity-0
                          -translate-x-1
                          group-hover:opacity-100
                          group-hover:translate-x-0
                        `}
                      />

                    </div>


                    {/* Agent role */}

                    <p
                      className="
                        max-w-[260px]
                        text-[11px]
                        sm:text-xs
                        text-axio-text-secondary
                        font-sans
                        leading-relaxed
                      "
                    >
                      {agent.role}
                    </p>


                    {/* Active state */}

                    <div
                      className={`
                        flex
                        items-center
                        gap-2
                        mt-5
                        font-mono
                        text-[9px]
                        tracking-[0.12em]
                        uppercase

                        ${isActive
                          ? 'text-axio-red'
                          : 'text-axio-muted'
                        }
                      `}
                    >

                      <span
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full

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

                      {isActive
                        ? 'ACTIVE'
                        : 'IDLE'}

                    </div>


                    {/* Bottom active signal */}

                    <div
                      className={`
                        absolute
                        bottom-0
                        left-0
                        h-px
                        bg-axio-red
                        shadow-[0_0_8px_rgba(255,48,70,0.5)]
                        transition-all
                        duration-500

                        ${isActive
                          ? 'w-10'
                          : 'w-0'
                        }

                        group-hover:w-12
                      `}
                    />

                  </div>
                );
              }
            )}

          </div>


          {/* ======================================================
              AGENT CONSTRAINT
          ====================================================== */}

          <div
            className="
              relative
              mt-12
              pt-7
              text-center
            "
          >

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                mb-3
              "
            >

              <span
                className="
                  w-6
                  h-px
                  bg-axio-red/40
                "
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  text-axio-red
                  uppercase
                  tracking-[0.16em]
                  font-bold
                "
              >
                STRICT AGENT CONSTRAINT
              </span>

              <span
                className="
                  w-6
                  h-px
                  bg-axio-red/40
                "
              />

            </div>

            <p
              className="
                max-w-3xl
                mx-auto
                text-[11px]
                sm:text-xs
                text-axio-muted
                font-sans
                leading-relaxed
              "
            >
              Exactly six agents handle routing, RAG metadata,
              SQL generation, analytical reasoning, report
              generation, and workflow execution.
            </p>

          </div>

        </div>


        {/* ========================================================
            BOTTOM ARCHITECTURE SIGNAL
        ======================================================== */}

        <div
          className={`
            flex
            items-center
            justify-center
            gap-3
            mt-14

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
            ONE AXIS · SIX SPECIALISTS · PURPOSEFUL EXECUTION
          </span>

        </div>

      </div>

    </section>
  );
};