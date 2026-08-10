import React from 'react';
import {
  Bot,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="relative overflow-hidden bg-[#090C11]">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute bottom-0 left-1/4 w-[420px] h-[160px] bg-axio-red/[0.035] rounded-full blur-[110px]" />

        <div className="absolute bottom-0 right-1/4 w-[300px] h-[140px] bg-white/[0.012] rounded-full blur-[90px]" />

        <div className="absolute inset-0 bg-tech-grid opacity-[0.08]" />

      </div>

      {/* Top accent */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-axio-red/25 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-6">

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* BRAND */}
          <div>

            <button
              onClick={() => setActivePage('landing')}
              className="group flex items-center gap-2.5 mb-3 text-left"
            >

              <div className="relative">

                <div className="absolute inset-0 bg-axio-red/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative w-8 h-8 rounded-lg bg-axio-red/[0.07] flex items-center justify-center">

                  <Bot className="w-4 h-4 text-axio-red transition-transform duration-300 group-hover:scale-110" />

                </div>

              </div>

              <span className="font-display font-black text-lg tracking-tight text-white">
                Axio<span className="text-axio-red">Go</span>
              </span>

            </button>

            <p className="text-axio-muted text-[10px] leading-relaxed mb-3 max-w-xs">
              Enterprise AI Decision Intelligence System for automotive & fleet data. Sits above existing Databricks Lakehouse infrastructure.
            </p>

            <div className="inline-flex items-center gap-1.5 text-[8px] text-emerald-400 uppercase tracking-wider font-semibold">

              <span className="relative flex h-1.5 w-1.5">

                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50 animate-ping" />

                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />

              </span>

              <span>Databricks Lakehouse Synced</span>

            </div>

          </div>


          {/* PLATFORM MODULES */}
          <div>

            <h4 className="text-white font-semibold mb-3 tracking-[0.14em] text-[9px] uppercase">
              Platform Modules
            </h4>

            <ul className="space-y-2 text-[10px]">

              <li>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="group flex items-center gap-1 text-axio-muted hover:text-white transition-colors"
                >
                  <span>Command Center Dashboard</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-axio-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage('catalog')}
                  className="group flex items-center gap-1 text-axio-muted hover:text-white transition-colors"
                >
                  <span>Enterprise Data Catalog</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-axio-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage('analytics')}
                  className="group flex items-center gap-1 text-axio-muted hover:text-white transition-colors"
                >
                  <span>Automotive Analytics</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-axio-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage('axis')}
                  className="group flex items-center gap-1 text-axio-muted hover:text-white transition-colors"
                >
                  <span>AXIS AI Workspace</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-axio-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActivePage('reports')}
                  className="group flex items-center gap-1 text-axio-muted hover:text-white transition-colors"
                >
                  <span>Multi-Format Report Generator</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-axio-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>

            </ul>

          </div>


          {/* SECURITY */}
          <div>

            <h4 className="text-white font-semibold mb-3 tracking-[0.14em] text-[9px] uppercase">
              Enterprise Security
            </h4>

            <ul className="space-y-2 text-[10px] text-axio-muted">

              <li className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Role-Based Access Control (RBAC)</span>
              </li>

              <li className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-axio-red shrink-0" />
                <span>6-Agent Purposeful Intelligence</span>
              </li>

              <li className="flex items-center gap-2">
                <Database className="w-3 h-3 text-axio-red shrink-0" />
                <span>No Raw Data Leaked to LLM</span>
              </li>

              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Power BI Enterprise Reporting Ready</span>
              </li>

            </ul>

          </div>


          {/* SYSTEM STATUS */}
          <div>

            <h4 className="text-white font-semibold mb-3 tracking-[0.14em] text-[9px] uppercase">
              System Status
            </h4>

            <div className="space-y-2 text-[9px]">

              <div className="flex items-center justify-between gap-3">
                <span className="text-axio-muted">
                  AXIS ENGINE
                </span>

                <span className="text-emerald-400 font-semibold">
                  ONLINE · 99.9%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-axio-muted">
                  DATABRICKS PIPELINE
                </span>

                <span className="text-emerald-400 font-semibold">
                  CONNECTED
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-axio-muted">
                  VOICE AI STT/TTS
                </span>

                <span className="text-emerald-400 font-semibold">
                  READY
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-axio-muted">
                  AUDIT ENGINE
                </span>

                <span className="text-axio-red font-semibold">
                  ENFORCED
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="relative mt-8 pt-4">

          <div className="h-px bg-white/[0.045] mb-4" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[8px] text-axio-muted">

            <p>
              © 2026 AxioGo Decision Intelligence Inc. All enterprise rights reserved.
            </p>

            <p className="font-mono tracking-wide">
              v1.0.4-ENTERPRISE-PROD
              <span className="mx-2 text-axio-red/40">·</span>
              LATENCY: 4.2ms
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
};