import React, { useState } from 'react';
import { Layers, CheckCircle2, Clock, Search, Filter } from 'lucide-react';

const Events = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const clusterEvents = [
    { type: 'Normal', reason: 'NodeReady', object: 'Node/aqviolet-instance-first', message: 'Node aqviolet-instance-first status is now: NodeReady', age: '12m' },
    { type: 'Normal', reason: 'Started', object: 'Pod/coredns-6799fbcd5-b9m2q', message: 'Started container coredns', age: '18m' },
    { type: 'Normal', reason: 'Created', object: 'Pod/coredns-6799fbcd5-b9m2q', message: 'Created container coredns', age: '18m' },
    { type: 'Normal', reason: 'Pulled', object: 'Pod/traefik-f4564c4f4-5s9dp', message: 'Container image "rancher/mirrored-library-traefik:2.11.21" already present on machine', age: '22m' },
    { type: 'Normal', reason: 'Scheduled', object: 'Pod/metrics-server-67c658d76b-7h82k', message: 'Successfully assigned kube-system/metrics-server to aqviolet-instance-first', age: '25m' },
    { type: 'Normal', reason: 'ScalingReplicaSet', object: 'Deployment/frontend-web', message: 'Scaled up replica set frontend-web-68dc6f5b9 to 2', age: '45m' },
    { type: 'Normal', reason: 'SuccessfulCreate', object: 'ReplicaSet/api-gateway-7d6f58b49', message: 'Created pod: api-gateway-7d6f58b49-zq8pl', age: '1h' },
    { type: 'Normal', reason: 'LeaderElection', object: 'Lease/kube-scheduler', message: 'aqviolet-instance-first became leader', age: '2h' },
  ];

  const filteredEvents = clusterEvents.filter((ev) => {
    const matchesSearch = ev.reason.toLowerCase().includes(search.toLowerCase()) ||
      ev.object.toLowerCase().includes(search.toLowerCase()) ||
      ev.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || ev.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-7 h-7 text-sky-400" />
          Cluster Lifecycle Events
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time event stream from Kubernetes API controller
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search events by reason or object..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-4 py-3.5 font-semibold">Reason</th>
                <th className="px-4 py-3.5 font-semibold">Involved Object</th>
                <th className="px-4 py-3.5 font-semibold">Message</th>
                <th className="px-4 py-3.5 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredEvents.map((ev, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-100 font-mono text-xs">{ev.reason}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-sky-400">{ev.object}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-300 max-w-md">{ev.message}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{ev.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Events;
