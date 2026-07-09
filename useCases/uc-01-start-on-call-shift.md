# UC-01 - Start An On-call Shift And Understand Current Risk

## User Groups From Product Map

- Primary: On-call responder.
- Supporting: Incident commander; Engineering manager / reliability lead.

## Main Screens

- Operations Dashboard.
- On-call & Escalation.

## User Goal

The responder needs to begin a shift with a fast understanding of current
operational risk, active incidents, ownership load, handoff state and coverage
gaps.

## Trigger

The responder starts a scheduled on-call shift or accepts a handoff from another
responder.

## Main Flow

1. User opens the Operations Dashboard.
2. System shows active critical alerts, active incidents, unowned alerts,
   coverage health and response-quality snapshot.
3. User checks "my shift" or team view.
4. User opens On-call & Escalation if there are handoff items or coverage gaps.
5. User accepts handoff or starts triaging the highest-priority alert.

## Key UI Requirements

- Current on-call status is visible in the header.
- Dashboard risk strip shows critical, unowned, SLA-risk and flapping counts.
- Handoff items show current hypothesis, next action and blocker.
- Coverage gaps are explicit and actionable.

## Success Criteria

- User can identify whether the shift is safe within 30 seconds.
- User can see which alert or incident needs attention first.
- Handoff acceptance is recorded with actor and timestamp.
