import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandTracker, Gesture } from './services/handTracker';
import { Camera, Trophy, RefreshCw, Hand, Scissors, Square, User, Cpu, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

type GameState = 'idle' | 'counting' | 'result' | 'error';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<HandTracker | null>(null);
  
  const [gameState, setGameState] = useState<GameState>('idle');
  const [userGesture, setUserGesture] = useState<Gesture>('none');
  const [currentDetection, setCurrentDetection] = useState<Gesture>('none');
  const [computerGesture, setComputerGesture] = useState<Gesture>('none');
  const [winner, setWinner] = useState<'user' | 'computer' | 'draw' | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [score, setScore] = useState({ user: 0, computer: 0 });
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Use a ref to always have the latest detection value in the game loop
  const latestDetectionRef = useRef<Gesture>('none');

  const initTracker = async () => {
    if (!videoRef.current) return;
    
    setGameState('idle');
    setCameraError(null);
    setIsCameraReady(false);

    try {
      const tracker = new HandTracker(videoRef.current, (gesture, results) => {
        setCurrentDetection(gesture);
        latestDetectionRef.current = gesture;
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            HandTracker.draw(ctx, results);
          }
        }
      });
      
      trackerRef.current = tracker;
      await tracker.start();
      setIsCameraReady(true);
    } catch (err) {
      console.error("Camera failed", err);
      setCameraError(err instanceof Error ? err.message : String(err));
      setGameState('error');
    }
  };

  useEffect(() => {
    initTracker();
    return () => {
      trackerRef.current?.stop();
    };
  }, []);

  const startGame = () => {
    if (gameState === 'counting') return;
    
    setGameState('counting');
    setCountdown(3);
    setWinner(null);
    setComputerGesture('none');
    setUserGesture('none');

    const gestures: Gesture[] = ['rock', 'paper', 'scissors'];
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        // Shuffle computer gesture during countdown for "juice"
        setComputerGesture(gestures[Math.floor(Math.random() * gestures.length)]);
        
        if (prev <= 1) {
          clearInterval(interval);
          resolveGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resolveGame = () => {
    // Use the REF to get the absolute latest detection, avoiding stale closures
    const currentGesture = latestDetectionRef.current;
    
    if (currentGesture === 'none') {
      setGameState('idle');
      setCameraError("No hand detected! Please keep your hand visible during the countdown.");
      return;
    }

    const finalUserGesture = currentGesture;
    
    const gestures: Gesture[] = ['rock', 'paper', 'scissors'];
    const randomComputerGesture = gestures[Math.floor(Math.random() * gestures.length)];
    
    setUserGesture(finalUserGesture);
    setComputerGesture(randomComputerGesture);
    
    let gameWinner: 'user' | 'computer' | 'draw';
    if (finalUserGesture === randomComputerGesture) {
      gameWinner = 'draw';
    } else if (
      (finalUserGesture === 'rock' && randomComputerGesture === 'scissors') ||
      (finalUserGesture === 'paper' && randomComputerGesture === 'rock') ||
      (finalUserGesture === 'scissors' && randomComputerGesture === 'paper')
    ) {
      gameWinner = 'user';
      setScore(s => ({ ...s, user: s.user + 1 }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff', '#34d399']
      });
    } else {
      gameWinner = 'computer';
      setScore(s => ({ ...s, computer: s.computer + 1 }));
    }

    setWinner(gameWinner);
    setGameState('result');
  };

  const getGestureIcon = (gesture: Gesture, size = 48) => {
    switch (gesture) {
      case 'rock': return <Square size={size} className="fill-current" />;
      case 'paper': return <Hand size={size} className="fill-current" />;
      case 'scissors': return <Scissors size={size} className="fill-current" />;
      default: return <Zap size={size} className="animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start p-4 md:p-8 pt-12 md:pt-20">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">VISION<span className="text-emerald-500">RPS</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Player</span>
              <span className="text-2xl font-mono font-bold text-white">{score.user}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">CPU</span>
              <span className="text-2xl font-mono font-bold text-white">{score.computer}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-video glass-panel overflow-hidden neon-glow">
            {!isCameraReady && gameState !== 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium animate-pulse">Initializing Neural Engine...</p>
              </div>
            )}
            
            {gameState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20 p-6 text-center">
                <Camera size={48} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Camera Access Denied</h3>
                <p className="text-zinc-400 mb-6">{cameraError || "Please enable camera permissions to play the vision-based game."}</p>
                <button 
                  onClick={initTracker}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl border border-white/10 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover video-container opacity-40"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover video-container z-10"
              width={640}
              height={480}
            />

            {/* Detection Overlay */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${currentDetection !== 'none' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                {currentDetection === 'none' ? 'Hand Not Found' : `Detected: ${currentDetection}`}
              </span>
            </div>
            
            {/* Status Message */}
            {currentDetection === 'none' && isCameraReady && gameState === 'idle' && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl backdrop-blur-md">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                  Show your hand to start
                </p>
              </div>
            )}

            {/* Countdown Overlay */}
            <AnimatePresence>
              {gameState === 'counting' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  key={countdown}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <span className="text-[12rem] font-black text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-panel p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                <User size={20} className="text-zinc-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Neural Hand Tracking</h4>
                <p className="text-xs text-zinc-500">Real-time gesture inference active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={initTracker}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-3 rounded-2xl transition-all border border-white/5 shadow-lg"
                title="Reset Camera"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={startGame}
                disabled={gameState === 'counting' || !isCameraReady}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold px-8 py-3 rounded-2xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {gameState === 'result' ? <RefreshCw size={20} /> : <Zap size={20} />}
                {gameState === 'result' ? 'Play Again' : 'Start Round'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Game Status */}
        <div className="lg:col-span-5 h-full">
          <div className="glass-panel h-full p-8 flex flex-col">
            <h3 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-500 mb-8">Battle Arena</h3>
            
            <div className="flex-1 flex flex-col gap-8 justify-center">
              {/* Computer Side */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Cpu size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Opponent CPU</span>
                </div>
                <motion.div 
                  animate={gameState === 'counting' ? { y: [0, -20, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className={`w-32 h-32 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                    winner === 'computer' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 
                    winner === 'user' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 opacity-50' :
                    'bg-zinc-900 border-zinc-800 text-zinc-100'
                  }`}
                >
                  {getGestureIcon(computerGesture, 56)}
                </motion.div>
                <span className="text-sm font-mono uppercase tracking-widest text-zinc-500">
                  {computerGesture === 'none' ? 'Waiting...' : computerGesture}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 py-4">
                <div className="h-px flex-1 bg-white/5" />
                <div className="text-xs font-black text-zinc-700 uppercase tracking-widest">VS</div>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {/* User Side */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <User size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">You (Player)</span>
                </div>
                <motion.div 
                  animate={gameState === 'counting' ? { y: [0, 20, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className={`w-32 h-32 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 ${
                    winner === 'user' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 
                    winner === 'computer' ? 'bg-zinc-900 border-zinc-800 text-zinc-700' :
                    'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {getGestureIcon(userGesture, 56)}
                </motion.div>
                <span className="text-sm font-mono uppercase tracking-widest text-zinc-500">
                  {userGesture === 'none' ? 'Ready' : userGesture}
                </span>
              </div>
            </div>

            {/* Result Banner */}
            <AnimatePresence>
              {gameState === 'result' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-4 rounded-2xl text-center font-bold uppercase tracking-widest border ${
                    winner === 'user' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' :
                    winner === 'computer' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                    'bg-zinc-500/10 border-zinc-500/50 text-zinc-500'
                  }`}
                >
                  {winner === 'user' ? (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy size={18} />
                      <span>Victory</span>
                    </div>
                  ) : winner === 'computer' ? (
                    <span>Defeat</span>
                  ) : (
                    <span>Draw</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-4">
        <span>Vision Engine v1.0</span>
        <div className="w-1 h-1 rounded-full bg-zinc-800" />
        <span>MediaPipe Hands Integration</span>
        <div className="w-1 h-1 rounded-full bg-zinc-800" />
        <span>Low Latency Inference</span>
      </footer>
    </div>
  );
}
