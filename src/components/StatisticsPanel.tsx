import React from 'react';
import { motion } from 'framer-motion';
import { Activity, GitBranch, Timer, Hash, Layers, CheckCircle, XCircle, ArrowLeftRight } from 'lucide-react';
import type { SolverStats, SolverStatus } from '../algorithms/solverTypes';

interface StatisticsPanelProps {
  stats: SolverStats;
  status: SolverStatus;
  boardSize: number;
  currentDepth: number;
  exhaustive: boolean;
  stoppedEarly: boolean;
}

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
    <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    <div className="min-w-0">
      <div className="text-xs text-slate-400 truncate">{label}</div>
      <div className="text-sm font-semibold text-slate-200 font-mono">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  </div>
);

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  stats,
  status,
  boardSize,
  currentDepth,
  exhaustive,
  stoppedEarly,
}) => {
  return (
    <motion.div
      className="glass-card p-4 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
        <Activity size={14} className="text-cyan-400" />
        Live Statistics
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <StatItem
          icon={<Hash size={14} className="text-violet-400" />}
          label="Board Size"
          value={`${boardSize}×${boardSize}`}
          color="bg-violet-500/10"
        />
        <StatItem
          icon={<Layers size={14} className="text-cyan-400" />}
          label="Current Depth"
          value={currentDepth >= 0 ? currentDepth : '—'}
          color="bg-cyan-500/10"
        />
        <StatItem
          icon={<GitBranch size={14} className="text-amber-400" />}
          label="Nodes Explored"
          value={stats.nodeCount}
          color="bg-amber-500/10"
        />
        <StatItem
          icon={<ArrowLeftRight size={14} className="text-rose-400" />}
          label="Backtracks"
          value={stats.backtrackCount}
          color="bg-rose-500/10"
        />
        <StatItem
          icon={
            stats.solutionCount > 0 ? (
              <CheckCircle size={14} className="text-emerald-400" />
            ) : (
              <XCircle size={14} className="text-slate-400" />
            )
          }
          label="Solutions Found"
          value={stats.solutionCount}
          color={stats.solutionCount > 0 ? 'bg-emerald-500/10' : 'bg-slate-500/10'}
        />
        <StatItem
          icon={<Timer size={14} className="text-cyan-400" />}
          label="Time (ms)"
          value={stats.executionTimeMs.toFixed(2)}
          color="bg-cyan-500/10"
        />
      </div>

      {/* Status messages */}
      {status === 'completed' && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
          ✅ Solution{stats.solutionCount > 1 ? 's' : ''} found!
          {stoppedEarly && ' (search limit reached — may not be exhaustive)'}
          {exhaustive && stats.solutionCount > 0 && ` (exhaustive search: ${stats.solutionCount} total)`}
        </div>
      )}

      {status === 'no-solution' && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          ❌ No valid arrangement exists for this configuration. All candidate placements have been exhausted.
        </div>
      )}

      {status === 'stopped' && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          ⏹ Search stopped by user. Results may be incomplete.
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(StatisticsPanel);
