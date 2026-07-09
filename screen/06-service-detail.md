# 06 - Service Detail

## Screen Purpose

Service Detail is for service owners and platform engineers who need to
understand why a service keeps creating alerts and how to improve its
reliability posture.

## Use Cases Covered

- UC-05: assign or reassign to the right owner/team.
- UC-10: identify duplicates/flapping alerts before silencing.
- UC-12: review service reliability history and dependencies.
- UC-14: measure response quality and alert quality.
- UC-15: configure routing/escalation rules.

## Primary User Groups

- Service owner / platform engineer.
- On-call responder.
- Engineering manager / reliability lead.
- Alert admin.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Service name | owner team | environment | health | open alerts             │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Service profile                │ Reliability overview                        │
│ owner, runbook, dependencies   │ SLO burn, alert trend, incidents, deploys   │
├───────────────────────────────┴─────────────────────────────────────────────┤
│ Tabs: Active Alerts | History | Dependencies | Runbooks | Rules | Reviews   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Service Profile

Fields:

- Owner team and escalation policy.
- Primary contacts.
- Environment.
- Criticality tier.
- Runbook links.
- Dashboards.
- Source repository/config links if available.
- Data/business domain.

The owner block should appear near the top because ownership ambiguity is one of
the biggest incident-response risks.

## Reliability Overview

Cards:

- Current health.
- Open critical/high alerts.
- 24h alert volume.
- Flapping/duplicate ratio.
- SLO/SLA burn.
- Last deploy/config change.
- Recent incidents.

These metrics should be service-scoped. The goal is to help owners find the
highest-leverage improvement, not to rank teams publicly.

## Tabs

Active Alerts:

- Filtered alert queue for the service.
- Group by alert rule or dependency.

History:

- Alert volume trend.
- Incident timeline.
- MTTA/MTTR over time.
- Reopen rate.

Dependencies:

- Upstream/downstream services.
- Alerts linked to dependencies.
- Known failure propagation paths.

Runbooks:

- Existing runbooks.
- Missing runbook warnings.
- Last opened/runbook helpfulness feedback.

Rules:

- Alert rules for this service.
- Routing and escalation policy.
- Silence history.
- Rule quality indicators.

Reviews:

- Related post-incident reviews.
- Follow-up action items.
- Recurring root-cause tags.

## UX Strategy Rationale

Service Detail connects live operations with long-term improvement. This is
where the product moves from response to learning. In UX Strategy terms, it
links business outcome metrics to user behavior: service owners can see whether
alert quality and reliability work are improving.

The screen also supports competitive differentiation. Many alert tools focus on
the moment of paging. This design adds service-centered memory so the system can
reduce future noise.

## Interaction Design

- From Alert Queue, clicking service opens Service Detail in a new route.
- From Service Detail, users can open filtered queue or rule editor.
- Users can mark a runbook as helpful/not helpful after incident usage.
- Rule suggestions are presented as recommendations with evidence, not as auto
  changes.

## Design Notes

- Use a mixed layout: compact profile on the left, trend/health on the right,
  detailed tabs below.
- Avoid visually punishing teams with red-heavy scorecards.
- Use neutral language like "needs attention", "missing owner", "recurring
  alert" instead of blame-heavy labels.

## Validation Questions

- Which service metadata is actually available and trustworthy?
- Do service owners want this screen during incidents or mainly after?
- Which reliability metrics create action rather than defensiveness?
- Should dependency visualization be graph-based or table-first?
