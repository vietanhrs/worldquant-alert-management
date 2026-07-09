# UC-04 - Acknowledge An Alert With Ownership/Audit Trail

## Primary Users

- On-call responder.

## Main Screens

- Alert Detail Inspector.

## User Goal

The responder needs to acknowledge that the alert is seen and establish clear
ownership without losing auditability.

## Trigger

An unacknowledged alert is selected.

## Main Flow

1. User opens Alert Detail Inspector.
2. User clicks "Acknowledge".
3. System offers a fast path: acknowledge as me.
4. User optionally adds note or assigns to self.
5. System updates state to acknowledged and records actor/time in timeline.

## Key UI Requirements

- Acknowledge is primary only when the alert is firing and unacknowledged.
- UI distinguishes "acknowledged" from "assigned".
- The timeline shows who acknowledged and when.
- Optional note is available but not required for fast first response.

## Success Criteria

- Alert no longer appears as unacknowledged.
- Other responders can see ownership status immediately.
- Audit trail is complete enough for post-incident review.

