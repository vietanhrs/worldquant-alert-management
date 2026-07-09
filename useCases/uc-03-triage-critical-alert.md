# UC-03 - Triage A Critical Alert In The First 5-10 Minutes

## Primary Users

- On-call responder.

## Main Screens

- Alert Queue.
- Alert Detail Inspector.

## User Goal

The responder needs enough context to decide whether to acknowledge, assign,
escalate, create an incident, silence, or resolve the alert.

## Trigger

A critical production alert fires.

## Main Flow

1. User opens the critical alert from Alert Queue.
2. System opens the Alert Detail Inspector.
3. User reviews impact, affected service, state, owner, related alerts, runbook,
   recent changes and AI evidence.
4. User chooses the safest next action.
5. System records the decision in the audit timeline.

## Key UI Requirements

- Inspector top section answers what is affected, who owns it, how severe it is
  and how long it has been firing.
- Evidence appears before AI recommendation.
- Runbook and related incident links are visible.
- Primary action changes based on alert state.

## Success Criteria

- User can reach a first decision in under 5 minutes.
- User does not need many external tabs before first action.
- Every action is recorded with actor, time and optional reason.

