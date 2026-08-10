import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Zap,
  RefreshCw,
  BarChart2
} from 'lucide-react';

import {
  PREBUILT_QUERIES,
  simulateAxisWorkflow
} from '../../services/axisService';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';


export const AxisDemoSection = ({ onOpenFullAxis }) => {

  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] =
    useState(false);

  const [selectedQuery, setSelectedQuery] =
    useState(
      PREBUILT_QUERIES[0].question
    );

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [activeStep, setActiveStep] =
    useState(null);

  const [completedSteps, setCompletedSteps] =
    useState([]);

  const [activeResponse, setActiveResponse] =
    useState(
      PREBUILT_QUERIES[0].response
    );


  /* ================================================================
     SCROLL REVEAL
  ================================================================= */

  useEffect(() => {
    const element =
      sectionRef.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            observer.unobserve(element);
          }
        },
        {
          threshold: 0.08,
          rootMargin:
            '0px 0px -100px 0px'
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);


  /* ================================================================
     AXIS QUERY
  ================================================================= */

  const handleQueryClick = (
    queryText
  ) => {

    setSelectedQuery(queryText);

    setIsProcessing(true);

    setCompletedSteps([]);

    setActiveStep(
      'Initializing AXIS Multi-Agent Pipeline...'
    );

    simulateAxisWorkflow(
      queryText,

      (step, idx) => {

        setActiveStep(
          step.agent +
          ': ' +
          step.text
        );

        setCompletedSteps(
          prev => [
            ...prev,
            step
          ]
        );
      },

      (response) => {

        setIsProcessing(false);

        setActiveStep(null);

        setActiveResponse(
          response
        );
      }
    );
  };


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
          opacity-[0.10]
          pointer-events-none
        "
      />

      {/* Main red glow */}

      <div
        className="
          absolute
          top-[20%]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[400px]
          bg-axio-red/[0.035]
          rounded-full
          blur-[150px]
          pointer-events-none
        "
      />

      {/* Secondary cyan glow */}

      <div
        className="
          absolute
          bottom-[15%]
          right-[5%]
          w-[350px]
          h-[300px]
          bg-axio-cyan/[0.018]
          rounded-full
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
              uppercase
              text-axio-red
              font-semibold
            "
          >

            <Bot
              className="
                w-3.5
                h-3.5
              "
            />

            03 · AXIS CENTRAL INTELLIGENCE

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

            MEET{' '}

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
              AXIS.
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
            Enterprise decision intelligence through natural
            language. AXIS reasoning is backed by purposeful
            multi-agent coordination.
          </p>

        </div>


        {/* ========================================================
            QUERY SELECTOR
        ======================================================== */}

        <div
          className={`
            mt-16
            transition-all
            duration-[1100ms]
            delay-200
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }
          `}
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-5
              gap-y-3
              font-mono
              text-xs
            "
          >

            <span
              className="
                text-[10px]
                text-axio-muted
                uppercase
                tracking-[0.16em]
                font-semibold
              "
            >
              TRY ASKING
            </span>

            {PREBUILT_QUERIES.map(
              (q) => (

                <button
                  key={q.question}
                  onClick={() =>
                    handleQueryClick(
                      q.question
                    )
                  }
                  disabled={isProcessing}
                  className={`
                    relative
                    px-1
                    py-2
                    transition-all
                    duration-300

                    ${selectedQuery ===
                      q.question
                      ? `
                          text-white
                        `
                      : `
                          text-axio-text-sub
                          hover:text-white
                        `
                    }
                  `}
                >

                  <span>
                    "{q.question}"
                  </span>

                  {selectedQuery ===
                    q.question && (
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

              )
            )}

          </div>

        </div>


        {/* ========================================================
            AXIS WORKSPACE
        ======================================================== */}

        <div
          className={`
            relative
            mt-14

            transition-all
            duration-[1300ms]
            delay-300
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-16 scale-[0.985]'
            }
          `}
        >

          {/* Ambient workspace glow */}

          <div
            className="
              absolute
              -inset-10
              bg-axio-red/[0.018]
              blur-[80px]
              rounded-full
              pointer-events-none
            "
          />


          {/* ======================================================
              WORKSPACE TOP BAR
          ====================================================== */}

          <div
            className="
              relative
              flex
              items-center
              justify-between
              py-4
              px-2
              mb-2
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
                  w-2
                  h-2
                  rounded-full
                  bg-axio-red
                  shadow-[0_0_12px_rgba(255,48,70,0.7)]
                  animate-pulse
                "
              />

              <span
                className="
                  font-mono
                  text-[10px]
                  sm:text-xs
                  text-white
                  tracking-[0.12em]
                  uppercase
                  font-semibold
                "
              >
                AXIS CONVERSATIONAL INTELLIGENCE
              </span>

            </div>


            <div
              className="
                hidden
                sm:flex
                items-center
                gap-2
                text-[10px]
                font-mono
                text-axio-muted
                uppercase
                tracking-wider
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-axio-cyan
                  opacity-60
                "
              />

              STATEFUL MEMORY ACTIVE

            </div>

          </div>


          {/* ======================================================
              USER QUESTION
          ====================================================== */}

          <div
            className="
              relative
              py-8
              px-2
              sm:px-6
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              {/* User marker */}

              <div
                className="
                  shrink-0
                  w-8
                  h-8
                  rounded-full
                  bg-white/[0.035]
                  flex
                  items-center
                  justify-center
                  font-mono
                  text-[9px]
                  text-axio-muted
                  tracking-wider
                "
              >
                YOU
              </div>


              <div
                className="
                  pt-1
                  text-sm
                  sm:text-base
                  text-white
                  font-sans
                  leading-relaxed
                "
              >
                "{selectedQuery}"
              </div>

            </div>


            {/* ====================================================
                PROCESSING
            ==================================================== */}

            {isProcessing && (

              <div
                className="
                  mt-10
                  ml-12
                  space-y-3
                  font-mono
                  text-[10px]
                  sm:text-xs
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-axio-red
                    font-semibold
                  "
                >

                  <RefreshCw
                    className="
                      w-3.5
                      h-3.5
                      animate-spin
                    "
                  />

                  AXIS EXECUTION PIPELINE

                </div>


                {completedSteps.map(
                  (step, i) => (

                    <div
                      key={i}
                      className="
                        flex
                        items-center
                        gap-2
                        text-axio-text-sub
                        animate-[fadeIn_400ms_ease-out]
                      "
                    >

                      <CheckCircle2
                        className="
                          w-3.5
                          h-3.5
                          text-axio-red
                        "
                      />

                      <span>
                        {step.agent}
                        : {step.text}
                      </span>

                    </div>

                  )
                )}


                {activeStep && (

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-white
                      font-medium
                      animate-pulse
                    "
                  >

                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-axio-red
                      "
                    />

                    {activeStep}

                  </div>

                )}

              </div>

            )}


            {/* ====================================================
                AXIS RESPONSE
            ==================================================== */}

            {!isProcessing &&
              activeResponse && (

                <div
                  className="
                    mt-10
                    ml-0
                    sm:ml-12
                    relative
                  "
                >

                  {/* AXIS marker */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mb-5
                    "
                  >

                    <div
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-axio-red/[0.08]
                        flex
                        items-center
                        justify-center
                        text-axio-red
                        font-mono
                        text-[9px]
                        font-bold
                      "
                    >
                      AXIS
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        text-axio-red
                        font-mono
                        uppercase
                        tracking-[0.15em]
                      "
                    >

                      <Sparkles
                        className="
                          w-3
                          h-3
                        "
                      />

                      Intelligence Response

                    </div>

                  </div>


                  {/* Response */}

                  <div
                    className="
                      space-y-8
                    "
                  >

                    {/* Headline */}

                    <div>

                      <h4
                        className="
                          text-lg
                          sm:text-2xl
                          font-display
                          font-bold
                          text-white
                          mb-3
                        "
                      >
                        {activeResponse.headline}
                      </h4>

                      <p
                        className="
                          max-w-3xl
                          text-sm
                          text-axio-text-secondary
                          leading-relaxed
                          font-sans
                        "
                      >
                        {activeResponse.summary}
                      </p>

                    </div>


                    {/* ==================================================
                        CHART
                    ================================================== */}

                    {activeResponse.chartData && (

                      <div
                        className="
                          relative
                          py-6
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mb-5
                          "
                        >

                          <span
                            className="
                              text-[9px]
                              sm:text-[10px]
                              text-axio-muted
                              uppercase
                              tracking-[0.14em]
                              font-mono
                            "
                          >
                            MAINTENANCE EXPENDITURE
                            · VEHICLE GROUP A
                          </span>

                          <BarChart2
                            className="
                              w-4
                              h-4
                              text-axio-red
                            "
                          />

                        </div>


                        <div
                          className="
                            h-48
                            w-full
                          "
                        >

                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >

                            <AreaChart
                              data={
                                activeResponse.chartData
                              }
                            >

                              <defs>

                                <linearGradient
                                  id="gradGroupA"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >

                                  <stop
                                    offset="5%"
                                    stopColor="#FF3046"
                                    stopOpacity={0.22}
                                  />

                                  <stop
                                    offset="95%"
                                    stopColor="#FF3046"
                                    stopOpacity={0}
                                  />

                                </linearGradient>

                              </defs>


                              <XAxis
                                dataKey="period"
                                stroke="#5F6873"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />

                              <YAxis
                                stroke="#5F6873"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />

                              <Tooltip
                                contentStyle={{
                                  backgroundColor:
                                    '#090C11',
                                  border:
                                    'none',
                                  borderRadius:
                                    '8px',
                                  fontSize:
                                    '11px',
                                  color:
                                    '#ffffff'
                                }}
                              />

                              <Area
                                type="monotone"
                                dataKey="GroupA"
                                stroke="#FF3046"
                                fillOpacity={1}
                                fill="url(#gradGroupA)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                  r: 4,
                                  fill: '#FF3046'
                                }}
                              />

                            </AreaChart>

                          </ResponsiveContainer>

                        </div>

                      </div>

                    )}


                    {/* ==================================================
                        RECOMMENDATIONS
                    ================================================== */}

                    {activeResponse.recommendations && (

                      <div
                        className="
                          relative
                          py-5
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            mb-4
                          "
                        >

                          <span
                            className="
                              w-1.5
                              h-1.5
                              rounded-full
                              bg-axio-red
                            "
                          />

                          <span
                            className="
                              text-[10px]
                              text-axio-red
                              font-bold
                              uppercase
                              tracking-[0.15em]
                              font-mono
                            "
                          >
                            AXIS ACTIONABLE RECOMMENDATION
                          </span>

                        </div>


                        <ul
                          className="
                            space-y-3
                            text-xs
                            sm:text-sm
                            text-axio-text-secondary
                            font-sans
                          "
                        >

                          {activeResponse.recommendations.map(
                            (rec, i) => (

                              <li
                                key={i}
                                className="
                                  flex
                                  items-start
                                  gap-3
                                "
                              >

                                <span
                                  className="
                                    text-axio-red
                                    mt-1
                                  "
                                >
                                  /
                                </span>

                                <span>
                                  {rec}
                                </span>

                              </li>

                            )
                          )}

                        </ul>

                      </div>

                    )}


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-5
                        pt-3
                      "
                    >

                      <button
                        onClick={
                          onOpenFullAxis
                        }
                        className="
                          group
                          flex
                          items-center
                          gap-2
                          text-xs
                          font-mono
                          font-semibold
                          text-white
                          transition-all
                          duration-300
                          hover:text-axio-red
                        "
                      >

                        <FileText
                          className="
                            w-4
                            h-4
                            text-axio-red
                          "
                        />

                        CREATE REPORT

                        <ArrowRight
                          className="
                            w-3.5
                            h-3.5
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />

                      </button>


                      {activeResponse.actionAvailable && (

                        <button
                          onClick={
                            onOpenFullAxis
                          }
                          className="
                            group
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-mono
                            font-semibold
                            text-axio-text-sub
                            hover:text-white
                            transition-colors
                          "
                        >

                          <Zap
                            className="
                              w-4
                              h-4
                              text-axio-cyan
                              opacity-70
                            "
                          />

                          {
                            activeResponse
                              .actionAvailable
                              .title
                          }

                          <ArrowRight
                            className="
                              w-3.5
                              h-3.5
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          />

                        </button>

                      )}

                    </div>

                  </div>

                </div>

              )}

          </div>


          {/* ======================================================
              INPUT BAR
          ====================================================== */}

          <div
            className="
              relative
              mt-6
              flex
              items-center
              gap-4
              py-4
              px-2
            "
          >

            <div
              className="
                flex-1
                relative
              "
            >

              <input
                type="text"
                readOnly
                value={selectedQuery}
                className="
                  w-full
                  bg-transparent
                  border-0
                  border-b
                  border-axio-border/60
                  px-1
                  py-3
                  text-xs
                  sm:text-sm
                  text-white
                  font-sans
                  focus:outline-none
                  focus:border-axio-red
                  transition-colors
                "
              />

            </div>


            <button
              onClick={
                onOpenFullAxis
              }
              className="
                group
                flex
                items-center
                gap-2
                shrink-0
                px-5
                py-3
                bg-axio-red
                hover:bg-red-600
                text-white
                font-mono
                text-xs
                font-bold
                rounded-md
                shadow-[0_0_25px_rgba(255,48,70,0.18)]
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >

              <span>
                OPEN AXIS
              </span>

              <ArrowRight
                className="
                  w-3.5
                  h-3.5
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </button>

          </div>

        </div>


        {/* ========================================================
            BOTTOM SIGNAL
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
            delay-500

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
            AXIS · CONTEXT AWARE · STATEFUL · MULTI-AGENT
          </span>

        </div>

      </div>

    </section>
  );
};