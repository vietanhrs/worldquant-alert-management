# 09 - Post-Incident Review

## Screen Purpose

Post-Incident Review turns incident response data into learning. It helps teams
write a review, extract action items, improve alert quality and track recurrence
without manually reconstructing everything from chat logs.

## Use Cases Covered

- UC-11: resolve/reopen with reason.
- UC-13: produce a post-incident review and action items.
- UC-14: measure response quality and alert quality.
- UC-15: feed improvements back into rules/runbooks.

## Primary User Groups

- Incident commander.
- Service owner.
- Engineering manager / reliability lead.
- Audit viewer.
- Alert admin.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Post-Incident Review                     incident selector | export/share   │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Review outline                 │ Evidence timeline                           │
│ summary, impact, root cause    │ facts, decisions, tasks, linked alerts      │
│ action items, alert feedback   │                                             │
├───────────────────────────────┴─────────────────────────────────────────────┤
│ Action item tracker | Alert quality feedback | Recurrence detection          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Review Outline

Sections:

- Executive summary.
- Customer/business impact.
- Timeline summary.
- Root cause.
- What went well.
- What did not go well.
- Detection quality.
- Response quality.
- Follow-up action items.

The screen should prefill from incident data but keep humans in control of final
language.

## Evidence Timeline

Timeline source:

- Incident Room events.
- Linked alerts.
- State changes.
- Assignments/escalations.
- Runbook opens.
- Decisions.
- Tasks.
- Resolution and reopen events.

Users can promote timeline entries into the review outline. This avoids
copy-paste and preserves auditability.

## Action Items

Fields:

- Title.
- Owner.
- Due date.
- Category: code, infra, process, runbook, alert rule, training.
- Linked service/rule/incident.
- Status.

Action items should be visible from Service Detail later so learning loops back
into reliability work.

## Alert Quality Feedback

Questions:

- Did the alert fire early enough?
- Was severity correct?
- Was owner correct?
- Was runbook helpful?
- Was this a duplicate or noisy alert?
- Should a rule be changed?

This section is important because the product should improve the alert system,
not just record incidents.

## UX Strategy Rationale

This screen maps directly to UX Strategy's measurement and learning loop. The
product should not stop at "incident resolved". It should turn operational
events into validated learning and future improvements.

It also supports business strategy by creating evidence for reliability
investment. Managers can see patterns in action items, alert quality and
recurrence rather than arguing from anecdotes.

## Interaction Design

- Create review draft from resolved incident.
- Promote timeline entry into outline.
- Convert alert quality feedback into rule recommendation.
- Export Markdown/PDF.
- Link action items back to service or rule.
- Mark review complete only when required sections are filled.

## States

Draft:

- Auto-created after incident resolution.
- Missing required sections highlighted.

In review:

- Team comments and edits.

Completed:

- Locked summary with follow-up items still trackable.

Reopened:

- If incident reopens, review displays warning and links back to active incident.

## Validation Questions

- What format does WorldQuant expect for incident reviews?
- Who owns action item follow-through?
- Which parts can be auto-generated without reducing trust?
- Is alert-quality feedback part of current culture?
