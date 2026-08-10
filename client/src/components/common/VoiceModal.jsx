import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  X,
  Sparkles,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { simulateAxisWorkflow } from '../../services/axisService';

export const VoiceModal = ({
  isOpen,
  onClose,
  onAxisResponse
}) => {
  const [voiceState, setVoiceState] = useState('IDLE');
  const [transcript, setTranscript] = useState('');
  const [aiSpeechText, setAiSpeechText] = useState('');

  const canvasRef = useRef(null);

  /* ============================================================
     RESET MODAL STATE
  ============================================================ */

  useEffect(() => {
    if (!isOpen) {
      setVoiceState('IDLE');
      setTranscript('');
      setAiSpeechText('');
    }
  }, [isOpen]);

  /* ============================================================
     AUDIO WAVEFORM
  ============================================================ */

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let animationId;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let amplitude = 5;

      if (voiceState === 'LISTENING') {
        amplitude = 24;
      } else if (voiceState === 'PROCESSING') {
        amplitude = 12;
      } else if (voiceState === 'SPEAKING') {
        amplitude = 19;
      }

      const frequency =
        voiceState === 'PROCESSING'
          ? 0.045
          : 0.03;

      /* --------------------------------------------------------
         Primary waveform
      -------------------------------------------------------- */

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x++) {
        const envelope =
          Math.sin((x / width) * Math.PI);

        const y =
          centerY +
          Math.sin(
            x * frequency + phase
          ) *
          amplitude *
          envelope;

        ctx.lineTo(x, y);
      }

      let primaryColor = '#7F8B98';

      if (voiceState === 'LISTENING') {
        primaryColor = '#FF3046';
      }

      if (voiceState === 'PROCESSING') {
        primaryColor = '#FF3046';
      }

      if (voiceState === 'SPEAKING') {
        primaryColor = '#FF3046';
      }

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      /* subtle red glow */

      if (voiceState !== 'IDLE') {
        ctx.shadowBlur = 12;
        ctx.shadowColor =
          'rgba(255, 48, 70, 0.45)';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.stroke();

      ctx.shadowBlur = 0;

      /* --------------------------------------------------------
         Secondary subtle waveform
      -------------------------------------------------------- */

      if (voiceState !== 'IDLE') {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x++) {
          const envelope =
            Math.sin((x / width) * Math.PI);

          const y =
            centerY +
            Math.cos(
              x * frequency * 0.72 +
              phase * 0.7
            ) *
            amplitude *
            0.42 *
            envelope;

          ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          'rgba(255, 48, 70, 0.22)';

        ctx.lineWidth = 1;

        ctx.stroke();
      }

      phase +=
        voiceState === 'IDLE'
          ? 0.035
          : voiceState === 'PROCESSING'
            ? 0.09
            : 0.15;

      animationId =
        requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, voiceState]);

  /* ============================================================
     MODAL
  ============================================================ */

  if (!isOpen) return null;

  /* ============================================================
     START VOICE INTERACTION
  ============================================================ */

  const handleStartListening = () => {
    setVoiceState('LISTENING');
    setTranscript('');
    setAiSpeechText('');

    setTimeout(() => {
      setTranscript(
        'Why did maintenance costs increase in Vehicle Group A?'
      );

      setVoiceState('PROCESSING');

      simulateAxisWorkflow(
        'Why did maintenance costs increase?',
        () => { },
        (response) => {
          setVoiceState('SPEAKING');

          setAiSpeechText(
            response.headline +
            ' ' +
            response.summary
          );

          if (onAxisResponse) {
            onAxisResponse(response);
          }
        }
      );
    }, 2800);
  };

  /* ============================================================
     STATE LABEL
  ============================================================ */

  const stateLabel =
    voiceState === 'IDLE'
      ? 'PRESS MICROPHONE TO SPEAK'
      : voiceState === 'LISTENING'
        ? 'LISTENING · ENGLISH'
        : voiceState === 'PROCESSING'
          ? 'AXIS ORCHESTRATING AGENTS'
          : 'AXIS SPEAKING RESPONSE';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

      {/* ========================================================
          BACKDROP
      ======================================================== */}

      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Ambient red light */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-axio-red/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* ========================================================
          MODAL
      ======================================================== */}

      <div
        className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-3xl
          bg-axio-panel/90
          backdrop-blur-2xl
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          animate-voice-modal
        "
      >

        {/* Top ambient glow */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] h-[80px] bg-axio-red/[0.06] blur-[40px] pointer-events-none" />

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="relative flex items-center justify-between px-6 sm:px-8 pt-6">

          <div className="flex items-center gap-3">

            <div className="relative">

              <div
                className={`
                  absolute
                  inset-0
                  rounded-xl
                  blur-xl
                  transition-opacity
                  duration-500
                  ${voiceState !== 'IDLE'
                    ? 'bg-axio-red/30 opacity-100'
                    : 'bg-axio-red/10 opacity-70'
                  }
                `}
              />

              <div className="relative w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">

                <Bot className="w-5 h-5 text-axio-red" />

              </div>

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="font-display text-sm font-bold text-white tracking-wide">
                  AXIS VOICE AI
                </h2>

                <span className="flex items-center gap-1 text-[8px] text-emerald-400 uppercase tracking-wider font-bold">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                  Online

                </span>

              </div>

              <p className="text-[9px] text-axio-muted uppercase tracking-[0.16em] mt-1">
                Natural language decision interface
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="
              w-8
              h-8
              rounded-full
              flex
              items-center
              justify-center
              text-axio-muted
              hover:text-white
              hover:bg-white/[0.05]
              transition-all
            "
            aria-label="Close voice interface"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="relative px-6 sm:px-8 py-7">

          <p className="text-xs sm:text-sm text-axio-text-secondary font-sans leading-relaxed max-w-xl mb-7">
            Speak naturally to AXIS. Your request is interpreted,
            routed through the intelligence layer, and returned as
            a contextual enterprise response.
          </p>

          {/* ==================================================
              VOICE VISUALIZER
          ================================================== */}

          <div className="relative overflow-hidden rounded-2xl bg-black/20">

            {/* ambient center glow */}

            <div
              className={`
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-40
                h-20
                rounded-full
                blur-[50px]
                transition-all
                duration-700
                ${voiceState === 'IDLE'
                  ? 'bg-axio-red/[0.03]'
                  : 'bg-axio-red/[0.12]'
                }
              `}
            />

            <div className="relative px-4 sm:px-8 pt-7 pb-6">

              <canvas
                ref={canvasRef}
                width={600}
                height={100}
                className="w-full h-24"
              />

              {/* State */}

              <div className="flex items-center justify-center gap-2 mt-3">

                <span
                  className={`
                    w-1.5
                    h-1.5
                    rounded-full
                    ${voiceState === 'LISTENING'
                      ? 'bg-axio-red animate-ping'
                      : voiceState === 'PROCESSING'
                        ? 'bg-axio-red animate-pulse'
                        : voiceState === 'SPEAKING'
                          ? 'bg-axio-red animate-pulse'
                          : 'bg-axio-muted'
                    }
                  `}
                />

                <span className="text-[9px] font-semibold text-axio-muted uppercase tracking-[0.18em]">

                  {stateLabel}

                </span>

              </div>

            </div>

          </div>

          {/* ==================================================
              TRANSCRIPT
          ================================================== */}

          {transcript && (
            <div className="voice-content-enter mt-5">

              <div className="flex items-center gap-2 mb-2">

                <Mic className="w-3.5 h-3.5 text-axio-red" />

                <span className="text-[9px] text-axio-red font-bold uppercase tracking-[0.15em]">
                  SPOKEN INPUT
                </span>

              </div>

              <div className="px-4 py-3 rounded-xl bg-white/[0.025]">

                <p className="text-xs text-white font-medium font-sans leading-relaxed">
                  "{transcript}"
                </p>

              </div>

            </div>
          )}

          {/* ==================================================
              AXIS RESPONSE
          ================================================== */}

          {aiSpeechText && (
            <div className="voice-content-enter mt-4">

              <div className="flex items-center gap-2 mb-2">

                <Volume2 className="w-3.5 h-3.5 text-axio-red" />

                <span className="text-[9px] text-axio-red font-bold uppercase tracking-[0.15em]">
                  AXIS SYNTHESIZED RESPONSE
                </span>

              </div>

              <div className="relative overflow-hidden px-4 py-4 rounded-xl bg-axio-red/[0.05]">

                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-axio-red/70" />

                <p className="text-xs text-axio-text-sub leading-relaxed font-sans pl-2">
                  {aiSpeechText}
                </p>

              </div>

            </div>
          )}

          {/* ==================================================
              PROCESSING INDICATOR
          ================================================== */}

          {voiceState === 'PROCESSING' && (
            <div className="flex items-center justify-center gap-2 mt-5">

              <Sparkles className="w-3.5 h-3.5 text-axio-red animate-pulse" />

              <span className="text-[9px] text-axio-muted uppercase tracking-[0.15em]">
                Coordinating enterprise intelligence
              </span>

            </div>
          )}

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex items-center justify-center gap-3 mt-7">

            {voiceState === 'IDLE' && (
              <button
                onClick={handleStartListening}
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-2.5
                  px-7
                  py-3.5
                  bg-axio-red
                  hover:bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  rounded-xl
                  shadow-[0_10px_35px_rgba(255,48,70,0.18)]
                  hover:shadow-[0_12px_45px_rgba(255,48,70,0.28)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
              >

                <Mic className="w-4 h-4" />

                <span>
                  Start Voice Query
                </span>

                <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              </button>
            )}

            {voiceState !== 'IDLE' && (
              <button
                onClick={() => setVoiceState('IDLE')}
                className="
                  flex
                  items-center
                  gap-2
                  px-6
                  py-3
                  rounded-xl
                  bg-white/[0.035]
                  text-axio-text-secondary
                  hover:text-white
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  transition-all
                  duration-300
                "
              >

                <X className="w-3.5 h-3.5" />

                <span>
                  Stop Voice Interaction
                </span>

              </button>
            )}

          </div>

          {/* ==================================================
              FOOTER STATUS
          ================================================== */}

          <div className="flex items-center justify-center gap-2 mt-6">

            <CheckCircle2 className="w-3 h-3 text-emerald-400" />

            <span className="text-[8px] text-axio-muted uppercase tracking-wider">
              Enterprise voice interface · AXIS controlled execution
            </span>

          </div>

        </div>

      </div>

      {/* ========================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`

        @keyframes voiceModalIn {

          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
            filter: blur(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

        }

        .animate-voice-modal {
          animation:
            voiceModalIn
            500ms
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes voiceContentIn {

          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .voice-content-enter {
          animation:
            voiceContentIn
            450ms
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @media (prefers-reduced-motion: reduce) {

          .animate-voice-modal,
          .voice-content-enter {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
};