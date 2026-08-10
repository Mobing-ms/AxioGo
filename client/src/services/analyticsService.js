// Automotive Analytics Mock Service for Command Center & Analytics App

export const FLEET_KPIS = [
  { id: 'kpi_vehicles', title: 'Total Vehicles', value: '128,320', subtitle: 'Active Fleet Units', change: '+4.2%', positive: true, icon: 'Truck' },
  { id: 'kpi_drivers', title: 'Active Drivers', value: '3,245', subtitle: 'On Duty Shifts', change: '+1.8%', positive: true, icon: 'Users' },
  { id: 'kpi_maintenance', title: 'Maintenance Orders', value: '2,156', subtitle: 'Active & In-Shop', change: '+14.2%', positive: false, icon: 'Wrench' },
  { id: 'kpi_claims', title: 'Insurance Claims', value: '8,952', subtitle: 'YTD Enterprise Claims', change: '-8.4%', positive: true, icon: 'ShieldAlert' }
];

export const TELEMETRY_ACTIVITY_DATA = [
  { time: '00:00', activeUnits: 98400, avgSpeed: 64, avgTemp: 88, networkLagMs: 4.2 },
  { time: '04:00', activeUnits: 104200, avgSpeed: 68, avgTemp: 89, networkLagMs: 4.5 },
  { time: '08:00', activeUnits: 122500, avgSpeed: 72, avgTemp: 92, networkLagMs: 5.1 },
  { time: '12:00', activeUnits: 128320, avgSpeed: 76, avgTemp: 95, networkLagMs: 4.8 },
  { time: '16:00', activeUnits: 124100, avgSpeed: 71, avgTemp: 94, networkLagMs: 4.4 },
  { time: '20:00', activeUnits: 108900, avgSpeed: 66, avgTemp: 90, networkLagMs: 4.1 }
];

export const MAINTENANCE_BY_CATEGORY = [
  { category: 'Engine & Thermal', cost: 142500, count: 680, color: '#FF3046' },
  { category: 'Brake Systems', cost: 98400, count: 520, color: '#20D6D2' },
  { category: 'Transmission', cost: 86200, count: 310, color: '#3B82F6' },
  { category: 'Electrical & Sensor', cost: 64100, count: 440, color: '#8B5CF6' },
  { category: 'Tires & Suspension', cost: 42300, count: 206, color: '#22C55E' }
];

export const CLAIMS_SEVERITY_BREAKDOWN = [
  { status: 'Resolved Claims', count: 6820, value: '$12.4M', color: '#22C55E' },
  { status: 'Open Investigation', count: 1420, value: '$4.1M', color: '#F59E0B' },
  { status: 'Pending Approval', count: 512, value: '$1.8M', color: '#20D6D2' },
  { status: 'Rejected / Disputed', count: 200, value: '$0.5M', color: '#FF3046' }
];

export const AI_INSIGHT_CARDS = [
  {
    id: 'ins_1',
    severity: 'HIGH',
    title: 'Thermal Spike Pattern Detected in Vehicle Group A',
    domain: 'MAINTENANCE',
    description: 'AXIS Analytics Agent identified a 28% increase in coolant temperature warnings occurring between 45k and 60k miles.',
    impact: 'Estimated risk of premature failure across 45 additional fleet units.',
    suggestedAction: 'Issue preventative shop recall for CH-8820 hose kits.'
  },
  {
    id: 'ins_2',
    severity: 'MEDIUM',
    title: 'Idle Fuel Waste Discrepancy on Regional Routes',
    domain: 'FUEL',
    description: 'Idle time during loading dock waits increased by 14.8 minutes per shift in Midwest hub.',
    impact: 'Monthly excess fuel cost of ~$34,000.',
    suggestedAction: 'Trigger automated driver coaching alert via ELD integration.'
  },
  {
    id: 'ins_3',
    severity: 'OPTIMAL',
    title: 'EV Transition Yielding 14.2% Lower Maintenance',
    domain: 'VEHICLES',
    description: 'First 500 electric delivery transports report zero powertrain fault codes over 100k aggregate miles.',
    impact: 'Exceeding target ROI by 3.4%.',
    suggestedAction: 'Update Power BI Executive Sustainability Dashboard.'
  }
];

export const getFleetKPIs = () => FLEET_KPIS;
export const getTelemetryData = () => TELEMETRY_ACTIVITY_DATA;
export const getMaintenanceCategories = () => MAINTENANCE_BY_CATEGORY;
export const getAiInsights = () => AI_INSIGHT_CARDS;
