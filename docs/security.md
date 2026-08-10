# AxioGo Security Specification

## 1. Purpose

AxioGo is an enterprise AI decision-intelligence system that sits above existing enterprise data infrastructure.

The security model must protect:

- Enterprise users and identities
- Databricks data
- Business-context and RAG knowledge
- SQL execution
- AXIS agent tools
- Generated reports
- Controlled autonomous actions
- Voice interactions
- Audit records
- Backend credentials and secrets

The core security principle is:

> The AI can recommend and reason, but deterministic backend services remain responsible for authorization, data access, and action execution.

## 2. Security Architecture

The intended security boundary is:

```text
                    AXIOGO FRONTEND
                         React
                           |
                           v
                    Backend API
                           |
                    Authentication
                           |
                    Authorization
                           |
              +------------+------------+
              |            |            |
              v            v            v
            RAG       Databricks       AXIS
          Context        Query        LangGraph
              |            |            |
              +------------+------------+
                           |
                    Controlled Tools
                           |
              +------------+------------+
              |                         |
              v                         v
          Reports                  Actions
                                      |
                              Human Approval
                                      |
                                  Execution
                                      |
                                  Audit Log
```

The frontend must never directly access protected enterprise systems.

## 3. Authentication

### V1 approach

AxioGo should use backend-managed authenticated sessions/tokens.

The frontend receives an authentication token after successful login and sends it with protected API requests.

Example:

```http
Authorization: Bearer <access_token>
```

The backend validates the token before allowing access to protected endpoints.

### Required user information

The authenticated identity should contain at minimum:

```text
user_id
name
email
role
permissions
```

The backend should derive permissions from the authenticated identity rather than trusting permission values supplied by the frontend.

## 4. Role-Based Access Control

AxioGo currently defines three enterprise roles:

```text
ADMIN
AUTHORIZED
STANDARD
```

### ADMIN

Administrative capabilities include:

- User/RBAC management
- System monitoring
- AI configuration
- Databricks integration monitoring
- Audit-log access
- High-risk administrative operations

### AUTHORIZED

Capabilities may include:

- Enterprise data querying
- AXIS analysis
- SQL-generated tables
- Report generation
- Approved operational actions

### STANDARD

Capabilities should be restricted to permitted:

- Dashboard information
- Catalog discovery
- Authorized AXIS queries
- Non-sensitive analytical information

The exact permission matrix should be enforced by the backend.

## 5. Frontend Authorization Is Not Security

The React application may hide UI elements based on permissions.

For example:

```text
if user cannot execute actions
    hide "Execute Action"
```

However, this is only a UI convenience.

The backend must independently verify authorization for every protected operation.

A malicious user must not be able to bypass the UI and call:

```http
POST /actions/{id}/execute
```

directly.

The backend must reject the request if the user lacks permission.

## 6. Data Access Control

Every request for enterprise data must pass through authorization.

The backend must determine:

```text
Who is the user?
        ↓
What role do they have?
        ↓
What permissions do they have?
        ↓
Which datasets can they access?
        ↓
Which fields can they access?
        ↓
What operation are they attempting?
```

Authorization must be applied before sensitive data is returned.

## 7. Databricks Security Boundary

The frontend must never connect directly to Databricks.

Correct:

```text
React
  ↓
AxioGo API
  ↓
Authorization
  ↓
Backend Databricks service
  ↓
Databricks
```

Incorrect:

```text
React
  ↓
Databricks
```

Databricks credentials must remain entirely on the backend.

They must never appear in:

- React source code
- frontend environment variables
- browser local storage
- API responses
- generated SQL shown to unauthorized users
- client-side logs

## 8. Secrets Management

Sensitive credentials must be stored using backend environment variables or a proper enterprise secrets manager.

Examples include:

```text
DATABRICKS_HOST
DATABRICKS_TOKEN
LLM_API_KEY
VECTOR_DATABASE_KEY
DATABASE_URL
JWT_SECRET
```

The `.env` file must not be committed.

The repository should contain:

```text
.env
.env.*
!.env.example
```

where appropriate.

`.env.example` may contain variable names but must never contain real credentials.

Example:

```env
DATABRICKS_HOST=
DATABRICKS_TOKEN=
LLM_API_KEY=
DATABASE_URL=
JWT_SECRET=
```

## 9. RAG / Business Context Security

The RAG layer contains organizational knowledge such as:

- SOPs
- warranty policies
- business rules
- KPI definitions
- OEM documentation
- compliance information
- internal reports

Not every user should necessarily access every document.

