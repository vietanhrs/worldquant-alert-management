# UC-07 - Create An Incident From One Or Many Alerts

## Primary Users

- On-call responder.
- Incident commander.

## Main Screens

- Alert Queue.
- Incident Room.

## User Goal

The user needs to group related alerts into a single incident so the response
has a shared owner, timeline, roles and communication surface.

## Trigger

Multiple alerts are correlated, business impact is significant, or the response
requires coordination across people/teams.

## Main Flow

1. User selects one or more alerts in Alert Queue.
2. User clicks "Create incident".
3. System proposes title, severity, impact, linked alerts and initial commander.
4. User confirms incident creation.
5. System opens Incident Room with linked alerts and initial timeline.

## Key UI Requirements

- Multi-select supports creating one incident from many alerts.
- Existing related incidents are shown to prevent duplicates.
- Incident creation preserves original alert links.
- Initial incident fields are editable before confirmation.

## Success Criteria

- Related alerts become one coordinated response.
- Incident Room starts with useful context.
- Duplicate incident creation is minimized.

