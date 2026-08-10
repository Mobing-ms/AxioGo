# AxioGo — Database / Entity Relationships

## Purpose

This document defines the core data model for AxioGo's enterprise AI decision-intelligence platform.

The model supports:

- Enterprise users and RBAC
- Automotive/fleet data catalog metadata
- Business context and organizational knowledge
- AXIS AI queries and multi-agent workflows
- Decision recommendations
- Controlled autonomous actions
- Reports
- Notifications
- Audit logging
- Workspace/domain context

The underlying enterprise telemetry and lakehouse data remains in the existing Databricks environment. AxioGo should store metadata, business context, AI activity, decisions, actions, and governance records rather than duplicating the raw enterprise dataset.

---

# 1. users

Represents authenticated AxioGo users.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | User display name |
| email | string | Enterprise email |
| role_id | UUID | FK → roles.id |
| avatar | string/null | Optional avatar/initials |
| status | enum | ACTIVE / INACTIVE |
| created_at | timestamp | Account creation |
| updated_at | timestamp | Last profile update |
| last_active_at | timestamp/null | Last known activity |

### Indexes / uniqueness

- `id` — primary key
- `email` — UNIQUE
- `role_id` — INDEX
- `status` — INDEX

---

# 2. roles

Defines AxioGo RBAC roles.

Current application roles are:

- ADMIN
- AUTHORIZED
- STANDARD

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | Role name |
| description | text | Role description |
| created_at | timestamp | Creation time |

### Indexes / uniqueness

- `id` — primary key
- `name` — UNIQUE

---

# 3. workspaces

Represents an enterprise workspace/domain context.

Examples of domain context include:

- Fleet operations
- Maintenance
- Telemetry
- Fuel
- Claims
- Drivers

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | Workspace/domain name |
| description | text | Domain description |
| status | enum | ACTIVE / INACTIVE |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `name` — UNIQUE
- `status` — INDEX

---

# 4. user_workspaces

Associates users with the workspaces they can access.

### Key fields

| Field | Type | Notes |
|---|---|---|
| user_id | UUID | FK → users.id |
| workspace_id | UUID | FK → workspaces.id |
| created_at | timestamp | Assignment time |

### Indexes / uniqueness

- `(user_id, workspace_id)` — UNIQUE
- `user_id` — INDEX
- `workspace_id` — INDEX

---

# 5. data_sources

Represents connected enterprise data systems.

The source can be an existing Databricks/Lakehouse system, rather than a duplicated local dataset.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | Human-readable source name |
| type | enum | DATABRICKS / SQL / STREAM / FILE / OTHER |
| connection_reference | string | Reference to securely stored connection configuration |
| status | enum | CONNECTED / DEGRADED / DISCONNECTED |
| last_sync_at | timestamp/null | Last successful sync |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `name` — UNIQUE
- `type` — INDEX
- `status` — INDEX

### Security note

Credentials, API tokens, and database passwords must NOT be stored directly in this table.

Store only a reference to a secret-management system.

---

# 6. datasets

Represents enterprise datasets known to AxioGo.

This is metadata about the data, not a copy of the underlying enterprise data.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| source_id | UUID | FK → data_sources.id |
| workspace_id | UUID/null | FK → workspaces.id |
| name | string | Dataset name |
| layer | enum | RAW / BRONZE / SILVER / GOLD |
| description | text | Dataset description |
| schema_reference | JSON/text | Metadata about available fields |
| freshness_status | enum | CURRENT / STALE / UNKNOWN |
| last_synced_at | timestamp/null | Last catalog sync |
| security_classification | string | Enterprise security label |
| row_count | bigint/null | Optional metadata |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last metadata update |

### Indexes / uniqueness

- `id` — primary key
- `(source_id, name)` — UNIQUE
- `workspace_id` — INDEX
- `layer` — INDEX
- `freshness_status` — INDEX

---

# 7. business_context

Stores approved business definitions and rules used by AXIS.

Examples:

- KPI definitions
- Business rules
- Ownership definitions
- Freshness SLAs
- SOP policies
- Warranty rules

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| type | enum | KPI / RULE / SOP / POLICY / DEFINITION / OTHER |
| name | string | Context item name |
| content | text | Approved business meaning/rule |
| source_reference | string/null | Original document/system reference |
| version | string | Context version |
| status | enum | ACTIVE / ARCHIVED |
| created_by | UUID | FK → users.id |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `workspace_id` — INDEX
- `type` — INDEX
- `status` — INDEX
- `(workspace_id, name, version)` — UNIQUE

