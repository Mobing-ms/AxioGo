# AxioGo Design Specification

## 1. Design Direction

The supplied AxioGo concept establishes the visual direction for the product.

The design language is:

- Dark enterprise interface
- Automotive/data-intelligence aesthetic
- Thin technical borders
- Subtle grid/dot background patterns
- Strong red primary accent
- Cyan/teal and green status accents
- White/light-gray typography
- Compact analytical layouts
- Data-dense but organized screens
- Minimal decorative UI

The experience should feel like a **mission-control environment for automotive data intelligence**.

It should not look like a generic chatbot or a conventional corporate dashboard.

---

## 2. Visual Identity

### Theme

Use a dark theme as the primary authenticated experience.

Recommended structure:

```text
Background
→ Near-black / deep charcoal

Panels
→ Slightly lighter charcoal

Borders
→ Subtle gray/blue

Primary accent
→ AxioGo red

Secondary information
→ Cyan / teal

Success
→ Green

Warning
→ Amber

Error / critical
→ Red
```

The screenshot's red accent should remain the dominant brand/action color.

### Typography

Use a modern sans-serif font.

Hierarchy:

```text
Large Page Title
Section Title
Card Title
Metric
Body
Metadata / labels
```

Use compact typography for dashboards while preserving readability.

---

## 3. Global Application Shell

The supplied screens show a consistent dark application shell.

```text
┌───────────────────────────────────────────────────────────────┐
│ AxioGo | Home | Analytics | Data Catalog | AXIS | ... | User │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                       Page Content                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Header

Include:

- AxioGo logo
- Primary navigation
- Active page indicator
- Notifications
- Voice/AI access
- User profile
- Theme/status controls where required

Navigation should remain visually lightweight.

---

## 4. Home / Overview

The supplied concept shows an automotive data intelligence landing/overview page.

### Hero

Headline direction:

**Automotive Data Intelligence**

Supporting copy should communicate that AxioGo combines data engineering, business context, and AI to transform fleet data into decisions.

Primary CTA:

**Explore AxioGo**

Secondary CTA:

**Ask AXIS**

### Hero Visual

Use a dark automotive/fleet visual with subtle technical overlays.

Avoid a generic AI robot image.

The visual should suggest:

- Vehicle
- Fleet
- Telemetry
- Data
- Intelligence

### KPI Strip

The supplied design uses four high-level metrics.

Use a compact KPI row such as:

```text
128,320        3,245        2,156        8,952
Vehicles       Drivers      Maintenance  Claims
```

Actual metrics should be connected to real data when implemented.

### Activity Section

Show a trend chart such as:

**Live Telemetry Activity**

### System Alerts

A compact panel should show:

- Alert severity
- Event
- Timestamp
- Status

---

## 5. About AxioGo

The supplied concept includes an About page.

Purpose:

Explain what AxioGo is without turning the page into technical documentation.

### Structure

```text
About AxioGo

Our Mission
[Mission explanation]

What Makes AxioGo Different?
• Data-first intelligence
• AI-powered analysis
• AI-powered insights
• Automated decision support
• Business context

Data Lakehouse Architecture
[Visual architecture explanation]
```

The architecture visual should communicate:

```text
Raw / Intake
     ↓
Forge
     ↓
Insight
     ↓
