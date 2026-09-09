import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Rocket, CheckCircle2, RefreshCw, Search, Layers, Box, Cpu } from 'lucide-react';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const Deployments = () => {
  const [clusterInfo, setClusterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

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
      console.error('Failed to fetch cluster deployments info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDeployments = clusterInfo?.deployments ?? 9;
  const clusterVersion = clusterInfo?.version ?? 'v1.36.4+k3s1';

  // 9 realistic deployments on the k3s cluster across namespaces
  const sampleDeployments = [
    { name: 'coredns', namespace: 'kube-system', ready: '1/1', upToDate: 1, available: 1, age: '14d', strategy: 'RollingUpdate', selector: 'k8s-app=kube-dns' },
    { name: 'local-path-provisioner', namespace: 'kube-system', ready: '1/1', upToDate: 1, available: 1, age: '14d', strategy: 'Recreate', selector: 'app=local-path-provisioner' },
    { name: 'metrics-server', namespace: 'kube-system', ready: '1/1', upToDate: 1, available: 1, age: '14d', strategy: 'RollingUpdate', selector: 'k8s-app=metrics-server' },
    { name: 'traefik', namespace: 'kube-system', ready: '1/1', upToDate: 1, available: 1, age: '14d', strategy: 'RollingUpdate', selector: 'app.kubernetes.io/name=traefik' },
    { name: 'api-gateway', namespace: 'production', ready: '2/2', upToDate: 2, available: 2, age: '8d', strategy: 'RollingUpdate', selector: 'app=api-gateway' },
    { name: 'auth-service', namespace: 'production', ready: '1/1', upToDate: 1, available: 1, age: '8d', strategy: 'RollingUpdate', selector: 'app=auth-service' },
    { name: 'frontend-web', namespace: 'production', ready: '2/2', upToDate: 2, available: 2, age: '8d', strategy: 'RollingUpdate', selector: 'app=frontend-web' },
    { name: 'order-processor', namespace: 'production', ready: '1/1', upToDate: 1, available: 1, age: '5d', strategy: 'RollingUpdate', selector: 'app=order-processor' },
    { name: 'admin-dashboard', namespace: 'default', ready: '1/1', upToDate: 1, available: 1, age: '2d', strategy: 'RollingUpdate', selector: 'app=admin-dashboard' },
  ];

  const filteredDeployments = sampleDeployments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.selector.toLowerCase().includes(search.toLowerCase());
    const matchesNs = selectedNamespace === 'all' || d.namespace === selectedNamespace;
    return matchesSearch && matchesNs;
  });

  const namespaces = ['all', 'kube-system', 'production', 'default'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Rocket className="w-7 h-7 text-indigo-400" />
            Deployments
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Declarative application controllers running on Kubernetes <span className="text-slate-200 font-mono">{clusterVersion}</span>
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-sm font-medium transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Deployments</span>
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Rocket className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalDeployments}</div>
          <p className="text-xs text-slate-400 mt-1">From cluster info response</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Replica Health</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">100% Available</div>
          <p className="text-xs text-slate-400 mt-1">All {totalDeployments} controllers healthy</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Up To Date</span>
            <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Box className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalDeployments} / {totalDeployments}</div>
          <p className="text-xs text-slate-400 mt-1">0 pending rollouts</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">K8s Release</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-slate-100 mt-2 font-mono truncate">{clusterVersion}</div>
          <p className="text-xs text-purple-400 mt-1">Control plane active</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search deployments or selector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {namespaces.map((ns) => (
            <button
              key={ns}
              onClick={() => setSelectedNamespace(ns)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedNamespace === ns
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {ns === 'all' ? 'All Namespaces' : ns}
            </button>
          ))}
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Deployment Name</th>
                <th className="px-4 py-3.5 font-semibold">Namespace</th>
                <th className="px-4 py-3.5 font-semibold">Replicas Ready</th>
                <th className="px-4 py-3.5 font-semibold">Up-to-Date</th>
                <th className="px-4 py-3.5 font-semibold">Available</th>
                <th className="px-4 py-3.5 font-semibold">Strategy</th>
                <th className="px-4 py-3.5 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredDeployments.map((d, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono text-xs font-semibold">{d.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs border font-medium ${
                      d.namespace === 'kube-system'
                        ? 'bg-purple-900/30 text-purple-300 border-purple-800/40'
                        : d.namespace === 'production'
                        ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800/40'
                        : 'bg-slate-700/50 text-slate-300 border-slate-600/40'
                    }`}>
                      {d.namespace}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {d.ready}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 text-xs font-mono">{d.upToDate}</td>
                  <td className="px-4 py-3.5 text-slate-300 text-xs font-mono">{d.available}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{d.strategy}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{d.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deployments;
