# 07 - On-call And Escalation

## Screen Purpose

On-call & Escalation makes responsibility visible: who is currently covering,
who is next, how escalation works and whether a handoff is safe.

## Use Cases Covered

- UC-01: start an on-call shift and understand current risk.
- UC-05: assign or reassign to the right owner/team.
- UC-06: escalate when impact or SLA risk increases.
- UC-08: hand off during active incident response.
- UC-15: configure escalation rules.

## Primary User Groups

- On-call responder.
- Incident commander.
- Engineering manager / reliability lead.
- Alert admin.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ On-call & Escalation                            team | timezone | week      │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Current coverage               │ Schedule timeline                           │
│ primary, secondary, gaps       │ week/day view, timezone aware               │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ Escalation policies            │ Handoff queue                                │
│ levels, channels, delays       │ due soon, missing note, active incident      │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

## Current Coverage

Shows:

- Current primary responder.
- Secondary/backup responder.
- Incident commander availability if different.
- Coverage gaps.
- Local time for responders.
- Current assigned alert load.

The screen should make it obvious when the current person is overloaded or
offline. This prevents silent ownership failure.

## Schedule Timeline

Timeline modes:

- Today.
- Week.
- Team rotation.
- Timezone overlay.

Each shift block shows:

- Person/team.
- Role.
- Local time.
- Handoff status.
- Current active incidents assigned to that shift.

## Escalation Policies

Policy card fields:

- Service/team.
- Level 1, level 2, level 3 responders.
- Delay before escalation.
- Channels.
- Business-critical override.
- Last updated.

Policy editing belongs in a guarded configuration drawer because changing
escalation can create operational risk.

## Handoff Queue

Handoff item fields:

- Alert/incident.
- Current owner.
- Next owner.
- Time due.
- Required note status.
- Current hypothesis.
- Next action.
- Blocker.

Handoff note should be structured. Free-form chat is not enough because the next
responder needs fast context.

## UX Strategy Rationale

This screen supports the "validated user research" assumption that ownership and
handoff are key pain points. If interviews show that the organization already
has excellent handoff tooling, this screen may shrink. If not, it becomes a core
value differentiator.

It also reflects the business strategy: coverage gaps and unclear escalation
directly affect MTTA/MTTR and incident risk. The design makes responsibility
visible before it becomes a failure.

## Interaction Design

- "Escalate now" from an alert opens a prefilled escalation drawer.
- "Start handoff" requires structured note.
- "Accept handoff" records actor/time and optionally reassigns alerts.
- Managers can inspect coverage gaps but should not interrupt live response
  unless needed.

## Safety Rules

- Escalation policy changes require reason and audit trail.
- Handoff cannot be marked complete without next owner acceptance.
- Coverage gap warnings appear in header if severe.

## Validation Questions

- How are on-call rotations currently managed?
- Are time zones relevant for WorldQuant teams?
- What information makes a handoff safe?
- Should escalation be manual, automatic or hybrid?
