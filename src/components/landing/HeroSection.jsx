import React from 'react';
import { DataParticleCanvas } from '../common/DataParticleCanvas';
import { Bot, ArrowRight, Activity, ShieldCheck, Sparkles, Play } from 'lucide-react';

export const HeroSection = ({ onAskAxis, onExplore }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-axio-bg">
      {/* Abstract Telemetry Particle & Grid Canvas */}
      <DataParticleCanvas particleCount={60} />

      {/* Red/Cyan Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-axio-red/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-axio-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-axio-panel border border-axio-border mb-8 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-axio-cyan animate-pulse" />
          <span className="font-tech text-xs text-axio-text-sub uppercase tracking-wider font-semibold">
            AXIOGO ENTERPRISE AI DECISION INTELLIGENCE
          </span>
          <span className="text-axio-border font-sans">|</span>
          <span className="font-tech text-xs text-axio-red font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AXIS COPILOT V1
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
          FROM ENTERPRISE DATA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-axio-cyan">
            TO INTELLIGENT DECISIONS.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-axio-text-secondary mb-10 leading-relaxed font-sans font-normal">
          Automotive data intelligence powered by business context, AXIS, and controlled AI multi-agent execution.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 font-tech">
          <button
            onClick={onAskAxis}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-axio-red hover:bg-red-600 text-white text-sm font-bold rounded-lg shadow-xl shadow-axio-red/25 transition-all transform hover:scale-105"
          >
            <Bot className="w-5 h-5 text-white" />
            <span>ASK AXIS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-axio-panel hover:bg-axio-card border border-axio-border hover:border-axio-border-bright text-white text-sm font-semibold rounded-lg transition-all"
          >
            <Play className="w-4 h-4 text-axio-cyan" />
            <span>EXPLORE AXIOGO</span>
          </button>
        </div>

        {/* Floating Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-sans">
          <div className="p-4 bg-axio-panel/80 backdrop-blur border border-axio-border rounded-lg">
            <div className="text-[11px] text-axio-muted uppercase tracking-wider font-semibold">ENTERPRISE FLEET</div>
            <div className="font-display text-2xl font-bold text-white mt-1">128,320</div>
            <div className="text-[11px] text-axio-green flex items-center gap-1.5 mt-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-axio-green" /> ACTIVE UNITS
            </div>
          </div>

          <div className="p-4 bg-axio-panel/80 backdrop-blur border border-axio-border rounded-lg">
            <div className="text-[11px] text-axio-muted uppercase tracking-wider font-semibold">DATABRICKS SYNC</div>
            <div className="font-display text-2xl font-bold text-axio-cyan mt-1">GOLD LAYER</div>
            <div className="text-[11px] text-axio-text-sub mt-1">DELTA LAKE PIPELINE</div>
          </div>

          <div className="p-4 bg-axio-panel/80 backdrop-blur border border-axio-border rounded-lg">
            <div className="text-[11px] text-axio-muted uppercase tracking-wider font-semibold">AXIS AGENTS</div>
            <div className="font-display text-2xl font-bold text-axio-red mt-1">6 SPECIALIZED</div>
            <div className="text-[11px] text-axio-text-sub mt-1">ORCHESTRATED</div>
          </div>

          <div className="p-4 bg-axio-panel/80 backdrop-blur border border-axio-border rounded-lg">
            <div className="text-[11px] text-axio-muted uppercase tracking-wider font-semibold">SECURITY STATUS</div>
            <div className="font-display text-2xl font-bold text-white mt-1">ENFORCED</div>
            <div className="text-[11px] text-axio-green flex items-center gap-1.5 mt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-axio-green" /> RBAC AUDITED
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
