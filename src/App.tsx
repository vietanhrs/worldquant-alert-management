import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ComponentType, ReactNode } from 'react'
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
  Modal,
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
  Textarea,
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
  IconArrowLeft,
  IconArrowRight,
  IconBellRinging,
  IconBrain,
  IconCalendarTime,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardCheck,
  IconClock,
  IconDatabase,
  IconDeviceDesktop,
  IconExternalLink,
  IconFileAnalytics,
  IconFilter,
  IconFlame,
  IconGitBranch,
  IconLayoutDashboard,
  IconListCheck,
  IconMenu2,
  IconMoon,
  IconPalette,
  IconPlus,
  IconRadar,
  IconRoute,
  IconSearch,
  IconSend,
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
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  team: string
  region: string
  environment: string
  source: string
  policy: string
  opened: string
  lastSeen: string
  repeatCount: number
  dedupeKey: string
  sla: string
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

type ServiceRow = {
  service: string
  name: string
  owner: string
  health: string
  alerts: number
  slo: number
  noise: string
  tier: string
  region: string
  timezone: string
  coverage: string
  dependencyRisk: string
  runbooks: string
  lastIncident: string
}

type OnCallView = 'day' | 'week' | 'two-weeks' | 'month'

const theme = createTheme({
  primaryColor: 'wqGreen',
  fontFamily: '"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily:
      '"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
    priority: 'P1',
    team: 'Market Data Platform',
    region: 'US',
    environment: 'Production',
    source: 'Datadog SLO',
    policy: 'Tier 0 market data',
    opened: '09:42',
    lastSeen: '09:49',
    repeatCount: 14,
    dedupeKey: 'vendor:us:equities:lag',
    sla: '12m to page L2',
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
    priority: 'P2',
    team: 'Research Platform',
    region: 'Global',
    environment: 'Production',
    source: 'Prometheus',
    policy: 'Research compute',
    opened: '09:31',
    lastSeen: '09:47',
    repeatCount: 6,
    dedupeKey: 'brain-sim:queue:saturation',
    sla: '22m to L2',
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
    priority: 'P3',
    team: 'Platform Reliability',
    region: 'Global',
    environment: 'Production',
    source: 'Splunk',
    policy: 'HPC storage core',
    opened: '09:07',
    lastSeen: '09:45',
    repeatCount: 11,
    dedupeKey: 'gpfs:metadata:retry',
    sla: '1h 18m to review',
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
    priority: 'P4',
    team: 'Data Operations',
    region: 'APAC',
    environment: 'Production',
    source: 'Data quality job',
    policy: 'Vendor quality',
    opened: '08:54',
    lastSeen: '09:36',
    repeatCount: 2,
    dedupeKey: 'vendor:apac:quality:zscore',
    sla: 'No escalation',
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
    priority: 'P3',
    team: 'Research Platform',
    region: 'Global',
    environment: 'Staging',
    source: 'Deploy checks',
    policy: 'Non-prod deploy',
    opened: '07:49',
    lastSeen: '08:12',
    repeatCount: 3,
    dedupeKey: 'research-api-staging:health',
    sla: 'Silenced',
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

const serviceRows: ServiceRow[] = [
  {
    service: 'md-ingest-equities-us',
    name: 'Market data ingestion',
    owner: 'Market Data Platform',
    health: 'At risk',
    alerts: 12,
    slo: 82,
    noise: '18%',
    tier: 'Tier 0',
    region: 'US',
    timezone: 'America/New_York',
    coverage: '24x7 primary + secondary',
    dependencyRisk: 'Vendor feed delayed',
    runbooks: '4 active, 1 missing',
    lastIncident: 'WQ-INC-4819',
  },
  {
    service: 'brain-sim-cluster',
    name: 'Research simulation cluster',
    owner: 'Research Platform',
    health: 'Degraded',
    alerts: 6,
    slo: 91,
    noise: '9%',
    tier: 'Tier 1',
    region: 'Global',
    timezone: 'UTC',
    coverage: 'Follow-the-sun',
    dependencyRisk: 'Worker saturation',
    runbooks: '6 active',
    lastIncident: 'WQ-INC-4818',
  },
  {
    service: 'hpc-storage-core',
    name: 'HPC storage core',
    owner: 'Platform Reliability',
    health: 'Watch',
    alerts: 9,
    slo: 94,
    noise: '21%',
    tier: 'Tier 0',
    region: 'Global',
    timezone: 'UTC',
    coverage: 'Platform primary + storage SME',
    dependencyRisk: 'Metadata retries',
    runbooks: '5 active',
    lastIncident: 'WQ-INC-4804',
  },
  {
    service: 'vendor-normalizer-apac',
    name: 'APAC vendor normalizer',
    owner: 'Data Operations',
    health: 'Healthy',
    alerts: 3,
    slo: 98,
    noise: '5%',
    tier: 'Tier 2',
    region: 'APAC',
    timezone: 'Asia/Singapore',
    coverage: 'APAC business hours',
    dependencyRisk: 'Vendor quality variance',
    runbooks: '3 active',
    lastIncident: 'WQ-INC-4815',
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

const incidentDataSources = [
  'Alert automation writes fired, acknowledged, assigned, escalated and resolved events.',
  'Responders submit decisions, evidence links and handoff notes from this room.',
  'Correlation suggestions come from alert clusters, recent deploys, runbooks and past incidents.',
]

const onCallShifts = [
  { person: 'Trang Pham', role: 'Primary', region: 'APAC', time: '08:00-16:00', load: 7 },
  { person: 'Leon Wu', role: 'Secondary', region: 'APAC', time: '08:00-16:00', load: 3 },
  { person: 'Maya Chen', role: 'Commander', region: 'US', time: '20:00-04:00', load: 2 },
]

const onCallScheduleRows = [
  {
    team: 'Market Data Platform',
    timezone: 'Asia/Singapore (UTC+8)',
    shifts: [
      { person: 'Trang Pham', role: 'Primary', start: 0, duration: 4, load: 7, tone: 'critical' },
      { person: 'Leon Wu', role: 'Secondary', start: 0, duration: 4, load: 3, tone: 'info' },
      { person: 'Maya Chen', role: 'Commander', start: 4, duration: 3, load: 2, tone: 'success' },
      { person: 'Iris Tan', role: 'Primary', start: 7, duration: 5, load: 4, tone: 'info' },
      { person: 'Noah Singh', role: 'Secondary', start: 12, duration: 5, load: 5, tone: 'warning' },
      { person: 'Trang Pham', role: 'Primary', start: 18, duration: 5, load: 6, tone: 'critical' },
      { person: 'Leon Wu', role: 'Secondary', start: 23, duration: 7, load: 3, tone: 'info' },
    ],
  },
  {
    team: 'Research Platform',
    timezone: 'Europe/London (UTC+1)',
    shifts: [
      { person: 'Noah Singh', role: 'Primary', start: 0, duration: 3, load: 2, tone: 'success' },
      { person: 'Priya Rao', role: 'Secondary', start: 0, duration: 3, load: 3, tone: 'info' },
      { person: 'Ken Mori', role: 'Primary', start: 3, duration: 4, load: 5, tone: 'warning' },
      { person: 'Maya Chen', role: 'Commander', start: 7, duration: 7, load: 2, tone: 'success' },
      { person: 'Priya Rao', role: 'Primary', start: 14, duration: 7, load: 4, tone: 'info' },
      { person: 'Ken Mori', role: 'Secondary', start: 21, duration: 9, load: 5, tone: 'warning' },
    ],
  },
  {
    team: 'Platform Reliability',
    timezone: 'America/New_York (UTC-4)',
    shifts: [
      { person: 'Hana Lee', role: 'Storage SME', start: 0, duration: 2, load: 4, tone: 'info' },
      { person: 'Minh Tran', role: 'Primary', start: 2, duration: 5, load: 6, tone: 'warning' },
      { person: 'Iris Tan', role: 'Secondary', start: 2, duration: 5, load: 3, tone: 'info' },
      { person: 'Hana Lee', role: 'Primary', start: 7, duration: 7, load: 4, tone: 'success' },
      { person: 'Minh Tran', role: 'Primary', start: 14, duration: 7, load: 5, tone: 'warning' },
      { person: 'Iris Tan', role: 'Secondary', start: 21, duration: 9, load: 2, tone: 'info' },
    ],
  },
]

const onCallViewOptions: { value: OnCallView; label: string }[] = [
  { value: 'day', label: '1 day' },
  { value: 'week', label: '1 week' },
  { value: 'two-weeks', label: '2 weeks' },
  { value: 'month', label: '1 month' },
]

const onCallViewDays: Record<OnCallView, number> = {
  day: 1,
  week: 7,
  'two-weeks': 14,
  month: 30,
}

const baseScheduleDate = new Date(2026, 6, 10)

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('dark')

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
          <div className="product-lockup" aria-label="WorldQuant Alert Management">
            <span className="app-switcher" aria-hidden="true">
              <IconLayoutDashboard size={18} stroke={1.8} />
            </span>
            <img src="/assets/worldquant.png" alt="WorldQuant" className="product-wordmark" />
            <span className="product-name">Alert Management</span>
          </div>
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
          {renderScreen(activeScreen)}
        </main>
      </div>
    </div>
  )
}

function renderScreen(activeScreen: ScreenId) {
  switch (activeScreen) {
    case 'dashboard':
      return <OperationsDashboard />
    case 'queue':
      return <AlertQueue />
    case 'incident':
      return <IncidentRoom />
    case 'services':
      return <ServicesScreen />
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

      <Panel title="Active critical path" icon={IconFlame} className="span-12">
        <ActiveCriticalPathTable />
      </Panel>

      <Panel title="Live incidents" icon={IconTimeline} className="span-12">
        <LiveIncidentsTable />
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

function ActiveCriticalPathTable() {
  return (
    <Table.ScrollContainer minWidth={1100} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Alert</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Signal</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Age</Table.Th>
            <Table.Th>Escalation</Table.Th>
            <Table.Th>SLA</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {alerts.slice(0, 4).map((alert) => (
            <Table.Tr key={alert.id}>
              <Table.Td>
                <Badge className={alert.priority === 'P1' ? 'chip-critical' : 'chip-warning'}>
                  {alert.priority}
                </Badge>
              </Table.Td>
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
              <Table.Td>{alert.signal}</Table.Td>
              <Table.Td>{alert.owner}</Table.Td>
              <Table.Td>{alert.age}</Table.Td>
              <Table.Td>{alert.policy}</Table.Td>
              <Table.Td>{alert.sla}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function LiveIncidentsTable() {
  return (
    <Table.ScrollContainer minWidth={1000} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Incident</Table.Th>
            <Table.Th>Severity</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Commander</Table.Th>
            <Table.Th>Age</Table.Th>
            <Table.Th>Impact</Table.Th>
            <Table.Th>Responders</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {incidents.map((incident) => (
            <Table.Tr key={incident.id}>
              <Table.Td>
                <div className={`severity-title severity-${incident.severity}`}>
                  <span />
                  <div>
                    <strong>{incident.title}</strong>
                    <small>{incident.id}</small>
                  </div>
                </div>
              </Table.Td>
              <Table.Td>
                <SeverityPill severity={incident.severity} />
              </Table.Td>
              <Table.Td>
                <Badge className="chip-info">{incident.state}</Badge>
              </Table.Td>
              <Table.Td>{incident.commander}</Table.Td>
              <Table.Td>{incident.age}</Table.Td>
              <Table.Td>{incident.impact}</Table.Td>
              <Table.Td>
                <Avatar.Group spacing="sm">
                  {incident.responders.map((person) => (
                    <Avatar key={person} radius="xl" color="wqGreen" size="sm">
                      {person[0]}
                    </Avatar>
                  ))}
                </Avatar.Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function AlertQueue() {
  const [query, setQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('active')
  const [teamFilter, setTeamFilter] = useState('all')
  const [environmentFilter, setEnvironmentFilter] = useState('all')
  const [modalAlertId, setModalAlertId] = useState<string | null>(null)

  const filteredAlerts = useMemo(
    () =>
      alerts.filter((alert) => {
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          !normalizedQuery ||
          [alert.id, alert.title, alert.service, alert.signal, alert.dedupeKey, alert.runbook]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)

        const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
        const matchesState =
          stateFilter === 'all' ||
          (stateFilter === 'active'
            ? alert.state !== 'Resolved' && alert.state !== 'Silenced'
            : alert.state === stateFilter)
        const matchesTeam = teamFilter === 'all' || alert.team === teamFilter
        const matchesEnvironment =
          environmentFilter === 'all' || alert.environment === environmentFilter

        return (
          matchesQuery && matchesSeverity && matchesState && matchesTeam && matchesEnvironment
        )
      }),
    [environmentFilter, query, severityFilter, stateFilter, teamFilter],
  )

  const modalAlert = alerts.find((alert) => alert.id === modalAlertId) ?? null

  return (
    <>
      <div className="queue-layout">
        <Panel title="Alert Queue" icon={IconBellRinging} className="queue-table-panel">
          <div className="queue-filter-toolbar">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Search alert, service, runbook, dedupe key"
              className="control"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
            <Select
              leftSection={<IconFilter size={16} />}
              label="Severity"
              value={severityFilter}
              onChange={(value) => setSeverityFilter(value ?? 'all')}
              data={[
                { value: 'all', label: 'All severities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'warning', label: 'Warning' },
                { value: 'info', label: 'Info' },
              ]}
              className="control"
            />
            <Select
              label="State"
              value={stateFilter}
              onChange={(value) => setStateFilter(value ?? 'active')}
              data={[
                { value: 'active', label: 'Needs action' },
                { value: 'all', label: 'All states' },
                { value: 'Firing', label: 'Firing' },
                { value: 'Acked', label: 'Acknowledged' },
                { value: 'Assigned', label: 'Assigned' },
                { value: 'Silenced', label: 'Silenced' },
              ]}
              className="control"
            />
            <Select
              label="Team"
              value={teamFilter}
              onChange={(value) => setTeamFilter(value ?? 'all')}
              data={[
                { value: 'all', label: 'All teams' },
                { value: 'Market Data Platform', label: 'Market Data Platform' },
                { value: 'Research Platform', label: 'Research Platform' },
                { value: 'Platform Reliability', label: 'Platform Reliability' },
                { value: 'Data Operations', label: 'Data Operations' },
              ]}
              className="control"
            />
            <Select
              label="Environment"
              value={environmentFilter}
              onChange={(value) => setEnvironmentFilter(value ?? 'all')}
              data={[
                { value: 'all', label: 'All environments' },
                { value: 'Production', label: 'Production' },
                { value: 'Staging', label: 'Staging' },
              ]}
              className="control"
            />
            <SegmentedControl
              data={['Mine', 'Team', 'All']}
              defaultValue="Team"
              className="control scope-control"
            />
          </div>

          <Table.ScrollContainer minWidth={1420} className="table-wrap">
            <Table className="ops-table" verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Alert</Table.Th>
                  <Table.Th>Service</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Team</Table.Th>
                  <Table.Th>Region</Table.Th>
                  <Table.Th>Source</Table.Th>
                  <Table.Th>Signal</Table.Th>
                  <Table.Th>Opened</Table.Th>
                  <Table.Th>Last seen</Table.Th>
                  <Table.Th>Repeats</Table.Th>
                  <Table.Th>SLA</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredAlerts.map((alert) => (
                  <Table.Tr key={alert.id} onClick={() => setModalAlertId(alert.id)}>
                    <Table.Td>
                      <Badge className={alert.priority === 'P1' ? 'chip-critical' : 'chip-info'}>
                        {alert.priority}
                      </Badge>
                    </Table.Td>
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
                    <Table.Td>{alert.team}</Table.Td>
                    <Table.Td>{alert.region}</Table.Td>
                    <Table.Td>{alert.source}</Table.Td>
                    <Table.Td>{alert.signal}</Table.Td>
                    <Table.Td>{alert.opened}</Table.Td>
                    <Table.Td>{alert.lastSeen}</Table.Td>
                    <Table.Td>{alert.repeatCount}</Table.Td>
                    <Table.Td>{alert.sla}</Table.Td>
                    <Table.Td>
                      <Button
                        size="xs"
                        className="btn-outline"
                        onClick={(event) => {
                          event.stopPropagation()
                          setModalAlertId(alert.id)
                        }}
                      >
                        Inspect
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Panel>
      </div>

      <Modal
        opened={Boolean(modalAlert)}
        onClose={() => setModalAlertId(null)}
        title={modalAlert ? `${modalAlert.id} · Alert Inspector` : 'Alert Inspector'}
        size="xl"
        centered
        className="detail-modal"
      >
        {modalAlert ? <AlertInspector alert={modalAlert} /> : null}
      </Modal>
    </>
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
        <Meta label="Team" value={alert.team} />
        <Meta label="Environment" value={alert.environment} />
        <Meta label="Signal" value={alert.signal} />
        <Meta label="Policy" value={alert.policy} />
        <Meta label="Runbook" value={alert.runbook} />
        <Meta label="Dedupe key" value={alert.dedupeKey} code />
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
        <div className="war-room-card">
          <div>
            <IconUsersGroup size={18} />
            <div>
              <strong>War Room Meeting</strong>
              <a href="https://meet.worldquant.example/wq-inc-4819">meet.worldquant.example/wq-inc-4819</a>
            </div>
          </div>
          <Button
            className="btn-primary"
            size="sm"
            leftSection={<IconExternalLink size={16} />}
            component="a"
            href="https://meet.worldquant.example/wq-inc-4819"
          >
            Join now
          </Button>
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

        <div className="incident-entry-grid">
          <div className="incident-entry-card">
            <strong>Submit decision</strong>
            <Textarea
              className="control"
              minRows={3}
              placeholder="Decision, rationale, owner, expected next check"
            />
            <Button className="btn-primary" size="sm" leftSection={<IconSend size={16} />}>
              Submit decision
            </Button>
          </div>
          <div className="incident-entry-card">
            <strong>Add evidence</strong>
            <TextInput className="control" placeholder="Dashboard or log URL" />
            <Textarea
              className="control"
              minRows={2}
              placeholder="Evidence summary"
            />
            <Button className="btn-outline" size="sm" leftSection={<IconPlus size={16} />}>
              Add evidence
            </Button>
          </div>
        </div>

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
        <div className="source-list">
          <strong>Data sources</strong>
          {incidentDataSources.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function ServicesScreen() {
  const [query, setQuery] = useState('')
  const [healthFilter, setHealthFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const selectedService = serviceRows.find((service) => service.service === selectedServiceId)
  const filteredServices = useMemo(
    () =>
      serviceRows.filter((service) => {
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          !normalizedQuery ||
          [service.service, service.name, service.owner, service.dependencyRisk]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)
        const matchesHealth = healthFilter === 'all' || service.health === healthFilter
        const matchesTier = tierFilter === 'all' || service.tier === tierFilter
        const matchesOwner = ownerFilter === 'all' || service.owner === ownerFilter

        return matchesQuery && matchesHealth && matchesTier && matchesOwner
      }),
    [healthFilter, ownerFilter, query, tierFilter],
  )

  if (selectedService) {
    return <ServiceDetail service={selectedService} onBack={() => setSelectedServiceId(null)} />
  }

  return (
    <div className="screen-grid">
      <Panel title="Service directory" icon={IconServer} className="span-12">
        <div className="queue-filter-toolbar service-filter-toolbar">
          <TextInput
            leftSection={<IconSearch size={16} />}
            placeholder="Search service, owner, dependency"
            className="control"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <Select
            label="Health"
            value={healthFilter}
            onChange={(value) => setHealthFilter(value ?? 'all')}
            data={[
              { value: 'all', label: 'All health states' },
              { value: 'At risk', label: 'At risk' },
              { value: 'Degraded', label: 'Degraded' },
              { value: 'Watch', label: 'Watch' },
              { value: 'Healthy', label: 'Healthy' },
            ]}
            className="control"
          />
          <Select
            label="Tier"
            value={tierFilter}
            onChange={(value) => setTierFilter(value ?? 'all')}
            data={[
              { value: 'all', label: 'All tiers' },
              { value: 'Tier 0', label: 'Tier 0' },
              { value: 'Tier 1', label: 'Tier 1' },
              { value: 'Tier 2', label: 'Tier 2' },
            ]}
            className="control"
          />
          <Select
            label="Owner"
            value={ownerFilter}
            onChange={(value) => setOwnerFilter(value ?? 'all')}
            data={[
              { value: 'all', label: 'All owners' },
              { value: 'Market Data Platform', label: 'Market Data Platform' },
              { value: 'Research Platform', label: 'Research Platform' },
              { value: 'Platform Reliability', label: 'Platform Reliability' },
              { value: 'Data Operations', label: 'Data Operations' },
            ]}
            className="control"
          />
        </div>

        <Table.ScrollContainer minWidth={1100} className="table-wrap">
          <Table className="ops-table" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Service</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Tier</Table.Th>
                <Table.Th>Health</Table.Th>
                <Table.Th>Open alerts</Table.Th>
                <Table.Th>SLO</Table.Th>
                <Table.Th>Noise</Table.Th>
                <Table.Th>Region</Table.Th>
                <Table.Th>Coverage</Table.Th>
                <Table.Th>Dependency risk</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredServices.map((service) => (
                <Table.Tr key={service.service} onClick={() => setSelectedServiceId(service.service)}>
                  <Table.Td>
                    <div>
                      <strong>{service.name}</strong>
                      <small>
                        <Code>{service.service}</Code>
                      </small>
                    </div>
                  </Table.Td>
                  <Table.Td>{service.owner}</Table.Td>
                  <Table.Td>{service.tier}</Table.Td>
                  <Table.Td>
                    <Badge className={service.health === 'Healthy' ? 'chip-success' : 'chip-warning'}>
                      {service.health}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{service.alerts}</Table.Td>
                  <Table.Td>{service.slo}%</Table.Td>
                  <Table.Td>{service.noise}</Table.Td>
                  <Table.Td>{service.region}</Table.Td>
                  <Table.Td>{service.coverage}</Table.Td>
                  <Table.Td>{service.dependencyRisk}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Panel>
    </div>
  )
}

function ServiceDetail({
  service,
  onBack,
}: {
  service: ServiceRow
  onBack: () => void
}) {
  return (
    <div className="service-detail-view">
      <div className="detail-subheader">
        <Button className="btn-outline" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
          Services
        </Button>
        <div>
          <Code>{service.service}</Code>
          <h2>{service.name}</h2>
          <p>
            {service.tier} service owned by {service.owner}. Coverage: {service.coverage}.
          </p>
        </div>
      </div>

      <div className="screen-grid">
        <Panel title="Service profile" icon={IconServer} className="span-4">
          <div className="profile-block">
            <Code>{service.service}</Code>
            <h3>{service.name}</h3>
            <p>{service.dependencyRisk}</p>
          </div>
          <div className="metadata-grid single">
            <Meta label="Owner" value={service.owner} />
            <Meta label="Timezone" value={service.timezone} />
            <Meta label="Escalation" value={service.coverage} />
            <Meta label="Runbooks" value={service.runbooks} />
            <Meta label="Last incident" value={service.lastIncident} />
          </div>
        </Panel>

        <Panel title="Reliability overview" icon={IconChartBar} className="span-8">
          <div className="service-metric-row">
            <MetricCard
              label="Open alerts"
              value={`${service.alerts}`}
              tone={service.alerts > 8 ? 'critical' : 'warning'}
              detail={`${service.region} coverage`}
            />
            <MetricCard
              label="SLO burn"
              value={`${service.slo}%`}
              tone={service.slo > 95 ? 'success' : 'warning'}
              detail="Last 4h"
            />
            <MetricCard label="Duplicate ratio" value={service.noise} tone="info" detail="Down 4%" />
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
              <CompactTable serviceName={service.service} />
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
    </div>
  )
}

function OnCallEscalation() {
  const [scheduleView, setScheduleView] = useState<OnCallView>('week')
  const [rangeOffset, setRangeOffset] = useState(0)
  const dayCount = onCallViewDays[scheduleView]
  const rangeStart = addDays(baseScheduleDate, rangeOffset * dayCount)
  const rangeEnd = addDays(rangeStart, dayCount - 1)
  const scheduleDays = Array.from({ length: dayCount }, (_, index) => addDays(rangeStart, index))

  return (
    <div className="screen-grid oncall-grid">
      <Panel title="Schedule timeline" icon={IconTimeline} className="span-12 schedule-timeline-panel">
        <div className="schedule-toolbar">
          <div>
            <strong>{formatScheduleRange(rangeStart, rangeEnd, dayCount)}</strong>
            <span>Coverage by team, responder and schedule timezone</span>
          </div>
          <div className="schedule-controls">
            <Tooltip label="Previous range">
              <ActionIcon
                variant="subtle"
                className="icon-button"
                aria-label="Previous schedule range"
                onClick={() => setRangeOffset((offset) => offset - 1)}
              >
                <IconChevronLeft size={18} />
              </ActionIcon>
            </Tooltip>
            <SegmentedControl
              value={scheduleView}
              onChange={(value) => {
                setScheduleView(value as OnCallView)
                setRangeOffset(0)
              }}
              data={onCallViewOptions}
              className="control schedule-view-control"
            />
            <Tooltip label="Next range">
              <ActionIcon
                variant="subtle"
                className="icon-button"
                aria-label="Next schedule range"
                onClick={() => setRangeOffset((offset) => offset + 1)}
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>

        <div
          className="schedule-calendar"
          style={{ '--schedule-days': dayCount } as CSSProperties}
        >
          <div className="schedule-calendar-grid">
            <div className="schedule-day-header">
              <span>Schedule</span>
              {scheduleDays.map((day) => (
                <div key={day.toISOString()}>
                  <strong>{formatScheduleDay(day)}</strong>
                  <span>{formatScheduleWeekday(day)}</span>
                </div>
              ))}
            </div>

            {onCallScheduleRows.map((schedule) => (
              <div key={schedule.team} className="schedule-team-row">
                <div className="schedule-team-label">
                  <strong>{schedule.team}</strong>
                  <span>{schedule.timezone}</span>
                </div>
                <div className="schedule-lanes">
                  {schedule.shifts
                    .filter((shift) => shift.start < dayCount)
                    .map((shift) => (
                      <div
                        key={`${schedule.team}-${shift.person}-${shift.start}`}
                        className={`schedule-shift shift-${shift.tone}`}
                        style={scheduleShiftStyle(shift.start, shift.duration, dayCount)}
                      >
                        <strong>{shift.person}</strong>
                        <span>
                          {shift.role} · {shift.load} alerts
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Current coverage" icon={IconCalendarTime} className="span-4">
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

      <Panel title="Escalation policies" icon={IconRoute} className="span-4">
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

      <Panel title="Handoff queue" icon={IconClipboardCheck} className="span-4">
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

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function formatScheduleDay(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatScheduleWeekday(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function formatScheduleRange(start: Date, end: Date, dayCount: number) {
  if (dayCount === 1) {
    return start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return `${formatScheduleDay(start)} - ${formatScheduleDay(end)}, ${end.getFullYear()}`
}

function scheduleShiftStyle(start: number, duration: number, dayCount: number): CSSProperties {
  const columnStart = Math.max(1, start + 1)
  const columnEnd = Math.min(dayCount + 1, start + duration + 1)

  return {
    gridColumn: `${columnStart} / ${Math.max(columnStart + 1, columnEnd)}`,
  }
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

function CompactTable({ serviceName }: { serviceName?: string }) {
  const rows = alerts.filter((alert) => !serviceName || alert.service === serviceName)
  const tableRows = rows.length > 0 ? rows : alerts.slice(0, 4)

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
          {tableRows.map((alert) => (
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
    services: 'Services',
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
    services: 'Service directory with ownership, reliability health, active risk and drill-down detail.',
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
