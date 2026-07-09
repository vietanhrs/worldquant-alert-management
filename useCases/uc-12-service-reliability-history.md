# UC-12 - Review Service Reliability History And Dependencies

## User Groups From Product Map

- Primary: Service owner / platform engineer.
- Supporting: On-call responder; Engineering manager / reliability lead.

## Main Screens

- Service Detail.

## User Goal

The service owner needs to understand recurring reliability issues, dependency
risks, alert history, rule quality and follow-up work for a service.

## Trigger

The user investigates a service after an alert, incident or recurring noise
pattern.

## Main Flow

1. User opens Service Detail from Alert Queue, Dashboard or search.
2. System shows owner, criticality, runbooks, escalation policy and dashboards.
3. User reviews active alerts, history, dependencies, rules and reviews.
4. User identifies recurring failures or alert-quality issues.
5. User opens rule recommendation, runbook update or follow-up action item.

## Key UI Requirements

- Owner and escalation metadata appear near the top.
- Service health combines open alerts, SLO burn, deploys and incident history.
- Dependencies are visible enough to understand failure propagation.
- Alert-rule quality is connected to history and reviews.

## Success Criteria

- Service owner can identify the highest-leverage reliability improvement.
- Recurring incidents and noisy alerts are visible.
- Follow-up actions connect back to services and rules.
