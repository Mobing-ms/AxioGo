import React from 'react';
import { Truck, Activity, Wrench, Fuel, ShieldAlert, AlertTriangle, Users, Layers } from 'lucide-react';

export const AutomotiveDomains = () => {
  const domains = [
    { name: 'VEHICLES', desc: 'Master registry & VIN asset indices', icon: Truck, color: 'text-axio-cyan border-axio-cyan/30' },
    { name: 'TELEMETRY', desc: 'IoT streaming metrics & fault codes', icon: Activity, color: 'text-axio-red border-axio-red/30' },
    { name: 'MAINTENANCE', desc: 'Shop work orders & part costs', icon: Wrench, color: 'text-amber-400 border-amber-400/30' },
    { name: 'FUEL', desc: 'Energy usage & idle waste logs', icon: Fuel, color: 'text-emerald-400 border-emerald-400/30' },
    { name: 'CLAIMS', desc: 'Insurance settlements & litigation', icon: ShieldAlert, color: 'text-blue-400 border-blue-400/30' },
    { name: 'ACCIDENTS', desc: 'Crash telematics & severity scores', icon: AlertTriangle, color: 'text-rose-500 border-rose-500/30' },
    { name: 'DRIVERS', desc: 'Safety scores & HOS compliance', icon: Users, color: 'text-purple-400 border-purple-400/30' },
    { name: 'FLEET OPERATIONS', desc: 'Dispatch SLA & route efficiency', icon: Layers, color: 'text-teal-400 border-teal-400/30' }
  ];

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-cyan/10 border border-axio-cyan/30 text-axio-cyan font-mono text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>06. AUTOMOTIVE DATA DOMAINS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            EIGHT CORE DOMAINS. <br />
            <span className="text-axio-red">ONE AXIS INTELLIGENCE.</span>
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed">
            These represent enterprise business domains — not separate chatbots. AXIS synthesizes across all eight domains seamlessly.
          </p>
        </div>

        {/* 8 Domains Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {domains.map((dom) => {
            const IconComp = dom.icon;
            return (
              <div
                key={dom.name}
                className="p-5 bg-axio-panel border border-axio-border hover:border-axio-border-bright rounded-xl text-left font-mono transition-all group"
              >
                <div className={`p-2.5 rounded border ${dom.color} w-fit bg-axio-bg mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-white tracking-wider mb-1">
                  {dom.name}
                </h3>
                <p className="text-[11px] text-axio-text-secondary font-sans leading-relaxed">
                  {dom.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
