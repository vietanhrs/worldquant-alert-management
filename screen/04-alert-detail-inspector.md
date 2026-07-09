# 04 - Alert Detail Inspector

## Screen Purpose

The Alert Detail Inspector gives enough context to make the next operational
decision safely without leaving the queue. It supports acknowledge, assign,
escalate, create incident, silence, resolve and reopen.

## Use Cases Covered

- UC-03: triage a critical alert in the first 5-10 minutes.
- UC-04: acknowledge an alert with ownership/audit trail.
- UC-05: assign or reassign to the right owner/team.
- UC-06: escalate when impact or SLA risk increases.
- UC-07: create an incident from one or many alerts.
- UC-09: use evidence, runbooks and AI suggestions without blind trust.
- UC-10: silence planned maintenance or noisy duplicates safely.
- UC-11: resolve, reopen or mark duplicate with reason.

## Primary User Groups

- On-call responder.
- Service owner.
- Incident commander.
- Alert admin.
- Audit viewer.

## Layout

```text
┌──────────────────────────────────────┐
│ Alert title + severity + state       │
│ Primary action row                   │
├──────────────────────────────────────┤
│ Impact summary                       │
├──────────────────────────────────────┤
│ Evidence stack                       │
│ - firing condition                   │
│ - metric/log anomaly                 │
│ - recent deploy/change               │
│ - related alerts                     │
├──────────────────────────────────────┤
│ Runbook + recommended next step      │
├──────────────────────────────────────┤
│ AI-assisted triage card              │
├──────────────────────────────────────┤
│ Timeline / audit trail               │
└──────────────────────────────────────┘
```

## Primary Action Row

Actions:

- Acknowledge.
- Assign.
- Escalate.
- Create incident.
- Silence.
- Resolve.

Interaction rules:

- Acknowledge is the default primary action only when alert is firing and not
  acknowledged.
- Assign is primary when alert is acknowledged but has no owner.
- Escalate becomes visually prominent when SLA risk, business impact or repeated
  firing crosses threshold.
- Silence and resolve use confirmation modals with reason fields.
- Reopen appears for recently resolved alerts.

## Impact Summary

The top section should answer:

- What is affected?
- Who is affected?
- How severe is it?
- How long has it been happening?
- Is there an active incident already?

Recommended fields:

- Service/pipeline/dataset.
- Environment.
- Business impact label.
- SLO/SLA burn if available.
- Related incident.
- Owner team.
- Customer/internal scope.

## Evidence Stack

Evidence should be visible before AI recommendations. This prevents the product
from becoming a black box.

Evidence items:

- Firing expression and current value.
- Metric trend sparkline.
- Log anomaly or error sample.
- Trace/query/dashboard link.
- Related alerts in the same window.
- Recent deploy/config/data change.
- Similar historical incidents.

## AI-Assisted Triage Card

Fields:

- Suggested root cause.
- Confidence.
- Evidence links.
- Recommended next action.
- "Accept suggestion", "Dismiss" and "Open evidence".

Rules:

- AI never auto-resolves or auto-silences.
- Confidence must be paired with evidence, not shown alone.
- Accepted/dismissed suggestion is recorded in audit trail.

## Modal Design

Acknowledge modal:

- Fast path: "Acknowledge as me".
- Optional note.
- Optional "assign to me".

Assign modal:

- Search team/person.
- Suggested owner based on service ownership.
- Show current on-call availability.

Escalate modal:

- Escalation target and channel.
- Reason.
- SLA/business impact preview.

Silence modal:

- Scope selector: alert instance, alert rule, service, label set, environment.
- Duration selector.
- Reason field required.
- Blast radius preview.

Resolve modal:

- Resolution reason.
- Root-cause category optional.
- Checkbox: "Create follow-up if alert quality issue was found".

## UX Strategy Rationale

The inspector embodies "action before decoration". Every section exists because
it supports a decision: acknowledge, assign, escalate, silence or resolve.

It also supports "validated user research" by making assumptions testable. If
users still need to open many external tabs before acknowledging, the inspector
has failed. The prototype should test whether evidence, owner and runbook
sections are enough for the first decision.

## Edge Cases

- Alert has no runbook: show "missing runbook" with create/request action.
- Owner unknown: show best inferred team and confidence.
- Related incident exists: promote "join incident" over "create incident".
- Alert is flapping: show frequency pattern and recommend rule review.
- Alert has been silenced before: show prior silence reason and recurrence.

## Validation Questions

- What exact context do engineers need before acknowledgement?
- Are silence/resolve confirmations too slow or appropriately safe?
- Does AI support feel transparent enough?
- Which evidence source is most trusted: metric, log, deploy or past incident?
