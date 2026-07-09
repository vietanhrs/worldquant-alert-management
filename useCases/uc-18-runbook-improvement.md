# UC-18 - Improve Or Create Runbooks From Incident Learning

## User Groups From Product Map

- Primary: Service owner / platform engineer; On-call responder.
- Supporting: Incident commander; Alert admin.

## Main Screens

- Alert Detail Inspector.
- Service Detail.
- Post-Incident Review.

## User Goal

The user needs to turn missing or weak response guidance into better runbooks so
future responders can triage faster and more consistently.

## Trigger

An alert has no runbook, a runbook is marked unhelpful, or a post-incident
review identifies missing response steps.

## Main Flow

1. User sees missing or low-rated runbook signal in Alert Detail Inspector or
   Service Detail.
2. User opens runbook improvement action.
3. System pre-fills service, alert rule, recent incident context and evidence.
4. User writes or updates response steps, validation checks and escalation
   guidance.
5. User links runbook to alert rule/service.
6. System tracks runbook coverage and helpfulness later.

## Key UI Requirements

- Missing runbook is visible on alert and service screens.
- Runbook improvement can start from post-incident action item.
- Runbook fields focus on triage steps, verification, rollback/escalation and
  evidence links.
- Runbook helpfulness feedback is captured after use.

## Success Criteria

- Critical alerts have usable runbooks.
- Future responders need fewer external context switches.
- Runbook quality improves through incident learning.
