// Report Generation Engine Mock Service

export const INITIAL_REPORTS = [
  {
    id: 'rep_001',
    title: 'Vehicle Group A Maintenance Root Cause Analysis',
    type: 'Root Cause & Anomaly Report',
    format: 'PDF',
    size: '3.2 MB',
    createdBy: 'Alex Vance',
    role: 'ADMIN',
    status: 'READY',
    createdAt: '2026-08-09 22:15',
    downloads: 14,
    summary: 'Detailed investigation of coolant system failure rates across heavy transports.'
  },
  {
    id: 'rep_002',
    title: 'Monthly Fleet Fuel Consumption & EV Transition ROI',
    type: 'Sustainability & Efficiency',
    format: 'Excel',
    size: '14.8 MB',
    createdBy: 'Sarah Analyst',
    role: 'AUTHORIZED USER',
    status: 'READY',
    createdAt: '2026-08-08 18:40',
    downloads: 32,
    summary: 'Full transaction ledger and route optimization impact modeling.'
  },
  {
    id: 'rep_003',
    title: 'Executive Fleet Operations Briefing - Q3',
    type: 'Executive Briefing',
    format: 'PowerPoint',
    size: '8.5 MB',
    createdBy: 'Alex Vance',
    role: 'ADMIN',
    status: 'READY',
    createdAt: '2026-08-07 11:20',
    downloads: 8,
    summary: 'High-level slide deck synthesized by AXIS Report Agent.'
  },
  {
    id: 'rep_004',
    title: 'Safety & Insurance Claim Settlement Summary',
    type: 'Risk Management',
    format: 'Word',
    size: '1.9 MB',
    createdBy: 'Legal & Compliance',
    role: 'AUTHORIZED USER',
    status: 'READY',
    createdAt: '2026-08-05 09:15',
    downloads: 21,
    summary: 'Legal disclosure report on settled and pending collision claims.'
  }
];

export const getReports = () => INITIAL_REPORTS;

export const generateNewReport = (title, format, category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        id: `rep_${Date.now()}`,
        title: title || 'AxioGo AI Decision Intelligence Report',
        type: category || 'Analytics Summary',
        format: format || 'PDF',
        size: '2.8 MB',
        createdBy: 'Active User',
        role: 'AXIS Engine',
        status: 'READY',
        createdAt: 'Just now',
        downloads: 0,
        summary: 'Synthesized report generated directly from AXIS multi-agent analytical context.'
      };
      resolve(newReport);
    }, 1800);
  });
};
