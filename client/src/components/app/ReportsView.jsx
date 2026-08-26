import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getReports,
  generateNewReport
} from '../../services/reportService';
import { RoleBadge } from '../common/RoleBadge';
import {
  FileText,
  Download,
  Plus,
  CheckCircle2,
  RefreshCw,
  X,
  FileCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReportsView = () => {
  const { currentRole } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState(
    'Q3 Enterprise Vehicle Maintenance Analysis'
  );
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedCategory, setSelectedCategory] = useState(
    'Root Cause Analysis'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await getReports();
        if (active) {
          setReports(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchReports();
    return () => { active = false; };
  }, []);

  /* ============================================================
     CREATE REPORT
  ============================================================ */

  const handleCreateReport = async () => {
    setIsGenerating(true);

    try {
      const response = await generateNewReport(
        reportTitle,
        selectedFormat,
        selectedCategory
      );

      setReports((prev) => [response.data, ...prev]);
      setIsModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ============================================================
     SCROLL / ENTRANCE ANIMATION
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.reports-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reports-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-[0.08] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-axio-red/[0.055] rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-axio-red/[0.025] rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="reports-scroll-reveal reports-reveal mb-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-axio-red/20 blur-xl rounded-full" />

                  <div className="relative w-9 h-9 rounded-xl bg-axio-red/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-axio-red" />
                  </div>

                </div>

                <span className="text-[9px] text-axio-red font-bold tracking-[0.2em] uppercase">
                  AXIOGO · REPORTING INTELLIGENCE
                </span>

                <RoleBadge role={currentRole} />

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                ENTERPRISE{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  REPORTS
                </span>

              </h1>

              <p className="max-w-2xl mt-5 text-sm sm:text-base text-axio-text-secondary leading-relaxed font-sans">
                Multi-format decision intelligence reports synthesized
                directly by AXIS Report Agent.
              </p>

            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="
                group
                shrink-0
                flex items-center justify-center gap-2.5
                px-5 py-3
                bg-axio-red
                hover:bg-red-500
                text-white
                font-bold
                text-xs
                rounded-xl
                shadow-[0_12px_30px_rgba(255,48,70,0.16)]
                transition-all
                hover:-translate-y-0.5
              "
            >

              <Plus className="w-4 h-4" />

              <span>CREATE REPORT</span>

              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />

            </button>

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/20 to-transparent" />

        </section>

        {/* ========================================================
            REPORT DIRECTORY
        ======================================================== */}

        <section
          className="reports-scroll-reveal reports-reveal"
          style={{ transitionDelay: '120ms' }}
        >

          <div className="relative overflow-hidden rounded-2xl bg-axio-panel/45 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.22)]">

            {/* Top accent */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent" />

            {/* Directory header */}

            <div className="p-5 sm:p-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <span className="absolute inset-0 bg-axio-red/20 blur-md rounded-full" />

                    <span className="relative block w-2 h-2 rounded-full bg-axio-red" />

                  </div>

                  <div>

                    <div className="text-[9px] text-axio-red font-bold tracking-[0.18em] uppercase">
                      REPORT DIRECTORY
                    </div>

                    <div className="text-sm font-display font-bold text-white mt-0.5">
                      Generated Decision Intelligence
                    </div>

                  </div>

                </div>

                <div className="hidden sm:flex items-center gap-2 text-[9px] text-axio-muted uppercase tracking-wider">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {reports.length} REPORTS AVAILABLE
                </div>

              </div>

            </div>

            {/* ====================================================
                DESKTOP TABLE
            ==================================================== */}

            <div className="hidden lg:block px-5 pb-5">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="text-[9px] text-axio-muted uppercase tracking-wider">

                      <th className="px-4 py-3 font-semibold">
                        Report
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Category
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Format
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Created By
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Created At
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Size
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {reports.map((rep, index) => (

                      <tr
                        key={rep.id}
                        className="
                          group
                          transition-all
                          duration-300
                          hover:bg-white/[0.018]
                        "
                        style={{
                          animationDelay: `${index * 60}ms`
                        }}
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-start gap-3">

                            <div className="shrink-0 w-9 h-9 rounded-lg bg-axio-red/[0.07] flex items-center justify-center">

                              <FileCheck className="w-4 h-4 text-axio-red" />

                            </div>

                            <div className="min-w-0">

                              <div className="font-bold text-xs text-white group-hover:text-red-100 transition-colors">
                                {rep.title}
                              </div>

                              <div className="text-[10px] text-axio-muted font-normal mt-1 max-w-sm leading-relaxed">
                                {rep.summary}
                              </div>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4">

                          <span className="text-[10px] text-axio-text-secondary">
                            {rep.type}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`
                              inline-flex items-center
                              px-2.5 py-1
                              rounded-md
                              font-bold
                              text-[9px]
                              uppercase
                              tracking-wider
                              ${rep.format === 'PDF'
                                ? 'bg-axio-red/10 text-red-400'
                                : rep.format === 'Excel'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : rep.format === 'PowerPoint'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-blue-500/10 text-blue-400'
                              }
                            `}
                          >
                            {rep.format}
                          </span>

                        </td>

                        <td className="px-4 py-4 text-[10px] text-axio-text-secondary">
                          {rep.createdBy}
                        </td>

                        <td className="px-4 py-4 text-[10px] text-axio-muted">
                          {rep.createdAt}
                        </td>

                        <td className="px-4 py-4 text-[10px] text-white font-semibold">
                          {rep.size}
                        </td>

                        <td className="px-4 py-4 text-right">

                          <button
                            className="
                              group/download
                              inline-flex items-center gap-2
                              px-3 py-2
                              rounded-lg
                              bg-white/[0.025]
                              hover:bg-axio-red/10
                              text-axio-text-secondary
                              hover:text-white
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-wider
                              transition-all
                            "
                          >

                            <Download className="w-3.5 h-3.5 text-axio-red transition-transform group-hover/download:-translate-y-0.5" />

                            <span>DOWNLOAD</span>

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* ====================================================
                MOBILE REPORT LIST
            ==================================================== */}

            <div className="lg:hidden px-5 pb-5 space-y-3">

              {reports.map((rep) => (

                <div
                  key={rep.id}
                  className="
                    p-4
                    rounded-xl
                    bg-white/[0.018]
                    hover:bg-white/[0.03]
                    transition-all
                  "
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 shrink-0 rounded-lg bg-axio-red/[0.07] flex items-center justify-center">

                        <FileCheck className="w-4 h-4 text-axio-red" />

                      </div>

                      <div>

                        <h3 className="text-xs font-bold text-white leading-relaxed">
                          {rep.title}
                        </h3>

                        <p className="text-[10px] text-axio-muted mt-1 leading-relaxed">
                          {rep.summary}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">

                    <span className="text-[9px] text-axio-text-secondary">
                      {rep.type}
                    </span>

                    <span className="text-axio-border">
                      •
                    </span>

                    <span className="text-[9px] text-axio-muted">
                      {rep.createdAt}
                    </span>

                    <span
                      className={`
                        ml-auto
                        px-2 py-1
                        rounded-md
                        text-[9px]
                        font-bold
                        uppercase
                        ${rep.format === 'PDF'
                          ? 'bg-axio-red/10 text-red-400'
                          : rep.format === 'Excel'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : rep.format === 'PowerPoint'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-blue-500/10 text-blue-400'
                        }
                      `}
                    >
                      {rep.format}
                    </span>

                  </div>

                  <button
                    className="
                      mt-4
                      w-full
                      flex items-center justify-center gap-2
                      py-2.5
                      rounded-lg
                      bg-white/[0.025]
                      hover:bg-axio-red/10
                      text-xs
                      text-white
                      font-bold
                      transition-all
                    "
                  >

                    <Download className="w-3.5 h-3.5 text-axio-red" />

                    DOWNLOAD REPORT

                  </button>

                </div>

              ))}

            </div>

          </div>

        </section>

      </main>

      {/* ============================================================
          CREATE REPORT MODAL
      ============================================================ */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => !isGenerating && setIsModalOpen(false)}
          />

          {/* Ambient glow */}

          <div className="absolute w-[450px] h-[300px] bg-axio-red/[0.07] rounded-full blur-[120px] pointer-events-none" />

          {/* Modal */}

          <div className="
            relative
            w-full
            max-w-lg
            max-h-[90vh]
            overflow-y-auto
            rounded-2xl
            bg-axio-panel/95
            backdrop-blur-2xl
            shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            reports-modal-enter
          ">

            {/* Red accent */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-axio-red to-transparent" />

            <div className="p-6 sm:p-7">

              {/* Modal header */}

              <div className="flex items-start justify-between gap-4 mb-7">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-axio-red" />
                  </div>

                  <div>

                    <div className="text-[9px] text-axio-red font-bold tracking-[0.18em] uppercase mb-1">
                      AXIS REPORT AGENT
                    </div>

                    <h2 className="text-sm font-display font-bold text-white">
                      Synthesize Report
                    </h2>

                  </div>

                </div>

                <button
                  onClick={() => !isGenerating && setIsModalOpen(false)}
                  disabled={isGenerating}
                  className="
                    p-2
                    rounded-lg
                    text-axio-muted
                    hover:text-white
                    hover:bg-white/[0.05]
                    transition-all
                  "
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <div className="space-y-6 text-xs">

                {/* Title */}

                <div>

                  <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                    Report Title
                  </label>

                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="
                      w-full
                      bg-white/[0.025]
                      rounded-lg
                      px-4 py-3
                      text-white
                      text-xs
                      font-sans
                      placeholder:text-axio-muted
                      focus:outline-none
                      focus:bg-white/[0.04]
                      focus:ring-1
                      focus:ring-axio-red/50
                      transition-all
                    "
                  />

                </div>

                {/* Format */}

                <div>

                  <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                    Target Format
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                    {['PDF', 'Excel', 'PowerPoint', 'Word'].map((fmt) => (

                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setSelectedFormat(fmt)}
                        className={`
                          py-2.5
                          rounded-lg
                          text-[10px]
                          font-bold
                          transition-all
                          ${selectedFormat === fmt
                            ? 'bg-axio-red text-white shadow-[0_8px_20px_rgba(255,48,70,0.14)]'
                            : 'bg-white/[0.025] text-axio-text-sub hover:text-white hover:bg-white/[0.045]'
                          }
                        `}
                      >
                        {fmt}
                      </button>

                    ))}

                  </div>

                </div>

                {/* Category */}

                <div>

                  <label className="block text-[9px] text-axio-muted uppercase tracking-wider mb-2">
                    Report Category
                  </label>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="
                      w-full
                      bg-axio-bg
                      rounded-lg
                      px-4 py-3
                      text-white
                      text-xs
                      focus:outline-none
                      focus:ring-1
                      focus:ring-axio-red/50
                    "
                  >

                    <option>
                      Root Cause Analysis
                    </option>

                    <option>
                      Sustainability & EV Transition
                    </option>

                    <option>
                      Executive Operational Briefing
                    </option>

                    <option>
                      Insurance Claims & Risk Settlement
                    </option>

                  </select>

                </div>

                {/* Agent information */}

                <div className="relative overflow-hidden rounded-xl bg-axio-red/[0.035] p-4">

                  <div className="absolute top-0 right-0 w-24 h-24 bg-axio-red/[0.05] rounded-full blur-2xl" />

                  <div className="relative flex items-start gap-3">

                    <Sparkles className="w-4 h-4 text-axio-red shrink-0 mt-0.5" />

                    <p className="text-[10px] text-axio-text-secondary leading-relaxed font-sans">
                      AXIS Report Agent will automatically pull Gold tables,
                      chart visualizations, and recommendation lists into
                      the export bundle.
                    </p>

                  </div>

                </div>

                {/* Actions */}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">

                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isGenerating}
                    className="
                      px-5 py-2.5
                      rounded-lg
                      bg-white/[0.025]
                      hover:bg-white/[0.05]
                      text-axio-text-sub
                      hover:text-white
                      text-[10px]
                      font-bold
                      transition-all
                    "
                  >
                    CANCEL
                  </button>

                  <button
                    onClick={handleCreateReport}
                    disabled={isGenerating}
                    className="
                      px-5 py-2.5
                      rounded-lg
                      bg-axio-red
                      hover:bg-red-500
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      text-white
                      text-[10px]
                      font-bold
                      shadow-[0_10px_25px_rgba(255,48,70,0.14)]
                      transition-all
                      flex items-center justify-center gap-2
                    "
                  >

                    {isGenerating ? (

                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>SYNTHESIZING...</span>
                      </>

                    ) : (

                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>GENERATE REPORT</span>
                      </>

                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`

        .reports-reveal {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(4px);

          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .reports-reveal.reports-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .reports-modal-enter {
          animation: reportsModalEnter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes reportsModalEnter {

          from {
            opacity: 0;
            transform: translateY(25px) scale(0.97);
            filter: blur(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .reports-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

          .reports-modal-enter {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
};