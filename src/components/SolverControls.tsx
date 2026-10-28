import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Square,
  Zap,
  Search,
  ListChecks,
} from 'lucide-react';
import type { SolverStatus } from '../algorithms/solverTypes';

interface SolverControlsProps {
  status: SolverStatus;
  animationSpeed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onStop: () => void;
  onSolveInstantly: () => void;
  onFindAll: () => void;
  onSpeedChange: (speed: number) => void;
}

const SolverControls: React.FC<SolverControlsProps> = ({
  status,
  animationSpeed,
  onStart,
  onPause,
  onResume,
  onStepForward,
  onStepBackward,
  onReset,
  onStop,
  onSolveInstantly,
  onFindAll,
  onSpeedChange,
}) => {
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isFinished = status === 'completed' || status === 'no-solution' || status === 'stopped';

  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        Solver Controls
      </h3>

      {/* Primary controls */}
      <div className="flex flex-wrap gap-2">
        {isIdle && (
          <button className="btn-primary" onClick={onStart}>
            <Play size={14} /> Start Solving
          </button>
        )}

        {isRunning && (
          <button className="btn-secondary" onClick={onPause}>
            <Pause size={14} /> Pause
          </button>
        )}

        {isPaused && (
          <button className="btn-primary" onClick={onResume}>
            <Play size={14} /> Resume
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={onStepBackward}
          disabled={isIdle || isRunning}
          title="Step Backward"
        >
          <SkipBack size={14} />
        </button>

        <button
          className="btn-secondary"
          onClick={onStepForward}
          disabled={isRunning || isFinished}
          title="Step Forward"
        >
          <SkipForward size={14} />
        </button>

        {(isRunning || isPaused) && (
          <button className="btn-danger" onClick={onStop}>
            <Square size={14} /> Stop
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={onReset}
          disabled={isIdle}
          title="Reset"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-success"
          onClick={onSolveInstantly}
          disabled={isRunning || isPaused}
          title="Solve Instantly"
        >
          <Zap size={14} /> Solve Instantly
        </button>

        <button
          className="btn-secondary"
          onClick={onFindAll}
          disabled={isRunning || isPaused}
          title="Find All Solutions"
        >
          <Search size={14} /> Find All Solutions
        </button>
      </div>

      {/* Speed control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ListChecks size={12} /> Animation Speed
          </span>
          <span className="font-mono">{animationSpeed}ms/step</span>
        </div>
        <input
          type="range"
          min={1}
          max={500}
          value={animationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="speed-slider w-full"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Fast (1ms)</span>
          <span>Slow (500ms)</span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning
              ? 'bg-emerald-400 animate-pulse'
              : isPaused
              ? 'bg-amber-400'
              : isFinished
              ? status === 'completed'
                ? 'bg-emerald-400'
                : 'bg-rose-400'
              : 'bg-slate-500'
          }`}
        />
        <span className="text-xs text-slate-400 capitalize">
          {status === 'no-solution' ? 'No Solution Found' : status}
        </span>
      </div>
    </div>
  );
};

export default React.memo(SolverControls);
