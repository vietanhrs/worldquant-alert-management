# UC-16 - Communicate Incident Status To Stakeholders

## User Groups From Product Map

- Primary: Incident commander.
- Supporting: Quant/research/business stakeholder; Engineering manager / reliability lead; Compliance/audit viewer.

## Main Screens

- Incident Room.
- Post-Incident Review.

## User Goal

The incident team needs to communicate impact, status and next update time to
non-responder stakeholders without leaking low-confidence technical guesses or
creating duplicate communication streams.

## Trigger

An incident affects research workflows, data freshness, production systems or a
business-critical service that stakeholders depend on.

## Main Flow

1. Incident commander or communications owner opens Incident Room.
2. System shows current impact, state, commander, responders and known facts.
3. User drafts stakeholder update from confirmed timeline facts.
4. User selects audience/channel and next update time.
5. System records update in the incident timeline.
6. Completed incident review reuses the status-update history.

## Key UI Requirements

- Stakeholder update separates confirmed facts from hypotheses.
- Update template includes impact, current status, next action and next update
  time.
- Audience/channel selection is explicit.
- Updates are recorded in the incident timeline for audit and review.

## Success Criteria

- Stakeholders understand impact and progress without interrupting responders.
- Incident team avoids conflicting status messages.
- Post-incident review can reference the communication timeline.
