// AXIS Intelligence Service - 6 Agent Execution & State Machine Simulation

export const AXIS_AGENTS = [
  { id: 'agent_coord', name: 'Coordinator Agent', role: 'Routes user query, orchestrates agent pipeline, enforces security', icon: 'Cpu', color: '#FF3046' },
  { id: 'agent_know', name: 'Knowledge / Metadata Agent', role: 'Retrieves business definitions, RAG docs, schema metadata', icon: 'BookOpen', color: '#20D6D2' },
  { id: 'agent_code', name: 'Code Agent', role: 'Generates secure SQL & PySpark queries for Databricks Lakehouse', icon: 'Code', color: '#3B82F6' },
  { id: 'agent_analytic', name: 'Analytics & Insight Agent', role: 'Executes statistical analysis, anomaly detection, root cause identification', icon: 'BarChart3', color: '#8B5CF6' },
  { id: 'agent_report', name: 'Report Agent', role: 'Synthesizes analytical outputs into structured reports (PDF, Excel, PPT)', icon: 'FileText', color: '#22C55E' },
  { id: 'agent_flow', name: 'Workflow Agent', role: 'Triggers controlled autonomous actions, job executions, and alerts', icon: 'Zap', color: '#F59E0B' }
];

// Pre-built interactive prompt responses for rich UX simulation
export const PREBUILT_QUERIES = [
  {
    question: "Why did maintenance costs increase?",
    category: "Root Cause Analysis",
    activatedAgents: ['Coordinator Agent', 'Knowledge / Metadata Agent', 'Code Agent', 'Analytics & Insight Agent'],
    steps: [
      { agent: 'Coordinator Agent', text: 'Understanding request and checking enterprise permissions' },
      { agent: 'Knowledge / Metadata Agent', text: 'Retrieving business definitions for "maintenance_cost"' },
      { agent: 'Code Agent', text: 'Executing Delta Lake query over Maintenance Records & Telemetry' },
      { agent: 'Analytics & Insight Agent', text: 'Identifying root cause anomaly in Vehicle Group A' }
    ],
    response: {
      headline: "Maintenance costs increased by 14.2% ($42,850) over the last 30 days.",
      summary: "Primary driver is an unexpected 28% increase in coolant system and turbocharger replacements within Vehicle Group A (Heavy Duty Transports).",
      metrics: [
        { label: "Total Cost Increase", value: "+$42,850", change: "+14.2%", positive: false },
        { label: "Primary Affected Group", value: "Vehicle Group A", change: "28 units", positive: false },
        { label: "Avg Cost per Repair", value: "$3,420", change: "+8.5%", positive: false },
        { label: "Anomaly Confidence", value: "98.4%", change: "High", positive: true }
      ],
      chartData: [
        { period: 'Week 1', GroupA: 18200, GroupB: 14100, GroupC: 11200 },
        { period: 'Week 2', GroupA: 19800, GroupB: 14500, GroupC: 10900 },
        { period: 'Week 3', GroupA: 26400, GroupB: 14200, GroupC: 11400 },
        { period: 'Week 4', GroupA: 34800, GroupB: 14800, GroupC: 11100 }
      ],
      recommendations: [
        "Issue preventative thermal inspection for remaining 45 units in Vehicle Group A.",
        "Review supplier warranty claims for Coolant Hose Kit #CH-8820.",
        "Schedule automated dispatch notification for high-risk vehicles."
      ],
      actionAvailable: {
        id: 'action_maint_alert',
        title: 'Dispatch Preventative Maintenance Alert',
        risk: 'LOW',
        description: 'Send direct inspection work order trigger to fleet service centers for Vehicle Group A.'
      }
    }
  },
  {
    question: "What changed this month?",
    category: "Operational Overview",
    activatedAgents: ['Coordinator Agent', 'Knowledge / Metadata Agent', 'Analytics & Insight Agent'],
    steps: [
      { agent: 'Coordinator Agent', text: 'Scanning overall automotive telemetry parameters' },
      { agent: 'Knowledge / Metadata Agent', text: 'Mapping Gold catalog tables for Telemetry & Fuel' },
      { agent: 'Analytics & Insight Agent', text: 'Synthesizing key operational deltas' }
    ],
    response: {
      headline: "Fleet operational summary for current billing cycle.",
      summary: "Active fleet size increased by 4.2% with overall fuel efficiency improving by 1.8 MPG due to EV integration in regional routes.",
      metrics: [
        { label: "Active Vehicles", value: "128,320", change: "+4.2%", positive: true },
        { label: "Avg Fuel Efficiency", value: "8.4 MPG", change: "+2.1%", positive: true },
        { label: "Total Open Claims", value: "142", change: "-8.4%", positive: true },
        { label: "Data Quality Score", value: "98.4%", change: "Optimal", positive: true }
      ],
      chartData: [
        { period: 'Jan', ActiveFleet: 121000, Efficiency: 7.9 },
        { period: 'Feb', ActiveFleet: 123500, Efficiency: 8.0 },
        { period: 'Mar', ActiveFleet: 125000, Efficiency: 8.2 },
        { period: 'Apr', ActiveFleet: 128320, Efficiency: 8.4 }
      ],
      recommendations: [
        "Continue phase-2 EV rollout in Eastern Logistics hub.",
        "Update Power BI Executive Dashboard with latest monthly metrics."
      ]
    }
  },
  {
    question: "Show vehicles with abnormal maintenance.",
    category: "Anomaly Detection",
    activatedAgents: ['Coordinator Agent', 'Knowledge / Metadata Agent', 'Code Agent', 'Analytics & Insight Agent'],
    steps: [
      { agent: 'Coordinator Agent', text: 'Filtering Databricks Delta table for high failure risk' },
      { agent: 'Code Agent', text: 'Executing statistical Z-score outlier detection SQL' },
      { agent: 'Analytics & Insight Agent', text: 'Highlighting 5 critical vehicle VINs requiring immediate service' }
    ],
    response: {
      headline: "5 Vehicles flagged with severe maintenance anomalies.",
      summary: "Telemetry indicates repeated engine temperature spikes exceeding 108°C coupled with oil pressure drop warnings.",
      flaggedVehicles: [
        { vin: 'VH-10231', model: 'Freightliner Cascadia (2022)', group: 'Group A', status: 'CRITICAL', temp: '112°C', costEst: '$4,200' },
        { vin: 'VH-10482', model: 'Volvo VNL 860 (2021)', group: 'Group A', status: 'HIGH RISK', temp: '109°C', costEst: '$3,800' },
        { vin: 'VH-10891', model: 'Kenworth T680 (2023)', group: 'Group B', status: 'HIGH RISK', temp: '107°C', costEst: '$2,900' },
        { vin: 'VH-11203', model: 'International LT (2022)', group: 'Group A', status: 'WARNING', temp: '105°C', costEst: '$1,800' },
        { vin: 'VH-11882', model: 'Peterbilt 579 (2023)', group: 'Group C', status: 'WARNING', temp: '104°C', costEst: '$1,500' }
      ],
      recommendations: [
        "Pull VH-10231 and VH-10482 from active dispatch immediately.",
        "Trigger high-priority shop reservation in Databricks workflow."
      ],
      actionAvailable: {
        id: 'action_trigger_dbks_job',
        title: 'Trigger Databricks Automated Shop Reservation Job',
        risk: 'HIGH',
        description: 'Execute Databricks production workflow job `job_auto_shop_dispatch_v4` to reserve service bays.'
      }
    }
  },
  {
    question: "Analyze fuel consumption.",
    category: "Efficiency Analysis",
    activatedAgents: ['Coordinator Agent', 'Knowledge / Metadata Agent', 'Code Agent', 'Analytics & Insight Agent'],
    steps: [
      { agent: 'Coordinator Agent', text: 'Loading Fuel & Telemetry Datasets' },
      { agent: 'Knowledge / Metadata Agent', text: 'Calculating idle fuel burn vs route efficiency' },
      { agent: 'Analytics & Insight Agent', text: 'Generating fleet fuel savings profile' }
    ],
    response: {
      headline: "Idle time accounts for 18.4% of total fuel expenditure ($184,200/mo).",
      summary: "Route optimization and idle reduction policy enforcement could save approximately $34,000 monthly.",
      metrics: [
        { label: "Total Fuel Spend", value: "$1,002,400", change: "-1.2%", positive: true },
        { label: "Idle Waste Estimate", value: "$184,200", change: "+4.1%", positive: false },
        { label: "Target Savings", value: "$34,000/mo", change: "Potential", positive: true }
      ],
      recommendations: [
        "Deploy automated driver idle alert policy on ELD modules.",
        "Refresh Power BI Fuel Analytics Report."
      ]
    }
  },
  {
    question: "Create a report.",
    category: "Report Generation",
    activatedAgents: ['Coordinator Agent', 'Knowledge / Metadata Agent', 'Analytics & Insight Agent', 'Report Agent'],
    steps: [
      { agent: 'Coordinator Agent', text: 'Initiating report synthesis pipeline' },
      { agent: 'Analytics & Insight Agent', text: 'Consolidating recent vehicle maintenance and telemetry insights' },
      { agent: 'Report Agent', text: 'Formatting multi-page PDF & Excel export bundle' }
    ],
    response: {
      headline: "Fleet Maintenance & Telemetry Intelligence Report ready.",
      summary: "Structured report synthesized from recent AXIS analytics including Vehicle Group A root cause analysis, anomaly breakdown, and financial impact.",
      reportCreated: {
        id: 'rep_2026_08_01',
        title: 'Q3 Enterprise Fleet Maintenance Root Cause Report',
        format: 'PDF',
        size: '2.4 MB',
        pages: 8,
        createdAt: 'Just now'
      },
      recommendations: [
        "Download generated PDF report or schedule automated weekly distribution.",
        "Export raw underlying table to Excel format for executive review."
      ]
    }
  }
];

export const simulateAxisWorkflow = (userQuery, onStepUpdate, onComplete) => {
  const match = PREBUILT_QUERIES.find(q => q.question.toLowerCase() === userQuery.toLowerCase()) 
    || PREBUILT_QUERIES[0];

  let currentStepIndex = 0;
  
  const stepInterval = setInterval(() => {
    if (currentStepIndex < match.steps.length) {
      onStepUpdate(match.steps[currentStepIndex], currentStepIndex, match.steps.length);
      currentStepIndex++;
    } else {
      clearInterval(stepInterval);
      setTimeout(() => {
        onComplete(match.response, match.activatedAgents);
      }, 400);
    }
  }, 600);
};