AXIS
```

The About page should reinforce that AxioGo works with the existing data-engineering foundation.

---

## 6. AXIS AI Assistant

This is the most important screen.

The supplied concept shows a dark chat workspace with:

- Conversation area
- Context panel
- Data/metric cards
- Charts
- Input area
- AI status indicators

### Layout

```text
┌─────────────────────────────┬───────────────────────────────┐
│ AXIS Conversation           │ Context / Metrics             │
│                             │                               │
│ User question               │ Dataset                      │
│                             │ Data freshness                │
│ AXIS response               │ KPI                           │
│                             │                               │
│ Chart / table               │ Source                        │
│                             │                               │
│ Recommendation              │                               │
├─────────────────────────────┴───────────────────────────────┤
│ Ask AXIS...                          🎙 Send                 │
└─────────────────────────────────────────────────────────────┘
```

### AXIS Response Design

Responses should use structured blocks:

```text
Answer
────────────
Key metrics
────────────
Chart/table
────────────
Explanation
────────────
Recommendation
────────────
Action
```

### AI Status

Use subtle progress indicators:

```text
Understanding request
Retrieving context
Analyzing data
Generating insight
```

Do not expose chain-of-thought.

### Voice

The microphone control should be directly integrated into the AXIS input.

---

## 7. Command Dashboard

The supplied concept shows a command-style analytics dashboard.

### Header

```text
Analytics Dashboard
[Date Filter] [Workspace] [Refresh]
```

### KPI Row

Use four compact metric cards.

Each card should contain:

- Label
- Large value
- Small comparison/trend
- Status indicator

### Main Analytics

The supplied concept uses a large line chart.

Recommended:

**Fleet / Telemetry Activity**

with:

- Time axis
- Interactive hover
- Date filtering
- Trend indication

### Secondary Analytics

Use compact panels for:

- Accuracy / Data Quality
- Alerts
- Recent activity
- Fleet status
- AI insights

### AXIS Integration

Add contextual action:

**Analyze with AXIS**

This should send the current dashboard context to AXIS.

---

## 8. Data Catalog

The supplied concept shows a data-table-centric catalog.

### Header

```text
Data Catalog
Search datasets...
[Filters]
```

### Dataset Table

Columns can include:

```text
Dataset
Description
Domain
Quality
Freshness
Owner
Updated
Actions
```

Use status badges rather than excessive color.

### Detail Panel

The supplied design includes a right-side dataset detail panel.

Use:

```text
Dataset Name

Description

Schema
Columns
Quality
Freshness
Owner
Tags

[Ask AXIS]
```

The panel should provide immediate context without requiring the user to leave the catalog.

---

## 9. Dataset Detail

Full dataset page:

```text
Dataset Name
Description

Overview | Schema | Lineage | Quality | Business Context
```

### Overview

Show:

- Owner
- Domain
- Freshness
- Quality
- Last updated
- Record count where available

### Schema

Table:

```text
Column | Type | Description | Quality
```

### Business Context

Show:

- Business definition
- KPI relationships
- Domain
- Business rules
- Related datasets

### AXIS

Provide:

**Ask AXIS about this dataset**

---

## 10. Dataset Upload

Use the same dark theme.

### Stepper

```text
Select
  →
Validate
  →
Preview
  →
Metadata
  →
Upload
  →
Processing
  →
Complete
```

### Processing Visualization

Use a technical pipeline indicator:

```text
Upload
  ✓
Intake
  ✓
Forge
  ● Processing
Insight
  ○ Pending
Catalog
  ○ Pending
```

This makes the Databricks workflow understandable without exposing unnecessary implementation details.

---

## 11. Analytics Screen

Use a dark data-dense layout.

```text
Analytics
[Filters]

[KPI] [KPI] [KPI] [KPI]

[Large Trend Chart]

[Breakdown] [Comparison]

[Anomalies] [AI Insights]
```

### Charts

Charts should use the AxioGo visual language:

- Dark chart background
- Fine grid
- Red primary series
- Cyan/teal secondary series
- Green for positive status
- Amber/red for warnings

Charts should remain readable and not become visually noisy.

---

## 12. Reports

Reports page:

```text
Reports

[Create Report]

Recent Reports
────────────────────────────────────────
Report | Type | Created | Status | Actions
```

### Generate Report

From AXIS or Analytics:

```text
Create Report
     ↓
Select content
     ↓
Select format
     ↓
Preview
     ↓
Generate
```

Formats:

- PDF
- Excel
- PowerPoint
- Word

---

## 13. Autonomous Actions

Use a visually prominent but controlled action card.

### Low Risk

```text
ACTION AVAILABLE

Send maintenance report

Risk: Low

[Execute] [Review]
```

### Approval Required

```text
APPROVAL REQUIRED

Trigger Databricks workflow

Risk: High

Impact
Reason
Target system

