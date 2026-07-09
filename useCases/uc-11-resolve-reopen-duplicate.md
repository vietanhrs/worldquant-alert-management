# UC-11 - Resolve, Reopen Or Mark Duplicate With Reason

## Primary Users

- Responders.
- Incident commander.

## Main Screens

- Alert Detail Inspector.
- Incident Room.

## User Goal

The user needs to close or classify operational work accurately while preserving
enough context for review and recurrence analysis.

## Trigger

An alert or incident is mitigated, reappears after resolution, or is confirmed
as duplicate.

## Main Flow

1. User selects resolve, reopen or mark duplicate.
2. System asks for reason and optional root-cause category.
3. User links duplicate to source alert/incident if applicable.
4. System updates state.
5. System records actor, time, reason and linked item in timeline.

## Key UI Requirements

- Resolve and duplicate actions require reason.
- Reopen shows previous resolution reason.
- Duplicate state points to canonical alert/incident.
- Default views hide resolved items but keep them searchable.

## Success Criteria

- Closed items remain auditable.
- Reopen and duplicate patterns can be analyzed later.
- Users do not mistake resolved, silenced and duplicate states.

