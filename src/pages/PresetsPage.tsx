import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Play,
  Lock,
  CheckCircle,
  XCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PRESETS, presetToRestricted } from '../utils/presets';
import { solveNQueens } from '../algorithms/nQueensSolver';
import type { Preset } from '../algorithms/solverTypes';

const categoryColors: Record<string, string> = {
  classic: 'badge-violet',
  'restricted-solvable': 'badge-emerald',
  'restricted-multiple': 'badge-cyan',
  'restricted-none': 'badge-rose',
};

const categoryIcons: Record<string, React.ReactNode> = {
  classic: <Crown size={14} className="text-violet-400" />,
  'restricted-solvable': <CheckCircle size={14} className="text-emerald-400" />,
  'restricted-multiple': <Layers size={14} className="text-cyan-400" />,
  'restricted-none': <XCircle size={14} className="text-rose-400" />,
};

const PresetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [verifiedResults, setVerifiedResults] = useState<
    Record<string, { solutionCount: number; timeMs: number }>
  >({});

  const verifyPreset = useCallback((preset: Preset) => {
    const restricted = presetToRestricted(preset);
    const result = solveNQueens({
      boardSize: preset.boardSize,
      restricted,
      findAll: true,
      maxSolutions: 100000,
    });
    setVerifiedResults((prev) => ({
      ...prev,
      [preset.id]: {
        solutionCount: result.stats.solutionCount,
        timeMs: result.stats.executionTimeMs,
      },
    }));
  }, []);

  const loadAndVisualize = useCallback(
    (presetId: string) => {
      navigate(`/visualizer?preset=${presetId}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-navy-950 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Crown size={22} className="text-violet-400" fill="currentColor" strokeWidth={1} />
            <span className="text-lg font-bold gradient-text">Demo Presets</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Select a validated preset configuration to explore. Each preset demonstrates a
          different aspect of the restricted N-Queens problem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESETS.map((preset, index) => (
            <motion.div
              key={preset.id}
              className="glass-card glass-card-hover p-5 space-y-3 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {categoryIcons[preset.category]}
                  <h3 className="text-base font-semibold text-slate-200">
                    {preset.name}
                  </h3>
                </div>
                <span className={`badge ${categoryColors[preset.category]}`}>
                  {preset.boardSize}×{preset.boardSize}
                </span>
              </div>

              <p className="text-sm text-slate-400">{preset.description}</p>

              {preset.restricted.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Lock size={10} />
                  {preset.restricted.length} restricted cell{preset.restricted.length > 1 ? 's' : ''}
                </div>
              )}

              {verifiedResults[preset.id] && (
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-400 font-mono">
                  Solutions: {verifiedResults[preset.id].solutionCount} •
                  Time: {verifiedResults[preset.id].timeMs.toFixed(2)}ms
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  className="btn-primary text-xs flex-1"
                  onClick={() => loadAndVisualize(preset.id)}
                >
                  <Play size={12} />
                  Visualize
                  <ArrowRight size={12} />
                </button>
                <button
                  className="btn-secondary text-xs"
                  onClick={() => verifyPreset(preset)}
                >
                  Verify
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresetsPage;
