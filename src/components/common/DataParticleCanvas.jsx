import React, { useEffect, useRef } from 'react';

export const DataParticleCanvas = ({ className = '', particleCount = 45, interactive = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Adapt particle density to viewport size so mobile stays light-weight
    const isSmallViewport = canvas.width < 640;
    const effectiveCount = prefersReducedMotion
      ? Math.round(particleCount * 0.5)
      : isSmallViewport
        ? Math.round(particleCount * 0.55)
        : particleCount;

    // Initialize telemetry particles
    const particles = [];
    const colors = ['#FF3046', '#20D6D2', '#3B82F6', '#AEB8C4'];

    for (let i = 0; i < effectiveCount; i++) {
      // "depth" drives parallax response, size, and brightness so the field reads as 3-dimensional
      const depth = Math.random() * 0.75 + 0.25; // 0.25 (far) -> 1 (near)
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        // per-particle speed multiplier so motion never reads as uniform/mechanical
        speedFactor: 0.5 + Math.random() * 1.1,
        // organic curve wander — gentle sine-based drift layered on top of the base velocity
        wanderAmp: 0.15 + Math.random() * 0.35,
        wanderFreq: 0.15 + Math.random() * 0.35,
        wanderPhase: Math.random() * Math.PI * 2,
        depth,
        size: (Math.random() * 1.4 + 0.7) * (0.6 + depth * 0.6),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: (Math.random() * 0.5 + 0.2) * (0.55 + depth * 0.45)
      });
    }

    // Telemetry node telemetry labels
    const labels = [
      'VEHICLE_ID: VH-10231',
      'ENGINE_TEMP: 98.4°C',
      'SPEED: 74 KM/H',
      'FUEL_LEVEL: 68%',
      'LAT: 41.8781 | LON: -87.6298',
      'DTC_CODE: P0299 (NORMAL)',
      'DELTA_LAKE: GOLD_INSIGHT'
    ];

    const floatingLabels = labels.map((text) => ({
      text,
      x: Math.random() * (canvas.width - 200) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      vy: -0.2 - Math.random() * 0.2,
      alpha: Math.random() * 0.4 + 0.2
    }));

    // Mouse parallax — tracked on the parent element since the canvas itself stays pointer-events-none
    const parent = canvas.parentElement;
    let rawMouseX = 0;
    let rawMouseY = 0;
    let mouseActive = false;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    const MAX_PARALLAX_PX = 38; // visible, fluid follow — still restrained relative to canvas size

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      rawMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      rawMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseActive = true;
    };
    const handleMouseLeave = () => {
      mouseActive = false;
    };

    if (interactive && !prefersReducedMotion && parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    let t = 0;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint technical grid line background
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(32, 39, 49, 0.25)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Ease mouse influence toward its target for a smooth, non-jittery parallax feel
      const targetX = mouseActive ? rawMouseX : 0;
      const targetY = mouseActive ? rawMouseY : 0;
      smoothMouseX += (targetX - smoothMouseX) * 0.065;
      smoothMouseY += (targetY - smoothMouseY) * 0.065;

      // Draw particles & connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Base drift plus a slow organic wander so paths curve instead of moving in straight lines
          const wanderX = Math.sin(t * p.wanderFreq + p.wanderPhase) * p.wanderAmp;
          const wanderY = Math.cos(t * p.wanderFreq * 0.8 + p.wanderPhase) * p.wanderAmp;
          p.x += (p.vx + wanderX) * p.speedFactor;
          p.y += (p.vy + wanderY) * p.speedFactor;

          if (p.x < -20) p.x = canvas.width + 20;
          if (p.x > canvas.width + 20) p.x = -20;
          if (p.y < -20) p.y = canvas.height + 20;
          if (p.y > canvas.height + 20) p.y = -20;
        }

        // Nearer particles (higher depth) shift more with the cursor — creates a sense of depth
        const drawX = p.x + smoothMouseX * MAX_PARALLAX_PX * p.depth;
        const drawY = p.y + smoothMouseY * MAX_PARALLAX_PX * p.depth;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles with subtle lines (kept restrained — atmosphere, not a network diagram)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2DrawX = p2.x + smoothMouseX * MAX_PARALLAX_PX * p2.depth;
          const p2DrawY = p2.y + smoothMouseY * MAX_PARALLAX_PX * p2.depth;
          const dx = drawX - p2DrawX;
          const dy = drawY - p2DrawY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(p2DrawX, p2DrawY);
            ctx.strokeStyle = p.color === '#FF3046' ? 'rgba(255, 48, 70, 0.12)' : 'rgba(32, 214, 210, 0.10)';
            ctx.lineWidth = 0.7;
            ctx.globalAlpha = (1 - dist / 100) * 0.35;
            ctx.stroke();
          }
        }
      }

      // Render floating subtle telemetry labels with sleek font
      ctx.font = '10px "Poppins", sans-serif';
      floatingLabels.forEach((label) => {
        if (!prefersReducedMotion) {
          label.y += label.vy;
          if (label.y < -20) {
            label.y = canvas.height + 20;
            label.x = Math.random() * (canvas.width - 200) + 50;
          }
        }

        ctx.fillStyle = '#AEB8C4';
        ctx.globalAlpha = label.alpha;
        ctx.fillText(label.text, label.x, label.y);
      });

      ctx.globalAlpha = 1;
      t += 0.016;
    };

    const render = () => {
      drawFrame();
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause the animation loop entirely when the tab isn't visible to save CPU/GPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (interactive && parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
