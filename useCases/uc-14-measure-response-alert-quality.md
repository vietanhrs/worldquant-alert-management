# UC-14 - Measure Response Quality And Alert Quality

## User Groups From Product Map

- Primary: Engineering manager / reliability lead.
- Supporting: Service owner / platform engineer; Alert admin.

## Main Screens

- Operations Dashboard.
- Post-Incident Review.

## User Goal

The user needs to understand whether incident response and alert quality are
improving over time.

## Trigger

The user reviews operational health during a shift, weekly reliability review or
post-incident process.

## Main Flow

1. User opens Operations Dashboard.
2. User reviews MTTA, MTTR, unowned alerts, noise ratio, runbook coverage and
   reopen rate.
3. User drills into services, incidents or reviews causing poor metrics.
4. User identifies action items or rule/runbook improvements.
5. User tracks whether follow-up improves later metrics.

## Key UI Requirements

- Metrics are connected to actions and screens, not shown as vanity charts.
- Noise ratio, duplicate rate and flapping rate are visible.
- Review completion and action-item follow-through are measurable.
- Metrics can be filtered by team, service and time range.

## Success Criteria

- Reliability lead can identify where to invest improvement effort.
- Metrics support product decisions and team alignment.
- Alert quality is measured separately from response speed.
