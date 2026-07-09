# UC-19 - Search Audit History And Historical Incidents

## Primary Users

- Compliance/audit viewer.
- Engineering manager / reliability lead.

## Supporting Users

- Incident commander.
- Service owner.

## Main Screens

- Alert Detail Inspector.
- Incident Room.
- Service Detail.
- Post-Incident Review.

## User Goal

The user needs to find past actions, decisions, silences, escalations and
incident outcomes for audit, learning and recurring-issue analysis.

## Trigger

The user investigates an incident after the fact, checks why an alert was
silenced/resolved, or searches for similar historical events.

## Main Flow

1. User searches by alert ID, incident ID, service, actor, time range, action or
   keyword.
2. System returns matching timeline events, incidents, silences and reviews.
3. User filters by service/team/action type.
4. User opens a result to inspect evidence, actor, timestamp and reason.
5. User exports or links the audit evidence if needed.

## Key UI Requirements

- Search accepts IDs, services, actors and action keywords.
- Timeline entries show actor, timestamp, reason and linked object.
- Silences and rule changes include before/after or scope details.
- Historical incidents can be compared to current alerts.

## Success Criteria

- Audit viewer can answer who did what, when and why.
- Reliability lead can identify recurring patterns from history.
- Similar historical incidents help current responders triage faster.

