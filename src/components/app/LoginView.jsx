import React, { useEffect, useRef, useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  ArrowRight,
  Shield,
  UserCheck,
  User,
} from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { switchRole } = useAuth();

  const [email, setEmail] = useState(
    'a.vance@fleet-enterprise.com'
  );

  const [password, setPassword] = useState(
    '••••••••••••'
  );

  const canvasRef = useRef(null);

  // ============================================================
  // LOGIN LOGIC — KEEPING YOUR ORIGINAL LOGIC
  // ============================================================

  const handleSignIn = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleRolePresetLogin = (role) => {
    switchRole(role);
    onLoginSuccess();
  };

  // ============================================================
  // POINTER / DATA PARTICLE FIELD
  // ============================================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const parent = canvas.parentElement;

    let animationFrameId;

    // ----------------------------------------------------------
    // RESIZE
    // ----------------------------------------------------------

    const resize = () => {
      canvas.width =
        parent?.clientWidth || window.innerWidth;

      canvas.height =
        parent?.clientHeight || window.innerHeight;
    };

    resize();

    window.addEventListener('resize', resize);

    // ----------------------------------------------------------
    // PARTICLES
    // ----------------------------------------------------------

    const particleCount =
      canvas.width < 768 ? 85 : 170;

    const particles = [];

    const colors = [
      '#FF3046',
      '#FF3046',
      '#FF3046',
      '#AEB8C4',
      '#AEB8C4',
      '#20D6D2',
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth =
        Math.random() * 0.8 + 0.2;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        vx:
          (Math.random() - 0.5) *
          0.45,

        vy:
          (Math.random() - 0.5) *
          0.45,

        size:
          (Math.random() * 1.8 + 0.8) *
          (0.7 + depth * 0.65),

        alpha:
          Math.random() * 0.32 +
          0.08,

        depth,

        speed:
          0.55 +
          Math.random() * 0.75,

        phase:
          Math.random() *
          Math.PI *
          2,

        color:
          colors[
          Math.floor(
            Math.random() *
            colors.length
          )
          ],
      });
    }

    // ----------------------------------------------------------
    // POINTER
    // ----------------------------------------------------------

    let mouseX =
      canvas.width * 0.72;

    let mouseY =
      canvas.height * 0.5;

    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    let mouseActive = false;

    // Stronger pointer interaction
    const ATTRACTION_RADIUS = 260;
    const REPULSION_RADIUS = 70;

    const ATTRACTION_STRENGTH = 0.045;
    const REPULSION_STRENGTH = 0.16;

    const MAX_SPEED = 3.2;

    const handleMouseMove = (event) => {
      const rect =
        parent.getBoundingClientRect();

      targetMouseX =
        event.clientX -
        rect.left;

      targetMouseY =
        event.clientY -
        rect.top;

      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    parent.addEventListener(
      'mousemove',
      handleMouseMove
    );

    parent.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    // ----------------------------------------------------------
    // ANIMATION
    // ----------------------------------------------------------

    let time = 0;

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // ========================================================
      // SUBTLE TECHNICAL GRID
      // ========================================================

      const gridSize = 48;

      ctx.strokeStyle =
        'rgba(255,255,255,0.018)';

      ctx.lineWidth = 1;

      for (
        let x = 0;
        x < canvas.width;
        x += gridSize
      ) {
        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
          x,
          canvas.height
        );

        ctx.stroke();
      }

      for (
        let y = 0;
        y < canvas.height;
        y += gridSize
      ) {
        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
          canvas.width,
          y
        );

        ctx.stroke();
      }

      // ========================================================
      // SMOOTH POINTER
      // ========================================================

      targetMouseX =
        Math.max(
          0,
          Math.min(
            canvas.width,
            targetMouseX
          )
        );

      targetMouseY =
        Math.max(
          0,
          Math.min(
            canvas.height,
            targetMouseY
          )
        );

      mouseX +=
        (targetMouseX - mouseX) *
        0.11;

      mouseY +=
        (targetMouseY - mouseY) *
        0.11;

      // ========================================================
      // CYAN POINTER FIELD
      // ========================================================

      if (mouseActive) {
        const pointerGlow =
          ctx.createRadialGradient(
            mouseX,
            mouseY,
            0,
            mouseX,
            mouseY,
            230
          );

        // Very subtle cyan
        pointerGlow.addColorStop(
          0,
          'rgba(32,214,210,0.055)'
        );

        pointerGlow.addColorStop(
          0.25,
          'rgba(32,214,210,0.025)'
        );

        pointerGlow.addColorStop(
          0.6,
          'rgba(32,214,210,0.008)'
        );

        pointerGlow.addColorStop(
          1,
          'rgba(32,214,210,0)'
        );

        ctx.beginPath();

        ctx.arc(
          mouseX,
          mouseY,
          230,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          pointerGlow;

        ctx.fill();

        // Tiny pointer core

        ctx.beginPath();

        ctx.arc(
          mouseX,
          mouseY,
          2,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          'rgba(32,214,210,0.18)';

        ctx.fill();

        // Outer pointer ring

        ctx.beginPath();

        ctx.arc(
          mouseX,
          mouseY,
          24,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          'rgba(32,214,210,0.045)';

        ctx.lineWidth = 1;

        ctx.stroke();
      }

      // ========================================================
      // PARTICLES
      // ========================================================

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p = particles[i];

        // ------------------------------------------------------
        // NATURAL MOVEMENT
        // ------------------------------------------------------

        const wanderX =
          Math.sin(
            time * 0.45 +
            p.phase
          ) *
          0.018;

        const wanderY =
          Math.cos(
            time * 0.35 +
            p.phase
          ) *
          0.018;

        p.vx += wanderX;
        p.vy += wanderY;

        // ------------------------------------------------------
        // ATTRACTION + REPULSION
        // ------------------------------------------------------

        if (mouseActive) {
          const dx =
            mouseX - p.x;

          const dy =
            mouseY - p.y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance <
            ATTRACTION_RADIUS &&
            distance > 0
          ) {
            const nx =
              dx / distance;

            const ny =
              dy / distance;

            // Attraction becomes stronger
            // as particle gets closer.

            const attraction =
              Math.pow(
                1 -
                distance /
                ATTRACTION_RADIUS,
                1.7
              ) *
              ATTRACTION_STRENGTH *
              p.depth;

            p.vx +=
              nx * attraction;

            p.vy +=
              ny * attraction;
          }

          // ----------------------------------------------------
          // REPULSION
          // ----------------------------------------------------

          if (
            distance <
            REPULSION_RADIUS &&
            distance > 0
          ) {
            const nx =
              dx / distance;

            const ny =
              dy / distance;

            const repulsion =
              Math.pow(
                1 -
                distance /
                REPULSION_RADIUS,
                2
              ) *
              REPULSION_STRENGTH;

            p.vx -=
              nx * repulsion;

            p.vy -=
              ny * repulsion;
          }
        }

        // ------------------------------------------------------
        // FRICTION
        // ------------------------------------------------------

        p.vx *= 0.982;
        p.vy *= 0.982;

        // ------------------------------------------------------
        // SPEED LIMIT
        // ------------------------------------------------------

        const speed =
          Math.sqrt(
            p.vx * p.vx +
            p.vy * p.vy
          );

        if (
          speed >
          MAX_SPEED
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
          p.speed;

        p.y +=
          p.vy *
          p.speed;

        // ------------------------------------------------------
        // WRAP
        // ------------------------------------------------------

        if (p.x < -30) {
          p.x =
            canvas.width + 30;
        }

        if (
          p.x >
          canvas.width + 30
        ) {
          p.x = -30;
        }

        if (p.y < -30) {
          p.y =
            canvas.height + 30;
        }

        if (
          p.y >
          canvas.height + 30
        ) {
          p.y = -30;
        }

        // ======================================================
        // DRAW PARTICLE
        // ======================================================

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

        // ======================================================
        // CONNECTIONS
        // ======================================================

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

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance < 85
          ) {
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
              'rgba(255,48,70,0.055)';

            ctx.lineWidth =
              0.5;

            ctx.globalAlpha =
              (1 -
                distance /
                85) *
              0.35;

            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      time += 0.016;

      animationFrameId =
        requestAnimationFrame(
          draw
        );
    };

    draw();

    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        'resize',
        resize
      );

      parent.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      parent.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-axio-bg
        text-white
      "
    >

      {/* ========================================================
          PARTICLE CANVAS
      ======================================================== */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
        "
      />

      {/* ========================================================
          BACKGROUND VIGNETTE
      ======================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
          bg-[radial-gradient(circle_at_68%_50%,transparent_10%,rgba(5,7,10,0.45)_55%,rgba(5,7,10,0.92)_100%)]
        "
      />

      {/* ========================================================
          LARGE RED AMBIENT GLOW
      ======================================================== */}

      <div
        className="
          absolute
          left-[24%]
          top-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-axio-red/[0.035]
          blur-[150px]
          pointer-events-none
        "
      />

      {/* ========================================================
          MAIN LAYOUT
      ======================================================== */}

      <div
        className="
          relative
          z-10
          min-h-screen
          w-full
          grid
          grid-cols-1
          lg:grid-cols-[1.15fr_0.85fr]
          items-center
        "
      >

        {/* ======================================================
            LEFT — AXIOGO BRAND
        ====================================================== */}

        <section
          className="
            relative
            h-full
            min-h-screen
            flex
            items-center
            px-8
            md:px-14
            lg:px-20
            xl:px-28
            py-20
          "
        >

          <div
            className="
              max-w-3xl
              animate-[brandReveal_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]
              opacity-0
            "
          >

            {/* Small label */}

            <div
              className="
                flex
                items-center
                gap-3
                mb-7
              "
            >
              <span
                className="
                  w-8
                  h-px
                  bg-axio-red
                  shadow-[0_0_12px_rgba(255,48,70,0.5)]
                "
              />

              <span
                className="
                  text-[9px]
                  md:text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-axio-muted
                "
              >
                ENTERPRISE AI INTELLIGENCE
              </span>
            </div>

            {/* ==================================================
                LARGE AXIOGO
            ================================================== */}

            <h1
              className="
                text-[18vw]
                sm:text-[15vw]
                lg:text-[9.5vw]
                xl:text-[9vw]
                leading-[0.78]
                font-black
                tracking-[-0.065em]
                whitespace-nowrap
                select-none
              "
            >
              <span className="text-white">
                AXIO
              </span>

              <span
                className="
                  text-axio-red
                  drop-shadow-[0_0_45px_rgba(255,48,70,0.12)]
                "
              >
                GO
              </span>
            </h1>

            {/* Supporting copy */}

            <div
              className="
                mt-10
                max-w-xl
              "
            >

              <p
                className="
                  text-sm
                  md:text-base
                  lg:text-lg
                  leading-relaxed
                  text-axio-text-sub
                "
              >
                Go beyond enterprise data with AI that
                understands your business context,
                uncovers meaningful insights, and turns
                them into intelligent action.
              </p>

            </div>

            {/* System indicators */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                items-center
                gap-x-7
                gap-y-3
                text-[8px]
                md:text-[9px]
                uppercase
                tracking-[0.2em]
                text-axio-muted/50
              "
            >

              <div className="flex items-center gap-2">

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red
                    shadow-[0_0_8px_rgba(255,48,70,0.7)]
                  "
                />

                TRUSTED DATA
              </div>

              <div className="flex items-center gap-2">

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red/70
                  "
                />

                BUSINESS CONTEXT
              </div>

              <div className="flex items-center gap-2">

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red/50
                  "
                />

                INTELLIGENT ACTION
              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            RIGHT — LOGIN
        ====================================================== */}

        <section
          className="
            relative
            flex
            items-center
            justify-center
            px-7
            md:px-12
            lg:px-14
            xl:px-20
            py-20
          "
        >

          <div
            className="
              w-full
              max-w-[410px]
              animate-[loginReveal_1s_cubic-bezier(0.16,1,0.3,1)_0.15s_forwards]
              opacity-0
            "
          >

            {/* --------------------------------------------------
                Login heading
            -------------------------------------------------- */}

            <div className="mb-9">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
                "
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-axio-red
                    shadow-[0_0_10px_rgba(255,48,70,0.7)]
                    animate-pulse
                  "
                />

                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-axio-muted
                  "
                >
                  SECURE ENTERPRISE ACCESS
                </span>

              </div>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                Welcome back.
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  leading-relaxed
                  text-axio-muted
                "
              >
                Sign in to continue to your
                AxioGo intelligence workspace.
              </p>

            </div>

            {/* --------------------------------------------------
                FORM
            -------------------------------------------------- */}

            <form
              onSubmit={handleSignIn}
              className="space-y-6"
            >

              {/* EMAIL */}

              <div className="group">

                <label
                  className="
                    block
                    mb-2
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    text-axio-muted
                  "
                >
                  Enterprise Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-white/[0.10]
                    rounded-none
                    px-0
                    py-3
                    text-sm
                    text-white
                    font-mono
                    focus:outline-none
                    focus:border-axio-red
                    transition-all
                    duration-300
                  "
                />

                <div
                  className="
                    h-px
                    w-0
                    bg-axio-red
                    group-focus-within:w-full
                    transition-all
                    duration-500
                    shadow-[0_0_12px_rgba(255,48,70,0.5)]
                  "
                />

              </div>

              {/* PASSWORD */}

              <div className="group">

                <label
                  className="
                    block
                    mb-2
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    text-axio-muted
                  "
                >
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-white/[0.10]
                    rounded-none
                    px-0
                    py-3
                    text-sm
                    text-white
                    font-mono
                    focus:outline-none
                    focus:border-axio-red
                    transition-all
                    duration-300
                  "
                />

                <div
                  className="
                    h-px
                    w-0
                    bg-axio-red
                    group-focus-within:w-full
                    transition-all
                    duration-500
                    shadow-[0_0_12px_rgba(255,48,70,0.5)]
                  "
                />

              </div>

              {/* SIGN IN */}

              <button
                type="submit"
                className="
                  group
                  relative
                  w-full
                  overflow-hidden
                  mt-2
                  py-3.5
                  rounded-lg
                  bg-axio-red
                  hover:bg-red-600
                  text-white
                  font-bold
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-[0_12px_35px_rgba(255,48,70,0.14)]
                  hover:shadow-[0_15px_45px_rgba(255,48,70,0.28)]
                  hover:-translate-y-0.5
                  transition-all
                  duration-300
                "
              >

                <span
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                    -translate-x-full
                    group-hover:translate-x-full
                    transition-transform
                    duration-700
                  "
                />

                <span className="relative">
                  SIGN IN TO AXIOGO
                </span>

                <ArrowRight
                  className="
                    relative
                    w-4
                    h-4
                    group-hover:translate-x-1
                    transition-transform
                  "
                />

              </button>

            </form>

            {/* --------------------------------------------------
                DEMO ROLES
            -------------------------------------------------- */}

            <div className="mt-10">

              <div
                className="
                  text-center
                  mb-5
                  text-[8px]
                  uppercase
                  tracking-[0.3em]
                  text-axio-muted/40
                "
              >
                Demo Access
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-9
                "
              >

                {/* ADMIN */}

                <button
                  type="button"
                  onClick={() =>
                    handleRolePresetLogin(
                      ROLES.ADMIN
                    )
                  }
                  className="
                    group
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-axio-muted
                    hover:text-white
                    transition-colors
                  "
                >

                  <Shield
                    className="
                      w-4
                      h-4
                      text-axio-red/60
                      group-hover:text-axio-red
                      group-hover:scale-110
                      transition-all
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      tracking-[0.16em]
                    "
                  >
                    ADMIN
                  </span>

                </button>

                {/* AUTHORIZED */}

                <button
                  type="button"
                  onClick={() =>
                    handleRolePresetLogin(
                      ROLES.AUTHORIZED
                    )
                  }
                  className="
                    group
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-axio-muted
                    hover:text-white
                    transition-colors
                  "
                >

                  <UserCheck
                    className="
                      w-4
                      h-4
                      text-axio-red/45
                      group-hover:text-axio-red
                      group-hover:scale-110
                      transition-all
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      tracking-[0.16em]
                    "
                  >
                    AUTHORIZED
                  </span>

                </button>

                {/* STANDARD */}

                <button
                  type="button"
                  onClick={() =>
                    handleRolePresetLogin(
                      ROLES.STANDARD
                    )
                  }
                  className="
                    group
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-axio-muted
                    hover:text-white
                    transition-colors
                  "
                >

                  <User
                    className="
                      w-4
                      h-4
                      text-axio-red/45
                      group-hover:text-axio-red
                      group-hover:scale-110
                      transition-all
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      tracking-[0.16em]
                    "
                  >
                    STANDARD
                  </span>

                </button>

              </div>

            </div>

            {/* --------------------------------------------------
                SYSTEM STATUS
            -------------------------------------------------- */}

            <div
              className="
                mt-10
                flex
                justify-center
                items-center
                gap-2
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-axio-muted/30
              "
            >

              <span
                className="
                  w-1
                  h-1
                  rounded-full
                  bg-axio-red/70
                "
              />

              AXIOGO SYSTEMS OPERATIONAL

            </div>

          </div>

        </section>

      </div>

      {/* ========================================================
          ANIMATION KEYFRAMES
      ======================================================== */}

      <style>{`

        @keyframes brandReveal {

          0% {
            opacity: 0;
            transform:
              translateX(-45px)
              scale(0.96);
            filter: blur(10px);
          }

          100% {
            opacity: 1;
            transform:
              translateX(0)
              scale(1);
            filter: blur(0);
          }

        }

        @keyframes loginReveal {

          0% {
            opacity: 0;
            transform:
              translateX(35px)
              scale(0.98);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform:
              translateX(0)
              scale(1);
            filter: blur(0);
          }

        }

        @media (max-width: 1023px) {

          @keyframes brandReveal {

            0% {
              opacity: 0;
              transform:
                translateY(25px);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0);
              filter: blur(0);
            }

          }

          @keyframes loginReveal {

            0% {
              opacity: 0;
              transform:
                translateY(25px);
              filter: blur(8px);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0);
              filter: blur(0);
            }

          }

        }

      `}</style>

    </div>
  );
};