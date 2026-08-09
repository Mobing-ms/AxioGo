import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';
import { Settings, User, Bell, Mic, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsView = () => {
  const { currentRole, currentUser } = useAuth();
  const [voiceSpeed, setVoiceSpeed] = useState('1.0x');
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-axio-border">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-axio-cyan" />
          <h1 className="text-xl font-bold text-white tracking-wide">USER & ENTERPRISE SETTINGS</h1>
        </div>
        <RoleBadge role={currentRole} />
      </div>

      <div className="space-y-6">
        
        {/* User Profile */}
        <div className="p-6 bg-axio-panel border border-axio-border rounded-lg space-y-4 text-xs font-sans">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-axio-red" />
            <span>USER PROFILE & CREDENTIALS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div><span className="text-axio-muted block text-[10px]">FULL NAME</span><input type="text" readOnly value={currentUser.name} className="w-full bg-axio-bg border border-axio-border px-3 py-2 rounded text-white" /></div>
            <div><span className="text-axio-muted block text-[10px]">ENTERPRISE EMAIL</span><input type="text" readOnly value={currentUser.email} className="w-full bg-axio-bg border border-axio-border px-3 py-2 rounded text-white" /></div>
          </div>
        </div>

        {/* Voice AI Settings */}
        <div className="p-6 bg-axio-panel border border-axio-border rounded-lg space-y-4 text-xs font-sans">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-axio-cyan" />
            <span>VOICE AI PREFERENCES</span>
          </h2>
          <div className="space-y-3 font-mono">
            <div>
              <span className="text-axio-muted block text-[10px] mb-1">AXIS TTS SPEECH RATE</span>
              <select value={voiceSpeed} onChange={(e) => setVoiceSpeed(e.target.value)} className="bg-axio-bg border border-axio-border px-3 py-2 rounded text-white">
                <option>0.8x (Slower)</option>
                <option>1.0x (Normal)</option>
                <option>1.2x (Faster)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6 bg-axio-panel border border-axio-border rounded-lg space-y-4 text-xs font-sans">
          <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-axio-green" />
            <span>NOTIFICATION PREFERENCES</span>
          </h2>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-axio-text-sub">Receive email alerts for High-Risk Autonomous Action Triggers</span>
            <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="w-4 h-4 accent-axio-red" />
          </div>
        </div>

      </div>

    </div>
  );
};
