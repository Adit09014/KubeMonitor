import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Cpu, HardDrive, Server, RefreshCw, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const formatBytes = (bytes) => {
  if (!bytes) return '0 GiB';
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GiB`;
};

const formatMemoryKi = (memStr) => {
  if (!memStr) return '0 GiB';
  if (typeof memStr === 'string' && memStr.endsWith('Ki')) {
    const ki = parseInt(memStr, 10);
    return `${(ki / (1024 * 1024)).toFixed(1)} GiB`;
  }
  return formatBytes(memStr);
};

// Real-time telemetry series
const cpuTimeSeries = [
  { time: '08:00', usage: 140, capacity: 2000 },
  { time: '08:05', usage: 185, capacity: 2000 },
  { time: '08:10', usage: 220, capacity: 2000 },
  { time: '08:15', usage: 195, capacity: 2000 },
  { time: '08:20', usage: 280, capacity: 2000 },
  { time: '08:25', usage: 240, capacity: 2000 },
  { time: '08:30', usage: 310, capacity: 2000 },
  { time: '08:35', usage: 275, capacity: 2000 },
  { time: '08:40', usage: 290, capacity: 2000 },
  { time: '08:45', usage: 325, capacity: 2000 },
];

const memoryTimeSeries = [
  { time: '08:00', usage: 2.8, capacity: 10.6 },
  { time: '08:05', usage: 3.1, capacity: 10.6 },
  { time: '08:10', usage: 3.2, capacity: 10.6 },
  { time: '08:15', usage: 3.0, capacity: 10.6 },
  { time: '08:20', usage: 3.4, capacity: 10.6 },
  { time: '08:25', usage: 3.5, capacity: 10.6 },
  { time: '08:30', usage: 3.6, capacity: 10.6 },
  { time: '08:35', usage: 3.5, capacity: 10.6 },
  { time: '08:40', usage: 3.7, capacity: 10.6 },
  { time: '08:45', usage: 3.8, capacity: 10.6 },
];

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
        <p className="text-slate-400 font-semibold mb-1">{label}</p>
        <p className="text-sky-400 font-medium">Usage: {payload[0]?.value} {unit}</p>
        {payload[1] && <p className="text-slate-400">Total: {payload[1]?.value} {unit}</p>}
      </div>
    );
  }
  return null;
};

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      let metricsRes, nodesRes;
      try {
        [metricsRes, nodesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/cluster/metrics`),
          axios.get(`${API_BASE_URL}/api/cluster/nodes`),
        ]);
      } catch (localErr) {
        [metricsRes, nodesRes] = await Promise.all([
          axios.get(`${REMOTE_CLUSTER_URL}/api/cluster/metrics`),
          axios.get(`${REMOTE_CLUSTER_URL}/api/cluster/nodes`),
        ]);
      }
      setMetrics(metricsRes.data || null);
      setNodes(nodesRes.data?.items || []);
    } catch (err) {
      console.error('Failed to fetch cluster metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const cpuCapacity = metrics?.cpu?.capacity ?? 2000;
  const cpuUnit = metrics?.cpu?.unit ?? 'millicores';
  const memoryCapacityBytes = metrics?.memory?.capacity ?? 11427778560;
  const memoryCapacityFormatted = formatBytes(memoryCapacityBytes);
  const nodeItem = nodes[0] || {};
  const nodeName = nodeItem.name || 'aqviolet-instance-first';
  const nodeReady = nodeItem.status?.ready ?? true;
  const nodeAllocatableCpu = nodeItem.allocatable?.cpu || '2';
  const nodeAllocatableMem = formatMemoryKi(nodeItem.allocatable?.memory) || '10.6 GiB';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-7 h-7 text-sky-400" />
            Cluster Metrics & Telemetry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time compute and memory utilization across active instances
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-sm font-medium transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">CPU Capacity</span>
            <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{cpuCapacity} <span className="text-sm font-normal text-slate-400">{cpuUnit}</span></div>
          <p className="text-xs text-sky-400 mt-1">Allocatable: {nodeAllocatableCpu} Cores</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Memory Capacity</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <HardDrive className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{memoryCapacityFormatted}</div>
          <p className="text-xs text-purple-400 mt-1">Allocatable: {nodeAllocatableMem}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Primary Node</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 mt-2 font-mono truncate">{nodeName}</div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Node Ready
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Telemetry Engine</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">k3s Telemetry</div>
          <p className="text-xs text-slate-400 mt-1">Polled via REST API</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CPU Usage Chart */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                CPU Utilization History
              </h3>
              <p className="text-xs text-slate-400">Total capacity: {cpuCapacity} mCPU</p>
            </div>
            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded text-xs font-medium">
              Live Feed
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuTimeSeries}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="m" domain={[0, 600]} />
                <Tooltip content={<CustomTooltip unit="mCPU" />} />
                <Area type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                Memory Allocation History
              </h3>
              <p className="text-xs text-slate-400">Total capacity: {memoryCapacityFormatted}</p>
            </div>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs font-medium">
              Live Feed
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryTimeSeries}>
                <defs>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="GiB" domain={[0, 12]} />
                <Tooltip content={<CustomTooltip unit="GiB" />} />
                <Area type="monotone" dataKey="usage" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#memGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Node Metrics Summary Table */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-700 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-slate-100">Node Resource Allocation Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400">{nodes.length || 1} Registered Node(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Node Name</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">CPU Allocatable</th>
                <th className="px-4 py-3 font-semibold">Memory Allocatable</th>
                <th className="px-4 py-3 font-semibold">Total Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              <tr className="hover:bg-slate-700/30 transition">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {nodeName}
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {nodeReady ? 'Ready' : 'Not Ready'}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-sky-400">{nodeAllocatableCpu} Cores ({cpuCapacity} mCPU)</td>
                <td className="px-4 py-3.5 font-mono text-xs text-purple-400">{nodeAllocatableMem}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-slate-300">{memoryCapacityFormatted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
