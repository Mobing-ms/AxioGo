import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getDatasets } from '../../services/datasetService';
import { RoleBadge } from '../common/RoleBadge';

import {
  Database,
  Search,
  Upload,
  Bot,
  X,
  CheckCircle2,
  Table,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const DataCatalogView = ({
  setActivePage,
  onOpenUploadModal
}) => {
  const { currentRole, permissions } = useAuth();
  const { setSelectedDataset } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [detailDataset, setDetailDataset] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const datasets = getDatasets();

  /* ============================================================
     FILTERING
  ============================================================ */

  const filteredDatasets = datasets.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain =
      selectedDomain === 'ALL' ||
      d.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const handleAskAxisAboutDataset = (datasetName) => {
    setSelectedDataset(datasetName);
    setActivePage('axis');
  };

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.catalog-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-[0.12] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-axio-red/7 rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed top-[40%] right-[-220px] w-[450px] h-[450px] bg-axio-red/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="fixed bottom-[-200px] left-[-150px] w-[400px] h-[400px] bg-axio-cyan/2 rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 font-mono">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="catalog-scroll-reveal catalog-reveal mb-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <span className="relative flex items-center justify-center">

                  <span className="absolute w-9 h-9 rounded-full bg-axio-red/10 blur-md" />

                  <Database className="relative w-5 h-5 text-axio-red" />

                </span>

                <span className="text-[10px] font-bold tracking-[0.2em] text-axio-red uppercase">
                  AXIOGO · ENTERPRISE DATA
                </span>

                <RoleBadge role={currentRole} />

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                ENTERPRISE{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  DATA CATALOG
                </span>

              </h1>

              <p className="mt-5 max-w-2xl text-sm sm:text-base text-axio-text-secondary leading-relaxed font-sans">
                Indexed Databricks Delta tables with business context,
                governance metadata, quality signals, and AXIS-ready
                intelligence bindings.
              </p>

            </div>

            {permissions.canUploadDatasets && (
              <button
                onClick={onOpenUploadModal}
                className="group shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-axio-red hover:bg-red-500 text-white rounded-xl font-bold text-xs shadow-[0_12px_30px_rgba(255,48,70,0.16)] transition-all hover:-translate-y-0.5"
              >
                <Upload className="w-4 h-4" />

                <span>
                  UPLOAD NEW DATASET
                </span>

                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/40 to-transparent" />

        </section>

        {/* ========================================================
            SEARCH + FILTERS
        ======================================================== */}

        <section
          className="catalog-scroll-reveal catalog-reveal mb-7"
          style={{ transitionDelay: '100ms' }}
        >

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Search */}

            <div className="relative w-full lg:w-96">

              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-axio-muted" />

              <input
                type="text"
                placeholder="Search datasets, columns, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.025] backdrop-blur-md rounded-xl text-xs text-white placeholder:text-axio-muted focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
              />

            </div>

            {/* Domain filters */}

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1">

              <span className="text-[10px] text-axio-muted uppercase font-semibold whitespace-nowrap">
                Domain:
              </span>

              {[
                'ALL',
                'TELEMETRY',
                'MAINTENANCE',
                'FUEL',
                'CLAIMS',
                'ACCIDENTS',
                'DRIVERS',
                'VEHICLES',
                'FLEET OPERATIONS'
              ].map((dom) => {

                const isActive = selectedDomain === dom;

                return (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`
                      px-3 py-2 rounded-lg
                      text-[9px] font-bold
                      whitespace-nowrap
                      transition-all duration-300
                      ${isActive
                        ? 'bg-axio-red text-white shadow-[0_8px_22px_rgba(255,48,70,0.14)]'
                        : 'bg-white/[0.025] text-axio-muted hover:text-white hover:bg-white/[0.05]'
                      }
                    `}
                  >
                    {dom}
                  </button>
                );
              })}

            </div>

          </div>

        </section>

        {/* ========================================================
            DATASET DIRECTORY
        ======================================================== */}

        <section
          className="catalog-scroll-reveal catalog-reveal"
          style={{ transitionDelay: '180ms' }}
        >

          <div className="relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent" />

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left text-xs">

                <thead>

                  <tr className="text-[9px] text-axio-muted uppercase tracking-wider">

                    <th className="p-5">
                      Dataset
                    </th>

                    <th className="p-5">
                      Domain
                    </th>

                    <th className="p-5">
                      Data Quality
                    </th>

                    <th className="p-5">
                      Freshness
                    </th>

                    <th className="p-5">
                      Owner
                    </th>

                    <th className="p-5">
                      Records
                    </th>

                    <th className="p-5 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredDatasets.map((ds) => (

                    <tr
                      key={ds.id}
                      className="group transition-all duration-300 hover:bg-white/[0.015]"
                    >

                      {/* Dataset */}

                      <td className="p-5">

                        <button
                          onClick={() => {
                            setDetailDataset(ds);
                            setActiveTab('Overview');
                          }}
                          className="text-left flex items-start gap-3 group/dataset"
                        >

                          <div className="mt-0.5 p-2 rounded-lg bg-axio-red/8 text-axio-red group-hover/dataset:bg-axio-red/15 transition-all">

                            <Table className="w-4 h-4" />

                          </div>

                          <div>

                            <div className="font-bold text-white group-hover/dataset:text-axio-red transition-colors">
                              {ds.name}
                            </div>

                            <span className="block mt-1 text-[10px] text-axio-muted font-normal truncate max-w-xs">
                              {ds.description}
                            </span>

                          </div>

                        </button>

                      </td>

                      {/* Domain */}

                      <td className="p-5">

                        <span className="px-2.5 py-1 rounded-full bg-white/[0.025] text-[9px] text-axio-text-secondary">
                          {ds.domain}
                        </span>

                      </td>

                      {/* Quality */}

                      <td className="p-5">

                        <div className="flex items-center gap-2">

                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                          <span className="text-emerald-400 font-bold">
                            {ds.qualityScore}%
                          </span>

                        </div>

                      </td>

                      {/* Freshness */}

                      <td className="p-5 text-axio-muted">
                        {ds.freshness}
                      </td>

                      {/* Owner */}

                      <td className="p-5 text-axio-text-secondary">
                        {ds.owner}
                      </td>

                      {/* Records */}

                      <td className="p-5 font-semibold text-white">
                        {ds.recordCount}
                      </td>

                      {/* Actions */}

                      <td className="p-5">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() => {
                              setDetailDataset(ds);
                              setActiveTab('Overview');
                            }}
                            className="px-3 py-1.5 bg-white/[0.025] hover:bg-white/[0.06] text-[10px] rounded-lg text-axio-text-sub hover:text-white transition-all"
                          >
                            Details
                          </button>

                          <button
                            onClick={() =>
                              handleAskAxisAboutDataset(ds.name)
                            }
                            className="group/axis px-3 py-1.5 bg-axio-red/10 hover:bg-axio-red text-axio-red hover:text-white font-bold text-[10px] rounded-lg flex items-center gap-1.5 transition-all"
                          >

                            <Bot className="w-3 h-3" />

                            <span>
                              ASK AXIS
                            </span>

                            <ArrowRight className="w-3 h-3 transition-transform group-hover/axis:translate-x-0.5" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Empty state */}

            {filteredDatasets.length === 0 && (

              <div className="py-20 text-center">

                <Search className="w-8 h-8 text-axio-muted mx-auto mb-3" />

                <p className="text-sm font-semibold text-white">
                  No datasets found
                </p>

                <p className="text-xs text-axio-muted mt-1">
                  Try another search term or domain.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ========================================================
            DATASET DETAIL MODAL
        ======================================================== */}

        {detailDataset && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">

            <div className="catalog-modal-reveal relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-axio-panel/95 backdrop-blur-2xl shadow-2xl">

              {/* Top glow */}

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-axio-red/70 to-transparent" />

              {/* Close */}

              <button
                onClick={() => setDetailDataset(null)}
                className="absolute top-5 right-5 p-2 text-axio-muted hover:text-white hover:bg-white/[0.05] rounded-lg transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

              <div className="p-6 sm:p-8">

                <div className="flex items-center gap-4 mb-7">

                  <div className="p-3 rounded-xl bg-axio-red/10 text-axio-red">

                    <Database className="w-6 h-6" />

                  </div>

                  <div>

                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {detailDataset.name}
                    </h2>

                    <p className="text-xs text-axio-muted mt-1">
                      Domain: {detailDataset.domain}
                      {' · '}
                      Location: {detailDataset.location}
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    TABS
                ================================================== */}

                <div className="flex overflow-x-auto gap-1 mb-7">

                  {[
                    'Overview',
                    'Schema',
                    'Lineage',
                    'Quality',
                    'Business Context'
                  ].map((tab) => {

                    const isActive = activeTab === tab;

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          relative px-4 py-2.5
                          text-[10px] font-bold
                          whitespace-nowrap
                          rounded-lg
                          transition-all
                          ${isActive
                            ? 'bg-axio-red/10 text-white'
                            : 'text-axio-muted hover:text-white hover:bg-white/[0.03]'
                          }
                        `}
                      >

                        {tab}

                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-axio-red rounded-full" />
                        )}

                      </button>
                    );
                  })}

                </div>

                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                {activeTab === 'Overview' && (

                  <div className="space-y-5 text-xs">

                    <p className="text-axio-text-secondary leading-relaxed font-sans">
                      {detailDataset.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                      <div className="p-4 bg-white/[0.025] rounded-xl">

                        <span className="text-[9px] text-axio-muted block mb-1">
                          OWNER
                        </span>

                        <span className="font-bold text-white">
                          {detailDataset.owner}
                        </span>

                      </div>

                      <div className="p-4 bg-white/[0.025] rounded-xl">

                        <span className="text-[9px] text-axio-muted block mb-1">
                          FRESHNESS
                        </span>

                        <span className="font-bold text-axio-red">
                          {detailDataset.freshness}
                        </span>

                      </div>

                      <div className="p-4 bg-white/[0.025] rounded-xl">

                        <span className="text-[9px] text-axio-muted block mb-1">
                          QUALITY SCORE
                        </span>

                        <span className="font-bold text-emerald-400">
                          {detailDataset.qualityScore}%
                        </span>

                      </div>

                      <div className="p-4 bg-white/[0.025] rounded-xl">

                        <span className="text-[9px] text-axio-muted block mb-1">
                          RECORD COUNT
                        </span>

                        <span className="font-bold text-white">
                          {detailDataset.recordCount}
                        </span>

                      </div>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    SCHEMA
                ================================================== */}

                {activeTab === 'Schema' && (

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[650px] text-left text-xs">

                      <thead>

                        <tr className="text-[9px] text-axio-muted uppercase tracking-wider">

                          <th className="p-3">
                            Column
                          </th>

                          <th className="p-3">
                            Type
                          </th>

                          <th className="p-3">
                            Description
                          </th>

                          <th className="p-3">
                            Quality
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {detailDataset.schema.map((col) => (

                          <tr
                            key={col.name}
                            className="hover:bg-white/[0.015] transition-colors"
                          >

                            <td className="p-3 font-bold text-axio-red">
                              {col.name}
                            </td>

                            <td className="p-3 text-axio-muted">
                              {col.type}
                            </td>

                            <td className="p-3 font-sans text-axio-text-secondary">
                              {col.description}
                            </td>

                            <td className="p-3 text-emerald-400">
                              {col.quality}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>
                )}

                {/* ==================================================
                    LINEAGE
                ================================================== */}

                {activeTab === 'Lineage' && (

                  <div className="p-6 bg-white/[0.02] rounded-xl text-xs space-y-5">

                    <div className="flex items-center gap-2 text-axio-red font-bold">

                      <Sparkles className="w-4 h-4" />

                      <span>
                        DATABRICKS LAKEHOUSE LINEAGE TRAIL
                      </span>

                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="p-3 bg-white/[0.025] rounded-lg text-axio-text-secondary">
                        Source: {detailDataset.lineage.source}
                      </span>

                      <ArrowRight className="w-4 h-4 text-axio-muted" />

                      <span className="p-3 bg-white/[0.025] rounded-lg text-emerald-400">
                        {detailDataset.lineage.bronzeTable}
                      </span>

                      <ArrowRight className="w-4 h-4 text-axio-muted" />

                      <span className="p-3 bg-white/[0.025] rounded-lg text-axio-red">
                        {detailDataset.lineage.silverTable}
                      </span>

                      <ArrowRight className="w-4 h-4 text-axio-muted" />

                      <span className="p-3 bg-axio-red/10 rounded-lg text-white font-bold">
                        {detailDataset.lineage.goldTable}
                      </span>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    QUALITY
                ================================================== */}

                {activeTab === 'Quality' && (

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="p-5 bg-white/[0.02] rounded-xl">

                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-3" />

                      <div className="text-[9px] text-axio-muted mb-1">
                        DATA QUALITY
                      </div>

                      <div className="text-2xl font-bold text-emerald-400">
                        {detailDataset.qualityScore}%
                      </div>

                    </div>

                    <div className="p-5 bg-white/[0.02] rounded-xl">

                      <Database className="w-5 h-5 text-axio-red mb-3" />

                      <div className="text-[9px] text-axio-muted mb-1">
                        RECORDS
                      </div>

                      <div className="text-2xl font-bold text-white">
                        {detailDataset.recordCount}
                      </div>

                    </div>

                    <div className="p-5 bg-white/[0.02] rounded-xl">

                      <Sparkles className="w-5 h-5 text-axio-red mb-3" />

                      <div className="text-[9px] text-axio-muted mb-1">
                        FRESHNESS
                      </div>

                      <div className="text-sm font-bold text-white">
                        {detailDataset.freshness}
                      </div>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    BUSINESS CONTEXT
                ================================================== */}

                {activeTab === 'Business Context' && (

                  <div className="space-y-4 text-xs font-sans">

                    <div className="p-5 bg-white/[0.02] rounded-xl">

                      <span className="font-mono text-axio-red font-bold block mb-2">
                        BUSINESS DEFINITION
                      </span>

                      <p className="text-axio-text-secondary leading-relaxed">
                        {detailDataset.businessContext.definition}
                      </p>

                    </div>

                    <div className="p-5 bg-white/[0.02] rounded-xl">

                      <span className="font-mono text-axio-red font-bold block mb-2">
                        BUSINESS RULES
                      </span>

                      <p className="text-axio-text-secondary leading-relaxed">
                        {detailDataset.businessContext.businessRules}
                      </p>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    BOTTOM ACTIONS
                ================================================== */}

                <div className="mt-8 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                  <span className="text-[10px] text-axio-muted">
                    Last updated: {detailDataset.updatedAt}
                  </span>

                  <button
                    onClick={() => {
                      handleAskAxisAboutDataset(
                        detailDataset.name
                      );

                      setDetailDataset(null);
                    }}
                    className="group px-5 py-3 bg-axio-red hover:bg-red-500 text-white font-mono text-[10px] font-bold rounded-xl shadow-[0_10px_25px_rgba(255,48,70,0.14)] flex items-center gap-2 transition-all hover:-translate-y-0.5"
                  >

                    <Bot className="w-4 h-4" />

                    <span>
                      ASK AXIS ABOUT THIS DATASET
                    </span>

                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

      {/* ============================================================
          ANIMATION STYLES
      ============================================================ */}

      <style>{`
        .catalog-reveal {
          opacity: 0;
          transform: translateY(32px);
          filter: blur(4px);
          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .catalog-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .catalog-modal-reveal {
          animation: catalogModalIn 350ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes catalogModalIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .catalog-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

          .catalog-modal-reveal {
            animation: none;
          }
        }
      `}</style>

    </div>
  );
};