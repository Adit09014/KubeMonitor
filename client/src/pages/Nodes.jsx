import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, Cpu, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const formatMemory = (memStr) => {
  if (!memStr) return 'Unknown';
  if (typeof memStr === 'string' && memStr.endsWith('Ki')) {
    const ki = parseInt(memStr, 10);
    return `${(ki / (1024 * 1024)).toFixed(1)} GiB`;
  }
  if (typeof memStr === 'number') {
    return `${(memStr / (1024 * 1024 * 1024)).toFixed(1)} GiB`;
  }
  return memStr;
};

const Nodes = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        let res;
        try {
          res = await axios.get(`${API_BASE_URL}/api/cluster/nodes`);
        } catch (localErr) {
          res = await axios.get(`${REMOTE_CLUSTER_URL}/api/cluster/nodes`);
        }
        setNodes(res.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch nodes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNodes();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-400">Loading nodes...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Cluster Nodes</h1>
        <p className="text-slate-400 text-sm">Physical and virtual worker instances ({nodes.length} Active)</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node, i) => {
          const nodeName = node.name || node.metadata?.name || `node-${i + 1}`;
          const isReady = node.status?.ready ?? (node.status?.conditions?.find(c => c.type === 'Ready')?.status === 'True') ?? true;
          const cpuAllocatable = node.allocatable?.cpu || node.capacity?.cpu || node.status?.allocatable?.cpu || '2';
          const memoryAllocatable = formatMemory(node.allocatable?.memory || node.capacity?.memory || node.status?.allocatable?.memory);

          return (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`p-3 rounded-lg mr-4 ${isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                    {nodeName}
                    {isReady ? (
                      <CheckCircle2 className="w-4 h-4 ml-2 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 ml-2 text-red-400" />
                    )}
                  </h3>
                  <p className="text-sm text-slate-400">Role: Control Plane / Worker • OS: Linux (k3s)</p>
                </div>
              </div>

              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-slate-300 mb-1">
                    <Cpu className="w-4 h-4 mr-1 text-primary-400" />
                    <span className="text-sm font-medium">CPU Capacity</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-100">{cpuAllocatable} Cores</span>
                </div>
                
                <div className="w-px h-12 bg-dark-700 hidden md:block"></div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-slate-300 mb-1">
                    <HardDrive className="w-4 h-4 mr-1 text-amber-400" />
                    <span className="text-sm font-medium">Memory Capacity</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-100">{memoryAllocatable}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Nodes;

