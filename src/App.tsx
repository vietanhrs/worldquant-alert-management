import { useEffect, useMemo, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Code,
  Divider,
  Group,
  MantineProvider,
  Menu,
  Paper,
  Progress,
  RingProgress,
  ScrollArea,
  SegmentedControl,
  Select,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
  Tooltip,
  createTheme,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import type { MantineColorScheme } from '@mantine/core'
import {
  IconAdjustments,
  IconArrowRight,
  IconBellRinging,
  IconBrain,
  IconCalendarTime,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconClipboardCheck,
  IconClock,
  IconDatabase,
  IconDeviceDesktop,
  IconFileAnalytics,
  IconFilter,
  IconFlame,
  IconGitBranch,
  IconHistory,
  IconLayoutDashboard,
  IconListCheck,
  IconMenu2,
  IconMoon,
  IconPalette,
  IconRadar,
  IconRoute,
  IconSearch,
  IconServer,
  IconShieldCheck,
  IconSun,
  IconTimeline,
  IconUserCheck,
  IconUsersGroup,
  IconX,
} from '@tabler/icons-react'

type ScreenId =
  | 'dashboard'
  | 'queue'
  | 'incident'
  | 'services'
  | 'oncall'
  | 'silences'
  | 'review'
  | 'validation'

type Severity = 'critical' | 'high' | 'warning' | 'info'

type AlertState = 'Firing' | 'Acked' | 'Assigned' | 'Silenced' | 'Resolved'

type AlertRow = {
  id: string
  title: string
  service: string
  severity: Severity
  state: AlertState
  owner: string
  age: string
  impact: string
  related: number
  runbook: string
  signal: string
}

type Incident = {
  id: string
  title: string
  severity: Severity
  state: string
  commander: string
  age: string
  impact: string
  responders: string[]
}

type NavItem = {
  id: ScreenId
  label: string
  group: string
  icon: ComponentType<{ size?: number; stroke?: number }>
  badge?: string
}

const theme = createTheme({
  primaryColor: 'wqGreen',
  fontFamily: 'Inter, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: '500',
  },
  colors: {
    wqGreen: [
      '#eaffed',
      '#c9ffd1',
      '#96ffa7',
      '#5cff77',
      '#2cff51',
      '#00e128',
      '#00ba20',
      '#008f18',
      '#006713',
      '#00470c',
    ],
  },
})

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Operations',
    group: 'Monitor',
    icon: IconLayoutDashboard,
    badge: '12',
  },
  { id: 'queue', label: 'Alert Queue', group: 'Monitor', icon: IconBellRinging, badge: '38' },
  { id: 'incident', label: 'Incident Room', group: 'Respond', icon: IconTimeline, badge: '3' },
  { id: 'services', label: 'Services', group: 'Monitor', icon: IconServer },
  { id: 'oncall', label: 'On-call', group: 'Respond', icon: IconCalendarTime },
  { id: 'silences', label: 'Silences & Rules', group: 'Improve', icon: IconAdjustments },
  { id: 'review', label: 'Post-Incident', group: 'Improve', icon: IconFileAnalytics, badge: '5' },
  { id: 'validation', label: 'Research Plan', group: 'Strategy', icon: IconRadar },
]

const alerts: AlertRow[] = [
  {
    id: 'WQ-AL-9081',
    title: 'Market data ingestion latency above SLO',
    service: 'md-ingest-equities-us',
    severity: 'critical',
    state: 'Firing',
    owner: 'Market Data Platform',
    age: '07m',
    impact: 'US equity research data freshness',
    related: 8,
    runbook: 'Data freshness degraded',
    signal: 'p95 lag 421s',
  },
  {
    id: 'WQ-AL-9077',
    title: 'Research simulation workers queue saturation',
    service: 'brain-sim-cluster',
    severity: 'high',
    state: 'Acked',
    owner: 'Research Platform',
    age: '18m',
    impact: 'Alpha simulation delay',
    related: 3,
    runbook: 'Scale simulation workers',
    signal: 'queue depth 18.2k',
  },
  {
    id: 'WQ-AL-9062',
    title: 'GPFS metadata operation retries increasing',
    service: 'hpc-storage-core',
    severity: 'warning',
    state: 'Assigned',
    owner: 'Platform Reliability',
    age: '42m',
    impact: 'Infrastructure risk',
    related: 5,
    runbook: 'Storage retry investigation',
    signal: 'retry rate 6.7%',
  },
  {
    id: 'WQ-AL-9058',
    title: 'Vendor data quality anomaly detected',
    service: 'vendor-normalizer-apac',
    severity: 'info',
    state: 'Assigned',
    owner: 'Data Operations',
    age: '01h',
    impact: 'APAC vendor validation',
    related: 2,
    runbook: 'Vendor anomaly checklist',
    signal: 'z-score 3.8',
  },
  {
    id: 'WQ-AL-9051',
    title: 'Staging deploy health check failed',
    service: 'research-api-staging',
    severity: 'warning',
    state: 'Silenced',
    owner: 'Research Platform',
    age: '02h',
    impact: 'Staging only',
    related: 1,
    runbook: 'Deploy health rollback',
    signal: '3/8 pods unhealthy',
  },
]

