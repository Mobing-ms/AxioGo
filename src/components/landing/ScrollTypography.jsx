import React, { useState, useEffect, useRef } from 'react';

export const ScrollTypography = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { title: "DATA", subtitle: "Trusted Enterprise Foundation", color: "text-white" },
    { title: "CONTEXT", subtitle: "Business Definitions & Rules", color: "text-axio-cyan" },
    { title: "INTELLIGENCE", subtitle: "AXIS Multi-Agent Reasoning", color: "text-axio-red" },
    { title: "DECISION", subtitle: "Root Cause & Recommendations", color: "text-amber-400" },
    { title: "ACTION", subtitle: "Controlled Autonomous Execution", color: "text-emerald-400" }
  ];

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-axio-bg border-y border-axio-border">
      
      {/* Pinned Sticky Window */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        
        {/* Background Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-tech-grid opacity-30" />
        <div className="absolute w-[600px] h-[300px] bg-axio-red/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          
          <div className="font-tech text-xs text-axio-muted uppercase tracking-[0.25em] mb-4 font-semibold">
            TRANSFORMATIONAL ARCHITECTURE LOOP
          </div>

          {/* Large Transforming Typography Object */}
          <div className="relative min-h-[160px] flex items-center justify-center my-6">
            {steps.map((step, idx) => {
              const stepThreshold = idx / (steps.length - 1);
              const isActive = Math.abs(scrollProgress - stepThreshold) < 0.15 || 
                (idx === steps.length - 1 && scrollProgress > 0.85);

              // Calculate transformation properties based on proximity
              const diff = scrollProgress - stepThreshold;
              const opacity = Math.max(0.1, 1 - Math.abs(diff) * 4);
              const scale = 1 - Math.abs(diff) * 0.3;
              const blur = Math.abs(diff) * 12;

              return (
                <div
                  key={step.title}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none ${step.color}`}
                  style={{
                    opacity: isActive ? 1 : opacity,
                    transform: `scale(${isActive ? 1.05 : scale}) translateY(${diff * 60}px)`,
                    filter: `blur(${isActive ? 0 : blur}px)`
                  }}
                >
                  <h2 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight uppercase select-none">
                    {step.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base font-semibold tracking-wider uppercase mt-2 text-axio-text-sub">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progressive Flow Indicator Pills at Bottom */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-12 font-sans text-xs">
            {steps.map((step, idx) => {
              const stepThreshold = idx / (steps.length - 1);
              const isReached = scrollProgress >= stepThreshold - 0.05;

              return (
                <React.Fragment key={step.title}>
                  <div className={`px-3.5 py-1.5 rounded-md border transition-all duration-300 flex items-center gap-2 ${
                    isReached 
                      ? 'bg-axio-card border-axio-red text-white shadow-lg shadow-axio-red/10 font-bold' 
                      : 'bg-axio-panel/50 border-axio-border text-axio-muted'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isReached ? 'bg-axio-red' : 'bg-axio-muted'}`} />
                    <span>{step.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <span className={`text-sm ${isReached ? 'text-axio-cyan' : 'text-axio-border'}`}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <p className="text-xs font-sans text-axio-muted mt-8 font-medium">
            Scroll down to experience the complete AxioGo intelligence progression
          </p>

        </div>
      </div>

    </section>
  );
};
