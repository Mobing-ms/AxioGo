import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Bot, Shield, ArrowRight, Key, UserCheck, User } from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('a.vance@fleet-enterprise.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSignIn = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleRolePresetLogin = (role) => {
    switchRole(role);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-axio-bg relative font-mono text-left">
      <div className="absolute inset-0 bg-tech-grid opacity-25" />
      <div className="absolute w-[500px] h-[300px] bg-axio-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 bg-axio-panel border border-axio-border rounded-xl shadow-2xl">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-axio-red/10 border border-axio-red/18 flex items-center justify-center text-axio-red mx-auto mb-3">
            <Bot className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">AXIOGO</h1>
          <p className="text-xs text-axio-muted uppercase tracking-widest mt-1">ENTERPRISE DECISION INTELLIGENCE</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4 text-xs mb-8">
          <div>
            <label className="block text-axio-muted uppercase text-[10px] mb-1">Enterprise Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-axio-bg border border-axio-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-axio-red font-mono"
            />
          </div>

          <div>
            <label className="block text-axio-muted uppercase text-[10px] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-axio-bg border border-axio-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-axio-red font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-axio-red hover:bg-red-600 font-bold text-white text-xs rounded shadow-lg shadow-axio-red/20 transition-all flex items-center justify-center gap-2"
          >
            <span>SIGN IN TO ENTERPRISE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Preset Logins */}
        <div className="border-t border-axio-border pt-6">
          <p className="text-[10px] text-axio-muted uppercase text-center mb-3 font-semibold">
            DEMO PRESET ROLE AUTHENTICATION:
          </p>

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              onClick={() => handleRolePresetLogin(ROLES.ADMIN)}
              className="p-2 bg-axio-red/10 border border-axio-red/15 hover:bg-axio-red/20 text-axio-red font-bold rounded flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4" />
              <span>ADMIN</span>
            </button>

            <button
              onClick={() => handleRolePresetLogin(ROLES.AUTHORIZED)}
              className="p-2 bg-axio-cyan/10 border border-axio-cyan/15 hover:bg-axio-cyan/20 text-axio-cyan font-bold rounded flex flex-col items-center gap-1"
            >
              <UserCheck className="w-4 h-4" />
              <span>ANALYST</span>
            </button>

            <button
              onClick={() => handleRolePresetLogin(ROLES.STANDARD)}
              className="p-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-bold rounded flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4" />
              <span>STANDARD</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
