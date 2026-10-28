import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Cpu, HardDrive, TrendingUp, Info } from 'lucide-react';
import type { SolverStats } from '../algorithms/solverTypes';

interface ComplexityPanelProps {
  stats: SolverStats;
  boardSize: number;
  /** History of runs for the comparison chart: [boardSize, nodeCount] pairs */
  runHistory: Array<{ boardSize: number; nodeCount: number; timeMs: number }>;
}

const ComplexityPanel: React.FC<ComplexityPanelProps> = ({
  stats,
  boardSize,
  runHistory,
}) => {
  const maxNodes = useMemo(
    () => Math.max(1, ...runHistory.map((r) => r.nodeCount)),
    [runHistory]
  );

  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
        <BarChart3 size={18} className="text-cyan-400" />
        Complexity Analysis
      </h3>

      {/* Theoretical complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-400">
            <TrendingUp size={14} />
            Time Complexity
          </div>
          <div className="text-2xl font-bold text-slate-200 font-mono">O(N!)</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upper-bound estimate for row-by-row backtracking with efficient column/diagonal
            conflict checks. First row has N choices, second has at most N−1, etc.
            Restricted cells and early pruning can substantially reduce actual work.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
            <HardDrive size={14} />
            Auxiliary Space
          </div>
          <div className="text-2xl font-bold text-slate-200 font-mono">O(N)</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The recursive call stack and occupancy sets each use O(N) space.
            Stored solutions require O(K×N) where K is the number of solutions.
            The visualization event history uses additional memory proportional to
            the number of recorded events.
          </p>
        </div>
      </div>

      {/* Measured statistics from actual execution */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Cpu size={14} className="text-emerald-400" />
          Measured Execution Statistics (N={boardSize})
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Recursive Calls', value: stats.recursiveCalls, color: 'text-violet-400' },
            { label: 'Candidate Checks', value: stats.candidateChecks, color: 'text-cyan-400' },
            { label: 'Successful Placements', value: stats.successfulPlacements, color: 'text-emerald-400' },
            { label: 'Backtrack Operations', value: stats.backtrackCount, color: 'text-rose-400' },
            { label: 'Solutions Found', value: stats.solutionCount, color: 'text-amber-400' },
            { label: 'Execution Time', value: `${stats.executionTimeMs.toFixed(2)}ms`, color: 'text-cyan-400' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1"
            >
              <div className="text-xs text-slate-500">{item.label}</div>
              <div className={`text-lg font-bold font-mono ${item.color}`}>
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
          <Info size={14} className="text-violet-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            These values are calculated from the actual solver execution — not fabricated benchmarks.
            Theoretical O(N!) is a worst-case upper bound. The actual node count depends heavily on
            the specific restriction pattern and early pruning effectiveness.
          </p>
        </div>
      </div>

      {/* Comparison chart from actual runs */}
      {runHistory.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            Node Comparison Across Board Sizes
          </h4>

          <div className="space-y-2">
            {runHistory.map((run, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-12 text-right font-mono">
                  N={run.boardSize}
                </span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, #7c3aed, #22d3ee)`,
                      width: `${Math.max(2, (run.nodeCount / maxNodes) * 100)}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, (run.nodeCount / maxNodes) * 100)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-20 font-mono">
                  {run.nodeCount.toLocaleString()} nodes
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Chart shows explored nodes from actual solver executions performed in this session.
          </p>
        </div>
      )}

      {/* Best/Worst case discussion */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-300">Complexity Considerations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-xs font-semibold text-emerald-400">Best Case</div>
            <p className="text-xs text-slate-400">
              When restrictions or lucky column ordering allows the solver to find a valid arrangement
              with minimal backtracking. In the ideal case, N placements succeed without conflict.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="text-xs font-semibold text-rose-400">Worst Case</div>
            <p className="text-xs text-slate-400">
              When the solver must explore nearly all N! row-column permutations before finding a
              solution or concluding none exists. Heavy restrictions that almost-but-don't-quite block
              all solutions tend to produce near-worst-case behavior.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ComplexityPanel);
