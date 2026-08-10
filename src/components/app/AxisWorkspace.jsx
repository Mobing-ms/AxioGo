import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';
import { PREBUILT_QUERIES, simulateAxisWorkflow } from '../../services/axisService';
import {
  Bot,
  Send,
  Mic,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Database,
  FileText,
  Zap,
  Layers,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AxisWorkspace = ({ onOpenVoiceModal, onOpenReports, onOpenActions }) => {
  const { currentRole } = useAuth();
  const { selectedDataset, activeWorkspace, activeFilters } = useWorkspace();
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'AXIS',
      text: 'Greetings. I am AXIS, your Enterprise AI Decision Intelligence Copilot. How can I assist with your automotive fleet data today?',
      timestamp: '09:00 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepText, setActiveStepText] = useState(null);
  const [activatedAgents, setActivatedAgents] = useState([]);

  const handleSendQuery = (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);
    setActiveStepText('Understanding request & checking permissions...');

    simulateAxisWorkflow(
      q,
      (step) => {
        setActiveStepText(`${step.agent}: ${step.text}`);
      },
      (response, agents) => {
        setIsProcessing(false);
        setActiveStepText(null);
        setActivatedAgents(agents);

        const axisMsg = {
          id: `axis_${Date.now()}`,
          sender: 'AXIS',
          headline: response.headline,
          text: response.summary,
          chartData: response.chartData,
          recommendations: response.recommendations,
          actionAvailable: response.actionAvailable,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, axisMsg]);
      }
    );
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">

      {/* Workspace Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-axio-border">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-axio-red" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">AXIS AI WORKSPACE</h1>
            <p className="text-xs text-axio-text-secondary">Stateful natural language decision copilot</p>
          </div>
        </div>
        <RoleBadge role={currentRole} />
      </div>

      {/* Main Workspace Layout (Chat Left, Context Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Chat Conversation */}
        <div className="lg:col-span-8 bg-axio-panel border border-axio-border rounded-lg flex flex-col h-[70vh] shadow-2xl overflow-hidden">

          {/* Conversation Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'AXIS' && (
                  <div className="w-8 h-8 rounded bg-axio-red/20 border border-axio-red/18 flex items-center justify-center text-axio-red font-bold text-xs shrink-0">
                    AXIS
                  </div>
                )}

                <div className={`p-4 rounded-lg text-xs max-w-2xl font-sans ${msg.sender === 'USER'
                    ? 'bg-axio-card border border-axio-border text-white'
                    : 'bg-axio-bg border border-axio-border text-axio-text-sub'
                  }`}>
                  <div className="font-mono text-[10px] text-axio-muted mb-1 flex items-center justify-between gap-4">
                    <span>{msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.headline && (
                    <div className="font-bold text-sm text-white mb-2 font-sans">{msg.headline}</div>
                  )}

                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Chart Rendering */}
                  {msg.chartData && (
                    <div className="mt-4 p-3 bg-axio-panel border border-axio-border rounded">
                      <div className="text-[10px] font-mono text-axio-cyan mb-2">MAINTENANCE EXPENDITURE AGGREGATION ($)</div>
                      <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={msg.chartData}>
                            <XAxis dataKey="period" stroke="#7F8B98" fontSize={10} />
                            <YAxis stroke="#7F8B98" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: '#090C11', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="GroupA" stroke="#FF3046" fill="#FF3046" fillOpacity={0.2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {msg.recommendations && (
                    <div className="mt-3 p-3 bg-axio-card border border-axio-border rounded text-[11px] font-sans">
                      <span className="font-mono text-axio-red font-bold block mb-1">RECOMMENDATIONS:</span>
                      <ul className="space-y-1">
                        {msg.recommendations.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Available Actions */}
                  {msg.actionAvailable && (
                    <div className="mt-3 pt-3 border-t border-axio-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-axio-muted">ACTION AVAILABLE: {msg.actionAvailable.title}</span>
                      <button
                        onClick={onOpenActions}
                        className="px-3 py-1 bg-axio-cyan/10 border border-axio-cyan/15 text-axio-cyan font-mono text-[10px] font-bold rounded"
                      >
                        EXECUTE ACTION
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="p-4 bg-axio-bg border border-axio-border rounded flex items-center gap-3 font-mono text-xs text-axio-cyan animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{activeStepText || 'AXIS Processing Multi-Agent Workflow...'}</span>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-6 py-2 bg-axio-card border-t border-axio-border flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-axio-muted font-bold text-[10px]">SUGGESTIONS:</span>
            {PREBUILT_QUERIES.slice(0, 3).map(q => (
              <button
                key={q.question}
                onClick={() => handleSendQuery(q.question)}
                className="px-2.5 py-1 bg-axio-bg hover:bg-axio-hover border border-axio-border text-axio-text-sub rounded whitespace-nowrap"
              >
                {q.question}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-axio-card border-t border-axio-border flex items-center gap-3">
            <button
              onClick={onOpenVoiceModal}
              className="p-2.5 bg-axio-bg hover:bg-axio-hover border border-axio-border text-axio-cyan rounded"
              title="Speak with Voice AI"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Ask AXIS about maintenance, telemetry, or fleet trends..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              className="flex-1 bg-axio-bg border border-axio-border rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-axio-red"
            />

            <button
              onClick={() => handleSendQuery()}
              className="px-5 py-2.5 bg-axio-red hover:bg-red-600 text-white font-bold text-xs rounded flex items-center gap-1.5"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Active Context Side Panel */}
        <div className="lg:col-span-4 p-6 bg-axio-panel border border-axio-border rounded-lg space-y-6">

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-axio-cyan" />
              <span>ACTIVE DATASET CONTEXT</span>
            </h3>
            <div className="p-3 bg-axio-bg border border-axio-border rounded text-xs space-y-1">
              <div className="text-white font-bold">{selectedDataset}</div>
              <div className="text-[10px] text-axio-muted">Domain: Fleet Operations</div>
              <div className="text-[10px] text-axio-green">Freshness: Real-time (5s lag)</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-axio-red" />
              <span>ACTIVE WORKSPACE FILTERS</span>
            </h3>
            <div className="p-3 bg-axio-bg border border-axio-border rounded text-xs space-y-1 text-axio-text-sub">
              <div>Workspace: {activeWorkspace}</div>
              <div>Range: {activeFilters.dateRange}</div>
              <div>Group: {activeFilters.vehicleGroup}</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-axio-green" />
              <span>SECURITY & AUDIT BOUNDARY</span>
            </h3>
            <div className="p-3 bg-axio-bg border border-axio-border rounded text-[11px] text-axio-muted leading-relaxed">
              RBAC active ({currentRole}). AXIS never returns unauthorized raw database credentials or unverified fields.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