[Approve] [Reject]
```

Risk must always be visually obvious.

---

## 14. Voice UI

Voice is part of AXIS.

### Idle

Microphone icon inside AXIS input.

### Listening

```text
Listening...
●
"Why did maintenance costs increase?"
```

### Processing

```text
Processing...
Understanding request
Analyzing data
```

### Speaking

```text
AXIS is responding...
```

Only English is required for Version 1.

---

## 15. Notifications

Use a compact notification drawer.

Categories:

- Dataset
- Pipeline
- AXIS
- Reports
- Actions
- Power BI
- System

Each notification should show:

- Type
- Short description
- Time
- Status
- Action if applicable

---

## 16. Admin Experience

Admin screens should use the same dark visual system but can be more table-oriented.

Navigation:

```text
Administration
├── Users
├── Roles & Permissions
├── Datasets
├── Databricks
├── Power BI
├── AI Configuration
├── Actions
├── Monitoring
└── Audit Logs
```

Avoid creating a separate visual language for administration.

---

## 17. Monitoring

Use command-center styling.

```text
System Health

API             HEALTHY
Databricks      HEALTHY
AXIS            HEALTHY
Voice STT       HEALTHY
Voice TTS       HEALTHY
Power BI        HEALTHY
```

Then:

```text
Agent Activity
Tool Calls
Databricks Jobs
Reports
Actions
Errors
```

Use subtle status colors and compact rows.

---

## 18. Audit Logs

Dense table:

```text
Timestamp | User | Event | Resource | Status | Details
```

Filters:

- Date
- User
- Event
- Resource
- Status

Use red only for critical/error events, not as a decorative color.

---

## 19. Interaction Patterns

### Primary Buttons

Use AxioGo red for the primary action.

Examples:

- Ask AXIS
- Upload Dataset
- Create Report
- Execute
- Approve

### Secondary Buttons

Use dark/neutral bordered buttons.

Examples:

- Cancel
- Review
- View Details
- Open

### Status Badges

Use compact badges for:

- Healthy
- Processing
- Complete
- Warning
- Failed
- Approval Required

---

## 20. Empty States

Keep empty states visually consistent with the dark theme.

Example:

```text
No datasets available

Upload a dataset to begin building
your enterprise data context.

[Upload Dataset]
```

AXIS empty state:

```text
Ask AXIS

Try:
"What changed this month?"
```

---

## 21. Loading and Error States

Long-running operations must show progress.

```text
Processing
Analyzing
Generating
Executing
Awaiting Approval
Completed
Failed
```

Error messages should explain the problem and provide a next action.

---

## 22. Responsive Design

Primary target:

- Desktop
- Laptop

Support tablet where practical.

The command dashboard, catalog, and AXIS experience should preserve their analytical usefulness on smaller screens.

Mobile is not a primary V1 target.

---

## 23. Accessibility

Support:

- Keyboard navigation
- Focus states
- Semantic HTML
- Accessible labels
- Good contrast
- Status indicators that do not rely only on color
- Screen-reader-friendly tables
- Text alternatives for charts
- Accessible voice controls

---

## 24. Core Navigation

Recommended navigation:

```text
Home
About
Dashboard
Workspace
Data Catalog
Analytics
Reports
AXIS
Administration
Settings
```

The exact visibility is role-dependent.

---

## 25. Core End-to-End UX

### Data to Decision

```text
Home / Dashboard
      ↓
Data Catalog
      ↓
Dataset
      ↓
Analyze with AXIS
      ↓
AXIS
      ↓
Insight
      ↓
Recommendation
      ↓
Report / Action
      ↓
Approval if needed
      ↓
Execution
      ↓
Audit
```

### Voice

```text
AXIS
 ↓
Microphone
 ↓
English Speech-to-Text
 ↓
AXIS
 ↓
Insight
 ↓
English Text-to-Speech
```

---

## 26. Design System Summary

### Core Visual Language

```text
Dark background
+
Thin technical borders
+
Red primary actions
+
Cyan/teal information
+
Green success
+
Amber warning
+
Compact typography
+
Data-dense layouts
+
Subtle grid/technical texture
```

### Product Personality

**Technical, intelligent, automotive, trustworthy, precise, enterprise-ready.**

### Avoid

- Bright consumer SaaS themes
- Generic chatbot appearance
- Excessive rounded cards
- Excessive gradients
- Decorative AI imagery
- Rainbow charts
- Unnecessary animations
- Databricks-clone navigation
- Overloaded dashboards

---

## 27. Final Design Principle

> **AxioGo should look and feel like an intelligent automotive command center where trusted enterprise data becomes understandable insight, decisions, and controlled action.**
