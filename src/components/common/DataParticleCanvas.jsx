import React, { useEffect, useRef } from 'react';

export const DataParticleCanvas = ({ className = '', particleCount = 45 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize telemetry particles
    const particles = [];
    const colors = ['#FF3046', '#20D6D2', '#3B82F6', '#AEB8C4'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2
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

    const floatingLabels = labels.map((text, i) => ({
      text,
      x: Math.random() * (canvas.width - 200) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      vy: -0.2 - Math.random() * 0.2,
      alpha: Math.random() * 0.4 + 0.2
    }));

    const render = () => {
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

      // Draw particles & connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color === '#FF3046' ? 'rgba(255, 48, 70, 0.15)' : 'rgba(32, 214, 210, 0.12)';
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = (1 - dist / 110) * 0.4;
            ctx.stroke();
          }
        }
      }

      // Render floating subtle telemetry labels with sleek font
      ctx.font = '10px "Space Grotesk", sans-serif';
      floatingLabels.forEach((label) => {
        label.y += label.vy;
        if (label.y < -20) {
          label.y = canvas.height + 20;
          label.x = Math.random() * (canvas.width - 200) + 50;
        }

        ctx.fillStyle = '#AEB8C4';
        ctx.globalAlpha = label.alpha;
        ctx.fillText(label.text, label.x, label.y);
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
