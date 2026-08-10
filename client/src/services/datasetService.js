// Mock service for enterprise automotive datasets in Databricks Lakehouse

export const AUTOMOTIVE_DATASETS = [
  {
    id: 'ds_telemetry',
    name: 'Vehicle Telemetry',
    domain: 'TELEMETRY',
    owner: 'Data Engineering Lead',
    freshness: 'Real-time (5s lag)',
    qualityScore: 98.4,
    recordCount: '1.4B',
    format: 'Delta / Parquet',
    location: 'dbfs:/mnt/gold/automotive/telemetry',
    description: 'High-frequency telemetry streamed from IoT edge modules on active fleet vehicles including engine temp, speed, fuel rate, and fault codes.',
    updatedAt: '2 minutes ago',
    schema: [
      { name: 'vehicle_id', type: 'STRING', description: 'Unique vehicle VIN index key', nullCount: 0, quality: '100%' },
      { name: 'timestamp', type: 'TIMESTAMP', description: 'UTC event occurrence timestamp', nullCount: 0, quality: '100%' },
      { name: 'engine_temp_c', type: 'DOUBLE', description: 'Coolant temperature in Celsius', nullCount: 142, quality: '99.8%' },
      { name: 'speed_kmh', type: 'DOUBLE', description: 'GPS verified speed in km/h', nullCount: 0, quality: '100%' },
      { name: 'fuel_level_pct', type: 'FLOAT', description: 'Calculated fuel tank capacity %', nullCount: 45, quality: '99.9%' },
      { name: 'dtc_code', type: 'STRING', description: 'Diagnostic Trouble Code string', nullCount: 12045, quality: '97.2%' }
    ],
    businessContext: {
      definition: 'Primary operational telemetry feed used to detect real-time performance anomalies and calculate predictive maintenance thresholds.',
      kpiRelations: ['Fleet Maintenance Cost', 'Engine Health Index', 'Fuel Efficiency Avg'],
      businessRules: 'Values exceeding 105°C engine temp generate critical warnings in Gold tables.',
      relatedDatasets: ['Maintenance Records', 'Fleet Operations']
    },
    lineage: {
      source: 'GCS IoT Stream (Kafka)',
      bronzeTable: 'intake_telemetry_raw',
      silverTable: 'forge_telemetry_cleaned',
      goldTable: 'insight_vehicle_telemetry'
    }
  },
  {
    id: 'ds_maintenance',
    name: 'Maintenance Records',
    domain: 'MAINTENANCE',
    owner: 'Fleet Logistics Team',
    freshness: 'Hourly Batch',
    qualityScore: 96.8,
    recordCount: '2.1M',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/maintenance',
    description: 'Historical and active shop work orders, parts consumption, mechanic hours, and breakdown diagnostics across all vehicle groups.',
    updatedAt: '15 minutes ago',
    schema: [
      { name: 'work_order_id', type: 'STRING', description: 'Primary work order key', nullCount: 0, quality: '100%' },
      { name: 'vehicle_id', type: 'STRING', description: 'Associated vehicle VIN', nullCount: 0, quality: '100%' },
      { name: 'category', type: 'STRING', description: 'Maintenance type (Engine, Brake, Transmission)', nullCount: 0, quality: '100%' },
      { name: 'cost_usd', type: 'DECIMAL(10,2)', description: 'Total service and parts cost', nullCount: 0, quality: '100%' },
      { name: 'service_date', type: 'DATE', description: 'Work order completion date', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Comprehensive log of service expenses. Interpreted using organization approved cost formulas.',
      kpiRelations: ['Maintenance Cost per Km', 'Mean Time Between Failures'],
      businessRules: 'Costs > $5,000 require secondary approval before Gold aggregation.',
      relatedDatasets: ['Vehicle Registry', 'Insurance Claims']
    },
    lineage: {
      source: 'Enterprise SAP / ERP',
      bronzeTable: 'intake_sap_workorders',
      silverTable: 'forge_maintenance_standardized',
      goldTable: 'insight_maintenance_gold'
    }
  },
  {
    id: 'ds_fuel',
    name: 'Fuel Consumption',
    domain: 'FUEL',
    owner: 'Sustainability & Fleet Admin',
    freshness: 'Daily Sync',
    qualityScore: 99.1,
    recordCount: '45.2M',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/fuel',
    description: 'Fuel card transactions, tank telemetry reconciliation, and EV charging station kWh usage logs.',
    updatedAt: '1 hour ago',
    schema: [
      { name: 'transaction_id', type: 'STRING', description: 'Fuel card transaction identifier', nullCount: 0, quality: '100%' },
      { name: 'vehicle_id', type: 'STRING', description: 'Target vehicle VIN', nullCount: 0, quality: '100%' },
      { name: 'gallons_liters', type: 'DOUBLE', description: 'Volume dispensed', nullCount: 0, quality: '100%' },
      { name: 'amount_usd', type: 'DECIMAL(10,2)', description: 'Transaction cost', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Tracks energy and fuel expenditures across hybrid, diesel, and electric fleet units.',
      kpiRelations: ['Fleet Carbon Footprint', 'Cost per Mile'],
      businessRules: 'Transaction fuel amount vs tank volume discrepancy flagged if > 12%.',
      relatedDatasets: ['Driver Operations', 'Vehicle Telemetry']
    },
    lineage: {
      source: 'WEX Fuel API & Telemetry',
      bronzeTable: 'intake_wex_transactions',
      silverTable: 'forge_fuel_reconciled',
      goldTable: 'insight_fuel_consumption'
    }
  },
  {
    id: 'ds_claims',
    name: 'Insurance Claims',
    domain: 'CLAIMS',
    owner: 'Legal & Risk Mgmt',
    freshness: 'Daily Sync',
    qualityScore: 94.5,
    recordCount: '8,952',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/claims',
    description: 'Enterprise insurance claims, adjuster reports, liability allocations, and payout records.',
    updatedAt: '3 hours ago',
    schema: [
      { name: 'claim_number', type: 'STRING', description: 'Insurance claim reference number', nullCount: 0, quality: '100%' },
      { name: 'incident_date', type: 'DATE', description: 'Date of incident', nullCount: 0, quality: '100%' },
      { name: 'status', type: 'STRING', description: 'Claim status (Open, Resolved, Pending)', nullCount: 0, quality: '100%' },
      { name: 'payout_usd', type: 'DECIMAL(12,2)', description: 'Approved claim payout amount', nullCount: 120, quality: '98.7%' }
    ],
    businessContext: {
      definition: 'Financial and legal exposure data resulting from vehicle collisions or damage.',
      kpiRelations: ['Loss Ratio', 'Claim Settlement Duration'],
      businessRules: 'Litigation pending claims must be obfuscated for Standard Users.',
      relatedDatasets: ['Accident Records', 'Vehicle Registry']
    },
    lineage: {
      source: 'Claims Management System',
      bronzeTable: 'intake_claims_raw',
      silverTable: 'forge_claims_enriched',
      goldTable: 'insight_claims_gold'
    }
  },
  {
    id: 'ds_accidents',
    name: 'Accident Records',
    domain: 'ACCIDENTS',
    owner: 'Safety & Compliance',
    freshness: 'Daily Sync',
    qualityScore: 97.2,
    recordCount: '4,120',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/accidents',
    description: 'Police crash reports, telematics crash detection events, driver statements, and damage severity scores.',
    updatedAt: '4 hours ago',
    schema: [
      { name: 'accident_id', type: 'STRING', description: 'Accident incident key', nullCount: 0, quality: '100%' },
      { name: 'vehicle_id', type: 'STRING', description: 'Involved vehicle VIN', nullCount: 0, quality: '100%' },
      { name: 'severity_level', type: 'STRING', description: 'Minor, Moderate, Severe, Total Loss', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Safety metrics driving fleet risk profile and driver training interventions.',
      kpiRelations: ['Preventable Crash Rate', 'Safety Index Score'],
      businessRules: 'Severe incidents auto-trigger AXIS safety workflow.',
      relatedDatasets: ['Driver Operations', 'Insurance Claims']
    },
    lineage: {
      source: 'Telematics Impact Detector + Police Reports',
      bronzeTable: 'intake_accidents_raw',
      silverTable: 'forge_accidents_geocoded',
      goldTable: 'insight_accidents_gold'
    }
  },
  {
    id: 'ds_drivers',
    name: 'Driver Operations',
    domain: 'DRIVERS',
    owner: 'HR & Workforce Logistics',
    freshness: 'Real-time Shift Sync',
    qualityScore: 98.9,
    recordCount: '3,245',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/drivers',
    description: 'Driver shift logs, Hours of Service (HOS) compliance, safety scores, and assigned routes.',
    updatedAt: '10 minutes ago',
    schema: [
      { name: 'driver_id', type: 'STRING', description: 'Enterprise employee ID', nullCount: 0, quality: '100%' },
      { name: 'name', type: 'STRING', description: 'Driver full name', nullCount: 0, quality: '100%' },
      { name: 'safety_rating', type: 'DOUBLE', description: '0-100 aggregated driver safety score', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Workforce operational dataset ensuring compliance with DOT and enterprise policies.',
      kpiRelations: ['HOS Compliance %', 'Fleet Safety Rating'],
      businessRules: 'Drivers with safety score < 75 flagged for coaching.',
      relatedDatasets: ['Fleet Operations', 'Accident Records']
    },
    lineage: {
      source: 'Workforce Portal & ELD Logs',
      bronzeTable: 'intake_eld_raw',
      silverTable: 'forge_driver_metrics',
      goldTable: 'insight_drivers_gold'
    }
  },
  {
    id: 'ds_registry',
    name: 'Vehicle Registry',
    domain: 'VEHICLES',
    owner: 'Asset Management',
    freshness: 'Daily Sync',
    qualityScore: 99.8,
    recordCount: '128,320',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/registry',
    description: 'Master index of all active, reserve, and decommissioned fleet vehicles, specifications, models, and VINs.',
    updatedAt: '30 minutes ago',
    schema: [
      { name: 'vehicle_id', type: 'STRING', description: 'VIN identifier', nullCount: 0, quality: '100%' },
      { name: 'make_model', type: 'STRING', description: 'Vehicle make, model, and year', nullCount: 0, quality: '100%' },
      { name: 'group_name', type: 'STRING', description: 'Vehicle Group assignment (Group A, B, C)', nullCount: 0, quality: '100%' },
      { name: 'status', type: 'STRING', description: 'Active, In Shop, Reserve, Retired', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Core dimension table for all automotive analytics.',
      kpiRelations: ['Total Active Fleet Size', 'Asset Utilization %'],
      businessRules: 'Registry changes propagate immediately to AXIS context vector store.',
      relatedDatasets: ['Vehicle Telemetry', 'Maintenance Records']
    },
    lineage: {
      source: 'Enterprise Asset ERP',
      bronzeTable: 'intake_erp_registry',
      silverTable: 'forge_registry_normalized',
      goldTable: 'insight_vehicle_registry'
    }
  },
  {
    id: 'ds_operations',
    name: 'Fleet Operations',
    domain: 'FLEET OPERATIONS',
    owner: 'Chief Logistics Officer',
    freshness: 'Real-time',
    qualityScore: 97.6,
    recordCount: '12.4M',
    format: 'Delta Lake',
    location: 'dbfs:/mnt/gold/automotive/operations',
    description: 'Combined dispatch events, route efficiency metrics, idle time telemetry, and SLA performance summaries.',
    updatedAt: '1 minute ago',
    schema: [
      { name: 'dispatch_id', type: 'STRING', description: 'Unique trip key', nullCount: 0, quality: '100%' },
      { name: 'route_id', type: 'STRING', description: 'Assigned route code', nullCount: 0, quality: '100%' },
      { name: 'idle_minutes', type: 'DOUBLE', description: 'Total engine idle time', nullCount: 0, quality: '100%' }
    ],
    businessContext: {
      definition: 'Aggregated operational summary used for high-level executive decision making.',
      kpiRelations: ['On-Time Delivery Rate', 'Idle Fuel Waste ($)'],
      businessRules: 'Route deviations > 15 miles automatically flagged.',
      relatedDatasets: ['Vehicle Telemetry', 'Driver Operations']
    },
    lineage: {
      source: 'Dispatch Engine & GPS Aggregator',
      bronzeTable: 'intake_dispatch_raw',
      silverTable: 'forge_operations_enriched',
      goldTable: 'insight_fleet_operations'
    }
  }
];

export const getDatasets = () => AUTOMOTIVE_DATASETS;

export const getDatasetById = (id) => {
  return AUTOMOTIVE_DATASETS.find(d => d.id === id || d.name === id) || AUTOMOTIVE_DATASETS[0];
};

// Simulated Dataset Upload Validation
export const validateDatasetUpload = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  const name = file.name.toLowerCase();
  if (!name.endsWith('.csv') && !name.endsWith('.json') && !name.endsWith('.parquet') && !name.endsWith('.xlsx')) {
    return { valid: false, error: 'Unsupported file format. Please upload CSV, JSON, Parquet, or Excel files.' };
  }
  return {
    valid: true,
    fileName: file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    estimatedRows: '142,500',
    detectedSchema: [
      { name: 'vehicle_id', type: 'STRING', status: 'Valid' },
      { name: 'timestamp', type: 'TIMESTAMP', status: 'Valid' },
      { name: 'engine_temp_c', type: 'DOUBLE', status: 'Valid' },
      { name: 'maintenance_cost', type: 'DECIMAL(10,2)', status: 'Valid' }
    ]
  };
};
