import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Users, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const RBAC = () => {
  const [roles, setRoles] = useState([]);
  const [bindings, setBindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRBAC = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const [rolesRes, bindingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/rbac/roles`, { headers }),
          axios.get(`${API_BASE_URL}/api/rbac/bindings`, { headers })
        ]);
        
        setRoles(rolesRes.data.items || []);
        setBindings(bindingsRes.data.items || []);
      } catch (err) {
        console.error("Failed to fetch RBAC data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRBAC();
  }, []);

  if (loading) return <div className="p-6 text-slate-400">Loading Security Policies...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Access Control (RBAC)</h1>
          <p className="text-slate-400 text-sm">Manage Roles, RoleBindings, and ServiceAccounts</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 px-4 py-2 rounded-lg flex items-center">
            <Shield className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-slate-300 text-sm">Current Role: <strong className="text-white">{user?.role}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Table */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center">
            <Key className="w-5 h-5 text-amber-400 mr-2" />
            <h3 className="text-lg font-semibold text-slate-100">Roles / ClusterRoles</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-dark-900/80 text-slate-400 border-b border-dark-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Namespace</th>
                  <th className="px-4 py-3 font-medium">Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {roles.map((r, i) => (
                  <tr key={i} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{r.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-dark-900 rounded text-xs border border-dark-600">{r.namespace}</span></td>
                    <td className="px-4 py-3 text-xs font-mono text-primary-400">
                      {Array.isArray(r.rules) ? r.rules.join(', ') : (r.rules || '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Bindings Table */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-dark-700 bg-dark-900/50 flex items-center">
            <Users className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-slate-100">RoleBindings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-dark-900/80 text-slate-400 border-b border-dark-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role Ref</th>
                  <th className="px-4 py-3 font-medium">Subjects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {bindings.map((b, i) => {
                  const subjectList = Array.isArray(b.subjects) ? b.subjects : (b.subjects ? [b.subjects] : []);
                  return (
                    <tr key={i} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">{b.name}</td>
                      <td className="px-4 py-3 text-amber-400">{b.roleRef}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {subjectList.map((sub, j) => (
                            <span key={j} className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs border border-blue-800/50">{sub}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RBAC;
