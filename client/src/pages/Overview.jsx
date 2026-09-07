import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Paper,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/Info';
import ErrorOutlineIcon from '@mui/icons-material/Error';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock chart data — more data points for richer graphs
const cpuData = [
  { time: '09:30', value: 18 }, { time: '09:35', value: 22 },
  { time: '09:40', value: 28 }, { time: '09:45', value: 24 },
  { time: '09:50', value: 32 }, { time: '09:55', value: 38 },
  { time: '10:00', value: 20 }, { time: '10:05', value: 35 },
  { time: '10:10', value: 25 }, { time: '10:15', value: 55 },
  { time: '10:20', value: 30 }, { time: '10:25', value: 45 },
  { time: '10:30', value: 38 },
];

const memoryData = [
  { time: '09:30', value: 38 }, { time: '09:35', value: 41 },
  { time: '09:40', value: 43 }, { time: '09:45', value: 39 },
  { time: '09:50', value: 44 }, { time: '09:55', value: 42 },
  { time: '10:00', value: 40 }, { time: '10:05', value: 45 },
  { time: '10:10', value: 48 }, { time: '10:15', value: 52 },
  { time: '10:20', value: 50 }, { time: '10:25', value: 55 },
  { time: '10:30', value: 53 },
];

const networkData = [
  { time: '09:30', inbound: 10, outbound: 6 },
  { time: '09:35', inbound: 14, outbound: 9 },
  { time: '09:40', inbound: 11, outbound: 7 },
  { time: '09:45', inbound: 16, outbound: 12 },
  { time: '09:50', inbound: 13, outbound: 10 },
  { time: '09:55', inbound: 20, outbound: 15 },
  { time: '10:00', inbound: 12, outbound: 8 },
  { time: '10:05', inbound: 18, outbound: 14 },
  { time: '10:10', inbound: 15, outbound: 11 },
  { time: '10:15', inbound: 25, outbound: 20 },
  { time: '10:20', inbound: 22, outbound: 16 },
  { time: '10:25', inbound: 28, outbound: 22 },
  { time: '10:30', inbound: 20, outbound: 18 },
];

// Mock recent activity
const recentActivity = [
  { type: 'error',   message: 'pod/payment-api CrashLoopBackOff — container exited with code 137', time: '2 min ago' },
  { type: 'warning', message: 'pod/cache-redis high memory usage at 92% (threshold: 85%)', time: '5 min ago' },
  { type: 'success', message: 'deployment/frontend scaled from 3 → 5 replicas', time: '8 min ago' },
  { type: 'info',    message: 'node/worker-03 joined the cluster (kubelet v1.29.1)', time: '15 min ago' },
  { type: 'success', message: 'deployment/api-gateway rollout completed successfully', time: '30 min ago' },
  { type: 'warning', message: 'PersistentVolumeClaim/data-pvc nearing capacity (88%)', time: '35 min ago' },
  { type: 'success', message: 'service/monitoring-stack LoadBalancer provisioned', time: '45 min ago' },
  { type: 'info',    message: 'namespace/staging created by admin', time: '1 hr ago' },
  { type: 'success', message: 'configmap/app-config updated in production namespace', time: '1.5 hr ago' },
];

// Mock top resource consumers
const topPods = [
  { name: 'payment-api-7b6c4', namespace: 'production', cpu: '450m', memory: '512Mi', status: 'CrashLoopBackOff', statusColor: 'error' },
  { name: 'frontend-deploy-a3f1', namespace: 'production', cpu: '320m', memory: '256Mi', status: 'Running', statusColor: 'success' },
  { name: 'cache-redis-0', namespace: 'default', cpu: '180m', memory: '1.2Gi', status: 'Running', statusColor: 'success' },
  { name: 'api-gateway-5d8b2', namespace: 'production', cpu: '280m', memory: '384Mi', status: 'Running', statusColor: 'success' },
  { name: 'monitoring-prom-0', namespace: 'monitoring', cpu: '520m', memory: '2.1Gi', status: 'Running', statusColor: 'success' },
];

