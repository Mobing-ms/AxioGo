// Enterprise Audit Log Repository

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud_99201',
    timestamp: '2026-08-10 01:14:22 UTC',
    user: 'alex.vance@fleet.com',
    role: 'ADMIN',
    event: 'ACTION_APPROVAL',
    resource: 'Databricks Job Cluster',
    action: 'Approved high-risk job trigger `job_auto_shop_dispatch_v4`',
    status: 'SUCCESS',
    severity: 'HIGH'
  },
  {
    id: 'aud_99202',
    timestamp: '2026-08-10 01:05:10 UTC',
    user: 'axis.system@axiogo.internal',
    role: 'AXIS AGENT',
    event: 'AXIS_QUERY',
    resource: 'Vehicle Telemetry (Gold)',
    action: 'AXIS Code Agent executed SQL on Delta table `insight_vehicle_telemetry`',
    status: 'SUCCESS',
    severity: 'NEUTRAL'
  },
  {
    id: 'aud_99203',
    timestamp: '2026-08-10 00:48:15 UTC',
    user: 'sarah.analyst@fleet.com',
    role: 'AUTHORIZED USER',
    event: 'REPORT_GENERATED',
    resource: 'Report Engine',
    action: 'Synthesized PDF report `Q3_Fleet_Maintenance_Analysis.pdf`',
    status: 'SUCCESS',
    severity: 'NEUTRAL'
  },
  {
    id: 'aud_99204',
    timestamp: '2026-08-10 00:32:04 UTC',
    user: 'alex.vance@fleet.com',
    role: 'ADMIN',
    event: 'POWERBI_REFRESH',
    resource: 'Power BI Service API',
    action: 'Triggered manual refresh of Executive Fleet Dashboard',
    status: 'SUCCESS',
    severity: 'NEUTRAL'
  },
  {
    id: 'aud_99205',
    timestamp: '2026-08-10 00:15:30 UTC',
    user: 'mark.standard@fleet.com',
    role: 'STANDARD USER',
    event: 'ACCESS_BLOCKED',
    resource: 'Raw Delta Storage',
    action: 'Attempted direct access to `intake_telemetry_raw` (RBAC Denied)',
    status: 'BLOCKED',
    severity: 'CRITICAL'
  },
  {
    id: 'aud_99206',
    timestamp: '2026-08-09 23:54:12 UTC',
    user: 'alex.vance@fleet.com',
    role: 'ADMIN',
    event: 'DATASET_UPLOAD',
    resource: 'Databricks Volume Intake',
    action: 'Ingested dataset `Vehicle_Telemetry_August_Supplement.parquet`',
    status: 'SUCCESS',
    severity: 'NEUTRAL'
  }
];

export const getAuditLogs = () => INITIAL_AUDIT_LOGS;
