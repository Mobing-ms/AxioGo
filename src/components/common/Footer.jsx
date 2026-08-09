import React from 'react';
import { Bot, Shield, Cpu, Database, CheckCircle2 } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="bg-axio-panel border-t border-axio-border text-axio-text-secondary pt-12 pb-8 font-mono text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-axio-red" />
              <span className="font-bold text-sm tracking-wider text-white">AXIOGO</span>
            </div>
            <p className="text-axio-muted text-[11px] leading-relaxed mb-4">
              Enterprise AI Decision Intelligence System for automotive & fleet data. Sits above existing Databricks Lakehouse infrastructure.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-axio-cyan bg-axio-cyan/10 border border-axio-cyan/30 px-2.5 py-1 rounded w-fit">
              <CheckCircle2 className="w-3 h-3" />
              <span>DATABRICKS LAKEHOUSE SYNCED</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider text-xs">PLATFORM MODULES</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setActivePage('dashboard')} className="hover:text-axio-red transition-colors">Command Center Dashboard</button></li>
              <li><button onClick={() => setActivePage('catalog')} className="hover:text-axio-red transition-colors">Enterprise Data Catalog</button></li>
              <li><button onClick={() => setActivePage('analytics')} className="hover:text-axio-red transition-colors">Automotive Analytics</button></li>
              <li><button onClick={() => setActivePage('axis')} className="hover:text-axio-red transition-colors">AXIS AI Workspace</button></li>
              <li><button onClick={() => setActivePage('reports')} className="hover:text-axio-red transition-colors">Multi-Format Report Generator</button></li>
            </ul>
          </div>

          {/* Architecture & Security */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider text-xs">ENTERPRISE SECURITY</h4>
            <ul className="space-y-2 text-[11px] text-axio-muted">
              <li className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-axio-green" /> Role-Based Access Control (RBAC)</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-axio-cyan" /> 6-Agent Purposeful Intelligence</li>
              <li className="flex items-center gap-1.5"><Database className="w-3 h-3 text-axio-red" /> No Raw Data Leaked to LLM</li>
              <li>Power BI Enterprise Reporting Ready</li>
            </ul>
          </div>

          {/* System Telemetry Indicator */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wider text-xs">SYSTEM STATUS</h4>
            <div className="p-3 bg-axio-bg border border-axio-border rounded space-y-2 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-axio-muted">AXIS ENGINE:</span>
                <span className="text-axio-green font-semibold">ONLINE (99.9%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-axio-muted">DATABRICKS PIPELINE:</span>
                <span className="text-axio-green font-semibold">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-axio-muted">VOICE AI STT/TTS:</span>
                <span className="text-axio-green font-semibold">READY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-axio-muted">AUDIT ENGINE:</span>
                <span className="text-axio-cyan font-semibold">ENFORCED</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-axio-border pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-axio-muted">
          <p>© 2026 AxioGo Decision Intelligence Inc. All enterprise rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">v1.0.4-ENTERPRISE-PROD | LATENCY: 4.2ms</p>
        </div>
      </div>
    </footer>
  );
};
