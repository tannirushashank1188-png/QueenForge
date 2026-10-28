import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Crown,
  ArrowLeft,
  Shuffle,
  Trash2,
  RotateCcw,
  Lock,
  Settings,
  Presentation,
} from 'lucide-react';
import ChessBoard from '../components/ChessBoard';
import SolverControls from '../components/SolverControls';
import StatisticsPanel from '../components/StatisticsPanel';
import SolutionGallery from '../components/SolutionGallery';
import { useBacktrackingVisualizer } from '../hooks/useBacktrackingVisualizer';
import {
  createEmptyRestricted,
  generateRandomRestrictions,
} from '../algorithms/nQueensSolver';
import { PRESETS, presetToRestricted } from '../utils/presets';
import { savePreferences, loadPreferences } from '../utils/storage';

const Visualizer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefs = loadPreferences();

  const [boardSize, setBoardSize] = useState(prefs.boardSize);
  const [restricted, setRestricted] = useState<boolean[][]>(() =>
    createEmptyRestricted(prefs.boardSize)
  );
  const [restrictionDensity, setRestrictionDensity] = useState(0.15);
  const [activePreset, setActivePreset] = useState<string | null>(prefs.lastPresetId);

  const visualizer = useBacktrackingVisualizer(boardSize, restricted);

  // Load preset from URL query parameter on mount
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setBoardSize(preset.boardSize);
        setRestricted(presetToRestricted(preset));
        setActivePreset(presetId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save preferences on change
  useEffect(() => {
    savePreferences({ boardSize, lastPresetId: activePreset });
  }, [boardSize, activePreset]);

  // Handle board size change
  const handleSizeChange = useCallback(
    (newSize: number) => {
      setBoardSize(newSize);
      setRestricted(createEmptyRestricted(newSize));
      setActivePreset(null);
      visualizer.reset();
    },
    [visualizer]
  );

  // Toggle restriction on a cell
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (
        visualizer.status === 'running' ||
        visualizer.status === 'paused'
      ) {
        return; // Don't allow edits during solving
      }

      setRestricted((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = !next[row][col];
        return next;
      });
      setActivePreset(null);
      visualizer.reset();
    },
    [visualizer]
  );

  // Clear all restrictions
  const clearRestrictions = useCallback(() => {
    setRestricted(createEmptyRestricted(boardSize));
    setActivePreset(null);
    visualizer.reset();
  }, [boardSize, visualizer]);

  // Reset board
  const resetBoard = useCallback(() => {
    setRestricted(createEmptyRestricted(boardSize));
    setActivePreset(null);
    visualizer.reset();
  }, [boardSize, visualizer]);

  // Random restrictions
  const randomRestrictions = useCallback(() => {
    setRestricted(generateRandomRestrictions(boardSize, restrictionDensity));
    setActivePreset(null);
    visualizer.reset();
  }, [boardSize, restrictionDensity, visualizer]);

  // Load preset
  const loadPreset = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      setBoardSize(preset.boardSize);
      setRestricted(presetToRestricted(preset));
      setActivePreset(presetId);
      visualizer.reset();
    },
    [visualizer]
  );

  const isEditable =
    visualizer.status === 'idle' ||
    visualizer.status === 'completed' ||
    visualizer.status === 'no-solution' ||
    visualizer.status === 'stopped';

  const currentDepth = visualizer.currentEvent?.depth ?? -1;

  return (
    <div className="min-h-screen bg-navy-950 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Crown size={22} className="text-violet-400" fill="currentColor" strokeWidth={1} />
              <span className="text-lg font-bold gradient-text">QUEENFORGE</span>
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => navigate('/presentation')}
          >
            <Presentation size={14} />
            Present
          </button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left column: Board + Config */}
          <div className="space-y-6">
            {/* Board configuration bar */}
            <motion.div
              className="glass-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Board size selector */}
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-slate-400" />
                  <label className="text-xs text-slate-400">Board Size:</label>
                  <select
                    className="select-input"
                    value={boardSize}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    disabled={!isEditable}
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 4).map((n) => (
                      <option key={n} value={n}>
                        {n}×{n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Restriction density */}
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-slate-400" />
                  <label className="text-xs text-slate-400">Density:</label>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    value={Math.round(restrictionDensity * 100)}
                    onChange={(e) =>
                      setRestrictionDensity(Number(e.target.value) / 100)
                    }
                    className="speed-slider w-20"
                    disabled={!isEditable}
                  />
                  <span className="text-xs text-slate-500 font-mono w-8">
                    {Math.round(restrictionDensity * 100)}%
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 ml-auto">
                  <button
                    className="btn-secondary"
                    onClick={randomRestrictions}
                    disabled={!isEditable}
                  >
                    <Shuffle size={14} />
                    Random
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={clearRestrictions}
                    disabled={!isEditable}
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={resetBoard}
                    disabled={!isEditable}
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-slate-500 self-center">Presets:</span>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      activePreset === preset.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => loadPreset(preset.id)}
                    disabled={!isEditable}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {isEditable && visualizer.status === 'idle' && (
                <p className="text-xs text-slate-500 mt-2">
                  💡 Click on cells to toggle restrictions, then use the solver controls.
                </p>
              )}
            </motion.div>

            {/* Chessboard */}
            <div className="flex justify-center">
              <ChessBoard
                size={boardSize}
                restricted={restricted}
                queens={visualizer.queens}
                currentEvent={visualizer.currentEvent}
                onCellClick={handleCellClick}
                isInteractive={isEditable}
              />
            </div>

            {/* Current event log */}
            {visualizer.currentEvent && (
              <motion.div
                className="glass-card p-3 text-xs font-mono text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-slate-500">Event:</span>{' '}
                <span
                  className={
                    visualizer.currentEvent.type === 'place'
                      ? 'text-emerald-400'
                      : visualizer.currentEvent.type === 'conflict'
                      ? 'text-rose-400'
                      : visualizer.currentEvent.type === 'backtrack'
                      ? 'text-amber-400'
                      : visualizer.currentEvent.type === 'solution'
                      ? 'text-emerald-300'
                      : visualizer.currentEvent.type === 'restricted'
                      ? 'text-rose-300'
                      : 'text-cyan-400'
                  }
                >
                  {visualizer.currentEvent.type.toUpperCase()}
                </span>
                {visualizer.currentEvent.position.col >= 0 && (
                  <span>
                    {' '}at ({visualizer.currentEvent.position.row},{' '}
                    {visualizer.currentEvent.position.col})
                  </span>
                )}
                <span className="text-slate-600 ml-4">
                  Step {visualizer.eventIndex + 1} / {visualizer.eventHistory.length}
                </span>
              </motion.div>
            )}

            {/* Solution gallery (when solutions exist) */}
            {(visualizer.status === 'completed' || visualizer.status === 'no-solution' || visualizer.status === 'stopped') &&
              visualizer.solutions.length > 0 && (
                <SolutionGallery
                  solutions={visualizer.solutions}
                  boardSize={boardSize}
                  restricted={restricted}
                  exhaustive={visualizer.exhaustive}
                  stoppedEarly={visualizer.stoppedEarly}
                />
              )}

            {/* No solution message */}
            {visualizer.status === 'no-solution' && visualizer.solutions.length === 0 && (
              <SolutionGallery
                solutions={[]}
                boardSize={boardSize}
                restricted={restricted}
                exhaustive={true}
                stoppedEarly={false}
              />
            )}
          </div>

          {/* Right column: Controls + Stats */}
          <div className="space-y-6">
            <SolverControls
              status={visualizer.status}
              animationSpeed={visualizer.animationSpeed}
              onStart={() => visualizer.startSolving(false)}
              onPause={visualizer.pause}
              onResume={visualizer.resume}
              onStepForward={visualizer.stepForward}
              onStepBackward={visualizer.stepBackward}
              onReset={visualizer.reset}
              onStop={visualizer.stop}
              onSolveInstantly={() => visualizer.solveInstantly(false)}
              onFindAll={() => visualizer.solveInstantly(true, 1000)}
              onSpeedChange={visualizer.setAnimationSpeed}
            />

            <StatisticsPanel
              stats={visualizer.stats}
              status={visualizer.status}
              boardSize={boardSize}
              currentDepth={currentDepth}
              exhaustive={visualizer.exhaustive}
              stoppedEarly={visualizer.stoppedEarly}
            />

            {/* Legend */}
            <motion.div
              className="glass-card p-4 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Legend
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { color: 'bg-violet-500/30', label: '♛ Queen', text: 'text-violet-300' },
                  { color: 'bg-rose-500/15', label: '🔒 Restricted', text: 'text-rose-300' },
                  { color: 'bg-cyan-500/20', label: '◉ Trying', text: 'text-cyan-300' },
                  { color: 'bg-rose-500/25', label: '✗ Conflict', text: 'text-rose-300' },
                  { color: 'bg-amber-500/8', label: '◦ Attacked', text: 'text-amber-300' },
                  { color: 'bg-emerald-500/20', label: '✓ Safe', text: 'text-emerald-300' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <span className={item.text}>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