---

# 8. knowledge_documents

Represents unstructured enterprise knowledge available to the RAG layer.

Examples:

- SOPs
- Warranty policies
- OEM repair manuals
- Driver safety guidelines
- Compliance documents
- Previous analytical reports/notes

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| workspace_id | UUID | FK → workspaces.id |
| title | string | Document title |
| document_type | enum | SOP / POLICY / MANUAL / GUIDELINE / REPORT / OTHER |
| source_uri | string | Secure source reference |
| version | string/null | Document version |
| status | enum | ACTIVE / ARCHIVED |
| indexed_at | timestamp/null | RAG indexing time |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `workspace_id` — INDEX
- `document_type` — INDEX
- `status` — INDEX
- `source_uri` — INDEX

---

# 9. axis_agents

Defines the six specialized AXIS agents.

Current agents represented by the application:

- Coordinator
- Knowledge/RAG
- SQL/Code
- Analytical Reasoning
- Report Generation
- Workflow Execution

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | string | Primary key |
| name | string | Agent name |
| role | text | Agent responsibility |
| status | enum | ACTIVE / INACTIVE |
| created_at | timestamp | Creation time |

### Indexes / uniqueness

- `id` — primary key
- `name` — UNIQUE

---

# 10. axis_sessions

Represents an AXIS interaction/session.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| workspace_id | UUID | FK → workspaces.id |
| started_at | timestamp | Session start |
| ended_at | timestamp/null | Session end |
| status | enum | ACTIVE / COMPLETED / FAILED |

### Indexes / uniqueness

- `id` — primary key
- `user_id` — INDEX
- `workspace_id` — INDEX
- `status` — INDEX
- `started_at` — INDEX

---

# 11. axis_queries

Represents individual questions submitted to AXIS.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| session_id | UUID | FK → axis_sessions.id |
| user_id | UUID | FK → users.id |
| query_text | text | User question |
| input_type | enum | TEXT / VOICE |
| status | enum | PROCESSING / COMPLETED / FAILED |
| created_at | timestamp | Query time |
| completed_at | timestamp/null | Completion time |

### Indexes / uniqueness

- `id` — primary key
- `session_id` — INDEX
- `user_id` — INDEX
- `status` — INDEX
- `created_at` — INDEX

---

# 12. axis_agent_runs

Tracks which AXIS agents participated in a query.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| query_id | UUID | FK → axis_queries.id |
| agent_id | string | FK → axis_agents.id |
| status | enum | STARTED / COMPLETED / FAILED |
| input_reference | text/null | Reference to agent input |
| output_reference | text/null | Reference to agent output |
| started_at | timestamp | Start time |
| completed_at | timestamp/null | Completion time |

### Indexes / uniqueness

- `id` — primary key
- `query_id` — INDEX
- `agent_id` — INDEX
- `(query_id, agent_id)` — UNIQUE

---

# 13. decisions

Represents the final decision intelligence generated from an AXIS query.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| query_id | UUID | FK → axis_queries.id |
| workspace_id | UUID | FK → workspaces.id |
| title | string | Decision title |
| summary | text | Decision summary |
| root_cause | text/null | Identified cause |
| recommendation | text | Recommended action |
| confidence_score | decimal/null | Optional confidence |
| status | enum | GENERATED / REVIEWED / ACTIONED / DISMISSED |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `query_id` — INDEX
- `workspace_id` — INDEX
- `status` — INDEX
- `created_at` — INDEX

---

# 14. actions

Represents controlled autonomous actions generated from decisions.

Examples:

- Supplier notifications
- Shop bay reservations
- Warranty claim preparation
- Other controlled workflow execution

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| decision_id | UUID | FK → decisions.id |
| requested_by | UUID | FK → users.id |
| title | string | Action title |
| reason | text | Why action is required |
| risk | enum | LOW / HIGH |
| target_system | string | Target enterprise system |
| impact | text | Expected operational impact |
| status | enum | AVAILABLE / AWAITING_APPROVAL / APPROVED / COMPLETED / REJECTED / FAILED |
| approval_required | boolean | Whether human approval is required |
| approved_by | UUID/null | FK → users.id |
| approved_at | timestamp/null | Approval timestamp |
| rejection_reason | text/null | Reason for rejection |
| executed_at | timestamp/null | Execution timestamp |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `decision_id` — INDEX
- `requested_by` — INDEX
- `risk` — INDEX
- `status` — INDEX
- `approval_required` — INDEX
- `created_at` — INDEX