Therefore:

```text
User
 ↓
Authorization
 ↓
RAG Retrieval Filter
 ↓
Authorized Documents
 ↓
AXIS
```

The backend must filter retrieval results according to the user's permissions.

The LLM should never receive unauthorized business-context documents.

## 10. RAG Metadata Security

RAG documents should have metadata allowing authorization filtering.

Potential metadata:

```text
document_id
domain
owner
classification
allowed_roles
allowed_users
created_at
updated_at
```

Example:

```json
{
  "document_id": "doc_123",
  "classification": "INTERNAL",
  "allowed_roles": [
    "ADMIN",
    "AUTHORIZED"
  ]
}
```

The exact metadata structure should follow the database design.

## 11. LLM Security Boundary

The LLM must not be treated as a trusted security component.

The LLM can:

- interpret user questions
- reason over authorized context
- generate SQL
- generate recommendations
- prepare reports
- propose actions

The LLM must not independently decide:

- whether a user is authorized
- whether a user can access a dataset
- whether a user can execute an action
- whether a sensitive document can be retrieved
- whether a high-risk action should bypass approval

Those decisions belong to deterministic backend logic.

## 12. LangGraph Tool Security

AXIS agents will interact with backend tools.

Examples:

```text
search_business_context
query_databricks
generate_sql
validate_sql
execute_sql
run_analytics
generate_report
prepare_action
execute_action
```

Each tool must enforce its own security boundary.

For example:

```text
AXIS
 ↓
execute_sql()
 ↓
Check authenticated user
 ↓
Check dataset permission
 ↓
Validate SQL
 ↓
Execute
```

The tool must not assume that because AXIS requested an operation, the operation is authorized.

## 13. SQL Security

Generated SQL must always be treated as untrusted output.

The SQL agent should generate SQL, but a deterministic validation layer must validate it before execution.

Required flow:

```text
User Question
      ↓
AXIS SQL Agent
      ↓
Generated SQL
      ↓
SQL Parser / Validator
      ↓
Dataset Authorization
      ↓
Column Authorization
      ↓
Read/Write Policy
      ↓
Query Limits
      ↓
Databricks
```

## 14. Read-Only SQL for V1

The initial AxioGo analytical SQL interface should be read-only.

Allowed operations should generally be limited to analytical queries such as:

```text
SELECT
WHERE
GROUP BY
ORDER BY
JOIN
LIMIT
```

The system should reject or restrict destructive operations such as:

```text
INSERT
UPDATE
DELETE
DROP
ALTER
TRUNCATE
CREATE
```

unless a separate explicitly authorized workflow is introduced later.

## 15. SQL Data Leakage Protection

SQL results must also be authorized.

Authorization is not complete merely because the SQL itself is valid.

Example:

```text
User has access to fleet maintenance
but not personally identifiable driver information.
```

The backend must prevent unauthorized columns from appearing in the result.

The system should also consider:

- row-level access
- column-level access
- sensitive fields
- aggregation leakage
- excessive result sizes

## 16. Query Limits

Analytical queries should have reasonable execution limits.

Possible controls:

```text
maximum execution time
maximum returned rows
maximum result size
maximum concurrent queries
query timeout
```

This prevents accidental or malicious resource exhaustion.

Exact values should be chosen during backend implementation based on the deployment environment.

## 17. Prompt Injection Protection

Business-context documents and external knowledge may contain malicious or misleading instructions.

Retrieved text must be treated as data, not as trusted system instructions.

AXIS should follow a hierarchy similar to:

```text
System security rules
        ↓
Backend authorization
        ↓
Application rules
        ↓
User request
        ↓
Retrieved business context
```

Retrieved documents must not be allowed to override system or authorization rules.

## 18. Sensitive Data Handling

Potentially sensitive information may include:

- enterprise user information
- vehicle information
- driver information
- insurance information
- financial information
- operational information
- internal policies
- audit records

Sensitive information should only be returned when the authenticated user is authorized to access it.

## 19. Reports Security

Reports inherit the authorization context of the user who requests them.

The backend must verify:

```text
Can user access requested data?
        ↓
Can user generate this report?
        ↓
Can user access the resulting report?
```

A report must not become a way to bypass dataset restrictions.

For example:

```text
User cannot access Dataset X
        ↓
User cannot generate a report containing Dataset X
```

Report download endpoints must also re-check authorization.

## 20. Controlled Autonomous Actions

Actions represent the highest-risk area of AxioGo.

AXIS should distinguish between:

```text
Recommendation
```

and:

