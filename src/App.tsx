import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ComponentType, ReactNode } from 'react'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Code,
  Divider,
  Group,
  MantineProvider,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
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
  Switch,
  createTheme,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import type { MantineColorScheme } from '@mantine/core'
import {
  IconAdjustments,
  IconAlertTriangle,
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
  IconPencil,
  IconPlus,
  IconRoute,
  IconSearch,
  IconSend,
  IconServer,
  IconShieldCheck,
  IconSun,
  IconTimeline,
  IconTrash,
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
  | 'reports'

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

type PostMortemDocument = {
  id: string
  incidentId: string
  title: string
  service: string
  owner: string
  state: 'Draft' | 'In review' | 'Approved'
  severity: Severity
  incidentDate: string
  due: string
  actionItems: number
  updated: string
}

type IncidentTicket = {
  id: string
  incidentId: string
  title: string
  type: 'Decision' | 'Evidence' | 'Follow-up'
  priority: 'P1' | 'P2' | 'P3'
  state: 'Open' | 'Doing' | 'Blocked'
  owner: string
  due: string
  source: string
  updated: string
}

type BarDatum = {
  label: string
  value: number
  meta?: string
}

type PieDatum = {
  label: string
  value: number
  color: string
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

type EscalationPolicy = {
  id: string
  service: string
  name: string
  enabled: boolean
  schedule: string
  timezone: string
  severityScope: Severity[]
  environmentScope: string[]
  l1After: number
  l2After: number
  commanderAfter: number
  primary: string
  secondary: string
  commander: string
  notifyChannels: string[]
  autoWarRoom: boolean
  fallback: string
  lastEdited: string
}

type SilenceRule = {
  scope: string
  service: string
  environment: string
  reason: string
  owner: string
  expires: string
  affected: number
  createdBy: string
  createdAt: string
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
  { id: 'incident', label: 'Incident Rooms', group: 'Respond', icon: IconTimeline, badge: '3' },
  { id: 'services', label: 'Services', group: 'Monitor', icon: IconServer },
  { id: 'oncall', label: 'On-call', group: 'Respond', icon: IconCalendarTime },
  { id: 'silences', label: 'Silences & Rules', group: 'Improve', icon: IconAdjustments },
  { id: 'review', label: 'Post-Incident', group: 'Improve', icon: IconFileAnalytics, badge: '5' },
  { id: 'reports', label: 'Reports', group: 'Analyze', icon: IconChartBar },
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

const incidentTickets: IncidentTicket[] = [
  {
    id: 'WQ-TKT-9012',
    incidentId: 'WQ-INC-4819',
    title: 'Check current mitigation path',
    type: 'Decision',
    priority: 'P1',
    state: 'Doing',
    owner: 'Trang',
    due: 'Today 10:15 ICT',
    source: 'Decision timeline',
    updated: '4m ago',
  },
  {
    id: 'WQ-TKT-9013',
    incidentId: 'WQ-INC-4819',
    title: 'Prepare stakeholder update',
    type: 'Follow-up',
    priority: 'P2',
    state: 'Open',
    owner: 'Leon',
    due: 'Today 10:30 ICT',
    source: 'Commander request',
    updated: '8m ago',
  },
  {
    id: 'WQ-TKT-9014',
    incidentId: 'WQ-INC-4819',
    title: 'Validate recovered batches',
    type: 'Evidence',
    priority: 'P1',
    state: 'Blocked',
    owner: 'Priya',
    due: 'Today 10:45 ICT',
    source: 'Recovery checklist',
    updated: '11m ago',
  },
  {
    id: 'WQ-TKT-9008',
    incidentId: 'WQ-INC-4818',
    title: 'Drain overloaded simulation worker pool',
    type: 'Decision',
    priority: 'P2',
    state: 'Doing',
    owner: 'Iris',
    due: 'Today 11:00 ICT',
    source: 'Mitigation runbook',
    updated: '13m ago',
  },
  {
    id: 'WQ-TKT-9009',
    incidentId: 'WQ-INC-4818',
    title: 'Notify research desk of capacity window',
    type: 'Follow-up',
    priority: 'P3',
    state: 'Open',
    owner: 'Ken',
    due: 'Today 11:20 ICT',
    source: 'Comms plan',
    updated: '18m ago',
  },
  {
    id: 'WQ-TKT-8997',
    incidentId: 'WQ-INC-4815',
    title: 'Attach APAC vendor sample comparison',
    type: 'Evidence',
    priority: 'P2',
    state: 'Open',
    owner: 'Hana',
    due: 'Today 12:00 ICT',
    source: 'Quality dashboard',
    updated: '31m ago',
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

const escalationPolicies: EscalationPolicy[] = [
  {
    id: 'WQ-EP-1001',
    service: 'md-ingest-equities-us',
    name: 'Market data Tier 0',
    enabled: true,
    schedule: 'Market Data Platform',
    timezone: 'Asia/Singapore (UTC+8)',
    severityScope: ['critical', 'high'],
    environmentScope: ['Production'],
    l1After: 5,
    l2After: 15,
    commanderAfter: 30,
    primary: 'Trang Pham',
    secondary: 'Leon Wu',
    commander: 'Maya Chen',
    notifyChannels: ['Phone', 'Slack', 'War room'],
    autoWarRoom: true,
    fallback: 'Page Platform Reliability if no owner after commander escalation',
    lastEdited: 'Jul 10, 09:12 by Viet Anh Tran',
  },
  {
    id: 'WQ-EP-1002',
    service: 'brain-sim-cluster',
    name: 'Research platform Tier 1',
    enabled: true,
    schedule: 'Research Platform',
    timezone: 'Europe/London (UTC+1)',
    severityScope: ['critical', 'high', 'warning'],
    environmentScope: ['Production', 'Staging'],
    l1After: 6,
    l2After: 16,
    commanderAfter: 30,
    primary: 'Noah Singh',
    secondary: 'Priya Rao',
    commander: 'Maya Chen',
    notifyChannels: ['Slack', 'Email'],
    autoWarRoom: false,
    fallback: 'Route to Research Platform team channel for business-hours review',
    lastEdited: 'Jul 09, 18:31 by Maya Chen',
  },
  {
    id: 'WQ-EP-1003',
    service: 'hpc-storage-core',
    name: 'HPC storage core',
    enabled: true,
    schedule: 'Platform Reliability',
    timezone: 'America/New_York (UTC-4)',
    severityScope: ['critical', 'high', 'warning'],
    environmentScope: ['Production'],
    l1After: 4,
    l2After: 12,
    commanderAfter: 25,
    primary: 'Minh Tran',
    secondary: 'Iris Tan',
    commander: 'Hana Lee',
    notifyChannels: ['Phone', 'Slack'],
    autoWarRoom: true,
    fallback: 'Escalate to storage SME rotation if primary and secondary miss acknowledgement',
    lastEdited: 'Jul 08, 11:03 by Hana Lee',
  },
  {
    id: 'WQ-EP-1004',
    service: 'vendor-normalizer-apac',
    name: 'Vendor data quality',
    enabled: true,
    schedule: 'Market Data Platform',
    timezone: 'Asia/Singapore (UTC+8)',
    severityScope: ['high', 'warning', 'info'],
    environmentScope: ['Production'],
    l1After: 7,
    l2After: 17,
    commanderAfter: 30,
    primary: 'Trang Pham',
    secondary: 'Leon Wu',
    commander: 'Linh Dao',
    notifyChannels: ['Slack', 'Email'],
    autoWarRoom: false,
    fallback: 'Create Data Operations review task if vendor alert remains assigned after 1 hour',
    lastEdited: 'Jul 07, 16:45 by Linh Dao',
  },
]

const severityOptions: { value: Severity; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
]

const environmentOptions = ['Production', 'Staging']
const notificationChannelOptions = ['Phone', 'Slack', 'Email', 'War room']

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

const silences: SilenceRule[] = [
  {
    scope: 'research-api-staging',
    service: 'research-api-staging',
    environment: 'Staging',
    reason: 'Staging deploy validation',
    owner: 'Research Platform',
    expires: '42m',
    affected: 3,
    createdBy: 'Priya Rao',
    createdAt: '09:08 ICT',
  },
  {
    scope: 'vendor-normalizer-apac',
    service: 'vendor-normalizer-apac',
    environment: 'Production',
    reason: 'Vendor maintenance window',
    owner: 'Data Operations',
    expires: '2h 10m',
    affected: 7,
    createdBy: 'Linh Dao',
    createdAt: '08:20 ICT',
  },
]

const actionItems = [
  { title: 'Tune market data freshness threshold', owner: 'Trang', due: 'Jul 12', state: 'Open' },
  { title: 'Add vendor heartbeat evidence to runbook', owner: 'Leon', due: 'Jul 13', state: 'Doing' },
  { title: 'Backfill missing APAC quality dashboard', owner: 'Hana', due: 'Jul 17', state: 'Open' },
]

const postMortemDocuments: PostMortemDocument[] = [
  {
    id: 'WQ-PIR-2041',
    incidentId: 'WQ-INC-4819',
    title: 'US market data freshness delayed',
    service: 'md-ingest-equities-us',
    owner: 'Market Data Platform',
    state: 'Draft',
    severity: 'critical',
    incidentDate: 'Jul 10, 2026',
    due: 'Jul 12',
    actionItems: 3,
    updated: '14m ago',
  },
  {
    id: 'WQ-PIR-2040',
    incidentId: 'WQ-INC-4818',
    title: 'Simulation cluster capacity degraded',
    service: 'brain-sim-cluster',
    owner: 'Research Platform',
    state: 'In review',
    severity: 'high',
    incidentDate: 'Jul 09, 2026',
    due: 'Jul 13',
    actionItems: 5,
    updated: '2h ago',
  },
  {
    id: 'WQ-PIR-2038',
    incidentId: 'WQ-INC-4815',
    title: 'APAC vendor quality anomaly',
    service: 'vendor-normalizer-apac',
    owner: 'Data Operations',
    state: 'Approved',
    severity: 'warning',
    incidentDate: 'Jul 07, 2026',
    due: 'Jul 10',
    actionItems: 2,
    updated: '1d ago',
  },
]

const topServiceAlertStats: BarDatum[] = [
  { label: 'md-ingest-equities-us', value: 128, meta: 'Market Data Platform' },
  { label: 'brain-sim-cluster', value: 104, meta: 'Research Platform' },
  { label: 'hpc-storage-core', value: 96, meta: 'Platform Reliability' },
  { label: 'vendor-normalizer-apac', value: 87, meta: 'Data Operations' },
  { label: 'research-api-prod', value: 82, meta: 'Research Platform' },
  { label: 'factor-cache-global', value: 74, meta: 'Quant Platform' },
  { label: 'signal-publisher-us', value: 69, meta: 'Market Data Platform' },
  { label: 'portfolio-risk-engine', value: 61, meta: 'Risk Platform' },
  { label: 'feature-store-write', value: 55, meta: 'ML Platform' },
  { label: 'alpha-backtest-api', value: 49, meta: 'Research Platform' },
  { label: 'vendor-feed-eu', value: 44, meta: 'Data Operations' },
  { label: 'notebook-session-gateway', value: 39, meta: 'Research Platform' },
  { label: 'market-calendar-sync', value: 34, meta: 'Market Data Platform' },
  { label: 'auth-token-broker', value: 29, meta: 'Platform Reliability' },
  { label: 'hpc-job-router', value: 24, meta: 'Compute Platform' },
]

const serviceErrorCodeStats: BarDatum[] = [
  { label: 'DATA_FRESHNESS_LAG', value: 212, meta: 'Market data freshness' },
  { label: 'UPSTREAM_TIMEOUT', value: 186, meta: 'Vendor/API timeout' },
  { label: 'QUEUE_SATURATION', value: 153, meta: 'Worker backlog' },
  { label: 'BATCH_VALIDATION_FAILED', value: 121, meta: 'Data quality check' },
  { label: 'STORAGE_RETRY_EXHAUSTED', value: 98, meta: 'Storage retries' },
  { label: 'RATE_LIMITED', value: 84, meta: 'External dependency' },
  { label: 'AUTH_TOKEN_EXPIRED', value: 62, meta: 'Auth/session' },
  { label: 'RUNBOOK_MISSING', value: 47, meta: 'Operational readiness' },
  { label: 'SCHEMA_MISMATCH', value: 39, meta: 'Payload contract' },
  { label: 'DEPLOY_HEALTHCHECK_FAIL', value: 28, meta: 'Release validation' },
]

const clientScreenErrorStats: PieDatum[] = [
  { label: 'Alert Queue', value: 31, color: '#0c66e4' },
  { label: 'Service Detail', value: 22, color: '#22a06b' },
  { label: 'Incident Room', value: 18, color: '#ff991f' },
  { label: 'On-call', value: 12, color: '#ae2e24' },
  { label: 'Silences', value: 10, color: '#6e5dc6' },
  { label: 'Reports', value: 7, color: '#8590a2' },
]

const clientErrorMessageStats: BarDatum[] = [
  { label: 'Failed to load alert inspector evidence', value: 94, meta: 'Alert Queue' },
  { label: 'Runbook preview timed out', value: 77, meta: 'Alert Queue' },
  { label: 'Service dependency graph failed to render', value: 63, meta: 'Service Detail' },
  { label: 'War room meeting link could not be generated', value: 58, meta: 'Incident Room' },
  { label: 'On-call schedule range request failed', value: 51, meta: 'On-call' },
  { label: 'Silence scope validation returned stale data', value: 44, meta: 'Silences' },
  { label: 'Post-incident evidence timeline failed to sync', value: 37, meta: 'Post-Incident' },
  { label: 'Alert queue filters could not be restored', value: 34, meta: 'Alert Queue' },
  { label: 'Escalation policy draft could not be saved', value: 29, meta: 'Service Detail' },
  { label: 'Client session expired while loading workspace', value: 25, meta: 'Global shell' },
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
            {['Monitor', 'Respond', 'Improve', 'Analyze'].map((group) => (
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
    case 'reports':
      return <ReportsScreen />
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
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId)

  if (selectedIncident) {
    return <IncidentRoomDetail incident={selectedIncident} onBack={() => setSelectedIncidentId(null)} />
  }

  return (
    <div className="screen-grid">
      <Panel title="Active incident rooms" icon={IconTimeline} className="span-12">
        <ActiveIncidentRoomsTable onOpen={setSelectedIncidentId} />
      </Panel>
    </div>
  )
}

function ActiveIncidentRoomsTable({ onOpen }: { onOpen: (incidentId: string) => void }) {
  return (
    <Table.ScrollContainer minWidth={1120} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Room</Table.Th>
            <Table.Th>Severity</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Commander</Table.Th>
            <Table.Th>Age</Table.Th>
            <Table.Th>Impact</Table.Th>
            <Table.Th>Responders</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {incidents.map((incident) => (
            <Table.Tr key={incident.id} onClick={() => onOpen(incident.id)}>
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
              <Table.Td>
                <Button
                  className="btn-outline"
                  size="xs"
                  rightSection={<IconArrowRight size={14} />}
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpen(incident.id)
                  }}
                >
                  Open room
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function IncidentRoomDetail({ incident, onBack }: { incident: Incident; onBack: () => void }) {
  const [activeModal, setActiveModal] = useState<'decision' | 'evidence' | 'ticket' | null>(null)
  const warRoomUrl = `https://meet.worldquant.example/${incident.id.toLowerCase()}`
  const [techLead = 'Trang', comms = 'Priya', watcher = 'Leon'] = incident.responders
  const tickets = incidentTickets.filter((ticket) => ticket.incidentId === incident.id)
  const roles = [
    `Commander - ${incident.commander}`,
    `Tech lead - ${techLead}`,
    `Comms - ${comms}`,
    `Watcher - ${watcher}`,
  ]

  return (
    <div className="service-detail-view service-detail-shell">
      <div className="detail-subheader">
        <Button className="btn-outline" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
          Incident Rooms
        </Button>
        <div>
          <Code>{incident.id}</Code>
          <h2>{incident.title}</h2>
          <p>
            {incident.state} · Commander {incident.commander} · {incident.age}
          </p>
        </div>
      </div>

      <div className="incident-layout">
        <Panel title="Incident status" icon={IconFlame} className="incident-left">
          <div className="incident-status-card">
            <SeverityPill severity={incident.severity} />
            <h3>{incident.title}</h3>
            <p>
              Commander {incident.commander} coordinating {incident.responders.length} responders
              across platform and data teams.
            </p>
          </div>
          <div className="role-list">
            {roles.map((role) => (
              <div key={role}>
                <IconUserCheck size={16} />
                <span>{role}</span>
              </div>
            ))}
          </div>
          <div className="war-room-card">
            <div>
              <IconUsersGroup size={18} />
              <div>
                <strong>War Room Meeting</strong>
                <a href={warRoomUrl}>{warRoomUrl.replace('https://', '')}</a>
              </div>
            </div>
            <Button
              className="btn-primary"
              size="sm"
              leftSection={<IconExternalLink size={16} />}
              component="a"
              href={warRoomUrl}
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

          <div className="incident-action-row">
            <Button
              className="btn-primary"
              leftSection={<IconSend size={16} />}
              onClick={() => setActiveModal('decision')}
            >
              Add decision step
            </Button>
            <Button
              className="btn-outline"
              leftSection={<IconPlus size={16} />}
              onClick={() => setActiveModal('evidence')}
            >
              Add evidence
            </Button>
          </div>
        </Panel>

        <Panel title="Evidence" icon={IconBrain} className="incident-right">
          <AICard />
          <div className="evidence-stack">
            <Evidence label="Linked alerts" value={`8 alerts related to ${incident.id}`} />
            <Evidence label="Recent deploy" value="No matching deploy in 6h" />
            <Evidence label="Similar incident" value={`${incident.id.replace(/\d$/, '1')}, 91% match`} />
            <Evidence label="Current impact" value={incident.impact} />
          </div>
        </Panel>
      </div>

      <Panel title="Incident tickets" icon={IconListCheck} className="incident-ticket-panel">
        <div className="incident-ticket-toolbar">
          <div>
            <strong>{tickets.length} linked tickets</strong>
            <span>Decision, evidence and follow-up work created during this response.</span>
          </div>
          <Button
            className="btn-primary"
            leftSection={<IconPlus size={16} />}
            onClick={() => setActiveModal('ticket')}
          >
            Add ticket
          </Button>
        </div>
        <IncidentTicketsTable tickets={tickets} />
      </Panel>

      <IncidentActionModal
        mode={activeModal}
        incident={incident}
        onClose={() => setActiveModal(null)}
      />
    </div>
  )
}

function IncidentTicketsTable({ tickets }: { tickets: IncidentTicket[] }) {
  return (
    <Table.ScrollContainer minWidth={1180} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ticket</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Due / SLA</Table.Th>
            <Table.Th>Source</Table.Th>
            <Table.Th>Updated</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tickets.map((ticket) => (
            <Table.Tr key={ticket.id}>
              <Table.Td>
                <div>
                  <strong>{ticket.title}</strong>
                  <small>{ticket.id}</small>
                </div>
              </Table.Td>
              <Table.Td>{ticket.type}</Table.Td>
              <Table.Td>
                <Badge className={ticket.priority === 'P1' ? 'chip-critical' : 'chip-warning'}>
                  {ticket.priority}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge className={ticket.state === 'Doing' ? 'chip-info' : 'chip-muted'}>
                  {ticket.state}
                </Badge>
              </Table.Td>
              <Table.Td>{ticket.owner}</Table.Td>
              <Table.Td>{ticket.due}</Table.Td>
              <Table.Td>{ticket.source}</Table.Td>
              <Table.Td>{ticket.updated}</Table.Td>
              <Table.Td>
                <Button className="btn-outline" size="xs" rightSection={<IconArrowRight size={14} />}>
                  Open
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function IncidentActionModal({
  mode,
  incident,
  onClose,
}: {
  mode: 'decision' | 'evidence' | 'ticket' | null
  incident: Incident
  onClose: () => void
}) {
  return (
    <Modal
      opened={mode !== null}
      onClose={onClose}
      title={
        mode === 'decision'
          ? 'Add decision step'
          : mode === 'evidence'
            ? 'Add evidence'
            : 'Add ticket'
      }
      centered
      size="lg"
      className="detail-modal"
    >
      {mode === 'decision' && (
        <div className="incident-modal-form">
          <Code>{incident.id}</Code>
          <Textarea
            label="Decision step"
            className="control"
            minRows={4}
            placeholder="Decision, rationale, owner, expected next check"
          />
          <Select
            label="Owner"
            className="control"
            defaultValue={incident.commander}
            data={[incident.commander, ...incident.responders]}
          />
          <TextInput label="Expected next check" className="control" defaultValue="10 minutes" />
          <div className="silence-modal-actions">
            <Button className="btn-outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="btn-primary" leftSection={<IconSend size={16} />} onClick={onClose}>
              Submit decision
            </Button>
          </div>
        </div>
      )}

      {mode === 'evidence' && (
        <div className="incident-modal-form">
          <Code>{incident.id}</Code>
          <TextInput label="Dashboard or log URL" className="control" placeholder="https://" />
          <Textarea
            label="Evidence summary"
            className="control"
            minRows={4}
            placeholder="Evidence summary"
          />
          <div className="silence-modal-actions">
            <Button className="btn-outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="btn-primary" leftSection={<IconPlus size={16} />} onClick={onClose}>
              Add evidence
            </Button>
          </div>
        </div>
      )}

      {mode === 'ticket' && (
        <div className="silence-modal-form">
          <TextInput
            label="Ticket title"
            className="control span-form-full"
            placeholder="Follow-up or recovery task"
          />
          <Select
            label="Type"
            className="control"
            defaultValue="Follow-up"
            data={['Decision', 'Evidence', 'Follow-up']}
          />
          <Select
            label="Owner"
            className="control"
            defaultValue={incident.responders[0] ?? incident.commander}
            data={[incident.commander, ...incident.responders]}
          />
          <Select label="Priority" className="control" defaultValue="P2" data={['P1', 'P2', 'P3']} />
          <TextInput label="Due / SLA" className="control" defaultValue="Today 10:45 ICT" />
          <Textarea
            label="Context"
            className="control span-form-full"
            minRows={3}
            placeholder="Link the ticket to a decision, evidence item, or recovery checklist"
          />
          <div className="silence-modal-actions span-form-full">
            <Button className="btn-outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="btn-primary" leftSection={<IconPlus size={16} />} onClick={onClose}>
              Add ticket
            </Button>
          </div>
        </div>
      )}
    </Modal>
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
  const policy =
    escalationPolicies.find((escalationPolicy) => escalationPolicy.service === service.service) ??
    escalationPolicies[0]

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

      <div className="screen-grid service-detail-grid">
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

        <Panel title="Service workspace" icon={IconDatabase} className="span-12 service-workspace-panel">
          <Tabs defaultValue="escalation" className="wq-tabs">
            <Tabs.List>
              <Tabs.Tab value="escalation">Escalation Policy</Tabs.Tab>
              <Tabs.Tab value="alerts">Active Alerts</Tabs.Tab>
              <Tabs.Tab value="history">History</Tabs.Tab>
              <Tabs.Tab value="deps">Dependencies</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="escalation">
              <EscalationPolicyEditor service={service} policy={policy} />
            </Tabs.Panel>
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
          </Tabs>
        </Panel>
      </div>
    </div>
  )
}

function EscalationPolicyEditor({
  service,
  policy,
}: {
  service: ServiceRow
  policy: EscalationPolicy
}) {
  const [policyName, setPolicyName] = useState(policy.name)
  const [enabled, setEnabled] = useState(policy.enabled)
  const [schedule, setSchedule] = useState(policy.schedule)
  const [timezone, setTimezone] = useState(policy.timezone)
  const [severityScope, setSeverityScope] = useState<Severity[]>(policy.severityScope)
  const [environmentScope, setEnvironmentScope] = useState(policy.environmentScope)
  const [l1After, setL1After] = useState(policy.l1After)
  const [l2After, setL2After] = useState(policy.l2After)
  const [commanderAfter, setCommanderAfter] = useState(policy.commanderAfter)
  const [primary, setPrimary] = useState(policy.primary)
  const [secondary, setSecondary] = useState(policy.secondary)
  const [commander, setCommander] = useState(policy.commander)
  const [notifyChannels, setNotifyChannels] = useState(policy.notifyChannels)
  const [autoWarRoom, setAutoWarRoom] = useState(policy.autoWarRoom)
  const [fallback, setFallback] = useState(policy.fallback)

  const scheduleOptions = onCallScheduleRows.map((row) => ({
    value: row.team,
    label: `${row.team} · ${row.timezone}`,
  }))
  const responderOptions = Array.from(
    new Set(onCallScheduleRows.flatMap((row) => row.shifts.map((shift) => shift.person))),
  ).map((person) => ({ value: person, label: person }))
  const selectedScheduleTimezone =
    onCallScheduleRows.find((row) => row.team === schedule)?.timezone ?? timezone
  const timingIsValid = l1After < l2After && l2After < commanderAfter

  return (
    <div className="policy-editor">
      <div className="policy-editor-grid">
        <div className="policy-editor-section">
          <div className="policy-section-heading">
            <IconShieldCheck size={18} />
            <div>
              <strong>Policy scope</strong>
              <span>{policy.id} controls alert routing for this service</span>
            </div>
          </div>

          <Switch
            checked={enabled}
            onChange={(event) => setEnabled(event.currentTarget.checked)}
            label="Policy enabled"
            className="policy-switch"
          />
          <TextInput
            label="Policy name"
            value={policyName}
            onChange={(event) => setPolicyName(event.currentTarget.value)}
            className="control"
          />
          <Select
            label="On-call schedule"
            value={schedule}
            onChange={(value) => {
              const nextSchedule = value ?? schedule
              setSchedule(nextSchedule)
              setTimezone(
                onCallScheduleRows.find((row) => row.team === nextSchedule)?.timezone ?? timezone,
              )
            }}
            data={scheduleOptions}
            className="control"
          />
          <TextInput
            label="Timezone"
            value={selectedScheduleTimezone}
            onChange={(event) => setTimezone(event.currentTarget.value)}
            className="control"
          />
          <MultiSelect
            label="Applies to severity"
            value={severityScope}
            onChange={(value) => setSeverityScope(value as Severity[])}
            data={severityOptions}
            className="control"
          />
          <Checkbox.Group
            label="Environments"
            value={environmentScope}
            onChange={setEnvironmentScope}
            className="policy-checkbox-group"
          >
            <Group gap="md">
              {environmentOptions.map((environment) => (
                <Checkbox key={environment} value={environment} label={environment} />
              ))}
            </Group>
          </Checkbox.Group>
        </div>

        <div className="policy-editor-section">
          <div className="policy-section-heading">
            <IconRoute size={18} />
            <div>
              <strong>Escalation path</strong>
              <span>Configure who gets paged and when ownership moves up</span>
            </div>
          </div>

          <div className="policy-step-grid">
            <Select
              label="L1 primary"
              value={primary}
              onChange={(value) => setPrimary(value ?? primary)}
              data={responderOptions}
              className="control"
            />
            <NumberInput
              label="Page after"
              value={l1After}
              min={0}
              suffix=" min"
              onChange={(value) => setL1After(numberInputValue(value, l1After))}
              className="control"
            />
            <Select
              label="L1 secondary"
              value={secondary}
              onChange={(value) => setSecondary(value ?? secondary)}
              data={responderOptions}
              className="control"
            />
            <NumberInput
              label="Escalate after"
              value={l2After}
              min={1}
              suffix=" min"
              onChange={(value) => setL2After(numberInputValue(value, l2After))}
              className="control"
            />
            <Select
              label="Incident commander"
              value={commander}
              onChange={(value) => setCommander(value ?? commander)}
              data={responderOptions}
              className="control"
            />
            <NumberInput
              label="Commander after"
              value={commanderAfter}
              min={1}
              suffix=" min"
              onChange={(value) => setCommanderAfter(numberInputValue(value, commanderAfter))}
              className="control"
            />
          </div>

          <MultiSelect
            label="Notification channels"
            value={notifyChannels}
            onChange={setNotifyChannels}
            data={notificationChannelOptions}
            className="control"
          />
          <Switch
            checked={autoWarRoom}
            onChange={(event) => setAutoWarRoom(event.currentTarget.checked)}
            label="Automatically create War Room for critical production alerts"
            className="policy-switch"
          />
          <Textarea
            label="Fallback rule"
            value={fallback}
            onChange={(event) => setFallback(event.currentTarget.value)}
            minRows={3}
            className="control"
          />
        </div>

        <div className="policy-preview-section">
          <div className="policy-section-heading">
            <IconBellRinging size={18} />
            <div>
              <strong>Preview & validation</strong>
              <span>What will happen when a matching alert fires</span>
            </div>
          </div>

          <div className={enabled ? 'policy-status enabled' : 'policy-status disabled'}>
            <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
            <span>{service.service}</span>
          </div>

          <div className="policy-preview-flow">
            <PolicyPreviewStep label="Alert fires" value={`${policyName} · ${service.tier}`} />
            <PolicyPreviewStep label={`${l1After}m`} value={`Page ${primary}`} />
            <PolicyPreviewStep label={`${l2After}m`} value={`Escalate to ${secondary}`} />
            <PolicyPreviewStep
              label={`${commanderAfter}m`}
              value={`Open commander path with ${commander}`}
            />
          </div>

          <div className="policy-validation-list">
            <div className={severityScope.length ? 'validation-row ok' : 'validation-row warning'}>
              <IconCheck size={16} />
              <span>{severityScope.length ? 'Severity scope selected' : 'Select at least one severity'}</span>
            </div>
            <div className={environmentScope.length ? 'validation-row ok' : 'validation-row warning'}>
              <IconCheck size={16} />
              <span>{environmentScope.length ? 'Environment scope selected' : 'Select environment scope'}</span>
            </div>
            <div className={timingIsValid ? 'validation-row ok' : 'validation-row warning'}>
              <IconClock size={16} />
              <span>
                {timingIsValid
                  ? 'Escalation timing increases safely'
                  : 'Timing must increase from L1 to commander'}
              </span>
            </div>
          </div>

          <div className="policy-summary-block">
            <Meta label="Channels" value={notifyChannels.join(', ') || 'None'} />
            <Meta label="War Room" value={autoWarRoom ? 'Auto-create for P1 production' : 'Manual only'} />
            <Meta label="Last edited" value={policy.lastEdited} />
          </div>

          <div className="policy-action-row">
            <Button className="btn-outline" leftSection={<IconCheck size={16} />}>
              Save draft
            </Button>
            <Button className="btn-primary" leftSection={<IconShieldCheck size={16} />}>
              Publish policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PolicyPreviewStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="policy-preview-step">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function numberInputValue(value: string | number, fallback: number) {
  return typeof value === 'number' ? value : fallback
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
          {escalationPolicies
            .filter((policy) => policy.enabled)
            .map((policy) => {
              const service = serviceRows.find((row) => row.service === policy.service)

              return (
              <div key={policy.id} className="policy-card">
                <strong>{policy.name}</strong>
                <span>
                  {service?.service ?? policy.service} · {policy.schedule}
                </span>
                <small>
                  L1 after {policy.l1After}m · L2 after {policy.l2After}m · commander after{' '}
                  {policy.commanderAfter}m
                </small>
              </div>
              )
            })}
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
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [activeSilence, setActiveSilence] = useState<SilenceRule | null>(null)

  const openSilenceModal = (mode: 'create' | 'edit' | 'delete', silence?: SilenceRule) => {
    setActiveSilence(silence ?? null)
    setModalMode(mode)
  }

  const closeSilenceModal = () => {
    setModalMode(null)
    setActiveSilence(null)
  }

  return (
    <>
      <div className="screen-grid silences-grid">
        <div className="silence-page-actions span-12">
          <Button
            className="btn-primary"
            leftSection={<IconPlus size={16} />}
            onClick={() => openSilenceModal('create')}
          >
            Create silence rule
          </Button>
        </div>

        <MetricCard
          className="span-3"
          label="Muted alerts"
          value="10"
          tone="info"
          detail="Covered by active silences"
        />
        <MetricCard
          className="span-3"
          label="Active silences"
          value="2"
          tone="success"
          detail="0 broad production"
        />
        <MetricCard
          className="span-3"
          label="Expiring soon"
          value="1"
          tone="warning"
          detail="Review within 1 hour"
        />
        <MetricCard
          className="span-3"
          label="Affected services"
          value="2"
          tone="info"
          detail="Across staging and production"
        />

        <Panel title="Active silences" icon={IconMoon} className="span-12">
          <ActiveSilencesTable
            onEdit={(silence) => openSilenceModal('edit', silence)}
            onDelete={(silence) => openSilenceModal('delete', silence)}
          />
        </Panel>
      </div>

      <SilenceRuleModal
        mode={modalMode === 'edit' ? 'edit' : 'create'}
        opened={modalMode === 'create' || modalMode === 'edit'}
        silence={activeSilence}
        onClose={closeSilenceModal}
      />
      <DeleteSilenceModal
        opened={modalMode === 'delete'}
        silence={activeSilence}
        onClose={closeSilenceModal}
      />
    </>
  )
}

function ActiveSilencesTable({
  onEdit,
  onDelete,
}: {
  onEdit: (silence: SilenceRule) => void
  onDelete: (silence: SilenceRule) => void
}) {
  return (
    <Table.ScrollContainer minWidth={1120} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Scope</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Environment</Table.Th>
            <Table.Th>Reason</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Affected</Table.Th>
            <Table.Th>Expires</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {silences.map((silence) => (
            <Table.Tr key={silence.scope}>
              <Table.Td>
                <div>
                  <strong>{silence.scope}</strong>
                  <small>Silence rule</small>
                </div>
              </Table.Td>
              <Table.Td>
                <Code>{silence.service}</Code>
              </Table.Td>
              <Table.Td>{silence.environment}</Table.Td>
              <Table.Td>{silence.reason}</Table.Td>
              <Table.Td>{silence.owner}</Table.Td>
              <Table.Td>{silence.affected} alerts</Table.Td>
              <Table.Td>
                <Badge className="chip-muted">{silence.expires}</Badge>
              </Table.Td>
              <Table.Td>
                <span>{silence.createdBy}</span>
                <small>{silence.createdAt}</small>
              </Table.Td>
              <Table.Td>
                <div className="row-action-group">
                  <Tooltip label="Edit silence">
                    <ActionIcon
                      variant="subtle"
                      className="icon-button"
                      aria-label={`Edit ${silence.scope}`}
                      onClick={() => onEdit(silence)}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete silence">
                    <ActionIcon
                      variant="subtle"
                      className="icon-button danger-icon-button"
                      aria-label={`Delete ${silence.scope}`}
                      onClick={() => onDelete(silence)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function SilenceRuleModal({
  mode,
  opened,
  silence,
  onClose,
}: {
  mode: 'create' | 'edit'
  opened: boolean
  silence: SilenceRule | null
  onClose: () => void
}) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? `Edit silence · ${silence?.scope ?? ''}` : 'Create silence rule'}
      size="lg"
      centered
      className="detail-modal"
    >
      <div className="silence-modal-form">
        <TextInput
          label="Scope"
          defaultValue={silence?.scope ?? ''}
          placeholder="service, label selector or environment"
          className="control"
        />
        <TextInput
          label="Service"
          defaultValue={silence?.service ?? ''}
          placeholder="service-name"
          className="control"
        />
        <Select
          label="Environment"
          defaultValue={silence?.environment ?? 'Production'}
          data={environmentOptions}
          className="control"
        />
        <TextInput
          label="Owner"
          defaultValue={silence?.owner ?? ''}
          placeholder="Owning team"
          className="control"
        />
        <TextInput
          label="Duration"
          defaultValue={silence?.expires ?? '1h'}
          placeholder="1h, 2h 30m, until deploy complete"
          className="control"
        />
        <NumberInput
          label="Affected alerts preview"
          defaultValue={silence?.affected ?? 0}
          min={0}
          className="control"
        />
        <Textarea
          label="Reason"
          defaultValue={silence?.reason ?? ''}
          placeholder="Why this silence is safe and when it should end"
          minRows={3}
          className="control span-form-full"
        />
        <div className="silence-modal-actions span-form-full">
          <Button className="btn-outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-primary" leftSection={<IconShieldCheck size={16} />} onClick={onClose}>
            {isEdit ? 'Save changes' : 'Create silence'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function DeleteSilenceModal({
  opened,
  silence,
  onClose,
}: {
  opened: boolean
  silence: SilenceRule | null
  onClose: () => void
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete silence rule"
      size="md"
      centered
      className="detail-modal"
    >
      <div className="delete-confirm">
        <ThemeIcon className="delete-confirm-icon" radius="xl">
          <IconAlertTriangle size={22} />
        </ThemeIcon>
        <div>
          <strong>{silence?.scope ?? 'Selected silence'}</strong>
          <p>
            Deleting this silence will allow matching alerts to fire again immediately. This action
            should be recorded in the audit trail.
          </p>
        </div>
        <div className="silence-modal-actions">
          <Button className="btn-outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-warning" leftSection={<IconTrash size={16} />} onClick={onClose}>
            Delete silence
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function PostIncidentReview() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const selectedDocument = postMortemDocuments.find((document) => document.id === selectedDocumentId)

  if (selectedDocument) {
    return (
      <PostIncidentDetail
        document={selectedDocument}
        onBack={() => setSelectedDocumentId(null)}
      />
    )
  }

  return (
    <>
      <div className="screen-grid">
        <div className="silence-page-actions span-12">
          <Button
            className="btn-primary"
            leftSection={<IconPlus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create post-mortem
          </Button>
        </div>

        <Panel title="Post-mortem documents" icon={IconFileAnalytics} className="span-12">
          <PostMortemDocumentsTable onOpen={setSelectedDocumentId} />
        </Panel>
      </div>

      <CreatePostMortemModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  )
}

function PostMortemDocumentsTable({ onOpen }: { onOpen: (documentId: string) => void }) {
  return (
    <Table.ScrollContainer minWidth={1080} className="table-wrap">
      <Table className="ops-table" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Document</Table.Th>
            <Table.Th>Incident</Table.Th>
            <Table.Th>Severity</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Service</Table.Th>
            <Table.Th>Owner</Table.Th>
            <Table.Th>Incident date</Table.Th>
            <Table.Th>Due</Table.Th>
            <Table.Th>Action items</Table.Th>
            <Table.Th>Updated</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {postMortemDocuments.map((document) => (
            <Table.Tr key={document.id} onClick={() => onOpen(document.id)}>
              <Table.Td>
                <div className={`severity-title severity-${document.severity}`}>
                  <span />
                  <div>
                    <strong>{document.title}</strong>
                    <small>{document.id}</small>
                  </div>
                </div>
              </Table.Td>
              <Table.Td>
                <Code>{document.incidentId}</Code>
              </Table.Td>
              <Table.Td>
                <SeverityPill severity={document.severity} />
              </Table.Td>
              <Table.Td>
                <Badge
                  className={
                    document.state === 'Approved'
                      ? 'chip-success'
                      : document.state === 'In review'
                        ? 'chip-info'
                        : 'chip-muted'
                  }
                >
                  {document.state}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Code>{document.service}</Code>
              </Table.Td>
              <Table.Td>{document.owner}</Table.Td>
              <Table.Td>{document.incidentDate}</Table.Td>
              <Table.Td>{document.due}</Table.Td>
              <Table.Td>{document.actionItems}</Table.Td>
              <Table.Td>{document.updated}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function CreatePostMortemModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create post-mortem document"
      centered
      size="lg"
      className="detail-modal"
    >
      <div className="silence-modal-form">
        <Select
          label="Incident"
          className="control"
          defaultValue={incidents[0]?.id}
          data={incidents.map((incident) => ({
            value: incident.id,
            label: `${incident.id} · ${incident.title}`,
          }))}
        />
        <TextInput label="Owner" className="control" defaultValue="Market Data Platform" />
        <TextInput
          label="Title"
          className="control span-form-full"
          defaultValue="US market data freshness delayed"
        />
        <TextInput label="Service" className="control" defaultValue="md-ingest-equities-us" />
        <TextInput label="Due date" className="control" defaultValue="Jul 12, 2026" />
        <Textarea
          label="Initial summary"
          className="control span-form-full"
          minRows={4}
          placeholder="Impact, suspected root cause, unresolved questions, and required evidence"
        />
        <div className="silence-modal-actions span-form-full">
          <Button className="btn-outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="btn-primary" leftSection={<IconPlus size={16} />} onClick={onClose}>
            Create document
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function PostIncidentDetail({
  document,
  onBack,
}: {
  document: PostMortemDocument
  onBack: () => void
}) {
  return (
    <div className="service-detail-view">
      <div className="detail-subheader">
        <Button className="btn-outline" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
          Post-Incident
        </Button>
        <div>
          <Code>{document.id}</Code>
          <h2>{document.title}</h2>
          <p>
            {document.incidentId} · {document.state} · owner {document.owner}
          </p>
        </div>
      </div>

      <div className="review-layout">
        <Panel title="Review outline" icon={IconFileAnalytics} className="review-outline">
          {[
            [
              'Executive summary',
              `${document.title} affected ${document.service} during the ${document.incidentDate} response window.`,
            ],
            ['Impact', 'Research refresh delayed for the affected quant workflows.'],
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
    </div>
  )
}

function ReportsScreen() {
  return (
    <div className="screen-grid">
      <Panel title="Alert and error reports" icon={IconChartBar} className="span-12 report-panel">
        <Tabs defaultValue="services" className="wq-tabs report-tabs">
          <Tabs.List>
            <Tabs.Tab value="services" leftSection={<IconServer size={16} />}>
              Services
            </Tabs.Tab>
            <Tabs.Tab value="client" leftSection={<IconDeviceDesktop size={16} />}>
              Client
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="services">
            <div className="report-tab-grid">
              <ReportSummaryStrip
                items={[
                  ['Total alerts', '1,142', '+18% WoW'],
                  ['Top service share', '11.2%', 'md-ingest-equities-us'],
                  ['Unique error codes', '38', 'last 7 days'],
                ]}
              />
              <div className="report-chart-card report-chart-wide">
                <ReportChartHeading
                  title="Top services by alert volume"
                  meta="Last 7 days"
                  value="15 services"
                />
                <HorizontalBarChart data={topServiceAlertStats} valueLabel="alerts" />
              </div>
              <div className="report-chart-card report-chart-wide">
                <ReportChartHeading
                  title="Most common service error codes"
                  meta="Deduplicated by error code"
                  value="10 codes"
                />
                <HorizontalBarChart data={serviceErrorCodeStats} valueLabel="events" compact />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="client">
            <div className="report-tab-grid client-report-grid">
              <ReportSummaryStrip
                items={[
                  ['Client errors', '480', '-6% WoW'],
                  ['Most affected screen', '31%', 'Alert Queue'],
                  ['Top message share', '19.6%', 'Inspector evidence'],
                ]}
              />
              <div className="report-chart-card report-pie-card">
                <ReportChartHeading
                  title="Error share by screen"
                  meta="Client-side errors"
                  value="100%"
                />
                <PieDonutChart data={clientScreenErrorStats} />
              </div>
              <div className="report-chart-card report-message-card">
                <ReportChartHeading
                  title="Top client error messages"
                  meta="Grouped by normalized message"
                  value="10 messages"
                />
                <HorizontalBarChart data={clientErrorMessageStats} valueLabel="errors" />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Panel>
    </div>
  )
}

function ReportSummaryStrip({ items }: { items: [string, string, string][] }) {
  return (
    <div className="report-summary-strip">
      {items.map(([label, value, meta]) => (
        <div key={label} className="report-summary-item">
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{meta}</small>
        </div>
      ))}
    </div>
  )
}

function ReportChartHeading({
  title,
  meta,
  value,
}: {
  title: string
  meta: string
  value: string
}) {
  return (
    <div className="report-chart-heading">
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <Badge className="chip-muted">{value}</Badge>
    </div>
  )
}

function HorizontalBarChart({
  data,
  valueLabel,
  compact = false,
}: {
  data: BarDatum[]
  valueLabel: string
  compact?: boolean
}) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className={compact ? 'horizontal-bars compact' : 'horizontal-bars'}>
      {data.map((item) => (
        <div key={item.label} className="horizontal-bar-row">
          <div className="bar-label">
            <strong>{item.label}</strong>
            {item.meta && <span>{item.meta}</span>}
          </div>
          <div className="bar-track" aria-hidden="true">
            <div
              className="bar-fill"
              style={{ width: `${Math.max(6, Math.round((item.value / maxValue) * 100))}%` }}
            />
          </div>
          <div className="bar-value">
            <strong>{item.value}</strong>
            <span>{valueLabel}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function PieDonutChart({ data }: { data: PieDatum[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const leading = data[0]

  return (
    <div className="pie-report">
      <div className="pie-chart" style={{ background: pieGradient(data) }}>
        <div>
          <strong>{leading.value}%</strong>
          <span>{leading.label}</span>
        </div>
      </div>
      <div className="pie-legend">
        {data.map((item) => (
          <div key={item.label}>
            <span style={{ background: item.color }} />
            <strong>{item.label}</strong>
            <small>{Math.round((item.value / total) * 100)}%</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function pieGradient(data: PieDatum[]) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0
  return `conic-gradient(${data
    .map((item) => {
      const start = cursor
      cursor += (item.value / total) * 100
      return `${item.color} ${start}% ${cursor}%`
    })
    .join(', ')})`
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
  className,
}: {
  label: string
  value: string
  detail: string
  tone: 'critical' | 'warning' | 'success' | 'info'
  className?: string
}) {
  return (
    <Paper className={className ? `metric-card tone-${tone} ${className}` : `metric-card tone-${tone}`}>
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

function screenTitle(screen: ScreenId) {
  const titles: Record<ScreenId, string> = {
    dashboard: 'Operations Dashboard',
    queue: 'Alert Queue',
    incident: 'Incident Rooms',
    services: 'Services',
    oncall: 'On-call & Escalation',
    silences: 'Silences & Rules',
    review: 'Post-Incident Review',
    reports: 'Reports',
  }
  return titles[screen]
}

function screenDescription(screen: ScreenId) {
  const descriptions: Record<ScreenId, string> = {
    dashboard: 'Shift-level risk, live incidents, service health and response quality in one operational surface.',
    queue: 'Dense triage queue with ownership, impact, evidence and action-ready inspector.',
    incident: 'Active incident room directory with drill-down response workspace for roles, decisions and evidence.',
    services: 'Service directory with ownership, reliability health, active risk and drill-down detail.',
    oncall: 'Coverage, escalation policy and handoff state across teams and time zones.',
    silences: 'Manage active silences with scoped duration, ownership, audit reason and safe expiry.',
    review: 'Post-incident document library with drill-down review workspace for evidence and action items.',
    reports: 'Alert and client error analytics by service, error code, screen and message.',
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

function screenFromHash(): ScreenId {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const hash = window.location.hash.replace('#', '')
  return navItems.some((item) => item.id === hash) ? (hash as ScreenId) : 'dashboard'
}

export default App
