import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Play, BarChart3 } from 'lucide-react';
import ComplexityPanel from '../components/ComplexityPanel';
import { solveNQueens, createEmptyRestricted } from '../algorithms/nQueensSolver';
import type { SolverStats } from '../algorithms/solverTypes';

const INITIAL_STATS: SolverStats = {
  nodeCount: 0,
  backtrackCount: 0,
  solutionCount: 0,
  executionTimeMs: 0,
  recursiveCalls: 0,
  candidateChecks: 0,
  successfulPlacements: 0,
};

interface RunRecord {
  boardSize: number;
  nodeCount: number;
  timeMs: number;
}

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = useState(8);
  const [stats, setStats] = useState<SolverStats>(INITIAL_STATS);
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]);

  const runBenchmark = useCallback(
    (size: number) => {
      const restricted = createEmptyRestricted(size);
      const result = solveNQueens({
        boardSize: size,
        restricted,
        findAll: true,
        maxSolutions: 100000,
      });

      setStats(result.stats);
      setBoardSize(size);

      // Add to history (replace if same size exists)
      setRunHistory((prev) => {
        const filtered = prev.filter((r) => r.boardSize !== size);
        return [
          ...filtered,
          {
            boardSize: size,
            nodeCount: result.stats.nodeCount,
            timeMs: result.stats.executionTimeMs,
          },
        ].sort((a, b) => a.boardSize - b.boardSize);
      });
    },
    []
  );

  const runAllBenchmarks = useCallback(() => {
    const sizes = [4, 5, 6, 7, 8, 9, 10];
    const newHistory: RunRecord[] = [];
    let lastStats = INITIAL_STATS;

    for (const size of sizes) {
      const restricted = createEmptyRestricted(size);
      const result = solveNQueens({
        boardSize: size,
        restricted,
        findAll: true,
        maxSolutions: 100000,
      });

      newHistory.push({
        boardSize: size,
        nodeCount: result.stats.nodeCount,
        timeMs: result.stats.executionTimeMs,
      });

      lastStats = result.stats;
    }

    setRunHistory(newHistory);
    setStats(lastStats);
    setBoardSize(10);
  }, []);

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
            <span className="text-lg font-bold gradient-text">Complexity Analysis</span>
          </div>
        </div>

        {/* Benchmark controls */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-cyan-400" />
              <span className="text-sm text-slate-300">Run Benchmark:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <button
                  key={n}
                  className="btn-secondary text-xs"
                  onClick={() => runBenchmark(n)}
                >
                  N={n}
                </button>
              ))}
            </div>
            <button className="btn-primary text-xs ml-auto" onClick={runAllBenchmarks}>
              <Play size={12} />
              Run All (4–10)
            </button>
          </div>
        </motion.div>

        <ComplexityPanel
          stats={stats}
          boardSize={boardSize}
          runHistory={runHistory}
        />
      </div>
    </div>
  );
};

export default AnalysisPage;
