# 01 - App Shell And Navigation

## Screen Purpose

The app shell is the persistent structure around the SPA: header, sidebar and
main content frame. It serves every user group and makes the product feel like a
single operational workspace rather than separate pages.

## Use Cases Covered

- UC-01: start an on-call shift and understand current risk.
- UC-02: scan active alerts and choose where to go next.
- UC-07: move from alert queue into incident creation.
- UC-08: move into active incident collaboration.
- UC-14: jump from live operations into metrics and review.
- UC-15: access routing/escalation configuration.

## Primary User Groups

- On-call responder.
- Incident commander.
- Service owner.
- Engineering manager / reliability lead.
- Alert admin.

## Layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: logo | env | global search | active incident count | on-call | user │
├───────────────┬─────────────────────────────────────────────────────────────┤
│ Sidebar       │ Main content                                                │
│ Monitor       │ Screen title + screen controls                              │
│ Respond       │ Feature content                                             │
│ Improve       │ Optional right inspector/drawer                             │
│ Configure     │                                                             │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

Recommended sizing:

- Header: 56px high. Compact enough for dense tools, tall enough for search and
  status chips.
- Sidebar: 248px desktop, icon rail on tablet, bottom navigation or drawer on
  mobile.
- Main content padding: 16px desktop, 12px tablet/mobile.
- Right inspectors: 380-420px when present.

## Header Content

Header elements from left to right:

- WorldQuant wordmark or compact square mark.
- Environment selector. Production should be visually distinct and harder to
  confuse with non-production.
- Global search/command palette with placeholder: "Search alerts, services,
  incidents, runbooks".
- Active incidents chip: count, highest severity and whether user is mentioned.
- Current on-call chip: team, remaining shift time, coverage health.
- Notification bell for mentions, assignments and escalation updates.
- Profile/team switcher.

## Sidebar Content

Navigation groups:

- Monitor
  - Operations Dashboard
  - Alert Queue
  - Services
- Respond
  - Incident Room
  - On-call & Escalation
- Improve
  - Post-Incident Review
  - Silences & Rules
- Configure
  - Routing
  - Integrations
  - Audit

Each item shows an icon, label and optional count. Counts should be used only
when they drive action: active critical alerts, incidents needing owner,
handoffs due soon, reviews pending.

## UX Strategy Rationale

The app shell expresses the "business strategy + killer UX design" bridge. The
business needs faster response and better accountability. The shell makes the
main operational states visible everywhere: environment, active incidents,
on-call responsibility and search.

The sidebar is grouped by user job rather than data model. A backend-first IA
might have "Alerts, Incidents, Services, Rules, Users". This design chooses
"Monitor, Respond, Improve, Configure" because the user is usually trying to
move through an operational journey.

## Interaction Design

- Global search opens with `/` or `Cmd/Ctrl + K`.
- Active incident chip opens a popover with top active incidents and direct
  links to rooms.
- On-call chip opens coverage status and shift handoff actions.
- Sidebar supports pinned favorites for teams with very different workflows.
- Breadcrumbs appear inside content screens when the user enters from deep links.

## Accessibility And Safety

- The app must be fully usable by keyboard during incident response.
- Header status colors must include text labels, not color alone.
- Production environment selector should use text and border, not only color.
- Dangerous actions are never placed in the persistent header.

## Responsive Behavior

Tablet:

- Sidebar collapses to an icon rail with tooltips.
- Search remains visible because it is a primary navigation mode.
- Right inspectors become drawers.

Mobile:

- Header keeps logo, search icon, active incident chip and user menu.
- Sidebar becomes a navigation drawer.
- Alert detail and incident room should prioritize current task over full
  dashboard overview.

## Validation Questions

- Can an on-call engineer find "my active alerts" within 5 seconds?
- Does the environment selector prevent production/staging confusion?
- Do users think the IA reflects how they work, or should "Services" be more
  prominent?
- Does the header feel useful under pressure or too noisy?
