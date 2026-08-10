import React, { useEffect, useRef, useState } from 'react';
import {
  Truck,
  Activity,
  Wrench,
  Fuel,
  ShieldAlert,
  AlertTriangle,
  Users,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AutomotiveDomains = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const domains = [
    {
      name: 'VEHICLES',
      desc: 'Master registry & VIN asset indices',
      icon: Truck,
      accent: 'red'
    },
    {
      name: 'TELEMETRY',
      desc: 'IoT streaming metrics & fault codes',
      icon: Activity,
      accent: 'cyan'
    },
    {
      name: 'MAINTENANCE',
      desc: 'Shop work orders & part costs',
      icon: Wrench,
      accent: 'red'
    },
    {
      name: 'FUEL',
      desc: 'Energy usage & idle waste logs',
      icon: Fuel,
      accent: 'red'
    },
    {
      name: 'CLAIMS',
      desc: 'Insurance settlements & litigation',
      icon: ShieldAlert,
      accent: 'red'
    },
    {
      name: 'ACCIDENTS',
      desc: 'Crash telematics & severity scores',
      icon: AlertTriangle,
      accent: 'red'
    },
    {
      name: 'DRIVERS',
      desc: 'Safety scores & HOS compliance',
      icon: Users,
      accent: 'red'
    },
    {
      name: 'FLEET OPERATIONS',
      desc: 'Dispatch SLA & route efficiency',
      icon: Layers,
      accent: 'cyan'
    }
  ];

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-screen
        py-32
        sm:py-40
        bg-axio-bg
        overflow-hidden
      "
    >

      {/* ==========================================================
          AMBIENT BACKGROUND
      ========================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-tech-grid
          opacity-[0.09]
          pointer-events-none
        "
      />

      {/* Main red atmosphere */}

      <div
        className="
          absolute
          top-[20%]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[400px]
          rounded-full
          bg-axio-red/[0.025]
          blur-[150px]
          pointer-events-none
        "
      />

      {/* Subtle cyan atmosphere */}

      <div
        className="
          absolute
          bottom-[10%]
          right-[0%]
          w-[350px]
          h-[300px]
          rounded-full
          bg-axio-cyan/[0.015]
          blur-[140px]
          pointer-events-none
        "
      />

      {/* ==========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ========================================================
            SECTION LABEL
        ======================================================== */}

        <div
          className={`
            flex
            items-center
            justify-center
            gap-3
            mb-8

            transition-all
            duration-1000
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          <span
            className="
              w-8
              h-px
              bg-axio-red
            "
          />

          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[10px]
              sm:text-xs
              tracking-[0.2em]
              text-axio-red
              uppercase
              font-semibold
            "
          >

            <Layers
              className="
                w-3.5
                h-3.5
              "
            />

            06 · AUTOMOTIVE DATA DOMAINS

          </div>

          <span
            className="
              w-8
              h-px
              bg-axio-red
            "
          />

        </div>


        {/* ========================================================
            MAIN HEADING
        ======================================================== */}

        <div
          className={`
            text-center
            max-w-4xl
            mx-auto

            transition-all
            duration-[1100ms]
            delay-100
            ease-[cubic-bezier(0.16,1,0.3,1)]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
            }
          `}
        >

          <h2
            className="
              font-display
              text-4xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
              leading-[0.95]
              text-white
            "
          >

            EIGHT CORE DOMAINS.

            <br />

            <span
              className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-axio-red
                via-red-400
                to-white
                drop-shadow-[0_0_35px_rgba(255,48,70,0.12)]
              "
            >
              ONE AXIS INTELLIGENCE.
            </span>

          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              mt-7
              text-base
              sm:text-lg
              text-axio-text-secondary
              font-sans
              leading-relaxed
            "
          >
            These represent enterprise business domains — not separate
            chatbots. AXIS synthesizes across all eight domains seamlessly.
          </p>

        </div>


        {/* ========================================================
            DOMAIN FIELD
        ======================================================== */}

        <div
          className="
            relative
            mt-20
          "
        >

          {/* Central intelligence glow */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[400px]
              h-[300px]
              bg-axio-red/[0.025]
              blur-[100px]
              rounded-full
              pointer-events-none
            "
          />


          {/* ======================================================
              DOMAIN GRID
          ====================================================== */}

          <div
            className="
              relative
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-10
              gap-y-2
            "
          >

            {domains.map((domain, index) => {

              const Icon = domain.icon;

              const isCyan =
                domain.accent === 'cyan';

              return (
                <div
                  key={domain.name}
                  className={`
                    group
                    relative
                    min-h-[150px]
                    py-7
                    cursor-default

                    transition-all
                    duration-[900ms]
                    ease-[cubic-bezier(0.16,1,0.3,1)]

                    ${isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                    }
                  `}
                  style={{
                    transitionDelay: `${250 + index * 80}ms`
                  }}
                >

                  {/* Top signal */}

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      right-0
                      h-px
                      bg-gradient-to-r
                      from-axio-border/50
                      via-transparent
                      to-transparent
                      group-hover:from-axio-red/70
                      transition-all
                      duration-500
                    "
                  />


                  {/* Domain number */}

                  <div
                    className="
                      absolute
                      top-7
                      right-0
                      text-[9px]
                      font-mono
                      tracking-wider
                      text-axio-border
                      group-hover:text-axio-red/50
                      transition-colors
                    "
                  >
                    0{index + 1}
                  </div>


                  {/* Icon */}

                  <div
                    className="
                      relative
                      mb-5
                      w-10
                      h-10
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-white/[0.025]
                      transition-all
                      duration-500
                      group-hover:bg-axio-red/[0.07]
                      group-hover:scale-110
                      group-hover:-translate-y-1
                    "
                  >

                    <Icon
                      className={`
                        w-5
                        h-5
                        transition-all
                        duration-500

                        ${isCyan
                          ? `
                              text-axio-cyan
                              opacity-60
                              group-hover:text-axio-red
                              group-hover:opacity-100
                            `
                          : `
                              text-axio-red
                              opacity-80
                              group-hover:opacity-100
                            `
                        }
                      `}
                    />

                  </div>


                  {/* Domain name */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                    "
                  >

                    <h3
                      className="
                        font-mono
                        text-xs
                        sm:text-sm
                        text-white
                        font-bold
                        tracking-[0.12em]
                        transition-colors
                        duration-300
                        group-hover:text-axio-red
                      "
                    >
                      {domain.name}
                    </h3>

                    <ArrowUpRight
                      className="
                        w-3
                        h-3
                        text-axio-border
                        opacity-0
                        -translate-x-1
                        translate-y-1
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        group-hover:translate-x-0
                        group-hover:translate-y-0
                        group-hover:text-axio-red
                      "
                    />

                  </div>


                  {/* Description */}

                  <p
                    className="
                      max-w-[230px]
                      text-[11px]
                      sm:text-xs
                      text-axio-text-secondary
                      font-sans
                      leading-relaxed
                      transition-colors
                      duration-300
                      group-hover:text-axio-text-sub
                    "
                  >
                    {domain.desc}
                  </p>


                  {/* Bottom active signal */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-0
                      h-px
                      bg-axio-red
                      shadow-[0_0_8px_rgba(255,48,70,0.5)]
                      transition-all
                      duration-500
                      group-hover:w-10
                    "
                  />

                </div>
              );
            })}

          </div>

        </div>


        {/* ========================================================
            AXIS SYNTHESIS LINE
        ======================================================== */}

        <div
          className={`
            relative
            mt-16
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-5

            transition-all
            duration-1000
            delay-[1000ms]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          {/* Left line */}

          <div
            className="
              hidden
              sm:block
              h-px
              w-20
              bg-gradient-to-r
              from-transparent
              to-axio-red/40
            "
          />


          {/* Center indicator */}

          <div
            className="
              flex
              items-center
              gap-3
              font-mono
              text-[9px]
              sm:text-[10px]
              text-axio-muted
              uppercase
              tracking-[0.18em]
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

            <span>
              08 DOMAINS
            </span>

            <span className="text-axio-border">
              →
            </span>

            <span className="text-white">
              ONE CONTEXT-AWARE INTELLIGENCE LAYER
            </span>

          </div>


          {/* Right line */}

          <div
            className="
              hidden
              sm:block
              h-px
              w-20
              bg-gradient-to-l
              from-transparent
              to-axio-red/40
            "
          />

        </div>


        {/* ========================================================
            FINAL STATEMENT
        ======================================================== */}

        <div
          className={`
            text-center
            mt-16

            transition-all
            duration-1000
            delay-[1100ms]

            ${isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }
          `}
        >

          <p
            className="
              font-display
              text-sm
              sm:text-base
              text-axio-text-secondary
            "
          >
            AXIS doesn't operate in isolated silos.
          </p>

          <p
            className="
              mt-2
              font-display
              text-lg
              sm:text-xl
              font-semibold
              text-white
            "
          >
            It connects the entire automotive intelligence landscape.
          </p>

        </div>

      </div>

    </section>
  );
};