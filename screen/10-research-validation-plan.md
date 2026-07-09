# 10 - Research And Validation Plan

## Purpose

This file defines how to validate the screen strategy before spending too much
time on high-fidelity UI. It exists because the UX Strategy summary emphasizes
that a product team should treat value proposition, personas and UI assumptions
as hypotheses until tested.

## Core Hypotheses

| Hypothesis | Why it matters | How to test |
| --- | --- | --- |
| On-call responders need ownership, impact, evidence and next action before acknowledgement | Determines Alert Queue and Inspector content | Timed triage usability test |
| Alert noise and unclear ownership are bigger pains than visual monitoring | Determines whether Rules/Service Detail deserve high IA priority | Problem interviews |
| Incident collaboration needs a dedicated room, not only alert comments | Determines whether Incident Room is core or secondary | Workflow walkthrough with incident commander |
| Service owners need post-incident learning tied back to alert rules | Determines Service Detail and Post-Incident Review connection | Prototype review with service owners |
| AI suggestions are useful only when evidence is visible | Determines AI card design | Trust/comprehension test |
| Header/sidebar global context improves speed instead of adding noise | Determines app shell density | Usability test across multi-screen task |

## Interview Plan

Target participants:

- 3-4 on-call engineers/SREs.
- 1-2 incident commanders or reliability leads.
- 2 service owners/platform engineers.
- 1 manager who reviews incident quality.

Problem interview topics:

- Last critical alert they handled.
- First 5-10 minutes: what they checked, where they clicked, who they asked.
- What made acknowledgement safe or unsafe.
- How they decide owner and escalation.
- How they handle duplicate/flapping alerts.
- How handoff happens across shifts/time zones.
- What information is missing in current tools.
- Which metrics matter after the incident.

Solution prototype tasks:

1. Start shift and identify what needs attention.
2. Find the highest-priority critical alert.
3. Decide whether to acknowledge or escalate.
4. Create an incident from related alerts.
5. Assign roles and create a handoff note.
6. Silence a planned-maintenance alert safely.
7. Generate a post-incident review draft.

## Success Metrics For Prototype

Usability metrics:

- Time to identify highest-priority alert.
- Time to understand owner/impact.
- Number of external tabs needed before acknowledgement.
- Error rate in silence scope selection.
- User confidence after AI suggestion.

Operational metrics the real product would aim to improve:

- MTTA.
- MTTR.
- Percent of alerts acknowledged with owner.
- Percent of incidents with commander and timeline.
- Alert duplicate/flapping ratio.
- Percent of critical alerts with runbook.
- Reopen rate.
- Action item completion rate.

## Screen-Specific Validation

Operations Dashboard:

- Can users decide where to go next without reading every card?
- Which top metrics are must-have versus vanity?

Alert Queue:

- Are row columns enough for triage?
- Are saved views aligned with real workflows?

Alert Detail Inspector:

- What evidence is necessary before acknowledge/assign/escalate?
- Are modals too heavy for emergency use?

Incident Room:

- Does timeline/task/role structure match real coordination behavior?
- Does it replace or complement chat?

Service Detail:

- Do service owners use history to tune alert rules?
- Is dependency context understandable?

Silences & Rules:

- Does blast-radius preview prevent unsafe silences?
- Who has permission to change rules?

Post-Incident Review:

- Does generated outline save time?
- Does it create better follow-through on action items?

## Competitive Research Direction

Tools to compare:

- PagerDuty.
- Opsgenie.
- Datadog Monitors/Incidents.
- Grafana OnCall.
- Splunk On-Call.
- Incident.io.
- Linear/Jira for follow-up workflows.

Comparison dimensions:

- Alert triage speed.
- Incident collaboration.
- Alert grouping/deduplication.
- Escalation/handoff clarity.
- Audit trail.
- AI/evidence transparency.
- Post-incident learning.
- Service ownership model.

## Product Decision Rule

Do not add a screen only because a competitor has it. Add a screen when it
supports a validated user job or a business outcome. For this interview project,
the first mockup should prioritize:

1. Alert Queue + Detail Inspector.
2. Incident Room.
3. Operations Dashboard.
4. Silences & Rules or Post-Incident Review, depending on which pain point seems
   strongest after discovery.
