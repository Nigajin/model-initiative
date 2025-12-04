import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const FocusZone: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'REST'>('FOCUS');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Timer finished
            if (mode === 'FOCUS') {
              setMode('REST');
              setMinutes(5);
            } else {
              setMode('FOCUS');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'FOCUS') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const setCustomTime = (min: number) => {
    setIsActive(false);
    setMode('FOCUS');
    setMinutes(min);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col h-full p-6 items-center justify-center space-y-8 bg-slate-50/50">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'FOCUS' ? '작은 몰입의 시간' : '달콤한 휴식'}
        </h2>
        <p className="text-slate-500">
          {mode === 'FOCUS' 
            ? '짧게라도 좋으니 딱 이 시간만 집중해봐요.' 
            : '고생했어요. 잠시 눈을 감고 쉬어보세요.'}
        </p>
      </div>

      <div className={`
        relative w-64 h-64 rounded-full flex items-center justify-center shadow-xl border-4
        transition-colors duration-500
        ${mode === 'FOCUS' ? 'bg-white border-indigo-100' : 'bg-green-50 border-green-100'}
      `}>
        <div className="text-6xl font-mono font-bold text-slate-700 tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        {isActive && (
          <div className="absolute -bottom-12 text-indigo-500 text-sm animate-pulse font-medium">
            함께 집중하고 있어요...
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`
            p-4 rounded-full shadow-md text-white transition-all transform hover:scale-105 active:scale-95
            ${isActive ? 'bg-amber-400 hover:bg-amber-500' : 'bg-indigo-500 hover:bg-indigo-600'}
          `}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white text-slate-400 shadow-md border border-slate-100 hover:text-slate-600 hover:bg-slate-50 transition-all"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-8">
        {[
          { label: '5분 시작', min: 5 },
          { label: '15분 몰입', min: 15 },
          { label: '25분 도전', min: 25 },
        ].map((opt) => (
          <button
            key={opt.min}
            onClick={() => setCustomTime(opt.min)}
            className="py-2 px-3 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode === 'FOCUS' && !isActive && (
        <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm max-w-xs text-center">
          <Coffee className="w-4 h-4" />
          <span>너무 힘들면 5분만 하고 쉬어도 괜찮아요.</span>
        </div>
      )}
    </div>
  );
};

export default FocusZone;