---

# 15. reports

Represents reports generated by the AXIS Report Agent.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | string | Report title |
| type | string | Report category |
| format | enum | PDF / Excel / PowerPoint / Word |
| summary | text | Short report summary |
| created_by | UUID | FK → users.id |
| source_decision_id | UUID/null | FK → decisions.id |
| file_reference | string/null | Storage reference |
| size | string/null | Human-readable file size |
| created_at | timestamp | Creation time |

### Indexes / uniqueness

- `id` — primary key
- `created_by` — INDEX
- `source_decision_id` — INDEX
- `format` — INDEX
- `type` — INDEX
- `created_at` — INDEX

---

# 16. notifications

Represents system notifications displayed in the application.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| title | string | Notification title |
| message | text | Notification message |
| type | enum | INFO / SUCCESS / WARNING / ACTION |
| read | boolean | Read state |
| created_at | timestamp | Creation time |

### Indexes / uniqueness

- `id` — primary key
- `user_id` — INDEX
- `(user_id, read)` — INDEX
- `created_at` — INDEX

---

# 17. audit_logs

Immutable record of security-sensitive and operational activity.

Events should include:

- Login/activity
- Role changes
- Data access
- AXIS activity
- Action approvals
- Action execution
- Action rejection
- Administrative changes
- Report generation

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID/null | FK → users.id |
| role | string | Role at time of event |
| event | string | Event type |
| resource | string | Affected resource |
| action | text | Action details |
| severity | enum | NEUTRAL / HIGH / CRITICAL |
| status | enum | SUCCESS / FAILED |
| metadata | JSON | Additional audit information |
| timestamp | timestamp | Event timestamp |

### Indexes / uniqueness

- `id` — primary key
- `user_id` — INDEX
- `event` — INDEX
- `resource` — INDEX
- `severity` — INDEX
- `status` — INDEX
- `timestamp` — INDEX

### Important rule

Audit records should be append-only.

Normal application users should never be able to update or delete audit records.

---

# 18. powerbi_connections

Represents Power BI integration metadata.

AxioGo complements Power BI rather than replacing it.

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | Connection/report name |
| workspace_reference | string | External Power BI workspace reference |
| report_reference | string | External Power BI report reference |
| dataset_reference | string | External dataset reference |
| status | enum | CONNECTED / DEGRADED / DISCONNECTED |
| last_refresh_at | timestamp/null | Last refresh |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `report_reference` — INDEX
- `dataset_reference` — INDEX
- `status` — INDEX

---

# 19. settings

Stores user-level application preferences.

Current application preferences include:

- Voice AI speech rate
- Email notification preference

### Key fields

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| voice_speed | string | Voice playback preference |
| email_notifications | boolean | Email notification preference |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update |

### Indexes / uniqueness

- `id` — primary key
- `user_id` — UNIQUE

---

# Relationships

```text
ROLES
  │
  └──< USERS
         │
         ├──< USER_WORKSPACES >── WORKSPACES
         │
         ├──< AXIS_SESSIONS
         │        │
         │        └──< AXIS_QUERIES
         │                 │
         │                 ├──< AXIS_AGENT_RUNS >── AXIS_AGENTS
         │                 │
         │                 └── DECISIONS
         │                         │
         │                         └──< ACTIONS
         │
         ├──< REPORTS
         │
         ├──< NOTIFICATIONS
         │
         ├──< AUDIT_LOGS
         │
         └── SETTINGS


WORKSPACES
  │
  ├──< DATASETS >── DATA_SOURCES
  │
  ├──< BUSINESS_CONTEXT
  │
  ├──< KNOWLEDGE_DOCUMENTS
  │
  └──< AXIS_SESSIONS


DECISIONS
  │
  ├──< ACTIONS
  │
  └──< REPORTS


POWERBI_CONNECTIONS
  └── references external Power BI resources