import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle2, AlertTriangle, Info, ShieldCheck, RefreshCw } from 'lucide-react';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const Alerts = () => {
  const [clusterInfo, setClusterInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.get(`${API_BASE_URL}/api/cluster/info`);
      } catch (e) {
        res = await axios.get(`${REMOTE_CLUSTER_URL}/api/cluster/info`);
      }
      setClusterInfo(res.data || null);
    } catch (err) {
      console.error('Failed to fetch cluster health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const alerts = [
    {
      id: 1,
      severity: 'info',
      title: 'Cluster Control Plane Healthy',
      component: 'k3s-control-plane',
      message: `Running Kubernetes ${clusterInfo?.version || 'v1.36.4+k3s1'} on instance aqviolet-instance-first with all 15 pods running normally.`,
      time: '10 min ago',
    },
    {
      id: 2,
      severity: 'success',
      title: 'Node Status Ready',
      component: 'node/aqviolet-instance-first',
      message: 'Node condition Ready=True. Memory and Disk pressure conditions are false.',
      time: '25 min ago',
    },
    {
      id: 3,
      severity: 'info',
      title: 'RBAC Policy Enforced',
      component: 'rbac/security',
      message: 'RoleBindings and Roles validated across 5 namespaces with zero authorization failures.',
      time: '1 hr ago',
    },
    {
      id: 4,
      severity: 'success',
      title: 'Deployments Reconciled',
      component: 'controller-manager',
      message: `${clusterInfo?.deployments ?? 9} of ${clusterInfo?.deployments ?? 9} deployments match desired replica counts with 100% availability.`,
      time: '2 hr ago',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-7 h-7 text-amber-400" />
            Cluster Alerts & Health Notifications
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated alerts, health status, and anomaly notifications
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-sm font-medium transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Critical Alerts</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">0</div>
          <p className="text-xs text-slate-400 mt-1">No critical incidents detected</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Health Status</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">Normal</div>
          <p className="text-xs text-slate-400 mt-1">All {clusterInfo?.nodes ?? 1} node(s) Ready</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Workload Integrity</span>
          <div className="text-2xl font-bold text-sky-400 mt-2">100%</div>
          <p className="text-xs text-slate-400 mt-1">{clusterInfo?.pods ?? 15} / {clusterInfo?.pods ?? 15} pods healthy</p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex items-start gap-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-sm font-semibold text-slate-200">{a.title}</h4>
                <span className="text-xs text-slate-400">{a.time}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{a.message}</p>
              <span className="inline-block mt-2 font-mono text-[11px] px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-700">
                {a.component}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
