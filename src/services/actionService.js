// Controlled Autonomous Actions Service

export const INITIAL_ACTIONS = [
  {
    id: 'act_101',
    title: 'Dispatch Preventative Maintenance Alert',
    risk: 'LOW',
    domain: 'MAINTENANCE',
    requestedBy: 'AXIS Workflow Agent',
    targetSystem: 'Enterprise Fleet Shop Portal',
    reason: 'Preventative recall for 28 units in Vehicle Group A exhibiting coolant thermal spikes.',
    status: 'AVAILABLE',
    impact: 'Sends direct digital work orders to regional service managers.',
    createdAt: '10m ago'
  },
  {
    id: 'act_102',
    title: 'Trigger Databricks Automated Shop Reservation Job',
    risk: 'HIGH',
    domain: 'DATABRICKS',
    requestedBy: 'AXIS Workflow Agent',
    targetSystem: 'Databricks Production Job Cluster',
    reason: 'Automated execution of production workflow `job_auto_shop_dispatch_v4` to lock service bays in SAP.',
    status: 'AWAITING_APPROVAL',
    impact: 'Mutates production shop schedule and commits maintenance budget allocations ($24,500).',
    createdAt: '25m ago'
  },
  {
    id: 'act_103',
    title: 'Refresh Power BI Executive Dashboard',
    risk: 'LOW',
    domain: 'POWER BI',
    requestedBy: 'Authorized User (Alex Vance)',
    targetSystem: 'Power BI REST Service API',
    reason: 'Sync latest Gold layer maintenance aggregates into Power BI reporting workspace.',
    status: 'COMPLETED',
    executedAt: '1h ago',
    impact: 'Updated Power BI cache without impacting underlying Lakehouse data.'
  },
  {
    id: 'act_104',
    title: 'Dispatch Driver Idle Reduction Policy via ELD',
    risk: 'LOW',
    domain: 'DRIVERS',
    requestedBy: 'AXIS Workflow Agent',
    targetSystem: 'Enterprise ELD Network',
    reason: 'Push automated idle reduction prompt to 340 Midwest regional drivers.',
    status: 'AVAILABLE',
    impact: 'Transmits policy pop-up on vehicle telematics displays.',
    createdAt: '2h ago'
  }
];

export const getAutonomousActions = () => INITIAL_ACTIONS;

export const executeAction = (actionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        actionId,
        status: 'EXECUTED',
        executedAt: new Date().toLocaleTimeString(),
        auditId: `audit_act_${Date.now()}`
      });
    }, 1200);
  });
};

export const approveAction = (actionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        actionId,
        status: 'APPROVED_AND_EXECUTED',
        approvedBy: 'Admin User',
        executedAt: new Date().toLocaleTimeString(),
        auditId: `audit_act_${Date.now()}`
      });
    }, 1500);
  });
};

export const rejectAction = (actionId, reason) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        actionId,
        status: 'REJECTED',
        rejectedBy: 'Admin User',
        reason: reason || 'User rejected execution.',
        auditId: `audit_act_${Date.now()}`
      });
    }, 800);
  });
};
