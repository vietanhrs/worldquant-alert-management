# UC-20 - Onboard A New Service And Validate Alert Readiness

## Primary Users

- Service owner.
- Alert admin.

## Supporting Users

- On-call responder.
- Engineering manager / reliability lead.

## Main Screens

- Service Detail.
- Silences & Rules.
- On-call & Escalation.

## User Goal

The user needs to onboard a service into alert management with clear ownership,
runbooks, routing, escalation and alert-quality checks before it becomes
production-critical.

## Trigger

A new service/pipeline/dataset is launched, promoted to production, or assigned
to an on-call rotation.

## Main Flow

1. User creates or opens service profile.
2. User adds owner team, criticality, environment, dashboards and runbooks.
3. User configures alert rules and routing/escalation policy.
4. System validates readiness: owner, runbook, escalation, notification channel,
   severity mapping and test alert.
5. User fixes gaps and enables production alerting.
6. System records readiness checklist and owner.

## Key UI Requirements

- Service profile has a readiness checklist.
- Required fields include owner, escalation policy, runbook and dashboards.
- Alert rules can be tested before production enablement.
- Missing readiness items are visible to service owners and admins.

## Success Criteria

- New services do not generate unowned or untriageable alerts.
- Production alerting starts with runbooks and escalation paths in place.
- Readiness gaps are visible before incidents happen.

