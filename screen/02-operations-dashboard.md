# 02 - Operations Dashboard

## Screen Purpose

The Operations Dashboard is the shift-level cockpit. It is the first screen for
an on-call responder starting a shift and the overview screen for a reliability
lead checking whether the organization is in a healthy state.

The dashboard should not be a wall of charts. Its purpose is to route users to
the next operational decision.

## Use Cases Covered

- UC-01: start an on-call shift and understand current risk.
- UC-02: scan active alerts and choose what needs action first.
- UC-06: notice escalation/SLA risk.
- UC-12: identify recurring service risk.
- UC-14: measure response quality and alert quality.

## Primary User Groups

- On-call responder.
- Engineering manager / reliability lead.
- Service owner.
- Incident commander.

## Key Questions Answered

- Are we currently in a risky state?
- Which alert or incident needs action first?
- Is the current on-call load sustainable?
- Which service or team is generating the most operational risk?
- Are MTTA, MTTR and alert noise getting better or worse?

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Page title: Operations Dashboard                 Saved view | Time range    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Risk strip: Critical open | SLA risk | Unowned | Flapping | On-call health  │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Active critical alerts         │ Active incidents                            │
│ Dense priority list            │ Incident cards with owner, impact, age      │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Team workload                  │ Service risk heatmap                         │
│ Who is overloaded/unassigned   │ Services by alert volume + business impact   │
├───────────────────────────────┴─────────────────────────────────────────────┤
│ Response quality: MTTA, MTTR, reopen rate, noisy alert ratio, trend line     │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Content Details

Risk strip:

- Critical firing count.
- Critical unacknowledged count.
- Alerts breaching response SLA soon.
- Unowned alerts.
- Flapping alerts.
- Coverage status: "Primary on-call online", "handoff due in 18m", or "gap".

Active critical alerts:

- Only the top 5-8 alerts by priority.
- Each item shows severity, title, service, impact, owner, age and next action.
- Selecting an item opens the Alert Detail Inspector.

Active incidents:

- Incident title, severity, commander, responders, status, time since opened.
- Whether decision/action is blocked.
- Direct button to enter Incident Room.

Team workload:

- On-call responder load: assigned alerts, unresolved incidents, pending
  handoffs.
- Highlight overload patterns but avoid blaming language.

Service risk heatmap:

- Rows: services/pipelines/datasets.
- Columns: open alerts, recurrence, recent deploys, SLO burn, business impact.
- The goal is prioritization, not deep service analysis.

Response quality:

- MTTA and MTTR for selected time range.
- Alert noise ratio: duplicate/flapping/auto-resolved alerts.
- Reopen rate after resolve.
- Percent of alerts with owner and runbook.

## UX Strategy Rationale

This dashboard is designed around the funnel idea from UX Strategy: every stage
should have a desired action and a metric. The dashboard moves users from
"suspect risk exists" to "choose the next action". It avoids decorative metrics
that do not change behavior.

Value innovation here is the combination of operational health, ownership load
and alert quality in one screen. Pager-like tools often separate live queue,
team load and post-incident metrics. This dashboard intentionally connects them
because alert fatigue is both a live-response problem and a system-quality
problem.

## Interaction Design

- Saved views: "My shift", "Production critical", "Data platform", "Research
  systems", "All teams".
- Time range: now, 1h, 4h, 24h, 7d.
- Clicking any metric applies the corresponding filter in Alert Queue.
- Clicking a service in heatmap opens Service Detail.
- Keyboard shortcuts should prioritize search, alert queue and incident room.

## Empty And Edge States

Healthy state:

- Show "No critical active alerts" with last incident resolved time.
- Still show service risk and recent trend, so the screen remains useful.

High-noise state:

- Group duplicates and flapping alerts instead of flooding the dashboard.
- Show "noise suspected" insight with a link to Silences & Rules.

Coverage gap:

- Show explicit coverage warning and route to On-call & Escalation.

## Design Notes

- Do not use large hero typography. This is a work surface.
- Use compact cards and tables with 8px radius.
- Use hot orange only for the highest-risk state.
- Use WorldQuant green for primary actions and healthy/acknowledged states.

## Validation Questions

- Does the dashboard help an on-call responder decide the next action in under
  30 seconds?
- Which metrics are actually used by reliability leads?
- Do service owners understand the heatmap without explanation?
- Is team workload useful or politically sensitive?
