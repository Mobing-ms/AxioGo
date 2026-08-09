import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, X, Sparkles, CheckCircle2, Bot } from 'lucide-react';
import { simulateAxisWorkflow } from '../../services/axisService';

export const VoiceModal = ({ isOpen, onClose, onAxisResponse }) => {
  const [voiceState, setVoiceState] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, SPEAKING
  const [transcript, setTranscript] = useState('');
  const [aiSpeechText, setAiSpeechText] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setVoiceState('IDLE');
      setTranscript('');
      setAiSpeechText('');
      return;
    }
  }, [isOpen]);

  // Audio Waveform Animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      const amplitude = voiceState === 'LISTENING' ? 24 : (voiceState === 'SPEAKING' ? 18 : 6);
      const frequency = 0.03;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = voiceState === 'LISTENING' ? '#20D6D2' : (voiceState === 'SPEAKING' ? '#FF3046' : '#7F8B98');
      ctx.lineWidth = 2.5;
      ctx.stroke();

      phase += voiceState === 'IDLE' ? 0.05 : 0.15;
      animationId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animationId);
  }, [isOpen, voiceState]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setVoiceState('LISTENING');
    setTranscript('');
    setAiSpeechText('');

    // Simulate speech-to-text input capture
    setTimeout(() => {
      setTranscript('Why did maintenance costs increase in Vehicle Group A?');
      setVoiceState('PROCESSING');

      // Trigger AXIS workflow engine
      simulateAxisWorkflow('Why did maintenance costs increase?', (step) => {}, (response) => {
        setVoiceState('SPEAKING');
        setAiSpeechText(response.headline + " " + response.summary);
        if (onAxisResponse) {
          onAxisResponse(response);
        }
      });
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 bg-axio-panel border border-axio-border rounded-lg shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-axio-muted hover:text-white rounded-md hover:bg-axio-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-axio-red" />
          <h3 className="text-lg font-mono font-bold tracking-wide text-white">AXIS Voice AI Interface</h3>
          <span className="ml-auto text-xs px-2 py-0.5 rounded bg-axio-cyan/10 border border-axio-cyan/30 text-axio-cyan font-mono">
            ENGLISH ONLY (V1)
          </span>
        </div>

        <p className="text-xs text-axio-text-secondary mb-6">
          Voice acts as a natural spoken interface directly to AXIS multi-agent intelligence.
        </p>

        {/* Audio Waveform Canvas Container */}
        <div className="relative flex flex-col items-center justify-center p-6 bg-axio-bg border border-axio-border rounded-lg mb-6 overflow-hidden">
          <canvas ref={canvasRef} width={400} height={80} className="w-full h-20" />
          
          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-axio-muted">
            <span className={`w-2 h-2 rounded-full ${
              voiceState === 'LISTENING' ? 'bg-axio-cyan animate-ping' :
              voiceState === 'PROCESSING' ? 'bg-axio-amber animate-pulse' :
              voiceState === 'SPEAKING' ? 'bg-axio-red animate-pulse' : 'bg-axio-muted'
            }`} />
            <span className="uppercase font-semibold tracking-wider">
              {voiceState === 'IDLE' && 'Press microphone to speak'}
              {voiceState === 'LISTENING' && 'Listening (English)...'}
              {voiceState === 'PROCESSING' && 'AXIS Orchestrating Agents...'}
              {voiceState === 'SPEAKING' && 'AXIS Speaking Response...'}
            </span>
          </div>
        </div>

        {/* Live Speech-to-Text & Output */}
        {transcript && (
          <div className="p-3 bg-axio-card border border-axio-border rounded-md mb-4 font-mono text-xs">
            <div className="text-axio-muted mb-1 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-axio-cyan" />
              <span>SP SPOKEN TEXT:</span>
            </div>
            <p className="text-white font-medium">"{transcript}"</p>
          </div>
        )}

        {aiSpeechText && (
          <div className="p-3 bg-axio-red/10 border border-axio-red/30 rounded-md mb-6 font-mono text-xs">
            <div className="text-axio-red mb-1 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>AXIS SYNTHESIZED SPEECH:</span>
            </div>
            <p className="text-axio-text-sub leading-relaxed">{aiSpeechText}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          {voiceState === 'IDLE' && (
            <button
              onClick={handleStartListening}
              className="flex items-center gap-2 px-6 py-3 bg-axio-red hover:bg-red-600 text-white font-mono text-xs font-semibold rounded-md shadow-lg shadow-axio-red/20 transition-all transform hover:scale-105"
            >
              <Mic className="w-4 h-4" />
              <span>START VOICE QUERY</span>
            </button>
          )}

          {voiceState !== 'IDLE' && (
            <button
              onClick={() => setVoiceState('IDLE')}
              className="px-5 py-2.5 bg-axio-card border border-axio-border hover:border-axio-border-bright text-axio-text-sub font-mono text-xs rounded-md transition-colors"
            >
              STOP VOICE INTERACTION
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
