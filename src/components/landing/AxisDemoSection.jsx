import React, { useState } from 'react';
import { Bot, Send, Sparkles, CheckCircle2, ArrowRight, FileText, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import { PREBUILT_QUERIES, simulateAxisWorkflow } from '../../services/axisService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AxisDemoSection = ({ onOpenFullAxis }) => {
  const [selectedQuery, setSelectedQuery] = useState(PREBUILT_QUERIES[0].question);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeResponse, setActiveResponse] = useState(PREBUILT_QUERIES[0].response);

  const handleQueryClick = (queryText) => {
    setSelectedQuery(queryText);
    setIsProcessing(true);
    setCompletedSteps([]);
    setActiveStep('Initializing AXIS Multi-Agent Pipeline...');

    simulateAxisWorkflow(
      queryText,
      (step, idx) => {
        setActiveStep(step.agent + ": " + step.text);
        setCompletedSteps(prev => [...prev, step]);
      },
      (response) => {
        setIsProcessing(false);
        setActiveStep(null);
        setActiveResponse(response);
      }
    );
  };

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-red/10 border border-axio-red/15 text-axio-red font-mono text-xs font-semibold mb-4">
            <Bot className="w-3.5 h-3.5" />
            <span>03. AXIS CENTRAL INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            MEET AXIS.
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed">
            Enterprise decision intelligence through natural language. AXIS reasoning is backed by purposeful multi-agent coordination.
          </p>
        </div>

        {/* Interactive Clickable Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto font-mono text-xs">
          <span className="text-axio-muted uppercase mr-2 font-semibold">Try Asking:</span>
          {PREBUILT_QUERIES.map((q) => (
            <button
              key={q.question}
              onClick={() => handleQueryClick(q.question)}
              disabled={isProcessing}
              className={`px-3.5 py-2 rounded-lg border transition-all ${selectedQuery === q.question
                  ? 'bg-axio-red text-white border-axio-red shadow-lg shadow-axio-red/20 font-bold'
                  : 'bg-axio-panel hover:bg-axio-card text-axio-text-sub border-axio-border hover:border-axio-border-bright'
                }`}
            >
              "{q.question}"
            </button>
          ))}
        </div>

        {/* Simulated AXIS Interactive Workspace Box */}
        <div className="max-w-4xl mx-auto bg-axio-panel border border-axio-border rounded-xl shadow-2xl overflow-hidden font-mono text-left">

          {/* Header Bar */}
          <div className="px-6 py-4 bg-axio-card border-b border-axio-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-axio-red" />
              <span className="font-bold text-sm text-white">AXIS CONVERSATIONAL INTELLIGENCE DEMO</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-axio-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STATEFUL MEMORY ACTIVE</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-6 space-y-6">

            {/* User Question Bubble */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-axio-card border border-axio-border flex items-center justify-center font-bold text-xs text-white">
                YOU
              </div>
              <div className="p-3.5 bg-axio-card border border-axio-border rounded-lg text-sm text-white max-w-xl font-sans">
                "{selectedQuery}"
              </div>
            </div>

            {/* High-Level Execution Status Machine */}
            {isProcessing && (
              <div className="p-4 bg-axio-bg border border-axio-border rounded-lg space-y-2 text-xs text-axio-muted">
                <div className="flex items-center gap-2 text-axio-cyan font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AXIS EXECUTION PIPELINE IN PROGRESS...</span>
                </div>
                {completedSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-axio-text-sub">
                    <CheckCircle2 className="w-3.5 h-3.5 text-axio-green" />
                    <span>{step.agent}: {step.text}</span>
                  </div>
                ))}
                {activeStep && (
                  <div className="text-axio-red font-medium animate-pulse pl-5">
                    ● {activeStep}
                  </div>
                )}
              </div>
            )}

            {/* AXIS Response Block */}
            {!isProcessing && activeResponse && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-axio-red/20 border border-axio-red/18 flex items-center justify-center text-axio-red font-bold text-xs">
                  AXIS
                </div>

                <div className="flex-1 p-5 bg-axio-bg border border-axio-border rounded-lg space-y-4">

                  {/* Headline & Summary */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1 font-sans">
                      {activeResponse.headline}
                    </h4>
                    <p className="text-xs text-axio-text-secondary leading-relaxed font-sans">
                      {activeResponse.summary}
                    </p>
                  </div>

                  {/* Inline Recharts Graph if present */}
                  {activeResponse.chartData && (
                    <div className="p-4 bg-axio-panel border border-axio-border rounded-lg">
                      <div className="text-[10px] text-axio-muted uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span>MAINTENANCE EXPENDITURE TREND BY VEHICLE GROUP ($)</span>
                        <BarChart2 className="w-3.5 h-3.5 text-axio-cyan" />
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeResponse.chartData}>
                            <defs>
                              <linearGradient id="gradGroupA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF3046" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#FF3046" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="period" stroke="#7F8B98" fontSize={10} />
                            <YAxis stroke="#7F8B98" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: '#090C11', borderColor: '#202731', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="GroupA" stroke="#FF3046" fillOpacity={1} fill="url(#gradGroupA)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {activeResponse.recommendations && (
                    <div className="p-3 bg-axio-card border border-axio-border rounded">
                      <div className="text-[10px] text-axio-red font-bold uppercase tracking-wider mb-2">
                        AXIS ACTIONABLE RECOMMENDATION
                      </div>
                      <ul className="space-y-1 text-xs text-axio-text-sub font-sans">
                        {activeResponse.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-axio-red font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={onOpenFullAxis}
                      className="flex items-center gap-1.5 px-4 py-2 bg-axio-red hover:bg-red-600 text-white font-mono text-xs font-semibold rounded shadow-md transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>CREATE REPORT</span>
                    </button>

                    {activeResponse.actionAvailable && (
                      <button
                        onClick={onOpenFullAxis}
                        className="flex items-center gap-1.5 px-4 py-2 bg-axio-cyan/10 border border-axio-cyan/15 text-axio-cyan hover:bg-axio-cyan/20 font-mono text-xs font-semibold rounded transition-all"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{activeResponse.actionAvailable.title}</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Input Bar */}
          <div className="px-6 py-4 bg-axio-card border-t border-axio-border flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={selectedQuery}
              className="flex-1 bg-axio-bg border border-axio-border rounded px-4 py-2.5 text-xs text-white focus:outline-none"
            />
            <button
              onClick={onOpenFullAxis}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-axio-red hover:bg-red-600 text-white font-bold rounded text-xs transition-colors"
            >
              <span>OPEN AXIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
