import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';

import {
  PREBUILT_QUERIES,
  simulateAxisWorkflow,
  sendLiveAxisQuery,
} from '../../services/axisService';

import {
  Bot,
  Send,
  Mic,
  Sparkles,
  RefreshCw,
  Database,
  Layers,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';


export const AxisWorkspace = ({
  onOpenVoiceModal,
  onOpenReports,
  onOpenActions,
}) => {

  const { currentRole } = useAuth();

  const {
    selectedDataset,
    activeWorkspace,
    activeFilters,
  } = useWorkspace();


  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'AXIS',
      text: 'Greetings. I am AXIS, your Enterprise AI Decision Intelligence Copilot. How can I assist with your automotive fleet data today?',
      timestamp: '09:00 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepText, setActiveStepText] = useState(null);
  const [activatedAgents, setActivatedAgents] = useState([]);


  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {

    const elements = document.querySelectorAll(
      '.axis-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -45px 0px',
      }
    );


    elements.forEach((element) => {
      observer.observe(element);
    });


    return () => {
      observer.disconnect();
    };

  }, []);


  /* ============================================================
     AXIS QUERY LOGIC
  ============================================================ */

  const handleSendQuery = (queryText) => {

    const q = queryText || inputQuery;

    if (!q.trim()) return;


    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };


    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInputQuery('');
    setIsProcessing(true);

    setActiveStepText(
      'Understanding request & checking permissions...'
    );


    sendLiveAxisQuery(
      q,
      activeWorkspace?.id,
      selectedDataset?.id,

      (step) => {
        setActiveStepText(
          `${step.agent}: ${step.text}`
        );
      },

      (response, agents) => {
        setIsProcessing(false);
        setActiveStepText(null);
        setActivatedAgents(agents);

        const axisMsg = {
          id: `axis_${Date.now()}`,
          sender: 'AXIS',
          headline: response.headline,
          text: response.summary,
          chartData: response.chartData,
          recommendations: response.recommendations,
          actionAvailable: response.actionAvailable,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [
          ...prev,
          axisMsg,
        ]);
      }
    );

  };


  return (
    <>
      {/* ========================================================
          PAGE-SPECIFIC SCROLL REVEAL
      ======================================================== */}

      <style>{`

        .axis-scroll-reveal {

          opacity: 0;

          transform:
            translateY(45px);

          filter:
            blur(7px);

          transition:
            opacity 750ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 750ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 750ms cubic-bezier(0.22, 1, 0.36, 1);

          will-change:
            opacity,
            transform,
            filter;

        }


        .axis-scroll-reveal.is-visible {

          opacity: 1;

          transform:
            translateY(0);

          filter:
            blur(0);

        }


        @media (prefers-reduced-motion: reduce) {

          .axis-scroll-reveal,
          .axis-scroll-reveal.is-visible {

            opacity: 1;

            transform: none;

            filter: none;

            transition: none;

          }

        }

      `}</style>


      <div className="relative min-h-screen overflow-hidden bg-axio-bg">


        {/* ======================================================
            AMBIENT BACKGROUND
        ====================================================== */}

        <div className="fixed inset-0 bg-tech-grid opacity-15 pointer-events-none" />

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-axio-red/7 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed top-[45%] right-[-220px] w-[450px] h-[450px] bg-axio-red/4 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed bottom-[-200px] left-[-160px] w-[400px] h-[400px] bg-axio-cyan/2 rounded-full blur-[150px] pointer-events-none" />


        {/* ======================================================
            MAIN
        ====================================================== */}

        <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">


          {/* ====================================================
              HEADER
          ==================================================== */}

          <section className="axis-scroll-reveal mb-8">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="relative flex items-center justify-center">

                    <span className="absolute w-9 h-9 rounded-full bg-axio-red/10 blur-md" />

                    <Bot className="relative w-5 h-5 text-axio-red" />

                  </span>


                  <span className="text-[10px] font-bold tracking-[0.2em] text-axio-red uppercase">
                    AXIOGO · AXIS INTELLIGENCE
                  </span>


                  <RoleBadge role={currentRole} />

                </div>


                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                  AXIS{' '}

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">

                    AI WORKSPACE

                  </span>

                </h1>


                <p className="mt-4 text-sm sm:text-base text-axio-text-secondary font-sans">

                  Stateful natural language decision copilot

                </p>

              </div>


              <div className="flex items-center gap-2 text-[9px] text-emerald-400 uppercase tracking-wider">

                <span className="relative flex w-2 h-2">

                  <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-50" />

                  <span className="relative w-2 h-2 rounded-full bg-emerald-400" />

                </span>

                AXIS ONLINE

              </div>

            </div>


            <div className="mt-7 h-px bg-gradient-to-r from-axio-red/40 via-axio-border to-transparent" />

          </section>


          {/* ====================================================
              MAIN WORKSPACE
          ==================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


            {/* ==================================================
                CHAT
            ================================================== */}

            <section
              className="
                axis-scroll-reveal
                lg:col-span-8
                relative
                overflow-hidden
                rounded-2xl
                bg-axio-panel/55
                backdrop-blur-xl
                flex
                flex-col
                h-[70vh]
              "
              style={{
                transitionDelay: '120ms',
              }}
            >

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent" />


              {/* =================================================
                  CONVERSATION
              ================================================= */}

              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">

                {messages.map((msg, index) => (

                  <div
                    key={msg.id}
                    className={`axis-message flex items-start gap-3 ${msg.sender === 'USER'
                      ? 'justify-end'
                      : 'justify-start'
                      }`}
                    style={{
                      animationDelay: `${Math.min(
                        index * 80,
                        400
                      )}ms`,
                    }}
                  >


                    {msg.sender === 'AXIS' && (

                      <div className="relative w-9 h-9 rounded-xl bg-axio-red/10 flex items-center justify-center text-axio-red font-bold text-[9px] shrink-0">

                        <span className="absolute inset-0 rounded-xl bg-axio-red/5 blur-md" />

                        <span className="relative">
                          AXIS
                        </span>

                      </div>

                    )}


                    <div
                      className={`
                        relative
                        p-4
                        rounded-2xl
                        text-xs
                        max-w-2xl
                        font-sans

                        ${msg.sender === 'USER'
                          ? 'bg-white/[0.035] text-white'
                          : 'bg-axio-bg/60 text-axio-text-sub'
                        }
                      `}
                    >

                      <div className="font-mono text-[9px] text-axio-muted mb-2 flex items-center justify-between gap-5">

                        <span
                          className={
                            msg.sender === 'AXIS'
                              ? 'text-axio-red font-bold'
                              : ''
                          }
                        >
                          {msg.sender}
                        </span>

                        <span>
                          {msg.timestamp}
                        </span>

                      </div>


                      {msg.headline && (

                        <div className="font-bold text-sm text-white mb-2 font-sans">

                          {msg.headline}

                        </div>

                      )}


                      <p className="leading-relaxed">
                        {msg.text}
                      </p>


                      {/* CHART */}

                      {msg.chartData && (

                        <div className="mt-5 p-3 bg-black/10 rounded-xl">

                          <div className="text-[9px] font-mono text-axio-red mb-2 tracking-wider">
                            MAINTENANCE EXPENDITURE AGGREGATION ($)
                          </div>


                          <div className="h-36 w-full">

                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                            >

                              <AreaChart data={msg.chartData}>

                                <XAxis
                                  dataKey="period"
                                  stroke="#7F8B98"
                                  fontSize={10}
                                />

                                <YAxis
                                  stroke="#7F8B98"
                                  fontSize={10}
                                />

                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#090C11',
                                    border: 'none',
                                    fontSize: '11px',
                                    borderRadius: '8px',
                                  }}
                                />

                                <Area
                                  type="monotone"
                                  dataKey="GroupA"
                                  stroke="#FF3046"
                                  fill="#FF3046"
                                  fillOpacity={0.12}
                                />

                              </AreaChart>

                            </ResponsiveContainer>

                          </div>

                        </div>

                      )}


                      {/* RECOMMENDATIONS */}

                      {msg.recommendations && (

                        <div className="mt-4 p-3 bg-white/[0.02] rounded-xl text-[11px] font-sans">

                          <span className="font-mono text-axio-red font-bold block mb-2">
                            RECOMMENDATIONS:
                          </span>


                          <ul className="space-y-1.5">

                            {msg.recommendations.map(
                              (r, i) => (

                                <li key={i}>
                                  • {r}
                                </li>

                              )
                            )}

                          </ul>

                        </div>

                      )}


                      {/* ACTION */}

                      {msg.actionAvailable && (

                        <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                          <span className="text-[9px] font-mono text-axio-muted">

                            ACTION AVAILABLE:{' '}

                            {msg.actionAvailable.title}

                          </span>


                          <button
                            onClick={onOpenActions}
                            className="group px-3.5 py-2 bg-axio-red/10 hover:bg-axio-red text-axio-red hover:text-white font-mono text-[9px] font-bold rounded-lg transition-all flex items-center gap-2"
                          >

                            EXECUTE ACTION

                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                ))}


                {/* PROCESSING */}

                {isProcessing && (

                  <div className="p-4 bg-axio-bg/60 rounded-xl flex items-center gap-3 font-mono text-xs text-axio-red">

                    <RefreshCw className="w-4 h-4 animate-spin" />

                    <span>
                      {activeStepText ||
                        'AXIS Processing Multi-Agent Workflow...'}
                    </span>

                  </div>

                )}

              </div>


              {/* =================================================
                  SUGGESTIONS
              ================================================= */}

              <div className="px-5 py-3 bg-white/[0.015] flex items-center gap-2 overflow-x-auto text-[10px]">

                <span className="text-axio-muted font-bold whitespace-nowrap">
                  SUGGESTIONS:
                </span>


                {PREBUILT_QUERIES.slice(0, 3).map((q) => (

                  <button
                    key={q.question}
                    onClick={() =>
                      handleSendQuery(q.question)
                    }
                    className="px-3 py-1.5 bg-axio-bg/60 hover:bg-axio-red/10 text-axio-text-sub hover:text-white rounded-lg whitespace-nowrap transition-all"
                  >
                    {q.question}
                  </button>

                ))}

              </div>


              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="p-4 bg-white/[0.015] flex items-center gap-3">

                <button
                  onClick={onOpenVoiceModal}
                  className="p-2.5 bg-axio-bg/60 hover:bg-axio-red/10 text-axio-red rounded-lg transition-all"
                  title="Speak with Voice AI"
                >
                  <Mic className="w-4 h-4" />
                </button>


                <input
                  type="text"
                  placeholder="Ask AXIS about maintenance, telemetry, or fleet trends..."
                  value={inputQuery}
                  onChange={(e) =>
                    setInputQuery(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleSendQuery()
                  }
                  className="flex-1 bg-axio-bg/60 rounded-xl px-4 py-3 text-xs text-white placeholder:text-axio-muted focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
                />


                <button
                  onClick={() => handleSendQuery()}
                  className="px-5 py-3 bg-axio-red hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-[0_10px_30px_rgba(255,48,70,0.15)] transition-all hover:-translate-y-0.5"
                >

                  <span>
                    SEND
                  </span>

                  <Send className="w-3.5 h-3.5" />

                </button>

              </div>

            </section>


            {/* ==================================================
                RIGHT CONTEXT PANEL
            ================================================== */}

            <aside
              className="
                axis-scroll-reveal
                lg:col-span-4
                relative
                overflow-hidden
                rounded-2xl
                bg-axio-panel/55
                backdrop-blur-xl
                p-6
                space-y-7
              "
              style={{
                transitionDelay: '220ms',
              }}
            >

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent" />


              {/* DATASET */}

              <div>

                <h3 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">

                  <Database className="w-4 h-4 text-axio-red" />

                  <span>
                    ACTIVE DATASET CONTEXT
                  </span>

                </h3>


                <div className="p-4 bg-axio-bg/50 rounded-xl space-y-1.5">

                  <div className="text-white font-bold text-xs">
                    {selectedDataset}
                  </div>

                  <div className="text-[9px] text-axio-muted">
                    Domain: Fleet Operations
                  </div>

                  <div className="text-[9px] text-emerald-400">
                    Freshness: Real-time (5s lag)
                  </div>

                </div>

              </div>


              {/* FILTERS */}

              <div>

                <h3 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">

                  <Layers className="w-4 h-4 text-axio-red" />

                  <span>
                    ACTIVE WORKSPACE FILTERS
                  </span>

                </h3>


                <div className="p-4 bg-axio-bg/50 rounded-xl text-xs space-y-2 text-axio-text-sub">

                  <div>
                    Workspace:{' '}

                    <span className="text-white">
                      {activeWorkspace}
                    </span>

                  </div>


                  <div>
                    Range:{' '}

                    <span className="text-white">
                      {activeFilters.dateRange}
                    </span>

                  </div>


                  <div>
                    Group:{' '}

                    <span className="text-white">
                      {activeFilters.vehicleGroup}
                    </span>

                  </div>

                </div>

              </div>


              {/* SECURITY */}

              <div>

                <h3 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">

                  <ShieldCheck className="w-4 h-4 text-emerald-400" />

                  <span>
                    SECURITY & AUDIT BOUNDARY
                  </span>

                </h3>


                <div className="p-4 bg-axio-bg/50 rounded-xl text-[10px] text-axio-muted leading-relaxed">

                  RBAC active (

                  <span className="text-white">
                    {currentRole}
                  </span>

                  ). AXIS never returns unauthorized raw database credentials or unverified fields.

                </div>

              </div>


              {/* ACTIVE AGENTS */}

              {activatedAgents.length > 0 && (

                <div>

                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">

                    <Sparkles className="w-4 h-4 text-axio-red" />

                    <span>
                      ACTIVE AGENTS
                    </span>

                  </h3>


                  <div className="space-y-2">

                    {activatedAgents.map(
                      (agent, index) => (

                        <div
                          key={`${agent}-${index}`}
                          className="flex items-center justify-between px-3 py-2.5 bg-axio-bg/40 rounded-lg text-[9px]"
                        >

                          <span className="text-white">
                            {agent}
                          </span>


                          <span className="flex items-center gap-1.5 text-emerald-400">

                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                            ACTIVE

                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </aside>

          </div>

        </main>

      </div>
    </>
  );
};