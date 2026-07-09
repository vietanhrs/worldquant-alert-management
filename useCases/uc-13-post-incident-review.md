# UC-13 - Produce A Post-Incident Review And Action Items

## Primary Users

- Incident commander.
- Engineering manager / reliability lead.

## Main Screens

- Post-Incident Review.

## User Goal

The user needs to turn incident response data into a review, action items and
alert-quality improvements without manually rebuilding the timeline.

## Trigger

An incident is resolved or moved to post-incident review.

## Main Flow

1. User opens Post-Incident Review from resolved incident.
2. System drafts summary, impact, timeline and linked evidence.
3. User edits root cause, what went well, what did not go well and action items.
4. User adds alert-quality feedback.
5. User completes review and tracks follow-up actions.

## Key UI Requirements

- Review outline is prefilled but editable.
- Timeline entries can be promoted into the review.
- Action items have owner, due date, category and linked service/rule.
- Alert-quality feedback can become rule/runbook recommendations.

## Success Criteria

- Review can be produced faster than manual copy-paste from chat/logs.
- Action items are trackable after review completion.
- Alert-system improvements are captured, not only incident narrative.

