# UC-17 - Manage Notification Preferences And Subscriptions

## Primary Users

- On-call responder.
- Alert admin.

## Supporting Users

- Service owner.
- Engineering manager / reliability lead.

## Main Screens

- App Shell.
- On-call & Escalation.
- Silences & Rules.

## User Goal

The user needs to receive the right operational notifications through the right
channels without being overwhelmed by noise or missing critical events.

## Trigger

The user joins a team, starts on-call duty, changes role, subscribes to a
service, or experiences notification noise.

## Main Flow

1. User opens profile/team notification settings or service subscription.
2. System shows current subscriptions, escalation channels and notification
   rules.
3. User changes preferred channel, quiet hours, service subscriptions or mention
   behavior.
4. System warns if the change creates coverage or escalation risk.
5. User saves preferences.
6. System records policy-impacting changes when relevant.

## Key UI Requirements

- Personal preferences are separated from team escalation policies.
- Critical escalation notifications cannot be accidentally muted without
  warning.
- Service subscriptions can be managed from service context.
- Header notification state reflects assignments, mentions and escalation
  events.

## Success Criteria

- Users receive actionable alerts and mentions.
- Notification fatigue is reduced without weakening incident response.
- Team policies remain auditable and distinct from personal preferences.

