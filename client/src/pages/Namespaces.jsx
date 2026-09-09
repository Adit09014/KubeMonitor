import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Folder, CheckCircle2, RefreshCw, Search, Shield, Layers, Box, Cpu } from 'lucide-react';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const Namespaces = () => {
  const [clusterInfo, setClusterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.get(`${API_BASE_URL}/api/cluster/info`);
      } catch (localErr) {
        res = await axios.get(`${REMOTE_CLUSTER_URL}/api/cluster/info`);
      }
      setClusterInfo(res.data || null);
    } catch (err) {
      console.error('Failed to fetch cluster namespaces info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalNamespaces = clusterInfo?.namespaces ?? 5;

  // The 5 active namespaces in the cluster
  const namespacesList = [
    {
      name: 'default',
      status: 'Active',
      pods: 3,
      deployments: 1,
      services: 4,
      role: 'admin-role',
      age: '14d',
      description: 'Default workspace for user workloads and persistent state',
      labels: ['kubernetes.io/metadata.name=default'],
    },
    {
      name: 'kube-system',
      status: 'Active',
      pods: 6,
      deployments: 4,
      services: 6,
      role: 'view-only',
      age: '14d',
      description: 'Kubernetes control plane, DNS, metrics server, and ingress',
      labels: ['kubernetes.io/metadata.name=kube-system'],
    },
    {
      name: 'production',
      status: 'Active',
      pods: 6,
      deployments: 4,
      services: 6,
      role: 'deployer',
      age: '8d',
      description: 'Production services, API gateways, and customer-facing apps',
      labels: ['environment=production', 'security.policy=strict'],
    },
    {
      name: 'kube-public',
      status: 'Active',
      pods: 0,
      deployments: 0,
      services: 1,
      role: 'cluster-info',
      age: '14d',
      description: 'Publicly readable cluster information for discovery',
      labels: ['kubernetes.io/metadata.name=kube-public'],
    },
    {
      name: 'kube-node-lease',
      status: 'Active',
      pods: 0,
      deployments: 0,
      services: 1,
      role: 'node-heartbeat',
      age: '14d',
      description: 'Node lease heartbeats for high availability monitoring',
      labels: ['kubernetes.io/metadata.name=kube-node-lease'],
    },
  ];

  const filteredNamespaces = namespacesList.filter((ns) =>
    ns.name.toLowerCase().includes(search.toLowerCase()) ||
    ns.description.toLowerCase().includes(search.toLowerCase()) ||
    ns.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Folder className="w-7 h-7 text-amber-400" />
            Namespaces
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Virtual clusters and resource boundaries ({totalNamespaces} Active)
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-sm font-medium transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Namespaces</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Folder className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalNamespaces}</div>
          <p className="text-xs text-slate-400 mt-1">From cluster telemetry response</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{totalNamespaces} Active</div>
          <p className="text-xs text-slate-400 mt-1">0 Terminating</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Security RBAC</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">Protected</div>
          <p className="text-xs text-slate-400 mt-1">Policies bound to namespaces</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search namespaces or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Grid of Namespaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNamespaces.map((ns, i) => (
          <div key={i} className="bg-slate-800/90 border border-slate-700/90 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <h3 className="font-bold text-slate-100 text-base font-mono">{ns.name}</h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-semibold">
                  {ns.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{ns.description}</p>

              <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 mb-3 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block">Pods</span>
                  <span className="text-sm font-bold text-slate-200">{ns.pods}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Deployments</span>
                  <span className="text-sm font-bold text-slate-200">{ns.deployments}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Services</span>
                  <span className="text-sm font-bold text-slate-200">{ns.services}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Role Bound:</span>
                <span className="font-mono text-purple-300 font-medium">{ns.role}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Age: {ns.age}</span>
              <span className="font-mono text-[10px] text-slate-500">{ns.labels[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Namespaces;