const incidents: Incident[] = [
  {
    id: 'WQ-INC-4819',
    title: 'US market data delayed for quant research',
    severity: 'critical',
    state: 'Investigating',
    commander: 'Maya Chen',
    age: '31m',
    impact: 'Delayed factor research refresh',
    responders: ['Trang', 'Leon', 'Priya'],
  },
  {
    id: 'WQ-INC-4818',
    title: 'Simulation cluster capacity degraded',
    severity: 'high',
    state: 'Mitigating',
    commander: 'Noah Singh',
    age: '54m',
    impact: 'Longer model iteration queue',
    responders: ['Iris', 'Ken'],
  },
  {
    id: 'WQ-INC-4815',
    title: 'APAC vendor quality anomaly',
    severity: 'warning',
    state: 'Monitoring',
    commander: 'Linh Dao',
    age: '2h',
    impact: 'Manual validation required',
    responders: ['Hana', 'Minh'],
  },
]

const serviceRows = [
  {
    service: 'md-ingest-equities-us',
    owner: 'Market Data Platform',
    health: 'At risk',
    alerts: 12,
    slo: 82,
    noise: '18%',
    tier: 'Tier 0',
  },
  {
    service: 'brain-sim-cluster',
    owner: 'Research Platform',
    health: 'Degraded',
    alerts: 6,
    slo: 91,
    noise: '9%',
    tier: 'Tier 1',
  },
  {
    service: 'hpc-storage-core',
    owner: 'Platform Reliability',
    health: 'Watch',
    alerts: 9,
    slo: 94,
    noise: '21%',
    tier: 'Tier 0',
  },
  {
    service: 'vendor-normalizer-apac',
    owner: 'Data Operations',
    health: 'Healthy',
    alerts: 3,
    slo: 98,
    noise: '5%',
    tier: 'Tier 2',
  },
]

const timelineEvents = [
  {
    icon: IconBellRinging,
    title: 'Alert fired',
    body: 'Market data ingestion latency exceeded p95 SLO for US equities.',
    time: '09:42:18 ICT',
    tone: 'critical',
  },
  {
    icon: IconUserCheck,
    title: 'Responder assigned',
    body: 'Trang accepted primary responder ownership.',
    time: '09:44:03 ICT',
    tone: 'success',
  },
  {
    icon: IconBrain,
    title: 'Evidence attached',
    body: 'Similar vendor delay incident and related alert cluster detected.',
    time: '09:45:21 ICT',
    tone: 'info',
  },
  {
    icon: IconRoute,
    title: 'Escalation path opened',
    body: 'Market Data Platform secondary on-call was notified.',
    time: '09:48:10 ICT',
    tone: 'warning',
  },
]

const onCallShifts = [
  { person: 'Trang Pham', role: 'Primary', region: 'APAC', time: '08:00-16:00', load: 7 },
  { person: 'Leon Wu', role: 'Secondary', region: 'APAC', time: '08:00-16:00', load: 3 },
  { person: 'Maya Chen', role: 'Commander', region: 'US', time: '20:00-04:00', load: 2 },
]

const silences = [
  {
    scope: 'research-api-staging',
    reason: 'Staging deploy validation',
    owner: 'Research Platform',
    expires: '42m',
    affected: 3,
  },
  {
    scope: 'vendor-normalizer-apac',
    reason: 'Vendor maintenance window',
    owner: 'Data Operations',
    expires: '2h 10m',
    affected: 7,
  },
]

const actionItems = [
  { title: 'Tune market data freshness threshold', owner: 'Trang', due: 'Jul 12', state: 'Open' },
  { title: 'Add vendor heartbeat evidence to runbook', owner: 'Leon', due: 'Jul 13', state: 'Doing' },
  { title: 'Backfill missing APAC quality dashboard', owner: 'Hana', due: 'Jul 17', state: 'Open' },
]

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Workspace />
    </MantineProvider>
  )
}

