import React, { useState } from 'react';
import { HelpCircle, Search, Lightbulb, Zap, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DecisionStorySection = ({ onOpenActions }) => {
  const [activeStep, setActiveStep] = useState(0);

  const decisionStages = [
    {
      num: '01',
      question: 'WHAT HAPPENED?',
      title: 'Metrics & Telemetry Detection',
      content: 'Maintenance expenditure spiked by +14.2% ($42,850) over the last 30 days across heavy-duty transports.',
      badge: 'METRICS DETECTED',
      icon: Search,
      color: 'border-blue-500 text-blue-400 bg-blue-500/10'
    },
    {
      num: '02',
      question: 'WHY DID IT HAPPEN?',
      title: 'Root Cause & Statistical Isolation',
      content: 'AXIS Analytics Agent isolated 28 coolant hose kit (CH-8820) failures occurring between 45k-60k miles in Vehicle Group A.',
      badge: 'ROOT CAUSE ISOLATED',
      icon: HelpCircle,
      color: 'border-axio-red text-axio-red bg-axio-red/10'
    },
    {
      num: '03',
      question: 'WHAT SHOULD WE DO?',
      title: 'Prescriptive Recommendation',
      content: 'Issue preventative thermal recall for remaining 45 units in Vehicle Group A and file supplier warranty claims.',
      badge: 'RECOMMENDATION SYNTHESIZED',
      icon: Lightbulb,
      color: 'border-axio-cyan text-axio-cyan bg-axio-cyan/10'
    },
    {
      num: '04',
      question: 'CAN AXIOGO ACT?',
      title: 'Controlled Autonomous Action',
      content: 'AXIS Workflow Agent prepares shop bay reservations and supplier notifications. Pauses for human authorization if high-risk.',
      badge: 'CONTROLLED ACTION READY',
      icon: Zap,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-red/10 border border-axio-red/30 text-axio-red font-mono text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>05. DECISION INTELLIGENCE PROGRESSION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            FROM INSIGHT TO CONTROLLED ACTION.
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed">
            AxioGo doesn't stop at charts. It guides enterprise teams through the complete decision workflow.
          </p>
        </div>

        {/* 4 Story Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {decisionStages.map((stage, idx) => {
            const IconComponent = stage.icon;
            const isActive = activeStep === idx;

            return (
              <div
                key={stage.num}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-xl border font-mono text-left cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'bg-axio-card border-axio-red shadow-2xl scale-105 z-10' 
                    : 'bg-axio-panel border-axio-border hover:border-axio-border-bright opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-axio-muted">{stage.num}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded border ${stage.color}`}>
                    {stage.badge}
                  </span>
                </div>

                <div className="p-2 rounded bg-axio-bg border border-axio-border w-fit text-white mb-4">
                  <IconComponent className="w-5 h-5 text-axio-cyan" />
                </div>

                <h3 className="text-xs font-bold text-axio-red uppercase tracking-wider mb-1">
                  {stage.question}
                </h3>
                <h4 className="text-sm font-bold text-white mb-2 font-sans">
                  {stage.title}
                </h4>
                <p className="text-xs text-axio-text-secondary leading-relaxed font-sans">
                  {stage.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Trigger Banner */}
        <div className="p-6 bg-axio-panel border border-axio-red/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded bg-axio-red/20 border border-axio-red flex items-center justify-center text-axio-red font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">READY TO EXECUTE APPROVED DECISIONS?</div>
              <div className="text-xs text-axio-text-sub">Explore the Autonomous Action Center with human-in-the-loop authorization.</div>
            </div>
          </div>

          <button
            onClick={onOpenActions}
            className="px-6 py-3 bg-axio-red hover:bg-red-600 text-white font-mono text-xs font-bold rounded-lg shadow-lg transition-colors flex items-center gap-2"
          >
            <span>GO TO ACTION CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
