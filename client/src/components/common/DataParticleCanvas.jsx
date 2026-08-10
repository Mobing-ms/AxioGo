import React, { useEffect, useRef } from 'react';

export const DataParticleCanvas = ({
  className = '',
  particleCount = 800,
  interactive = true
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // ============================================================
    // RESIZE
    // ============================================================

    const handleResize = () => {
      canvas.width =
        canvas.parentElement?.clientWidth || window.innerWidth;

      canvas.height =
        canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const isSmallViewport = canvas.width < 640;

    const effectiveCount = prefersReducedMotion
      ? Math.round(particleCount * 0.5)
      : isSmallViewport
        ? Math.round(particleCount * 0.55)
        : particleCount;

    // ============================================================
    // PARTICLES
    // ============================================================

    const particles = [];

    const colors = [
      '#e04d4dff',
      '#d83f3fff',
      '#f6483bff',
      '#e45f5fff'
    ];

    for (let i = 0; i < effectiveCount; i++) {
      const depth = Math.random() * 0.75 + 0.25;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,

        speedFactor: 0.5 + Math.random() * 1.1,

        wanderAmp: 0.15 + Math.random() * 0.35,
        wanderFreq: 0.15 + Math.random() * 0.35,
        wanderPhase: Math.random() * Math.PI * 2,

        depth,

        // Particle size
        size:
          (Math.random() * 2.2 + 0.3) *
          (0.7 + depth * 0.7),

        color:
          colors[Math.floor(Math.random() * colors.length)],

        // ========================================================
        // SLIGHTLY LOWER OPACITY
        // Previously this was stronger.
        // Multiplying by 0.72 makes it more subtle.
        // ========================================================

        alpha:
          (Math.random() * 0.5 + 0.2) *
          (0.55 + depth * 0.45) *
          0.72,

        // Explosion velocity
        explosionVX: 0,
        explosionVY: 0
      });
    }

    // ============================================================
    // DATA LABELS
    // ============================================================

    const labels = [
      'DATASET: VEHICLE_TELEMETRY',
      'DATA_LAYER: INSIGHT',
      'DATA_QUALITY: 98.7%',
      'AXIS_STATUS: READY',
      'BUSINESS_DOMAIN: FLEET',
      'KPI: MAINTENANCE_COST',
      'FRESHNESS: 2 MIN AGO'
    ];

    const floatingLabels = labels.map((text) => ({
      text,
      x: Math.random() * (canvas.width - 200) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      vy: -0.2 - Math.random() * 0.2,
      alpha: Math.random() * 0.4 + 0.2
    }));

    // ============================================================
    // MOUSE / ANTIGRAVITY
    // ============================================================

    const parent = canvas.parentElement;

    let mouseX = 0;
    let mouseY = 0;

    let smoothMouseX = 0;
    let smoothMouseY = 0;

    let mouseActive = false;

    // ============================================================
    // MOUSE SETTINGS
    // ============================================================

    const MOUSE_RADIUS = 200;

    const REPULSION_RADIUS = 45;

    const ATTRACTION_STRENGTH = 0.115;

    const REPULSION_STRENGTH = 0.1;

    const MAX_SPEED = 2.2;

    // ============================================================
    // CLICK EXPLOSION SETTINGS
    // ============================================================

    // How far the click explosion reaches
    const EXPLOSION_RADIUS = 260;

    // How powerful the explosion is
    const EXPLOSION_STRENGTH = 13;

    // How quickly the explosion disappears
    const EXPLOSION_DECAY = 0.91;

    // Visual click shockwave
    let explosionX = 0;
    let explosionY = 0;
    let explosionProgress = 0;
    let explosionActive = false;

    // ============================================================
    // MOUSE MOVE
    // ============================================================

    const handleMouseMove = (e) => {
      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      mouseActive = true;
    };

    // ============================================================
    // MOUSE LEAVE
    // ============================================================

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    // ============================================================
    // CLICK EXPLOSION
    // ============================================================

    const handleClick = (e) => {
      if (
        !interactive ||
        prefersReducedMotion ||
        !parent
      ) {
        return;
      }

      const rect = parent.getBoundingClientRect();

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      explosionX = clickX;
      explosionY = clickY;

      explosionProgress = 1;
      explosionActive = true;

      // ==========================================================
      // PUSH PARTICLES OUTWARD
      // ==========================================================

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - clickX;
        const dy = p.y - clickY;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (
          distance > 0 &&
          distance < EXPLOSION_RADIUS
        ) {
          // Normalized direction
          const nx = dx / distance;
          const ny = dy / distance;

          // Stronger closer to click
          const falloff =
            1 - distance / EXPLOSION_RADIUS;

          // Non-linear falloff gives a stronger
          // central explosion
          const force =
            Math.pow(falloff, 1.6) *
            EXPLOSION_STRENGTH *
            (0.7 + p.depth * 0.5);

          p.explosionVX += nx * force;
          p.explosionVY += ny * force;
        }
      }
    };

    // ============================================================
    // EVENT LISTENERS
    // ============================================================

    if (
      interactive &&
      !prefersReducedMotion &&
      parent
    ) {
      parent.addEventListener(
        'mousemove',
        handleMouseMove
      );

      parent.addEventListener(
        'mouseleave',
        handleMouseLeave
      );

      parent.addEventListener(
        'click',
        handleClick
      );
    }

    // ============================================================
    // ANIMATION
    // ============================================================

    let t = 0;

    const drawFrame = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // ==========================================================
      // TECHNICAL GRID
      // ==========================================================

      const gridSize = 40;

      ctx.strokeStyle =
        'rgba(32, 39, 49, 0.25)';

      ctx.lineWidth = 1;

      for (
        let x = 0;
        x < canvas.width;
        x += gridSize
      ) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (
        let y = 0;
        y < canvas.height;
        y += gridSize
      ) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ==========================================================
      // SMOOTH MOUSE
      // ==========================================================

      if (mouseActive) {
        smoothMouseX +=
          (mouseX - smoothMouseX) * 0.12;

        smoothMouseY +=
          (mouseY - smoothMouseY) * 0.12;
      } else {
        smoothMouseX +=
          (canvas.width / 2 - smoothMouseX) * 0.025;

        smoothMouseY +=
          (canvas.height / 2 - smoothMouseY) * 0.025;
      }

      // ==========================================================
      // SUBTLE CYAN MOUSE FIELD
      // ==========================================================

      if (
        mouseActive &&
        interactive
      ) {
        const gradient =
          ctx.createRadialGradient(
            smoothMouseX,
            smoothMouseY,
            0,
            smoothMouseX,
            smoothMouseY,
            MOUSE_RADIUS
          );

        gradient.addColorStop(
          0,
          'rgba(32, 214, 210, 0.045)'
        );

        gradient.addColorStop(
          0.35,
          'rgba(32, 214, 210, 0.01)'
        );

        gradient.addColorStop(
          1,
          'rgba(32, 214, 210, 0)'
        );

        ctx.beginPath();

        ctx.arc(
          smoothMouseX,
          smoothMouseY,
          MOUSE_RADIUS,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = gradient;

        ctx.fill();
      }

      // ==========================================================
      // CLICK EXPLOSION SHOCKWAVE
      // ==========================================================

      if (
        explosionActive &&
        interactive
      ) {
        const radius =
          (1 - explosionProgress) *
          EXPLOSION_RADIUS;

        const alpha =
          explosionProgress * 0.16;

        const gradient =
          ctx.createRadialGradient(
            explosionX,
            explosionY,
            Math.max(0, radius - 25),
            explosionX,
            explosionY,
            radius
          );

        gradient.addColorStop(
          0,
          `rgba(255, 48, 70, 0)`
        );

        gradient.addColorStop(
          0.75,
          `rgba(255, 48, 70, ${alpha})`
        );

        gradient.addColorStop(
          1,
          'rgba(255, 48, 70, 0)'
        );

        ctx.beginPath();

        ctx.arc(
          explosionX,
          explosionY,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = gradient;

        ctx.fill();

        // Thin red shockwave ring
        ctx.beginPath();

        ctx.arc(
          explosionX,
          explosionY,
          radius,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          `rgba(255, 48, 70, ${alpha * 1.8})`;

        ctx.lineWidth = 1;

        ctx.stroke();

        explosionProgress *=
          EXPLOSION_DECAY;

        if (
          explosionProgress < 0.015
        ) {
          explosionProgress = 0;
          explosionActive = false;
        }
      }

      // ==========================================================
      // PARTICLES
      // ==========================================================

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p = particles[i];

        if (!prefersReducedMotion) {

          // ------------------------------------------------------
          // Organic movement
          // ------------------------------------------------------

          const wanderX =
            Math.sin(
              t * p.wanderFreq +
              p.wanderPhase
            ) *
            p.wanderAmp;

          const wanderY =
            Math.cos(
              t * p.wanderFreq * 0.8 +
              p.wanderPhase
            ) *
            p.wanderAmp;

          p.vx +=
            wanderX * 0.01;

          p.vy +=
            wanderY * 0.01;

          // ------------------------------------------------------
          // MOUSE ANTIGRAVITY
          // ------------------------------------------------------

          if (
            mouseActive &&
            interactive
          ) {
            const dx =
              smoothMouseX - p.x;

            const dy =
              smoothMouseY - p.y;

            const distance =
              Math.sqrt(
                dx * dx +
                dy * dy
              );

            // Soft attraction
            if (
              distance <
              MOUSE_RADIUS &&
              distance >
              REPULSION_RADIUS
            ) {
              const nx =
                dx / distance;

              const ny =
                dy / distance;

              const strength =
                (1 -
                  distance /
                  MOUSE_RADIUS) *
                ATTRACTION_STRENGTH *
                p.depth;

              p.vx +=
                nx * strength;

              p.vy +=
                ny * strength;
            }

            // Close repulsion
            if (
              distance <
              REPULSION_RADIUS &&
              distance > 0
            ) {
              const nx =
                dx / distance;

              const ny =
                dy / distance;

              const strength =
                (1 -
                  distance /
                  REPULSION_RADIUS) *
                REPULSION_STRENGTH;

              p.vx -=
                nx * strength;

              p.vy -=
                ny * strength;
            }
          }

          // ------------------------------------------------------
          // CLICK EXPLOSION VELOCITY
          // ------------------------------------------------------

          p.vx +=
            p.explosionVX;

          p.vy +=
            p.explosionVY;

          // Gradually kill explosion velocity
          p.explosionVX *= 0.90;
          p.explosionVY *= 0.90;

          // ------------------------------------------------------
          // NORMAL VELOCITY DAMPING
          // ------------------------------------------------------

          p.vx *= 0.985;
          p.vy *= 0.985;

          // ------------------------------------------------------
          // SPEED LIMIT
          // ------------------------------------------------------

          const speed =
            Math.sqrt(
              p.vx * p.vx +
              p.vy * p.vy
            );

          if (
            speed > MAX_SPEED
          ) {
            p.vx =
              (p.vx / speed) *
              MAX_SPEED;

            p.vy =
              (p.vy / speed) *
              MAX_SPEED;
          }

          // ------------------------------------------------------
          // MOVE
          // ------------------------------------------------------

          p.x +=
            p.vx *
            p.speedFactor;

          p.y +=
            p.vy *
            p.speedFactor;

          // ------------------------------------------------------
          // WRAP
          // ------------------------------------------------------

          if (p.x < -20) {
            p.x =
              canvas.width + 20;
          }

          if (
            p.x >
            canvas.width + 20
          ) {
            p.x = -20;
          }

          if (p.y < -20) {
            p.y =
              canvas.height + 20;
          }

          if (
            p.y >
            canvas.height + 20
          ) {
            p.y = -20;
          }
        }

        // ========================================================
        // DRAW PARTICLE
        // ========================================================

        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          p.color;

        ctx.globalAlpha =
          p.alpha;

        ctx.fill();

        // ========================================================
        // CONNECTION LINES
        // ========================================================

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const p2 =
            particles[j];

          const dx =
            p.x - p2.x;

          const dy =
            p.y - p2.y;

          const dist =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (dist < 100) {
            ctx.beginPath();

            ctx.moveTo(
              p.x,
              p.y
            );

            ctx.lineTo(
              p2.x,
              p2.y
            );

            ctx.strokeStyle =
              p.color ===
                '#e94454ff'
                ? 'rgba(233, 32, 52, 0.23)'
                : 'rgba(226, 59, 59, 0.18)';

            ctx.lineWidth = 0.7;

            ctx.globalAlpha =
              (1 -
                dist / 100) *
              0.35;

            ctx.stroke();
          }
        }
      }

      // ==========================================================
      // FLOATING DATA LABELS
      // ==========================================================
      ctx.font =
        '10px "Poppins", sans-serif';

      floatingLabels.forEach(
        (label) => {
          if (
            !prefersReducedMotion
          ) {
            label.y +=
              label.vy;

            if (
              label.y < -20
            ) {
              label.y =
                canvas.height +
                20;

              label.x =
                Math.random() *
                (canvas.width -
                  200) +
                50;
            }
          }

          ctx.fillStyle =
            '#4a596bff';

          ctx.globalAlpha =
            label.alpha;

          ctx.fillText(
            label.text,
            label.x,
            label.y
          );
        }
      );

      ctx.globalAlpha = 1;

      t += 0.016;
    };
    // ============================================================
    // RENDER
    // ============================================================

    const render = () => {
      drawFrame();

      if (!prefersReducedMotion) {
        animationFrameId =
          requestAnimationFrame(
            render
          );
      }
    };

    // ============================================================
    // VISIBILITY
    // ============================================================

    const handleVisibilityChange =
      () => {
        if (document.hidden) {
          cancelAnimationFrame(
            animationFrameId
          );
        } else if (
          !prefersReducedMotion
        ) {
          animationFrameId =
            requestAnimationFrame(
              render
            );
        }
      };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    render();

    // ============================================================
    // CLEANUP
    // ============================================================

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      if (
        interactive &&
        parent
      ) {
        parent.removeEventListener(
          'mousemove',
          handleMouseMove
        );

        parent.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );

        parent.removeEventListener(
          'click',
          handleClick
        );
      }

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};