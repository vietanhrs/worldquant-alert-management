# UC-06 - Escalate When Impact Or SLA Risk Increases

## Primary Users

- On-call responder.
- Incident commander.

## Main Screens

- Alert Detail Inspector.
- Incident Room.

## User Goal

The user needs to involve the right people quickly when business impact,
severity, recurrence or SLA/SLO risk increases.

## Trigger

An alert crosses escalation threshold, remains unresolved, affects a critical
service, or becomes linked to an active incident.

## Main Flow

1. User selects alert or incident.
2. User clicks "Escalate".
3. System previews escalation target, channel, reason and SLA/business impact.
4. User confirms escalation.
5. System notifies escalation target and records timeline event.

## Key UI Requirements

- Escalation action is prominent only when risk justifies it.
- Escalation path shows level, delay and target responder/team.
- User must enter or confirm reason.
- Escalation event appears in alert and incident timelines.

## Success Criteria

- Escalation reaches the correct responder/team.
- Escalation reason and time are auditable.
- Incident commander can see escalation status without asking in chat.