```text
Execution
```

The LLM should be able to recommend an action without automatically executing it.

Example:

```text
AXIS detects coolant failures
        ↓
Recommendation
        ↓
Prepare warranty claim
        ↓
Risk evaluation
        ↓
Human approval if required
        ↓
Execute
```

## 21. Human-in-the-Loop

High-risk actions should require human approval.

Example states:

```text
PROPOSED
    ↓
PENDING_APPROVAL
    ↓
APPROVED
    ↓
EXECUTING
    ↓
COMPLETED
```

Alternative terminal states:

```text
REJECTED
FAILED
CANCELLED
```

The approval must be associated with the authenticated user who approved it.

## 22. Action Authorization

Before executing an action, the backend must re-check:

1. User identity
2. User role
3. Action permission
4. Action risk level
5. Current action state
6. Required approval
7. Target resource authorization

Even if the action was previously prepared, execution authorization must be checked again.

## 23. Action Idempotency

Action execution should be protected against accidental duplicate execution.

For important operations, use an idempotency mechanism.

Example:

```http
Idempotency-Key: action-execution-123
```

The backend should prevent the same action from being unintentionally executed multiple times.

## 24. Audit Logging

Security-sensitive operations must produce audit records.

Examples:

```text
Login
Logout
Role change
Dataset access
SQL execution
Report generation
Report download
RAG document access
Action preparation
Action approval
Action rejection
Action execution
Administrative changes
```

Audit records should include information such as:

```text
timestamp
user_id
role
event
resource
action
status
severity
request_id
workflow_id
```

## 25. Audit Immutability

Normal users and normal application flows must not be able to modify or delete audit records.

Audit data should be append-oriented.

Administrative access to audit records should itself be audited.

## 26. Voice Security

Voice is another input channel to AXIS.

The security model must remain the same:

```text
Voice
 ↓
Transcription
 ↓
Authenticated User
 ↓
Authorization
 ↓
AXIS
```

A voice request must not bypass normal permissions.

For example, asking for restricted financial data by voice must not grant additional access.

Voice transcription should be treated as user input and therefore untrusted.

## 27. Voice Data Retention

For V1, avoid storing raw voice recordings unless there is a clear product requirement.

Prefer:

```text
Audio
 ↓
Transcription
 ↓
AXIS
```

rather than permanently storing audio.

If audio is stored later, retention and access policies must be defined.

## 28. API Security

The backend API should include:

- authentication
- authorization
- request validation
- rate limiting where appropriate
- request size limits
- secure error handling
- CORS restrictions
- HTTPS in production

Production API traffic should use HTTPS.

## 29. CORS

The backend should allow requests only from approved AxioGo frontend origins.

Development may allow the local frontend origin.

Production should use the actual deployed AxioGo frontend origin.

Avoid:

```text
Access-Control-Allow-Origin: *
```

for authenticated production APIs unless there is a deliberate and justified architecture requiring it.

## 30. Input Validation

All API inputs must be validated server-side.

Examples:

- user IDs
- dataset IDs
- report formats
- action types
- SQL requests
- workspace IDs
- query parameters
- voice input metadata

Never rely solely on frontend validation.

## 31. Error Handling

Errors returned to users should not expose sensitive implementation details.

Avoid returning:

```text
database passwords
Databricks tokens
stack traces
internal filesystem paths
private service URLs
LLM provider credentials
```

Instead return controlled errors such as:

```json
{
  "success": false,
  "error_code": "FORBIDDEN",
  "message": "You do not have permission to access this resource."
}
```

Detailed technical information should remain in protected backend logs.

## 32. Logging

Backend logs should support troubleshooting without exposing secrets.

Never log:

```text
passwords
access tokens
API keys
database credentials
full sensitive datasets
private user secrets
```

Use request IDs to correlate operations.

Example:

```text
request_id
workflow_id
user_id
operation
status
duration
```

## 33. Frontend Storage

Sensitive authentication information should not be casually stored in browser-accessible storage.

Avoid putting:

```text
Databricks credentials
LLM API keys
database credentials
service tokens
```

in the frontend under any circumstances.

The backend remains the trust boundary.

## 34. Database Security

Database credentials must remain backend-only.

Database access should use:

- least-privilege credentials
- parameterized queries where applicable
- connection limits
- appropriate encryption
- controlled migrations

The application should not use a database superuser for normal application operations.

## 35. Least Privilege

Every component should receive only the permissions it needs.

Example:

