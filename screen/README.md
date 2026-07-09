# Screen Documentation Index

## Product Thesis

WorldQuant Alert Management is an internal SPA for operational alert triage,
incident collaboration and reliability learning. The first design goal is not
to make another generic monitoring dashboard. The product should help technical
users answer, under pressure: what is happening, who owns it, what changed, what
should I do next, and how do we learn from it later?

The UX strategy is based on four principles from the UX Strategy summary:

- Business strategy: reduce operational risk, shorten MTTA/MTTR, improve
  reliability accountability and preserve auditability.
- Value innovation: combine alert queue, incident room, evidence, runbook,
  handoff and post-incident learning in one coherent workflow instead of
  forcing users to jump between disconnected tools.
- Validated user research: treat all personas and workflows below as
  provisional until validated with engineers, SREs, service owners and
  reliability leads.
- Killer UX design: express the strategy as dense, calm, action-oriented
  screens, not as decorative dashboards.

## Provisional User Groups

These groups are derived from the current interview/discovery assumptions. They
must be validated later through problem interviews.

| User group | Context | Primary goal | Main risk if UX fails |
| --- | --- | --- | --- |
| On-call responder | Gets paged during work hours or off hours | Triage quickly, acknowledge, find next action | Alert fatigue, wrong ownership, delayed response |
| Incident commander | Coordinates a live incident | Keep roles, timeline, decisions and tasks aligned | Duplicate work, missing handoff, unclear status |
| Service owner / platform engineer | Owns services, pipelines, datasets or infra | Understand recurring failures and improve rules/runbooks | Repeated noisy alerts, hidden reliability debt |
| Engineering manager / reliability lead | Reviews operational health and team load | See risk, workload, response quality and trends | Cannot prioritize reliability investments |
| Quant/research/business stakeholder | Consumes affected platforms or data indirectly | Know whether business-critical workflows are affected | Technical alerts do not map to business impact |
| Compliance/audit viewer | Reviews incident decisions after the fact | See who did what, when and why | Untraceable silence/resolve/escalation decisions |
| Alert admin | Maintains routing, escalation and suppression rules | Tune signal quality safely | Rule changes create blind spots |

## Use Case Map

| ID | Use case | Primary users | Main screens |
| --- | --- | --- | --- |
| UC-01 | Start an on-call shift and understand current risk | On-call responder | Operations Dashboard, On-call & Escalation |
| UC-02 | Scan active alerts and choose what needs action first | On-call responder, manager | Operations Dashboard, Alert Queue |
| UC-03 | Triage a critical alert in the first 5-10 minutes | On-call responder | Alert Queue, Alert Detail Inspector |
| UC-04 | Acknowledge an alert with ownership/audit trail | On-call responder | Alert Detail Inspector |
| UC-05 | Assign or reassign to the right owner/team | On-call responder, service owner | Alert Detail Inspector, On-call & Escalation |
| UC-06 | Escalate when impact or SLA risk increases | On-call responder, incident commander | Alert Detail Inspector, Incident Room |
| UC-07 | Create an incident from one or many alerts | On-call responder, incident commander | Alert Queue, Incident Room |
| UC-08 | Collaborate during an incident with roles and tasks | Incident commander, responders | Incident Room |
| UC-09 | Use evidence, runbooks and AI suggestions without blind trust | Responders, service owners | Alert Detail Inspector, Incident Room |
| UC-10 | Silence planned maintenance or noisy duplicates safely | Alert admin, service owner | Silences & Rules |
| UC-11 | Resolve, reopen or mark duplicate with reason | Responders, incident commander | Alert Detail Inspector, Incident Room |
| UC-12 | Review service reliability history and dependencies | Service owner, platform engineer | Service Detail |
| UC-13 | Produce a post-incident review and action items | Incident commander, manager | Post-Incident Review |
| UC-14 | Measure response quality and alert quality | Manager, reliability lead | Operations Dashboard, Post-Incident Review |
| UC-15 | Configure alert routing/escalation rules | Alert admin | Silences & Rules, On-call & Escalation |

## Screen Set

| File | Screen | Strategic purpose |
| --- | --- | --- |
| [01-app-shell-navigation.md](01-app-shell-navigation.md) | App shell and navigation | Create a stable SPA structure with header/sidebar navigation between large features |
| [02-operations-dashboard.md](02-operations-dashboard.md) | Operations Dashboard | Give the shift-level picture and route users to the next operational action |
| [03-alert-queue.md](03-alert-queue.md) | Alert Queue | Support high-speed triage, filtering, ownership and bulk grouping decisions |
| [04-alert-detail-inspector.md](04-alert-detail-inspector.md) | Alert Detail Inspector | Give enough context to acknowledge, assign, escalate, silence or resolve safely |
| [05-incident-room.md](05-incident-room.md) | Incident Room | Coordinate live response with roles, tasks, timeline, decisions and evidence |
| [06-service-detail.md](06-service-detail.md) | Service Detail | Help service owners reduce recurring failures and improve alert quality |
| [07-on-call-escalation.md](07-on-call-escalation.md) | On-call & Escalation | Make coverage, handoff and escalation explicit across time zones |
| [08-silences-and-rules.md](08-silences-and-rules.md) | Silences & Rules | Reduce noise without creating hidden operational blind spots |
| [09-post-incident-review.md](09-post-incident-review.md) | Post-Incident Review | Convert incident data into learning, action items and alert improvements |
| [10-research-validation-plan.md](10-research-validation-plan.md) | Validation Plan | Define how to test the assumptions before over-investing in UI implementation |

## SPA Information Architecture

The app uses one persistent header and one persistent sidebar.

Header responsibilities:

- Global alert search and command palette.
- Environment selector: Production, Research, Staging, Data Platform.
- Current on-call status, shift time and escalation availability.
- Global incident state: active incidents, SLA risk and unread mentions.
- Profile/team switcher.

Sidebar feature groups:

- Monitor: Operations Dashboard, Alert Queue, Service Detail.
- Respond: Incident Room, On-call & Escalation.
- Improve: Post-Incident Review, Silences & Rules.
- Configure: routing, notification and audit settings.

The reason for this IA: operational users often enter from an alert link, but
they need a stable way to move from triage to collaboration to learning. The
sidebar groups screens by job-to-be-done rather than by backend object. This
matches the UX Strategy principle that UX should reflect the user problem, not
the internal system model.

## Design Direction

The visual language should adapt WorldQuant public brand signals into a dense
internal tool:

- Dark operational background with high contrast text.
- Green as primary action/acknowledged/healthy state.
- Blue for research/AI/evidence modules.
- Orange/hot orange for severity, escalation and SLA risk.
- Thin severity rails, chips and focused highlights instead of full red cards.
- Tables, inspectors and timelines over marketing-style cards.

The reason: alert management is a high-pressure task. Visual intensity should be
reserved for decision moments, not spent on decoration.
