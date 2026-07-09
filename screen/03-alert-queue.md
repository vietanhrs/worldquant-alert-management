# 03 - Alert Queue

## Screen Purpose

The Alert Queue is the main triage surface. It is optimized for the first 5-10
minutes after alerts fire: filter, understand priority, acknowledge, assign,
group, escalate or open the detail inspector.

## Use Cases Covered

- UC-02: scan active alerts and choose what needs action first.
- UC-03: triage a critical alert in the first 5-10 minutes.
- UC-04: acknowledge an alert with ownership/audit trail.
- UC-05: assign or reassign to the right owner/team.
- UC-07: create an incident from one or many alerts.
- UC-10: identify duplicates/flapping alerts before silencing.
- UC-11: resolve, reopen or mark duplicate with reason.

## Primary User Groups

- On-call responder.
- Service owner.
- Incident commander.
- Alert admin.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Alert Queue                                   Saved view | Bulk actions     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter bar: severity | team | service | state | env | age | only mine       │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Alert table                    │ Detail inspector when row is selected       │
│ compact rows + sticky header   │ summary, evidence, runbook, timeline        │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

The queue uses a split layout. The table remains visible while the selected
alert opens in a right inspector. This is faster than navigating away for every
triage decision.

## Table Columns

Recommended columns:

- Severity rail.
- Alert title.
- Service / pipeline / dataset.
- State: firing, acknowledged, assigned, silenced, resolved, duplicate.
- Owner/team.
- Age and last seen.
- Occurrence count.
- Business impact.
- Related alerts.
- Runbook availability.
- Primary action.

The first version should avoid too many columns. Advanced metadata can appear in
the inspector or column chooser.

## Row Anatomy

Each row should show:

- Thin left severity rail, not a full red background.
- Alert title in strong text.
- Service ID in monospace or compact chip.
- State chip with text label.
- Owner avatar/team chip.
- Age with relative and exact timestamp in tooltip.
- A one-line impact phrase: "research data delayed", "orders blocked",
  "internal only", etc.

The reason: in operational contexts users scan horizontally. A consistent row
shape reduces cognitive load and helps the responder compare alerts quickly.

## Filters And Views

Default views:

- Needs action.
- My assigned.
- Critical production.
- Unowned.
- Flapping/noisy.
- Recently resolved.

Filters:

- Severity.
- Team.
- Service.
- Environment.
- State.
- Age.
- Ownership.
- Business impact.
- Runbook missing.
- Related to active incident.

Search accepts alert ID, service name, runbook keyword, trace ID and owner.

## Bulk Actions

Bulk actions are available only after selecting multiple rows:

- Acknowledge.
- Assign.
- Create incident.
- Mark duplicate.
- Silence.

Safety rules:

- Bulk silence always requires scope, duration and reason.
- Bulk resolve requires reason and shows impacted services.
- Bulk actions should preview how many services and teams are affected.

## UX Strategy Rationale

The key value proposition is faster, safer triage. The Alert Queue is therefore
not a generic data table. It is a decision tool. It makes ownership, severity,
impact, recurrence and next action visible at row level.

This follows the UX Strategy idea that design should validate the riskiest
assumption. The riskiest assumption here is that responders can determine the
right first action from available context. The queue should be prototyped and
tested with timed triage tasks.

## Interaction Design

- Row click selects and opens inspector.
- Double-click or Enter opens full alert detail if needed.
- `A` acknowledges selected alert.
- `S` opens silence modal.
- `E` opens escalation path.
- `I` creates an incident from selected alerts.
- Shift-click supports multi-select.
- Saved views can be shared with a team.

## States

New firing:

- Subtle pulse only for a short time.
- Stop animation after acknowledgement or after user focuses row.

Acknowledged:

- Green state chip.
- Show actor and time in tooltip.

Assigned:

- Owner/team visible in row.
- If assigned to current user, row gets "mine" indicator.

Silenced:

- Muted row treatment.
- Show silence expiry and reason.

Resolved:

- Hidden from default active view but available in recently resolved.

## Validation Questions

- Can users identify the highest-priority alert without opening detail?
- Which columns are essential in the first 5 minutes?
- Do users trust business-impact labels?
- Is split view faster than full-page detail navigation?
- Are bulk actions helpful or too risky?