```text
Frontend
→ API access only

AXIS SQL tool
→ authorized analytical query access

RAG tool
→ authorized context retrieval

Report service
→ permitted report data

Action service
→ only explicitly permitted actions
```

Avoid giving one service unrestricted access to the entire enterprise environment.

## 36. Authorization Context Propagation

When AXIS invokes a tool, the authenticated user's security context must remain attached to the request.

Conceptually:

```text
User
 ↓
API
 ↓
user_id + role + permissions
 ↓
LangGraph
 ↓
Tool
 ↓
Authorization check
```

The tool must not execute as an anonymous or unrestricted system user without applying the original user's authorization context.

## 37. Multi-Agent Security

AXIS contains multiple specialized agents.

Agents should not automatically have access to every capability.

Example:

```text
Coordinator
→ routing

Knowledge Agent
→ RAG retrieval

SQL Agent
→ SQL generation

Analytics Agent
→ analytical reasoning

Report Agent
→ report preparation

Workflow Agent
→ controlled action workflows
```

High-risk tools should be isolated from general reasoning tools.

In particular:

```text
execute_action
```

should not be available as an unrestricted general-purpose LLM tool.

## 38. Data Minimization

Only provide the LLM with the data required to answer the user's question.

Prefer:

```text
Relevant authorized rows
Relevant business context
Required metadata
```

rather than:

```text
Entire enterprise database
```

This reduces:

- data exposure
- token usage
- hallucination risk
- accidental leakage

## 39. Security of Business Definitions

Business definitions are trusted organizational knowledge but must still be governed.

Examples:

```text
KPI formulas
Business rules
SOP policies
Warranty rules
Ownership definitions
```

Only authorized administrators or designated knowledge owners should modify these definitions.

Changes should be auditable.

## 40. Security of AXIS Configuration

AI configuration such as:

```text
temperature
maximum tokens
RAG retrieval limits
model selection
tool permissions
```

must not be freely configurable by normal users.

Administrative changes should be:

1. Authenticated
2. Authorized
3. Validated
4. Audited

## 41. Production Security Requirements

Before production deployment, AxioGo should have at minimum:

```text
HTTPS
Secure authentication
Backend RBAC
Databricks credentials protected
LLM credentials protected
RAG authorization filtering
SQL validation
Read-only analytical SQL
Action approval controls
Audit logging
CORS restrictions
Input validation
Rate limiting where required
Secure error handling
```

## 42. V1 Deferred Security Features

For a small initial implementation, the following may be intentionally deferred:

- Enterprise SSO/SAML integration
- SCIM provisioning
- Advanced row-level security across every enterprise source
- Dedicated secrets-management platform
- Full SIEM integration
- Advanced anomaly detection
- Automated security policy engine
- Multi-region disaster recovery
- Formal penetration testing
- Advanced data-loss-prevention platform
- Fine-grained attribute-based access control
- Comprehensive model red-team program

These should not be silently assumed to exist in V1.

## 43. Security Testing

Before production, test at least:

### Authentication

- invalid login
- expired token
- missing token
- revoked session

### Authorization

- STANDARD accessing ADMIN endpoint
- unauthorized dataset access
- unauthorized report access
- unauthorized action execution

### SQL

- destructive SQL
- unauthorized tables
- unauthorized columns
- excessive result sizes
- SQL injection attempts

### RAG

- restricted document retrieval
- prompt injection in documents
- cross-user document access

### Actions

- execute without approval
- execute after rejection
- duplicate execution
- expired authorization

### API

- malformed input
- oversized request
- invalid IDs
- rate-limit behavior

## 44. Security Principle for AXIS

The most important architectural rule is:

```text
LLM proposes.
Backend verifies.
Authorization decides.
Human approves when required.
Backend executes.
Audit records everything important.
```

AXIS should never be designed as an unrestricted autonomous administrator of the enterprise environment.

## 45. V1 Security Summary

For V1, AxioGo should focus on a strong and understandable security boundary:

```text
             AUTHENTICATED USER
                     |
                     v
              AXIOGO API
                     |
              RBAC / PERMISSIONS
                     |
          +----------+----------+
          |          |          |
          v          v          v
         RAG      Databricks   AXIS
          |          |          |
          +----------+----------+
                     |
               Authorized Result
                     |
          +----------+----------+
          |          |          |
          v          v          v
        Answer      Table     Report

                     |
                  Action?
                     |
                     v
              Risk Evaluation
                     |
              Human Approval
                     |
                     v
                 Execute
                     |
                     v
                 Audit Log
```

This provides the security foundation required for AxioGo without over-engineering the first implementation.
