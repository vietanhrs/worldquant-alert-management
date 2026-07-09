# UC-08 - Collaborate During An Incident With Roles And Tasks

## User Groups From Product Map

- Primary: Incident commander; On-call responder.
- Supporting: Service owner / platform engineer; Engineering manager / reliability lead.

## Main Screens

- Incident Room.

## User Goal

The team needs one shared workspace for roles, tasks, timeline, evidence,
decisions and handoff during a live incident.

## Trigger

An incident is opened or an active incident needs coordinated response.

## Main Flow

1. Incident commander opens Incident Room.
2. Commander assigns roles such as commander, tech lead and communications
   owner.
3. On-call responders add facts, hypotheses, decisions and tasks.
4. Evidence and runbooks are linked to the timeline.
5. Team resolves, monitors, hands off or escalates from the room.

## Key UI Requirements

- Roles are visible in a persistent side panel.
- Timeline distinguishes facts, hypotheses and decisions.
- Tasks have owner, status and next check time.
- Handoff requires current hypothesis, next action and blocker.

## Success Criteria

- Team members understand who owns what.
- Decisions are auditable and easy to review later.
- Handoff does not require reconstructing context from chat.