function Workspace() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => screenFromHash())
  const [selectedAlertId, setSelectedAlertId] = useState(alerts[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark')

  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.id === selectedAlertId) ?? alerts[0],
    [selectedAlertId],
  )

  const activeNavItem = navItems.find((item) => item.id === activeScreen) ?? navItems[0]

  useEffect(() => {
    const handleHashChange = () => setActiveScreen(screenFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="wq-app">
      <header className="app-header">
        <div className="header-left">
          <ActionIcon
            variant="subtle"
            className="mobile-nav-button"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setSidebarOpen((opened) => !opened)}
          >
            {sidebarOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </ActionIcon>
          <img src="/assets/worldquant.png" alt="WorldQuant" className="brand-wordmark" />
          <Badge className="environment-badge">Production</Badge>
        </div>

        <TextInput
          className="global-search"
          leftSection={<IconSearch size={16} />}
          placeholder="Search alerts, services, incidents, runbooks"
          aria-label="Search alerts, services, incidents, runbooks"
        />

        <div className="header-status">
          <button type="button" className="header-pill">
            <IconFlame size={16} />
            <span>3 incidents</span>
          </button>
          <button type="button" className="header-pill">
            <IconClock size={16} />
            <span>Shift 2h 18m</span>
          </button>
        </div>

        <Menu position="bottom-end" width={300} shadow="lg">
          <Menu.Target>
            <button type="button" className="avatar-trigger" aria-label="Open user menu">
              <Avatar radius="xl" color="wqGreen">
                VA
              </Avatar>
              <span className="avatar-name">Viet Anh Tran</span>
              <IconChevronDown size={16} />
            </button>
          </Menu.Target>
          <Menu.Dropdown className="profile-menu">
            <div className="profile-summary">
              <Avatar radius="xl" color="wqGreen">
                VA
              </Avatar>
              <div>
                <strong>Viet Anh Tran</strong>
                <span>Platform Reliability</span>
              </div>
            </div>
            <Menu.Divider />
            <div className="appearance-menu-item">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="wqGreen" radius="md">
                  <IconPalette size={18} />
                </ThemeIcon>
                <div>
                  <Text size="sm" fw={600}>
                    Appearance
                  </Text>
                  <Text size="xs" c="dimmed">
                    Current: {appearanceLabel(colorScheme, computedColorScheme)}
                  </Text>
                </div>
              </Group>
              <SegmentedControl
                fullWidth
                size="xs"
                value={colorScheme}
                onChange={(value) => setColorScheme(value as MantineColorScheme)}
                data={[
                  {
                    value: 'auto',
                    label: (
                      <span className="appearance-option">
                        <IconDeviceDesktop size={14} /> System
                      </span>
                    ),
                  },
                  {
                    value: 'dark',
                    label: (
                      <span className="appearance-option">
                        <IconMoon size={14} /> Dark
                      </span>
                    ),
                  },
                  {
                    value: 'light',
                    label: (
                      <span className="appearance-option">
                        <IconSun size={14} /> Light
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </Menu.Dropdown>
        </Menu>
      </header>

      <div className="workspace-shell">
        <aside className={sidebarOpen ? 'sidebar is-open' : 'sidebar'}>
          <div className="sidebar-brand">
            <img src="/assets/wq-logo-square.png" alt="" />
            <div>
              <span>Alert Management</span>
              <strong>Ops Command</strong>
            </div>
          </div>

          <ScrollArea className="sidebar-scroll">
            {['Monitor', 'Respond', 'Improve', 'Strategy'].map((group) => (
              <nav key={group} className="nav-group" aria-label={group}>
                <span>{group}</span>
                {navItems
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={item.id === activeScreen ? 'nav-link active' : 'nav-link'}
                        onClick={() => {
                          setActiveScreen(item.id)
                          window.location.hash = item.id
                          setSidebarOpen(false)
                        }}
                      >
                        <Icon size={18} stroke={1.8} />
                        <span>{item.label}</span>
                        {item.badge ? <Badge className="nav-badge">{item.badge}</Badge> : null}
                      </button>
                    )
                  })}
              </nav>
            ))}
          </ScrollArea>

          <div className="sidebar-shift-card">
            <span>Primary on-call</span>
            <strong>Trang Pham</strong>
            <p>7 assigned alerts, 2 handoffs due</p>
          </div>
        </aside>

        <main className="main-content">
          <ScreenTitle
            eyebrow={activeNavItem.group}
            title={screenTitle(activeScreen)}
            description={screenDescription(activeScreen)}
          />
          {renderScreen(activeScreen, selectedAlert, setSelectedAlertId)}
        </main>
      </div>
    </div>
  )
}

function renderScreen(
  activeScreen: ScreenId,
  selectedAlert: AlertRow,
  setSelectedAlertId: (id: string) => void,
) {
  switch (activeScreen) {
    case 'dashboard':
      return <OperationsDashboard />
    case 'queue':
      return <AlertQueue selectedAlert={selectedAlert} setSelectedAlertId={setSelectedAlertId} />
    case 'incident':
      return <IncidentRoom />
    case 'services':
      return <ServiceDetail />
    case 'oncall':
      return <OnCallEscalation />
    case 'silences':
      return <SilencesAndRules />
    case 'review':
      return <PostIncidentReview />
    case 'validation':
      return <ResearchPlan />
  }
}

function OperationsDashboard() {
  return (
    <div className="screen-grid dashboard-grid">
      <MetricCard label="Critical active" value="3" tone="critical" detail="2 unacknowledged" />
      <MetricCard label="MTTA today" value="4m 12s" tone="success" detail="Target under 5m" />
      <MetricCard label="Unowned alerts" value="6" tone="warning" detail="Needs routing" />
      <MetricCard label="Noise ratio" value="18%" tone="info" detail="Down 4% vs 7d" />

      <Panel title="Active critical path" icon={IconFlame} className="span-7">
        <div className="alert-stack">
          {alerts.slice(0, 4).map((alert) => (
            <AlertSummary key={alert.id} alert={alert} />
          ))}
        </div>
      </Panel>

      <Panel title="Live incidents" icon={IconTimeline} className="span-5">
        <div className="incident-list">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </Panel>

      <Panel title="Service risk" icon={IconServer} className="span-7">
        <div className="service-risk-grid">
          {serviceRows.map((service) => (
            <div key={service.service} className="service-risk-row">
              <div>
                <strong>{service.service}</strong>
                <span>{service.owner}</span>
              </div>
              <Badge className={service.health === 'Healthy' ? 'chip-success' : 'chip-warning'}>
                {service.health}
              </Badge>
              <Progress value={service.slo} color={service.slo > 95 ? 'wqGreen' : 'orange'} />
              <small>SLO {service.slo}%</small>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Response quality" icon={IconChartBar} className="span-5">
        <div className="quality-grid">
          <QualityMetric label="Runbook coverage" value={86} />
          <QualityMetric label="Owned on ack" value={79} />
          <QualityMetric label="Review completed" value={64} />
        </div>
      </Panel>
    </div>
  )
}

function AlertQueue({
  selectedAlert,
  setSelectedAlertId,
}: {
  selectedAlert: AlertRow
  setSelectedAlertId: (id: string) => void
}) {
  return (
    <div className="queue-layout">
      <Panel title="Alert Queue" icon={IconBellRinging} className="queue-table-panel">
        <div className="table-toolbar">
          <TextInput
            leftSection={<IconSearch size={16} />}
            placeholder="Search service, alert ID, trace ID"
            className="control"
          />
          <Select
            leftSection={<IconFilter size={16} />}
            placeholder="Severity"
            defaultValue="needs-action"
            data={[
              { value: 'needs-action', label: 'Needs action' },
              { value: 'critical', label: 'Critical' },
              { value: 'mine', label: 'Assigned to me' },
              { value: 'flapping', label: 'Flapping' },
            ]}
            className="control"
          />
          <SegmentedControl data={['Mine', 'Team', 'All']} defaultValue="Team" className="control" />
        </div>

        <Table.ScrollContainer minWidth={980} className="table-wrap">
          <Table className="ops-table" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Alert</Table.Th>
                <Table.Th>Service</Table.Th>
                <Table.Th>State</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Age</Table.Th>
                <Table.Th>Impact</Table.Th>
                <Table.Th>Related</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {alerts.map((alert) => (
                <Table.Tr
                  key={alert.id}
                  className={alert.id === selectedAlert.id ? 'selected-row' : undefined}
                  onClick={() => setSelectedAlertId(alert.id)}
                >
                  <Table.Td>
                    <div className={`severity-title severity-${alert.severity}`}>
                      <span />
                      <div>
                        <strong>{alert.title}</strong>
                        <small>{alert.id}</small>
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Code>{alert.service}</Code>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge state={alert.state} />
                  </Table.Td>
                  <Table.Td>{alert.owner}</Table.Td>
                  <Table.Td>{alert.age}</Table.Td>
                  <Table.Td>{alert.impact}</Table.Td>
                  <Table.Td>{alert.related}</Table.Td>
                  <Table.Td>
                    <Button size="xs" className="btn-outline">
                      Triage
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Panel>

      <AlertInspector alert={selectedAlert} />
    </div>
  )
}

function AlertInspector({ alert }: { alert: AlertRow }) {
  return (
    <Panel title="Alert Inspector" icon={IconShieldCheck} className="inspector-panel">
      <div className={`inspector-hero severity-${alert.severity}`}>
        <Badge className={`severity-chip ${alert.severity}`}>{alert.severity}</Badge>
        <h3>{alert.title}</h3>
        <p>{alert.impact}</p>
      </div>

      <div className="action-bar">
        <Button className="btn-primary" leftSection={<IconCheck size={16} />}>
          Acknowledge
        </Button>
        <Button className="btn-outline" leftSection={<IconUsersGroup size={16} />}>
          Assign
        </Button>
        <Button className="btn-warning" leftSection={<IconArrowRight size={16} />}>
          Escalate
        </Button>
      </div>

      <div className="metadata-grid">
        <Meta label="Service" value={alert.service} code />
        <Meta label="Signal" value={alert.signal} />
        <Meta label="Runbook" value={alert.runbook} />
        <Meta label="Related" value={`${alert.related} correlated alerts`} />
      </div>

      <AICard compact />

      <div className="mini-timeline">
        {timelineEvents.slice(0, 3).map((event) => (
          <TimelineEntry key={event.title} event={event} />
        ))}
      </div>
    </Panel>
  )
}

function IncidentRoom() {
  return (
    <div className="incident-layout">
      <Panel title="Incident status" icon={IconFlame} className="incident-left">
        <div className="incident-status-card">
          <SeverityPill severity="critical" />
          <h3>US market data delayed for quant research</h3>
          <p>Commander Maya Chen coordinating 3 responders across platform and data teams.</p>
        </div>
        <div className="role-list">
          {['Commander - Maya', 'Tech lead - Trang', 'Comms - Priya', 'Watcher - Leon'].map(
            (role) => (
              <div key={role}>
                <IconUserCheck size={16} />
                <span>{role}</span>
              </div>
            ),
          )}
        </div>
      </Panel>

      <Panel title="Decision timeline" icon={IconTimeline} className="incident-main">
        <Timeline active={3} bulletSize={30} lineWidth={1} className="incident-timeline">
          {timelineEvents.map((event) => {
            const EventIcon = event.icon
            return (
              <Timeline.Item
                key={event.title}
                bullet={<EventIcon size={15} />}
                title={event.title}
                className={`timeline-${event.tone}`}
              >
                <Text size="sm">{event.body}</Text>
                <Text size="xs" c="dimmed">
                  {event.time}
                </Text>
              </Timeline.Item>
            )
          })}
        </Timeline>

        <Divider className="soft-divider" />

        <div className="task-board">
          {[
            ['Check vendor heartbeat', 'Trang', 'Doing'],
            ['Prepare stakeholder update', 'Priya', 'Open'],
            ['Validate recovered batches', 'Leon', 'Blocked'],
          ].map(([task, owner, state]) => (
            <div key={task} className="task-card">
              <strong>{task}</strong>
              <span>{owner}</span>
              <Badge className={state === 'Doing' ? 'chip-info' : 'chip-muted'}>{state}</Badge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Evidence" icon={IconBrain} className="incident-right">
        <AICard />
        <div className="evidence-stack">
          <Evidence label="Linked alerts" value="8 alerts across 3 market data services" />
          <Evidence label="Recent deploy" value="No matching deploy in 6h" />
          <Evidence label="Similar incident" value="WQ-INC-4821, 91% match" />
        </div>
      </Panel>
    </div>
  )
}

function ServiceDetail() {
  return (
    <div className="screen-grid">
      <Panel title="Service profile" icon={IconServer} className="span-4">
        <div className="profile-block">
          <Code>md-ingest-equities-us</Code>
          <h3>Market data ingestion</h3>
          <p>Tier 0 data freshness service owned by Market Data Platform.</p>
        </div>
        <div className="metadata-grid single">
          <Meta label="Owner" value="Market Data Platform" />
          <Meta label="Escalation" value="Primary -> Secondary -> Data lead" />
          <Meta label="Runbooks" value="4 active, 1 missing" />
        </div>
      </Panel>

      <Panel title="Reliability overview" icon={IconChartBar} className="span-8">
        <div className="service-metric-row">
          <MetricCard label="Open alerts" value="12" tone="critical" detail="3 critical" />
          <MetricCard label="SLO burn" value="82%" tone="warning" detail="Last 4h" />
          <MetricCard label="Duplicate ratio" value="18%" tone="info" detail="Down 4%" />
        </div>
      </Panel>

      <Panel title="Service workspace" icon={IconDatabase} className="span-12">
        <Tabs defaultValue="alerts" className="wq-tabs">
          <Tabs.List>
            <Tabs.Tab value="alerts">Active Alerts</Tabs.Tab>
            <Tabs.Tab value="history">History</Tabs.Tab>
            <Tabs.Tab value="deps">Dependencies</Tabs.Tab>
            <Tabs.Tab value="rules">Rules</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="alerts">
            <CompactTable />
          </Tabs.Panel>
          <Tabs.Panel value="history">
            <div className="history-grid">
              <QualityMetric label="MTTA 7d" value={84} />
              <QualityMetric label="Runbook helpful" value={72} />
              <QualityMetric label="Action items closed" value={58} />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="deps">
            <div className="dependency-grid">
              {['vendor-feed-us', 'normalizer-core', 'research-cache', 'hpc-storage-core'].map(
                (dependency) => (
                  <div key={dependency} className="dependency-node">
                    <IconGitBranch size={16} />
                    <span>{dependency}</span>
                  </div>
                ),
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="rules">
            <RuleRecommendations />
          </Tabs.Panel>
        </Tabs>
      </Panel>
    </div>
  )
}

function OnCallEscalation() {
  return (
    <div className="screen-grid">
      <Panel title="Current coverage" icon={IconCalendarTime} className="span-5">
        <div className="coverage-stack">
          {onCallShifts.map((shift) => (
            <div key={shift.person} className="coverage-row">
              <Avatar color="wqGreen" radius="xl">
                {shift.person
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </Avatar>
              <div>
                <strong>{shift.person}</strong>
                <span>
                  {shift.role} · {shift.region} · {shift.time}
                </span>
              </div>
              <Badge className={shift.load > 5 ? 'chip-warning' : 'chip-success'}>
                {shift.load} alerts
              </Badge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Schedule timeline" icon={IconTimeline} className="span-7">
        <div className="schedule-grid">
          {['08:00', '12:00', '16:00', '20:00', '00:00', '04:00'].map((time, index) => (
            <div key={time} className={index === 2 ? 'schedule-slot active' : 'schedule-slot'}>
              <span>{time}</span>
              <strong>{index < 3 ? 'APAC shift' : 'US shift'}</strong>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Escalation policies" icon={IconRoute} className="span-6">
        <div className="policy-stack">
          {['Market data Tier 0', 'Research platform Tier 1', 'Vendor data quality'].map(
            (policy, index) => (
              <div key={policy} className="policy-card">
                <strong>{policy}</strong>
                <span>L1 after {index + 5}m · L2 after {index + 15}m · commander after 30m</span>
              </div>
            ),
          )}
        </div>
      </Panel>

      <Panel title="Handoff queue" icon={IconClipboardCheck} className="span-6">
        <div className="handoff-card">
          <strong>WQ-INC-4819 handoff due in 18m</strong>
          <p>Hypothesis: upstream vendor batch delay. Next action: validate recovered batches.</p>
          <Button className="btn-primary" size="sm">
            Accept handoff
          </Button>
        </div>
      </Panel>
    </div>
  )
}

function SilencesAndRules() {
  return (
    <div className="screen-grid">
      <MetricCard label="Noisy alerts" value="14" tone="warning" detail="Repeated in 24h" />
      <MetricCard label="Active silences" value="2" tone="info" detail="0 broad production" />
      <MetricCard label="Missing runbooks" value="7" tone="critical" detail="2 critical rules" />
      <MetricCard label="Rule suggestions" value="5" tone="success" detail="Evidence-backed" />

      <Panel title="Active silences" icon={IconMoon} className="span-6">
        <div className="silence-stack">
          {silences.map((silence) => (
            <div key={silence.scope} className="silence-card">
              <div>
                <strong>{silence.scope}</strong>
                <span>{silence.reason}</span>
              </div>
              <Badge className="chip-muted">{silence.expires}</Badge>
              <small>
                {silence.affected} alerts · {silence.owner}
              </small>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Rule recommendations" icon={IconAdjustments} className="span-6">
        <RuleRecommendations />
      </Panel>

      <Panel title="Create silence preview" icon={IconShieldCheck} className="span-12">
        <div className="silence-flow">
          {['Scope', 'Duration', 'Reason', 'Blast radius', 'Confirm'].map((step, index) => (
            <div key={step} className={index === 3 ? 'flow-step active' : 'flow-step'}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <p>{silenceStepCopy(step)}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function PostIncidentReview() {
  return (
    <div className="review-layout">
      <Panel title="Review outline" icon={IconFileAnalytics} className="review-outline">
        {[
          ['Executive summary', 'US market data freshness degraded for 31 minutes.'],
          ['Impact', 'Research refresh delayed for US equities factor workflows.'],
          ['Root cause', 'Vendor delivery lag with missing heartbeat escalation.'],
          ['What went well', 'Responder ownership established within 4 minutes.'],
          ['What to improve', 'Runbook lacked vendor heartbeat validation step.'],
        ].map(([label, value]) => (
          <div key={label} className="outline-block">
            <span>{label}</span>
            <p>{value}</p>
          </div>
        ))}
      </Panel>

      <Panel title="Evidence timeline" icon={IconTimeline} className="review-timeline">
        <div className="mini-timeline large">
          {timelineEvents.map((event) => (
            <TimelineEntry key={event.title} event={event} />
          ))}
        </div>
      </Panel>

      <Panel title="Action items" icon={IconListCheck} className="review-actions">
        <div className="action-item-stack">
          {actionItems.map((item) => (
            <div key={item.title} className="action-item">
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.owner} · due {item.due}
                </span>
              </div>
              <Badge className={item.state === 'Doing' ? 'chip-info' : 'chip-muted'}>
                {item.state}
              </Badge>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Alert quality feedback" icon={IconClipboardCheck} className="review-quality">
        <div className="feedback-grid">
          <QualityMetric label="Fired early enough" value={76} />
          <QualityMetric label="Correct owner" value={92} />
          <QualityMetric label="Runbook helpful" value={54} />
        </div>
      </Panel>
    </div>
  )
}

function ResearchPlan() {
  return (
    <div className="screen-grid">
      <Panel title="Core hypotheses" icon={IconRadar} className="span-7">
        <div className="hypothesis-stack">
          {[
            'Responders need ownership, impact, evidence and next action before acknowledgement.',
            'Incident collaboration needs roles, timeline and evidence in one shared room.',
            'AI suggestions are useful only when confidence is paired with visible evidence.',
            'Alert noise improvement must preserve auditability and blast-radius awareness.',
          ].map((hypothesis, index) => (
            <div key={hypothesis} className="hypothesis-card">
              <span>H{index + 1}</span>
              <p>{hypothesis}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Prototype tasks" icon={IconClipboardCheck} className="span-5">
        <div className="prototype-task-list">
          {[
            'Identify highest-priority alert',
            'Acknowledge with safe ownership',
            'Create an incident from related alerts',
            'Write a structured handoff note',
            'Silence planned maintenance safely',
            'Generate review action items',
          ].map((task) => (
            <div key={task}>
              <IconCheck size={16} />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Measurement matrix" icon={IconChartBar} className="span-12">
        <Table.ScrollContainer minWidth={760} className="table-wrap">
          <Table className="ops-table" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Metric</Table.Th>
                <Table.Th>Behavior</Table.Th>
                <Table.Th>Screen</Table.Th>
                <Table.Th>Target</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                ['Time to priority', 'Find highest-risk alert', 'Dashboard / Queue', '< 30s'],
                ['Context confidence', 'Ack without external tabs', 'Inspector', '80%+'],
                ['Handoff completeness', 'Next owner understands current state', 'Incident Room', '90%+'],
                ['Silence safety', 'Choose correct scope', 'Silences & Rules', '0 critical mistakes'],
              ].map(([metric, behavior, screen, target]) => (
                <Table.Tr key={metric}>
                  <Table.Td>{metric}</Table.Td>
                  <Table.Td>{behavior}</Table.Td>
                  <Table.Td>{screen}</Table.Td>
                  <Table.Td>{target}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Panel>
    </div>
  )
}

function ScreenTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="screen-title">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="screen-actions">
        <Button className="btn-outline" leftSection={<IconHistory size={16} />}>
          Last 24h
        </Button>
        <Button className="btn-primary" leftSection={<IconArrowRight size={16} />}>
          Open command
        </Button>
      </div>
    </section>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: ComponentType<{ size?: number; stroke?: number }>
  children: ReactNode
  className?: string
}) {
  return (
    <Paper className={className ? `panel ${className}` : 'panel'}>
      <div className="panel-header">
        <Group gap="sm">
          <ThemeIcon variant="light" color="wqGreen" radius="md">
            <Icon size={18} stroke={1.8} />
          </ThemeIcon>
          <h2>{title}</h2>
        </Group>
        <Tooltip label="Open details">
          <ActionIcon variant="subtle" className="icon-button" aria-label={`Open ${title} details`}>
            <IconArrowRight size={17} />
          </ActionIcon>
        </Tooltip>
      </div>
      <div className="panel-body">{children}</div>
    </Paper>
  )
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: 'critical' | 'warning' | 'success' | 'info'
}) {
  return (
    <Paper className={`metric-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </Paper>
  )
}

function AlertSummary({ alert }: { alert: AlertRow }) {
  return (
    <div className={`alert-summary severity-${alert.severity}`}>
      <div>
        <SeverityPill severity={alert.severity} />
        <strong>{alert.title}</strong>
        <span>{alert.service}</span>
      </div>
      <div className="alert-summary-side">
        <StatusBadge state={alert.state} />
        <small>{alert.age}</small>
      </div>
    </div>
  )
}

function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div className={`incident-card severity-${incident.severity}`}>
      <div>
        <SeverityPill severity={incident.severity} />
        <strong>{incident.title}</strong>
        <p>{incident.impact}</p>
      </div>
      <Group justify="space-between">
        <span>{incident.commander}</span>
        <Badge className="chip-info">{incident.state}</Badge>
      </Group>
      <Avatar.Group spacing="sm">
        {incident.responders.map((person) => (
          <Avatar key={person} radius="xl" color="wqGreen" size="sm">
            {person[0]}
          </Avatar>
        ))}
      </Avatar.Group>
    </div>
  )
}

function StatusBadge({ state }: { state: AlertState }) {
  return <Badge className={`status-chip ${stateClass(state)}`}>{state}</Badge>
}

function SeverityPill({ severity }: { severity: Severity }) {
  return <Badge className={`severity-chip ${severity}`}>{severity}</Badge>
}

function Meta({ label, value, code }: { label: string; value: string; code?: boolean }) {
  return (
    <div className="meta-card">
      <span>{label}</span>
      {code ? <Code>{value}</Code> : <strong>{value}</strong>}
    </div>
  )
}

function AICard({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? 'ai-card compact' : 'ai-card'}>
      <div className="ai-card-header">
        <ThemeIcon className="brain-icon" radius="md">
          <IconBrain size={20} />
        </ThemeIcon>
        <div>
          <strong>Likely upstream vendor delay</strong>
          <span>74% confidence · 5 correlated signals</span>
        </div>
        {!compact ? (
          <RingProgress
            size={64}
            thickness={6}
            sections={[{ value: 74, color: '#0a8afa' }]}
            label={<Text size="xs" ta="center">74%</Text>}
          />
        ) : null}
      </div>
      <div className="evidence-grid">
        <Evidence label="Recent deploy" value="No matching deploy in 6h" />
        <Evidence label="Past incident" value="WQ-INC-4821" />
        {!compact ? <Evidence label="Next action" value="Check vendor heartbeat" /> : null}
      </div>
    </div>
  )
}

function Evidence({ label, value }: { label: string; value: string }) {
  return (
    <div className="evidence">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TimelineEntry({ event }: { event: (typeof timelineEvents)[number] }) {
  const EventIcon = event.icon
  return (
    <div className={`timeline-entry timeline-${event.tone}`}>
      <ThemeIcon radius="xl" variant="light">
        <EventIcon size={16} />
      </ThemeIcon>
      <div>
        <strong>{event.title}</strong>
        <p>{event.body}</p>
        <span>{event.time}</span>
      </div>
    </div>
  )
}

function QualityMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="quality-metric">
      <RingProgress
        size={82}
        thickness={8}
        sections={[{ value, color: value > 75 ? '#00e128' : value > 60 ? '#fa8c24' : '#fc4017' }]}
        label={<Text size="xs" ta="center">{value}%</Text>}
      />
      <span>{label}</span>
    </div>
  )
}

function CompactTable() {
  return (
    <Table.ScrollContainer minWidth={760} className="table-wrap nested-table">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Alert</Table.Th>
            <Table.Th>State</Table.Th>
            <Table.Th>Age</Table.Th>
            <Table.Th>Owner</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {alerts.slice(0, 4).map((alert) => (
            <Table.Tr key={alert.id}>
              <Table.Td>{alert.title}</Table.Td>
              <Table.Td>
                <StatusBadge state={alert.state} />
              </Table.Td>
              <Table.Td>{alert.age}</Table.Td>
              <Table.Td>{alert.owner}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function RuleRecommendations() {
  return (
    <div className="recommendation-stack">
      {[
        ['Add grouping key', '8 alerts share vendor and region labels.'],
        ['Require runbook', '2 critical rules have no responder checklist.'],
        ['Tune threshold', 'Rule fired 12 times without human action.'],
      ].map(([title, body]) => (
        <div key={title} className="recommendation-card">
          <IconBrain size={17} />
          <div>
            <strong>{title}</strong>
            <span>{body}</span>
          </div>
          <Button size="xs" className="btn-outline">
            Review
          </Button>
        </div>
      ))}
    </div>
  )
}

function screenTitle(screen: ScreenId) {
  const titles: Record<ScreenId, string> = {
    dashboard: 'Operations Dashboard',
    queue: 'Alert Queue',
    incident: 'Incident Room',
    services: 'Service Detail',
    oncall: 'On-call & Escalation',
    silences: 'Silences & Rules',
    review: 'Post-Incident Review',
    validation: 'Research Validation',
  }
  return titles[screen]
}

function screenDescription(screen: ScreenId) {
  const descriptions: Record<ScreenId, string> = {
    dashboard: 'Shift-level risk, live incidents, service health and response quality in one operational surface.',
    queue: 'Dense triage queue with ownership, impact, evidence and action-ready inspector.',
    incident: 'Shared response room for roles, decisions, tasks, evidence and auditable handoff.',
    services: 'Service-centered reliability view connecting current alerts with history, rules and dependencies.',
    oncall: 'Coverage, escalation policy and handoff state across teams and time zones.',
    silences: 'Noise reduction with duration, reason, blast-radius preview and rule-quality feedback.',
    review: 'Incident learning workspace that turns timeline evidence into action items and alert improvements.',
    validation: 'Discovery hypotheses, prototype tasks and metrics for validating the UX strategy.',
  }
  return descriptions[screen]
}

function stateClass(state: AlertState) {
  const classes: Record<AlertState, string> = {
    Firing: 'chip-critical',
    Acked: 'chip-success',
    Assigned: 'chip-info',
    Silenced: 'chip-muted',
    Resolved: 'chip-resolved',
  }
  return classes[state]
}

function appearanceLabel(colorScheme: MantineColorScheme, computed: 'light' | 'dark') {
  if (colorScheme === 'auto') {
    return `System (${computed})`
  }
  return colorScheme === 'dark' ? 'Dark' : 'Light'
}

function silenceStepCopy(step: string) {
  const copy: Record<string, string> = {
    Scope: 'Alert, service, labels or environment',
    Duration: 'Default finite window with expiry',
    Reason: 'Required audit note',
    'Blast radius': 'Affected alerts and services preview',
    Confirm: 'Recorded actor, time and scope',
  }
  return copy[step]
}

function screenFromHash(): ScreenId {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const hash = window.location.hash.replace('#', '')
  return navItems.some((item) => item.id === hash) ? (hash as ScreenId) : 'dashboard'
}

export default App
