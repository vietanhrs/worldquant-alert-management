# 08 - Silences And Rules

## Screen Purpose

Silences & Rules helps teams reduce alert noise without hiding real incidents.
It covers temporary silences, recurring noisy alerts, duplicate grouping and
rule quality.

## Use Cases Covered

- UC-10: silence planned maintenance or noisy duplicates safely.
- UC-12: review recurring service alert history.
- UC-14: measure alert quality.
- UC-15: configure alert routing/escalation rules.

## Primary User Groups

- Alert admin.
- Service owner.
- On-call responder.
- Reliability lead.
- Audit viewer.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Silences & Rules                       create silence | create rule change  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Alert quality strip: noisy | duplicate | flapping | missing runbook | stale │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Active silences table          │ Rule quality / recommendations              │
│ scope, reason, owner, expiry   │ evidence-backed improvement opportunities   │
├───────────────────────────────┴─────────────────────────────────────────────┤
│ Tabs: Active Silences | Expired | Rule Catalog | Change History | Audit      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Active Silences

Columns:

- Scope.
- Service/team.
- Environment.
- Reason.
- Created by.
- Starts/ends.
- Affected alert count.
- Expiry warning.
- Linked maintenance/incident.

Silence rows should make blast radius visible. A broad silence should look
meaningfully different from a narrow one.

## Silence Creation Flow

Steps:

1. Choose scope: alert instance, alert rule, service, label set, environment.
2. Choose duration.
3. Add reason.
4. Preview affected alerts/services.
5. Confirm.

Reason is required. The UI should encourage concrete reasons like "planned
maintenance for data pipeline deploy" instead of vague notes like "noise".

## Rule Quality

Signals:

- Flapping frequency.
- Duplicate rate.
- Auto-resolved without human action.
- Alerts without runbook.
- Alerts with frequent reassignment.
- Alerts repeatedly silenced.
- Alerts linked to incidents.

Recommendations:

- Tune threshold.
- Add grouping key.
- Add runbook.
- Change owner.
- Split rule by environment.
- Convert to lower-severity notification.

Recommendations must show evidence and should not auto-apply.

## UX Strategy Rationale

This screen is about value innovation and risk control. Reducing alert fatigue
is valuable, but unsafe silence can create hidden incidents. The design balances
speed with guardrails: fast creation, visible blast radius, required reason and
audit history.

From UX Strategy's perspective, this is a place where business strategy and user
pain can conflict. The user wants fewer alerts. The business needs no missed
critical incident. The UX must make the trade-off explicit.

## Interaction Design

- From Alert Detail, "Silence" opens the same creation drawer with prefilled
  scope.
- Expiring silence warnings appear in header and dashboard when relevant.
- Rule recommendations can be saved as draft changes.
- Rule change history shows actor, time, reason and before/after summary.

## Safety And Audit

- No indefinite silence by default.
- Broad silence requires stronger confirmation.
- Production silence should require a linked reason/maintenance window if
  available.
- All changes create audit entries.
- Expired silences remain searchable.

## Validation Questions

- What are the most common noise sources?
- Who is allowed to create production silences?
- Is rule tuning part of on-call work or a separate reliability workflow?
- What level of confirmation is safe without slowing incident response too much?
