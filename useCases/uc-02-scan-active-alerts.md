# UC-02 - Scan Active Alerts And Choose What Needs Action First

## User Groups From Product Map

- Primary: On-call responder.
- Supporting: Engineering manager / reliability lead.

## Main Screens

- Operations Dashboard.
- Alert Queue.

## User Goal

The user needs to separate real operational risk from noise and decide which
alert deserves immediate attention.

## Trigger

The user receives multiple alerts, opens the queue during a shift, or checks
live operational health.

## Main Flow

1. User opens Operations Dashboard or Alert Queue.
2. User applies a saved view such as "Needs action", "Critical production", or
   "My assigned".
3. System shows severity, state, owner, age, impact, related-alert count and
   runbook availability.
4. User selects the top-priority alert.
5. System opens the Alert Detail Inspector for the selected alert.

## Key UI Requirements

- Alert table has compact rows and sticky header.
- Severity appears as a small rail/dot, not full-card alarm color.
- Filtering supports severity, team, service, state, environment, ownership and
  "only mine".
- Selected row keeps queue context while detail opens on the side.

## Success Criteria

- User can identify the highest-priority alert without opening every detail.
- The queue supports comparing severity, ownership, impact and age quickly.
- Noise and duplicate candidates are visible before bulk action.
