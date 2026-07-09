# UC-09 - Use Evidence, Runbooks And AI Suggestions Without Blind Trust

## Primary Users

- Responders.
- Service owners.

## Main Screens

- Alert Detail Inspector.
- Incident Room.

## User Goal

The user needs help triaging faster while still seeing the evidence behind any
suggested root cause or next action.

## Trigger

The user opens an alert or incident with available correlated signals, runbook
links or AI-assisted triage.

## Main Flow

1. System displays raw evidence: firing condition, metrics, logs, recent
   changes, related alerts and past incidents.
2. System displays AI suggestion with confidence.
3. User opens evidence links before accepting or dismissing the suggestion.
4. User applies a recommended next action or ignores the suggestion.
5. System records accepted/dismissed suggestion in timeline.

## Key UI Requirements

- AI suggestion never appears without evidence.
- AI never auto-resolves or auto-silences.
- Confidence is visible but not treated as proof.
- Runbook link is visible next to evidence and recommended next action.

## Success Criteria

- User can understand why a suggestion was made.
- AI support speeds triage without hiding uncertainty.
- Accepted/dismissed AI actions are auditable.

