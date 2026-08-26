import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMaintenanceCategories,
  getClaimsSeverity,
} from '../../services/analyticsService';
import {
  getReports,
  generateNewReport,
} from '../../services/reportService';
import { RoleBadge } from '../common/RoleBadge';

import {
  BarChart2,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  FileText,
  Plus,
  Download,
  FileCheck,
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsView = ({ setActivePage }) => {
  const { currentRole, permissions } = useAuth();

  const [activeTab, setActiveTab] = useState('Analytics');

  const [maintenanceData, setMaintenanceData] = useState([]);
  const [claimsData, setClaimsData] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mRes, cRes, rRes] = await Promise.all([
          getMaintenanceCategories(),
          getClaimsSeverity(),
          getReports()
        ]);
        if (active) {
          setMaintenanceData(mRes || []);
          setClaimsData(cRes || []);
          setReports(rRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching analytics view data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reportTitle, setReportTitle] = useState(
    'Q3 Enterprise Vehicle Maintenance Analysis'
  );

  const [selectedFormat, setSelectedFormat] = useState('PDF');

  const [selectedCategory, setSelectedCategory] = useState(
    'Root Cause Analysis'
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const [isPowerBiRefreshing, setIsPowerBiRefreshing] =
    useState(false);

  const [powerBiRefreshedAt, setPowerBiRefreshedAt] =
    useState('10 minutes ago');


  /* ============================================================
     RELIABLE SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.analytics-scroll-reveal'
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
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [activeTab]);


  /* ============================================================
     POWER BI
  ============================================================ */

  const handleRefreshPowerBi = () => {
    setIsPowerBiRefreshing(true);

    setTimeout(() => {
      setIsPowerBiRefreshing(false);
      setPowerBiRefreshedAt('Just now');
    }, 1800);
  };


  /* ============================================================
     REPORT GENERATION
  ============================================================ */

  const handleCreateReport = async () => {
    setIsGenerating(true);

    const response = await generateNewReport(
      reportTitle,
      selectedFormat,
      selectedCategory
    );

    setReports((prev) => [response.data, ...prev]);

    setIsGenerating(false);
    setIsModalOpen(false);
  };


  return (
    <>
      {/* ==========================================================
          PAGE-SPECIFIC REVEAL CSS
      ========================================================== */}

      <style>{`
        .analytics-scroll-reveal {
          opacity: 0;
          transform: translateY(45px);
          filter: blur(7px);

          transition:
            opacity 750ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 750ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 750ms cubic-bezier(0.22, 1, 0.36, 1);

          will-change:
            opacity,
            transform,
            filter;
        }

        .analytics-scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .analytics-scroll-reveal,
          .analytics-scroll-reveal.is-visible {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }
        }
      `}</style>


      {/* ==========================================================
          PAGE
      ========================================================== */}

      <div className="relative min-h-screen overflow-hidden bg-axio-bg">


        {/* ========================================================
            AMBIENT BACKGROUND
        ======================================================== */}

        <div className="fixed inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-axio-red/6 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed top-[45%] right-[-220px] w-[450px] h-[450px] bg-axio-red/4 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed bottom-[-220px] left-[-160px] w-[400px] h-[400px] bg-axio-cyan/2 rounded-full blur-[150px] pointer-events-none" />


        {/* ========================================================
            MAIN
        ======================================================== */}

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 font-sans">


          {/* ======================================================
              HEADER
          ====================================================== */}

          <section className="analytics-scroll-reveal mb-12">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="relative flex items-center justify-center">

                    <span className="absolute w-8 h-8 rounded-full bg-axio-red/10 blur-md" />

                    <BarChart2 className="relative w-5 h-5 text-axio-red" />

                  </span>

                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-axio-red uppercase">
                    AXIOGO · ANALYTICS INTELLIGENCE
                  </span>

                  <RoleBadge role={currentRole} />

                </div>


                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                  ANALYTICS{' '}

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                    & REPORTS
                  </span>

                </h1>


                <p className="mt-5 max-w-3xl text-sm sm:text-base text-axio-text-secondary leading-relaxed">
                  Unified automotive analytics, enterprise reporting,
                  Power BI intelligence, and AI-assisted report synthesis.
                </p>

              </div>


              <button
                onClick={() => setActivePage('axis')}
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  bg-axio-red
                  hover:bg-red-500
                  text-white
                  rounded-lg
                  font-bold
                  text-[10px]
                  shadow-[0_12px_35px_rgba(255,48,70,0.16)]
                  hover:shadow-[0_15px_45px_rgba(255,48,70,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
              >

                <Bot className="w-4 h-4" />

                <span>
                  ANALYZE WITH AXIS
                </span>

                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />

              </button>

            </div>


            <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border to-transparent" />

          </section>


          {/* ======================================================
              TABS
          ====================================================== */}

          <section
            className="analytics-scroll-reveal mb-10"
            style={{
              transitionDelay: '100ms',
            }}
          >

            <div className="flex flex-wrap items-center gap-2">

              {[
                {
                  id: 'Analytics',
                  label: 'Fleet Analytics',
                },
                {
                  id: 'PowerBI',
                  label: 'Power BI Embedded',
                },
                {
                  id: 'Reports',
                  label: 'Report Generator',
                },
              ].map((tab) => {

                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative
                      px-4
                      py-2.5
                      rounded-lg
                      text-[10px]
                      font-bold
                      transition-all
                      duration-300

                      ${isActive
                        ? 'text-white bg-axio-red/8'
                        : 'text-axio-muted hover:text-white hover:bg-axio-panel/50'
                      }
                    `}
                  >

                    {tab.label}

                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-axio-red shadow-[0_0_8px_rgba(255,48,70,0.5)]" />
                    )}

                  </button>
                );

              })}

            </div>

          </section>


          {/* ======================================================
              FLEET ANALYTICS
          ====================================================== */}

          {activeTab === 'Analytics' && (

            <div className="space-y-8">


              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


                {/* ==================================================
                    MAINTENANCE CHART
                ================================================== */}

                <div
                  className="
                    analytics-scroll-reveal
                    lg:col-span-7
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-axio-panel/55
                    backdrop-blur-xl
                    p-6
                  "
                  style={{
                    transitionDelay: '150ms',
                  }}
                >

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


                  <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">

                      <TrendingUp className="w-4 h-4 text-axio-red" />

                      <span>
                        MAINTENANCE EXPENDITURE BY CATEGORY ($)
                      </span>

                    </h2>

                    <span className="text-[9px] text-axio-muted font-mono">
                      DELTA GOLD LAYER
                    </span>

                  </div>


                  <div className="h-64 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart data={maintenanceData}>

                        <XAxis
                          dataKey="category"
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

                        <Bar
                          dataKey="cost"
                          fill="#FF3046"
                          radius={[4, 4, 0, 0]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>


                {/* ==================================================
                    CLAIMS
                ================================================== */}

                <div
                  className="
                    analytics-scroll-reveal
                    lg:col-span-5
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    bg-axio-panel/55
                    backdrop-blur-xl
                    p-6
                  "
                  style={{
                    transitionDelay: '250ms',
                  }}
                >

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


                  <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">

                      <AlertTriangle className="w-4 h-4 text-axio-red" />

                      <span>
                        CLAIMS SEVERITY DISTRIBUTION
                      </span>

                    </h2>

                    <span className="text-[9px] text-axio-muted font-mono">
                      YTD CLAIMS
                    </span>

                  </div>


                  <div className="h-64 w-full">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={claimsData}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                        >

                          {claimsData.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                              />
                            )
                          )}

                        </Pie>

                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#090C11',
                            border: 'none',
                            fontSize: '11px',
                            borderRadius: '8px',
                          }}
                        />

                        <Legend
                          wrapperStyle={{
                            fontSize: '10px',
                            paddingTop: '10px',
                          }}
                        />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                </div>

              </div>


              {/* ==================================================
                  AXIS CONTEXT
              ================================================== */}

              <div
                className="
                  analytics-scroll-reveal
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-axio-panel/55
                  backdrop-blur-xl
                  p-6
                "
                style={{
                  transitionDelay: '350ms',
                }}
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <Sparkles className="w-4 h-4 text-axio-red" />

                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        AXIS CONTEXTUAL ANALYSIS
                      </h3>

                    </div>

                    <p className="text-xs text-axio-text-secondary leading-relaxed">
                      Carries current telemetry parameters and vehicle
                      group analytics directly into the AXIS natural
                      language conversational engine.
                    </p>

                  </div>


                  <button
                    onClick={() => setActivePage('axis')}
                    className="group flex items-center gap-2 text-xs text-axio-red font-bold whitespace-nowrap"
                  >

                    <span>
                      TRANSFER FILTERS TO AXIS
                    </span>

                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />

                  </button>

                </div>

              </div>

            </div>

          )}


          {/* ======================================================
              POWER BI
          ====================================================== */}

          {activeTab === 'PowerBI' && (

            <div
              className="
                analytics-scroll-reveal
                relative
                overflow-hidden
                rounded-2xl
                bg-axio-panel/55
                backdrop-blur-xl
                p-6
                sm:p-8
              "
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <div>

                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                    EMBEDDED POWER BI SUITE
                  </h2>

                  <p className="text-xs text-axio-muted mt-1">
                    Last Cache Sync: {powerBiRefreshedAt}
                  </p>

                </div>


                {permissions.canAccessPowerBiRefresh && (

                  <button
                    onClick={handleRefreshPowerBi}
                    disabled={isPowerBiRefreshing}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      bg-axio-red
                      hover:bg-red-500
                      text-white
                      font-bold
                      text-[10px]
                      rounded-lg
                      transition-all
                    "
                  >

                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isPowerBiRefreshing
                          ? 'animate-spin'
                          : ''
                        }`}
                    />

                    <span>
                      {isPowerBiRefreshing
                        ? 'REFRESHING...'
                        : 'REFRESH POWER BI'}
                    </span>

                  </button>

                )}

              </div>


              <div className="relative min-h-[380px] bg-axio-bg/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">

                <div className="absolute w-64 h-64 bg-axio-red/5 rounded-full blur-[100px]" />

                <BarChart2 className="relative w-16 h-16 text-axio-red mb-5 animate-pulse" />

                <h3 className="relative text-base font-bold text-white mb-2">
                  POWER BI EXECUTIVE DASHBOARD EMBEDDED
                </h3>

                <p className="relative max-w-md text-xs text-axio-text-secondary mb-7 leading-relaxed">
                  Power BI reports remain fully operational for executive
                  reporting over the Databricks Lakehouse.
                </p>


                <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl text-xs">

                  <div className="p-4 bg-axio-card/60 rounded-xl">

                    <span className="text-[9px] text-axio-muted block mb-1">
                      POWER BI CACHE
                    </span>

                    <span className="text-emerald-400 font-bold">
                      SYNCHRONIZED
                    </span>

                  </div>


                  <div className="p-4 bg-axio-card/60 rounded-xl">

                    <span className="text-[9px] text-axio-muted block mb-1">
                      DATA LAYER
                    </span>

                    <span className="text-axio-red font-bold">
                      DATABRICKS GOLD
                    </span>

                  </div>


                  <div className="p-4 bg-axio-card/60 rounded-xl">

                    <span className="text-[9px] text-axio-muted block mb-1">
                      REST API
                    </span>

                    <span className="text-white font-bold">
                      200 OK
                    </span>

                  </div>


                  <div className="p-4 bg-axio-card/60 rounded-xl">

                    <span className="text-[9px] text-axio-muted block mb-1">
                      RLS GOVERNANCE
                    </span>

                    <span className="text-emerald-400 font-bold">
                      ENFORCED
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}


          {/* ======================================================
              REPORTS
          ====================================================== */}

          {activeTab === 'Reports' && (

            <div className="space-y-6">

              <div
                className="analytics-scroll-reveal flex justify-end"
              >

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    bg-axio-red
                    hover:bg-red-500
                    text-white
                    font-bold
                    text-[10px]
                    rounded-lg
                    shadow-[0_10px_30px_rgba(255,48,70,0.15)]
                    transition-all
                    hover:-translate-y-0.5
                  "
                >

                  <Plus className="w-4 h-4" />

                  <span>
                    CREATE NEW REPORT
                  </span>

                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />

                </button>

              </div>


              <div
                className="
                  analytics-scroll-reveal
                  overflow-x-auto
                  rounded-2xl
                  bg-axio-panel/55
                  backdrop-blur-xl
                "
                style={{
                  transitionDelay: '150ms',
                }}
              >

                <table className="w-full min-w-[900px] text-left text-xs">

                  <thead>

                    <tr className="text-axio-muted uppercase text-[9px] tracking-wider">

                      <th className="p-5">
                        Report Title
                      </th>

                      <th className="p-5">
                        Category
                      </th>

                      <th className="p-5">
                        Format
                      </th>

                      <th className="p-5">
                        Created By
                      </th>

                      <th className="p-5">
                        Created At
                      </th>

                      <th className="p-5">
                        Size
                      </th>

                      <th className="p-5 text-right">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {reports.map((rep) => (

                      <tr
                        key={rep.id}
                        className="group hover:bg-white/[0.015] transition-colors"
                      >

                        <td className="p-5">

                          <div className="flex items-center gap-2">

                            <FileCheck className="w-4 h-4 text-emerald-400" />

                            <span className="font-bold text-white">
                              {rep.title}
                            </span>

                          </div>

                          <span className="block text-[10px] text-axio-muted mt-1">
                            {rep.summary}
                          </span>

                        </td>


                        <td className="p-5 text-axio-red font-semibold">
                          {rep.type}
                        </td>


                        <td className="p-5">

                          <span
                            className={`
                              px-2
                              py-1
                              rounded-full
                              font-bold
                              text-[9px]

                              ${rep.format === 'PDF'
                                ? 'bg-red-500/10 text-red-400'
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


                        <td className="p-5 text-axio-text-secondary">
                          {rep.createdBy}
                        </td>


                        <td className="p-5 text-axio-muted">
                          {rep.createdAt}
                        </td>


                        <td className="p-5 text-white font-semibold">
                          {rep.size}
                        </td>


                        <td className="p-5 text-right">

                          <button
                            className="
                              px-3
                              py-2
                              bg-axio-red/5
                              hover:bg-axio-red/10
                              rounded-lg
                              text-xs
                              text-white
                              inline-flex
                              items-center
                              gap-1.5
                              transition-colors
                            "
                          >

                            <Download className="w-3.5 h-3.5 text-axio-red" />

                            <span>
                              DOWNLOAD
                            </span>

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </main>


        {/* ========================================================
            CREATE REPORT MODAL
        ======================================================== */}

        {isModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-axio-panel/95 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.7)]">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-axio-red/10 blur-[50px] pointer-events-none" />

              <div className="relative p-7 sm:p-8">

                <div className="flex items-center gap-3 mb-7">

                  <FileText className="w-5 h-5 text-axio-red" />

                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                    SYNTHESIZE REPORT FROM AXIS ANALYTICS
                  </h2>

                </div>


                <div className="space-y-5 text-xs">

                  {/* REPORT TITLE */}

                  <div>

                    <label className="block text-axio-muted text-[9px] uppercase tracking-wider mb-2">
                      REPORT TITLE
                    </label>

                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) =>
                        setReportTitle(e.target.value)
                      }
                      className="
                        w-full
                        bg-axio-bg/60
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        focus:outline-none
                        focus:ring-1
                        focus:ring-axio-red/40
                        transition-all
                      "
                    />

                  </div>


                  {/* FORMAT */}

                  <div>

                    <label className="block text-axio-muted text-[9px] uppercase tracking-wider mb-2">
                      TARGET FORMAT
                    </label>

                    <div className="grid grid-cols-4 gap-2">

                      {[
                        'PDF',
                        'Excel',
                        'PowerPoint',
                        'Word',
                      ].map((fmt) => (

                        <button
                          key={fmt}
                          type="button"
                          onClick={() =>
                            setSelectedFormat(fmt)
                          }
                          className={`
                            py-2.5
                            rounded-lg
                            text-[9px]
                            font-bold
                            transition-all

                            ${selectedFormat === fmt
                              ? 'bg-axio-red text-white shadow-[0_8px_20px_rgba(255,48,70,0.15)]'
                              : 'bg-axio-bg/60 text-axio-text-sub hover:text-white'
                            }
                          `}
                        >
                          {fmt}
                        </button>

                      ))}

                    </div>

                  </div>


                  {/* CATEGORY */}

                  <div>

                    <label className="block text-axio-muted text-[9px] uppercase tracking-wider mb-2">
                      REPORT CATEGORY
                    </label>

                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value)
                      }
                      className="
                        w-full
                        bg-axio-bg/60
                        rounded-lg
                        px-4
                        py-3
                        text-white
                        focus:outline-none
                        focus:ring-1
                        focus:ring-axio-red/40
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


                  {/* ACTIONS */}

                  <div className="flex justify-end gap-3 pt-5">

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="
                        px-4
                        py-2.5
                        bg-white/[0.03]
                        hover:bg-white/[0.06]
                        rounded-lg
                        text-axio-text-sub
                        text-[10px]
                        font-bold
                        transition-colors
                      "
                    >
                      CANCEL
                    </button>


                    <button
                      onClick={handleCreateReport}
                      disabled={isGenerating}
                      className="
                        px-6
                        py-2.5
                        bg-axio-red
                        hover:bg-red-500
                        disabled:opacity-50
                        text-white
                        font-bold
                        rounded-lg
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        transition-all
                      "
                    >

                      {isGenerating ? (

                        <>

                          <RefreshCw className="w-4 h-4 animate-spin" />

                          <span>
                            SYNTHESIZING...
                          </span>

                        </>

                      ) : (

                        <>

                          <span>
                            GENERATE REPORT
                          </span>

                          <ArrowRight className="w-3 h-3" />

                        </>

                      )}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
};