import React from 'react';
import { Bot, Server, ShieldCheck, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutView = ({ setActivePage }) => {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-mono text-left">
      
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-red/10 border border-axio-red/30 text-axio-red text-xs font-bold mb-3">
          <Bot className="w-4 h-4" />
          <span>ABOUT AXIOGO</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          ENTERPRISE AI DECISION INTELLIGENCE
        </h1>
        <p className="text-base text-axio-text-secondary font-sans leading-relaxed max-w-2xl mx-auto">
          AxioGo combines enterprise Databricks data engineering, business context, AXIS multi-agent intelligence, and controlled autonomous action into a single command center.
        </p>
      </div>

      {/* Core Loop Box */}
      <div className="p-8 bg-axio-panel border border-axio-border rounded-xl mb-12 shadow-2xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-center">THE AXIOGO CENTRAL PRODUCT LOOP</h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-axio-text-sub font-bold text-center">
          <div className="p-3 bg-axio-bg border border-axio-border rounded w-full">TRUSTED DATA</div>
          <span>↓</span>
          <div className="p-3 bg-axio-bg border border-axio-border rounded w-full">BUSINESS CONTEXT</div>
          <span>↓</span>
          <div className="p-3 bg-axio-red/20 border border-axio-red text-white rounded w-full">AXIS ENGINE</div>
          <span>↓</span>
          <div className="p-3 bg-axio-bg border border-axio-border rounded w-full">DECISION</div>
          <span>↓</span>
          <div className="p-3 bg-axio-cyan/20 border border-axio-cyan text-axio-cyan rounded w-full">CONTROLLED ACTION</div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-8 py-4 bg-axio-red hover:bg-red-600 text-white font-bold text-xs rounded-lg shadow-xl shadow-axio-red/20 transition-all inline-flex items-center gap-2"
        >
          <span>OPEN COMMAND CENTER DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
