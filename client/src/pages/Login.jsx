import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, User, Mail, UserCircle } from 'lucide-react';

const Login = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const endpoint = isRegistering 
        ? 'http://localhost:8080/api/auth/register' 
        : 'http://localhost:8080/api/auth/login';
        
      const payload = isRegistering 
        ? { name, username, email, password }
        : { username, password };

      const res = await axios.post(endpoint, payload);
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="bg-dark-800 border border-dark-700 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-500/20 rounded-full border border-primary-500/30">
            <ShieldAlert className="w-12 h-12 text-primary-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-2">KubePulse</h2>
        <p className="text-center text-slate-400 mb-8">
          {isRegistering ? 'Create a new account' : 'Authenticate to access cluster'}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {isRegistering && (
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary-500/30 mt-4"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        
        <p className="text-sm text-center text-slate-400 mt-6">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
