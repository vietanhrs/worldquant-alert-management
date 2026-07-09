# 05 - Incident Room

## Screen Purpose

The Incident Room is the collaboration surface for active incidents. It turns
one or more alerts into a coordinated response with roles, timeline, tasks,
evidence and decisions.

## Use Cases Covered

- UC-06: escalate when impact or SLA risk increases.
- UC-07: create an incident from one or many alerts.
- UC-08: collaborate during an incident with roles and tasks.
- UC-09: use evidence, runbooks and AI suggestions without blind trust.
- UC-11: resolve, reopen or mark duplicate with reason.
- UC-13: produce a post-incident review and action items.

## Primary User Groups

- Incident commander.
- On-call responder.
- Service owner.
- Engineering manager / reliability lead.
- Audit viewer.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Incident title | severity | state | commander | elapsed | resolve/escalate  │
├─────────────────┬───────────────────────────────────────────┬───────────────┤
│ Left rail       │ Main collaboration timeline                │ Right panel   │
│ Roles           │ Decisions, comments, state changes, alerts │ Evidence      │
│ Responders      │ Tasks                                      │ Runbooks      │
│ Impact          │ War-room thread                            │ Related       │
└─────────────────┴───────────────────────────────────────────┴───────────────┘
```

## Header

Incident header contains:

- Incident title.
- Severity and state.
- Incident commander.
- Elapsed time.
- Business impact.
- Buttons: escalate, handoff, resolve.

The header should stay sticky because incident coordination depends on shared
status.

## Left Rail

Roles:

- Incident commander.
- Technical lead.
- Communications owner.
- Service owner.
- Observers/watchers.

Impact:

- Affected services.
- Affected teams/users.
- Current known impact.
- SLA/SLO risk.

Handoff:

- Next shift owner.
- Handoff due time.
- Handoff note status.

## Main Timeline

Timeline events:

- Incident created.
- Alert linked.
- Responder joined.
- Role assigned.
- Decision made.
- Task created/completed.
- Runbook opened.
- Escalation sent.
- Related deploy detected.
- Status changed.
- Resolved/reopened.

Timeline entries should distinguish facts, hypotheses and decisions. For
example:

- Fact: "Error rate crossed 5%".
- Hypothesis: "Possible data pipeline lag after deploy".
- Decision: "Rollback started".

This reduces confusion during handoff and post-incident review.

## Task Area

Task fields:

- Title.
- Owner.
- Status.
- Due/next check time.
- Related evidence link.

Tasks should be lightweight. The goal is incident coordination, not replacing a
project management tool.

## Right Evidence Panel

Sections:

- Linked alerts.
- Metrics/logs/dashboards.
- Recent changes.
- Similar incidents.
- Runbooks.
- AI suggestions with evidence.

The panel stays separate from the main timeline so collaboration and evidence do
not compete for the same reading flow.

## UX Strategy Rationale

The Incident Room is the product's strongest value-innovation screen. Many
tools can page a person. The differentiator is turning a noisy alert into a
shared, auditable response. This supports business strategy by reducing response
time and coordination mistakes.

The design also follows the storyboard principle from UX Strategy. The key
experience is not "open incident page"; it is the sequence: alert becomes
incident, roles become clear, evidence becomes shared, decisions become
auditable, and learning becomes reusable.

## Interaction Design

- Create incident from one or more alerts in Alert Queue.
- Invite responders from team/on-call suggestions.
- Drag task status between todo, doing, blocked, done.
- Pin important timeline entries as "decision".
- Convert timeline to post-incident review draft.
- Handoff button requires current hypothesis, next action and blocker.

## States

Open:

- Active response, timeline input visible.

Monitoring:

- Incident impact is reduced but not resolved.
- Tasks and timeline still active.

Resolved:

- Resolution summary required.
- Post-incident review draft offered.

Reopened:

- Previous resolution and reopen reason visible.

## Validation Questions

- Do incident commanders prefer timeline-first or task-first layout?
- Which roles are real in WorldQuant's process?
- What external tools must be linked or embedded?
- Does the incident room reduce duplicated communication?
- Can the post-incident review be generated from the room without losing nuance?
