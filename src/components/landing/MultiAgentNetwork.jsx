import React, { useState } from 'react';
import { AXIS_AGENTS } from '../../services/axisService';
import { Cpu, BookOpen, Code, BarChart3, FileText, Zap, Sparkles } from 'lucide-react';

export const MultiAgentNetwork = () => {
  const [activeWorkflow, setActiveWorkflow] = useState('MAINTENANCE'); // MAINTENANCE, REPORT, WORKFLOW

  // Mapping of icons
  const agentIcons = {
    agent_coord: Cpu,
    agent_know: BookOpen,
    agent_code: Code,
    agent_analytic: BarChart3,
    agent_report: FileText,
    agent_flow: Zap
  };

  // Define active agent sets for different workflow scenarios
  const workflowActivationMap = {
    MAINTENANCE: ['agent_coord', 'agent_know', 'agent_code', 'agent_analytic'],
    REPORT: ['agent_coord', 'agent_know', 'agent_code', 'agent_analytic', 'agent_report'],
    WORKFLOW: ['agent_coord', 'agent_analytic', 'agent_flow']
  };

  const currentActiveSet = workflowActivationMap[activeWorkflow] || workflowActivationMap.MAINTENANCE;

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-cyan/10 border border-axio-cyan/30 text-axio-cyan font-mono text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>04. PURPOSEFUL MULTI-AGENT INTELLIGENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            EXACTLY SIX SPECIALIZED AGENTS.
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed">
            One unified AXIS intelligence orchestrating six purpose-built agents.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center justify-center gap-3 mb-12 font-mono text-xs">
          <span className="text-axio-muted uppercase font-semibold mr-2">Simulate Workflow:</span>
          <button
            onClick={() => setActiveWorkflow('MAINTENANCE')}
            className={`px-4 py-2 rounded border transition-all ${
              activeWorkflow === 'MAINTENANCE' 
                ? 'bg-axio-red text-white border-axio-red font-bold' 
                : 'bg-axio-panel text-axio-text-sub border-axio-border hover:border-axio-border-bright'
            }`}
          >
            Maintenance Analysis Workflow
          </button>

          <button
            onClick={() => setActiveWorkflow('REPORT')}
            className={`px-4 py-2 rounded border transition-all ${
              activeWorkflow === 'REPORT' 
                ? 'bg-axio-cyan text-black border-axio-cyan font-bold' 
                : 'bg-axio-panel text-axio-text-sub border-axio-border hover:border-axio-border-bright'
            }`}
          >
            Report Synthesis Workflow
          </button>

          <button
            onClick={() => setActiveWorkflow('WORKFLOW')}
            className={`px-4 py-2 rounded border transition-all ${
              activeWorkflow === 'WORKFLOW' 
                ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                : 'bg-axio-panel text-axio-text-sub border-axio-border hover:border-axio-border-bright'
            }`}
          >
            Controlled Action Workflow
          </button>
        </div>

        {/* Interactive Agent Network Canvas / Grid Display */}
        <div className="p-8 bg-axio-panel border border-axio-border rounded-xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-4 left-4 font-mono text-[10px] text-axio-muted">
            ORCHESTRATION ARCHITECTURE: COORDINATOR TOPOLOGY
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {AXIS_AGENTS.map((agent) => {
              const IconComp = agentIcons[agent.id] || Cpu;
              const isActive = currentActiveSet.includes(agent.id);

              return (
                <div
                  key={agent.id}
                  className={`p-5 rounded-lg border text-left font-mono transition-all duration-300 ${
                    isActive 
                      ? 'bg-axio-card border-axio-red shadow-xl shadow-axio-red/10 scale-105' 
                      : 'bg-axio-bg/50 border-axio-border opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded border ${
                      isActive ? 'bg-axio-red/20 border-axio-red text-axio-red' : 'bg-axio-panel border-axio-border text-axio-muted'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      isActive ? 'bg-axio-cyan/10 border-axio-cyan/40 text-axio-cyan font-bold' : 'bg-axio-panel border-axio-border text-axio-muted'
                    }`}>
                      {isActive ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1.5">{agent.name}</h3>
                  <p className="text-xs text-axio-text-secondary leading-relaxed font-sans">{agent.role}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-axio-border text-center font-mono text-xs text-axio-muted">
            <span className="text-white font-bold">STRICT AGENT CONSTRAINT:</span> Exactly 6 agents handle routing, RAG metadata, SQL generation, analytical reasoning, report generation, and workflow execution.
          </div>

        </div>

      </div>
    </section>
  );
};
