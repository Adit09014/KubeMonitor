import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Server, Shield, User, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, REMOTE_CLUSTER_URL } from '../config/api';

const Settings = () => {
  const { user } = useAuth();
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/health`);
      setTestStatus({ ok: true, msg: `Backend connected successfully (${res.data?.message || 'OK'})` });
    } catch (err) {
      setTestStatus({ ok: false, msg: `Failed to connect to backend: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-sky-400" />
          Settings & Environment
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          KubePulse dashboard configuration and endpoint connectivity
        </p>
      </div>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
            <User className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-slate-100">Authenticated Session</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400 text-xs block">Username</span>
              <span className="font-mono text-slate-200 font-semibold">{user?.username || 'admin'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Role</span>
              <span className="font-mono text-emerald-400 font-semibold">{user?.role || 'admin'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block">Session Status</span>
              <span className="text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> Active (HTTP-only Cookie)
              </span>
            </div>
          </div>
        </div>

        {/* API Endpoint Configuration */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
            <Server className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-slate-100">API Gateway & Cluster Configuration</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="text-slate-400 text-xs block mb-1">Local Backend Gateway (`VITE_API_URL`)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={API_BASE_URL}
                  className="w-full sm:w-96 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  Test Health
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs block mb-1">Remote Cluster Fallback (`VITE_REMOTE_CLUSTER_URL`)</label>
              <input
                type="text"
                readOnly
                value={REMOTE_CLUSTER_URL}
                className="w-full sm:w-96 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300"
              />
              <p className="text-[11px] text-slate-500 mt-1">Configured in client `.env` file for high-availability failover</p>
            </div>

            {testStatus && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                testStatus.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {testStatus.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {testStatus.msg}
              </div>
            )}
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">Security & Credentials</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All requests to protected routes use JWT tokens validated by the Go backend and RBAC middleware. Sensitive endpoints proxy to the target cluster without exposing raw credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
