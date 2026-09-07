import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, Cpu, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

const Nodes = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cluster/nodes');
        setNodes(res.data.items || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch nodes:", err);
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
        <p className="text-slate-400 text-sm">Physical and virtual worker instances</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node, i) => {
          const isReady = node.status.conditions?.find(c => c.type === 'Ready')?.status === 'True';
          
          return (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`p-3 rounded-lg mr-4 ${isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                    {node.metadata.name}
                    {isReady ? (
                      <CheckCircle2 className="w-4 h-4 ml-2 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 ml-2 text-red-400" />
                    )}
                  </h3>
                  <p className="text-sm text-slate-400">Role: Worker • OS: Linux</p>
                </div>
              </div>

              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-slate-300 mb-1">
                    <Cpu className="w-4 h-4 mr-1 text-primary-400" />
                    <span className="text-sm font-medium">CPU Capacity</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-100">{node.status.allocatable?.cpu || 'Unknown'} Cores</span>
                </div>
                
                <div className="w-px h-12 bg-dark-700 hidden md:block"></div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-slate-300 mb-1">
                    <HardDrive className="w-4 h-4 mr-1 text-amber-400" />
                    <span className="text-sm font-medium">Memory Capacity</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-100">{node.status.allocatable?.memory || 'Unknown'}</span>
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
