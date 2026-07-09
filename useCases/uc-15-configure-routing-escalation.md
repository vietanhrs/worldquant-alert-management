# UC-15 - Configure Alert Routing/Escalation Rules

## Primary Users

- Alert admin.

## Supporting Users

- Service owner.
- Engineering manager / reliability lead.

## Main Screens

- Silences & Rules.
- On-call & Escalation.

## User Goal

The alert admin needs to configure routing and escalation policies safely so
alerts reach the right responder at the right time.

## Trigger

A new service is onboarded, ownership changes, escalation policy changes, or
alert-quality review shows incorrect routing.

## Main Flow

1. User opens Silences & Rules or On-call & Escalation.
2. User selects service/team policy.
3. User edits owner, levels, delay, channels or business-critical override.
4. System previews affected alerts/services.
5. User enters reason and confirms change.
6. System records before/after summary in audit history.

## Key UI Requirements

- Policy editor shows current owner, levels, delays and channels.
- Changes require reason.
- Before/after summary is visible before confirmation.
- Production-impacting changes are auditable.
- Routing recommendations show evidence before adoption.

## Success Criteria

- Alerts route to correct on-call responders.
- Policy changes do not accidentally create coverage gaps.
- Audit history explains who changed routing and why.

