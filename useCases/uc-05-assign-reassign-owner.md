# UC-05 - Assign Or Reassign To The Right Owner/Team

## User Groups From Product Map

- Primary: On-call responder; Service owner / platform engineer.
- Supporting: Alert admin.

## Main Screens

- Alert Detail Inspector.
- On-call & Escalation.

## User Goal

The user needs to route an alert to the correct owner or team based on service
ownership, on-call availability and current workload.

## Trigger

An alert has no owner, an owner is unavailable, or triage shows another team is
responsible.

## Main Flow

1. User clicks "Assign" in Alert Detail Inspector.
2. System suggests owner/team based on service metadata and on-call roster.
3. User reviews availability and workload.
4. User assigns or reassigns with optional reason.
5. System updates alert owner and writes timeline event.

## Key UI Requirements

- Suggested owner is visible with confidence/source.
- Current on-call availability is visible in the assignment flow.
- Reassignment requires lightweight reason when ownership changes team.
- Assignment changes appear immediately in queue and timeline.

## Success Criteria

- Alert reaches the correct team with minimal back-and-forth.
- Reassignment history is traceable.
- No alert remains unowned when response SLA is at risk.
