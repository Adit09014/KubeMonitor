import React, { useState } from 'react';
import { Terminal, RefreshCw, Search, Download, Trash2, ArrowDown } from 'lucide-react';

const Logs = () => {
  const [selectedPod, setSelectedPod] = useState('api-gateway-7d6f58b49-zq8pl');
  const [search, setSearch] = useState('');

  const podsList = [
    'api-gateway-7d6f58b49-zq8pl',
    'frontend-web-68dc6f5b9-m4t8q',
    'auth-service-58f7bc8d4-l2v9x',
    'coredns-6799fbcd5-b9m2q',
    'traefik-f4564c4f4-5s9dp',
    'metrics-server-67c658d76b-7h82k',
  ];

  const logLines = [
    { time: '2026-09-09T08:15:02Z', level: 'INFO', msg: '[server] HTTP service listening on 0.0.0.0:8080' },
    { time: '2026-09-09T08:15:03Z', level: 'INFO', msg: '[k8s-client] Initialized in-cluster config with token secret' },
    { time: '2026-09-09T08:15:10Z', level: 'INFO', msg: '[health] GET /api/health HTTP/1.1 200 OK (0.42ms)' },
    { time: '2026-09-09T08:15:15Z', level: 'INFO', msg: '[cluster] GET /api/cluster/info HTTP/1.1 200 OK (2.15ms)' },
    { time: '2026-09-09T08:15:20Z', level: 'INFO', msg: '[metrics] Polling node aqviolet-instance-first telemetry: cpu=2000m, memory=11.4GB' },
    { time: '2026-09-09T08:16:01Z', level: 'INFO', msg: '[rbac] Evaluated authorization for user "admin" on namespace "default" -> ALLOW' },
    { time: '2026-09-09T08:17:34Z', level: 'INFO', msg: '[proxy] Forwarded request to cluster endpoint: response status 200' },
    { time: '2026-09-09T08:18:22Z', level: 'INFO', msg: '[gc] Container memory sweep completed in 1.2ms' },
    { time: '2026-09-09T08:20:00Z', level: 'INFO', msg: '[heartbeat] Lease kube-node-lease/aqviolet-instance-first renewed' },
  ];

  const filteredLogs = logLines.filter((l) =>
    l.msg.toLowerCase().includes(search.toLowerCase()) || l.time.includes(search)
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-7 h-7 text-emerald-400" />
            Container Workload Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time stdout/stderr stream from cluster containers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPod}
            onChange={(e) => setSelectedPod(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {podsList.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="text-xs text-slate-400 font-mono ml-2">logs: {selectedPod}</span>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Log Lines */}
        <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-[500px] overflow-y-auto">
          {filteredLogs.map((l, i) => (
            <div key={i} className="flex items-start gap-3 hover:bg-slate-900/40 px-2 py-0.5 rounded transition">
              <span className="text-slate-500 shrink-0 select-none">{l.time}</span>
              <span className="text-emerald-400 font-semibold shrink-0 select-none">[{l.level}]</span>
              <span className="text-slate-200">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;
