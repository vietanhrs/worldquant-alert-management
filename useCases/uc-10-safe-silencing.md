# UC-10 - Silence Planned Maintenance Or Noisy Duplicates Safely

## Primary Users

- Alert admin.
- Service owner.

## Main Screens

- Silences & Rules.

## User Goal

The user needs to reduce alert noise without creating blind spots or hiding real
incidents.

## Trigger

The team has planned maintenance, repeated duplicates, flapping alerts or a rule
that is firing without useful action.

## Main Flow

1. User opens Silences & Rules or clicks "Silence" from Alert Detail Inspector.
2. User chooses scope: alert instance, rule, service, label set or environment.
3. User selects duration.
4. User enters required reason.
5. System previews affected alerts/services.
6. User confirms silence.

## Key UI Requirements

- Silence scope and duration are explicit.
- Reason is required.
- Blast-radius preview is shown before confirmation.
- Broad production silence needs stronger confirmation.
- Silence expiry is visible in active silences list.

## Success Criteria

- Noise is reduced without hiding unrelated critical alerts.
- Every silence has actor, time, scope, duration and reason.
- Expiring silences are visible before they surprise responders.