const statCards = [
  { title: 'Nodes', count: 6, ok: 6, warn: 0, path: '/nodes', icon: DnsIcon, gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: '#3b82f6', trend: '+1', trendUp: true },
  { title: 'Pods', count: 42, ok: 39, warn: 3, path: '/pods', icon: ViewInArIcon, gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', color: '#a78bfa', trend: '+5', trendUp: true },
  { title: 'Deployments', count: 12, ok: 12, warn: 0, path: '/deployments', icon: RocketLaunchIcon, gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', color: '#34d399', trend: '0', trendUp: true },
  { title: 'Services', count: 18, ok: 18, warn: 0, path: '/services', icon: LanguageIcon, gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', color: '#fbbf24', trend: '+2', trendUp: true },
  { title: 'Namespaces', count: 5, ok: 5, warn: 0, path: '/namespaces', icon: FolderIcon, gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)', color: '#22d3ee', trend: '+1', trendUp: true },
  { title: 'RBAC Policies', count: 8, ok: 8, warn: 0, path: '/rbac', icon: AdminPanelSettingsIcon, gradient: 'linear-gradient(135deg, #be185d 0%, #f472b6 100%)', color: '#f472b6', trend: '0', trendUp: true },
];

// Cluster quick metrics
const quickMetrics = [
  { label: 'Avg CPU', value: '38%', icon: SpeedIcon, color: '#10b981' },
  { label: 'Avg Memory', value: '53%', icon: MemoryIcon, color: '#8b5cf6' },
  { label: 'Total Storage', value: '62%', icon: StorageIcon, color: '#0ea5e9' },
  { label: 'Uptime', value: '99.97%', icon: TrendingUpIcon, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, bgcolor: '#0f172a', border: '1px solid #334155' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry, idx) => (
          <Typography key={idx} variant="body2" sx={{ color: entry.color, fontWeight: 600, fontSize: '0.8rem' }}>
            {entry.name}: {entry.value}{entry.unit || '%'}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const StorageGauge = ({ label, used, total, unit, color }) => {
  const percent = Math.round((used / total) * 100);
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
          {used} / {total} {unit || 'GB'} ({percent}%)
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: (theme) => alpha(color, 0.12),
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: color,
          },
        }}
      />
    </Box>
  );
};

const Overview = () => {
  const navigate = useNavigate();
  const [clusterInfo, setClusterInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoRes = await axios.get('http://localhost:5000/api/cluster/info');
        setClusterInfo(infoRes.data);
        const metricsRes = await axios.get('http://localhost:5000/api/cluster/metrics');
        setMetrics(metricsRes.data);
      } catch (err) {
        console.error('Failed to fetch cluster data:', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Cluster Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time telemetry and health monitoring
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {clusterInfo && (
            <Chip
              label={`v${clusterInfo.version}`}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'divider', color: 'text.secondary' }}
            />
          )}
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important' }} />}
            label="Healthy"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
              borderColor: (theme) => alpha(theme.palette.success.main, 0.3),
              border: '1px solid',
              fontWeight: 600,
              '& .MuiChip-icon': { color: 'success.main' },
            }}
          />
        </Box>
      </Box>

      {/* Quick Metrics Banner */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <Grid size={{ xs: 6, sm: 3 }} key={m.label}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(m.color, 0.12),
                  }}
                >
                  <Icon sx={{ color: m.color, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {m.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: m.color }}>
                    {m.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Stat Cards — Clickable */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={card.title}>
              <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardActionArea onClick={() => navigate(card.path)} sx={{ p: 0 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: card.gradient,
                          boxShadow: `0 4px 12px ${alpha(card.color, 0.35)}`,
                        }}
                      >
                        <Icon sx={{ color: '#fff', fontSize: 20 }} />
                      </Box>
                      {card.trend !== '0' && (
                        <Chip
                          size="small"
                          icon={card.trendUp ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />}
                          label={card.trend}
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            bgcolor: (theme) => alpha(card.trendUp ? theme.palette.success.main : theme.palette.error.main, 0.1),
                            color: card.trendUp ? 'success.main' : 'error.main',
                            '& .MuiChip-icon': { color: card.trendUp ? 'success.main' : 'error.main' },
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
                      {card.count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 6, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main" sx={{ fontSize: '0.65rem' }}>
                        {card.ok} OK
                      </Typography>
                      {card.warn > 0 && (
                        <>
                          <FiberManualRecordIcon sx={{ fontSize: 6, color: 'warning.main', ml: 0.5 }} />
                          <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.65rem' }}>
                            {card.warn} Warn
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Resource Utilization Charts */}
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        Resource Utilization
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* CPU Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>CPU Usage</Typography>
              <Chip label="Avg: 38%" size="small" sx={{ bgcolor: (theme) => alpha('#10b981', 0.1), color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="CPU" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Memory Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Memory Usage</Typography>
              <Chip label="Avg: 53%" size="small" sx={{ bgcolor: (theme) => alpha('#8b5cf6', 0.1), color: '#8b5cf6', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryData}>
                  <defs>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="Memory" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Network Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Network I/O</Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 3, bgcolor: '#0ea5e9', borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Inbound</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 3, bgcolor: '#f59e0b', borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Outbound</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="MB" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="inbound" name="Inbound" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorInbound)" />
                  <Area type="monotone" dataKey="outbound" name="Outbound" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorOutbound)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Storage */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <StorageIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Storage</Typography>
            </Box>
            <StorageGauge label="PersistentVolumes" used={62} total={100} color="#0ea5e9" />
            <StorageGauge label="etcd Database" used={1.8} total={8} color="#8b5cf6" />
            <StorageGauge label="Container Images" used={24} total={50} color="#f59e0b" />
            <StorageGauge label="Logs Volume" used={8.5} total={20} color="#10b981" />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section: Top Pods + Recent Activity side by side */}
      <Grid container spacing={2.5}>
        {/* Top Resource Consumers */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Top Resource Consumers</Typography>
              <Chip
                label="View All Pods"
                size="small"
                icon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => navigate('/pods')}
                sx={{
                  cursor: 'pointer',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': { color: 'primary.main' },
                  '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15) },
                }}
              />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}>Pod</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}>Namespace</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}>CPU</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}>Memory</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPods.map((pod, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        '&:hover': { bgcolor: (theme) => alpha(theme.palette.common.white, 0.03) },
                        '& td': { borderColor: 'divider' },
                      }}
                    >
                      <TableCell sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {pod.name}
                      </TableCell>
                      <TableCell>
                        <Chip label={pod.namespace} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 22, borderColor: 'divider' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary', fontSize: '0.8rem', fontFamily: 'monospace' }}>{pod.cpu}</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontSize: '0.8rem', fontFamily: 'monospace' }}>{pod.memory}</TableCell>
                      <TableCell>
                        <Chip
                          label={pod.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            bgcolor: (theme) => alpha(theme.palette[pod.statusColor].main, 0.1),
                            color: `${pod.statusColor}.main`,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Activity</Typography>
              <Chip
                label="View Events"
                size="small"
                icon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => navigate('/events')}
                sx={{
                  cursor: 'pointer',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': { color: 'primary.main' },
                  '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15) },
                }}
              />
            </Box>
            <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
              {recentActivity.map((event, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    px: 1,
                    py: 0.75,
                    borderRadius: 1.5,
                    mb: 0.25,
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.common.white, 0.03) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {event.type === 'error' && <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 18 }} />}
                    {event.type === 'warning' && <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 18 }} />}
                    {event.type === 'success' && <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 18 }} />}
                    {event.type === 'info' && <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: 18 }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={event.message}
                    secondary={event.time}
                    primaryTypographyProps={{ fontSize: '0.8rem', lineHeight: 1.3 }}
                    secondaryTypographyProps={{ fontSize: '0.65rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
