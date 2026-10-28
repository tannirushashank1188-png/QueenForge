import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, CheckCircle, XCircle, Layers } from 'lucide-react';
import type { Solution } from '../algorithms/solverTypes';

interface SolutionGalleryProps {
  solutions: Solution[];
  boardSize: number;
  restricted: boolean[][];
  exhaustive: boolean;
  stoppedEarly: boolean;
}

const MiniBoard: React.FC<{
  solution: Solution;
  size: number;
  restricted: boolean[][];
  index: number;
}> = ({ solution, size, restricted, index }) => {
  const cellSize = size <= 6 ? 28 : size <= 8 ? 24 : 20;

  return (
    <motion.div
      className="glass-card p-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * (index % 10) }}
    >
      <div className="text-xs text-slate-400 text-center mb-2 font-mono">
        Solution #{index + 1}
      </div>
      <div className="inline-block border border-white/10 rounded overflow-hidden">
        {Array.from({ length: size }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: size }, (_, col) => {
              const isLight = (row + col) % 2 === 0;
              const hasQueen = solution[row] === col;
              const isRestricted = restricted[row]?.[col] ?? false;

              return (
                <div
                  key={col}
                  className={`flex items-center justify-center ${
                    isRestricted
                      ? 'bg-rose-500/10'
                      : hasQueen
                      ? 'bg-violet-500/30'
                      : isLight
                      ? 'bg-navy-600/50'
                      : 'bg-navy-700/50'
                  }`}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {hasQueen && (
                    <Crown
                      size={cellSize * 0.55}
                      className="text-violet-400"
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500 text-center mt-2 font-mono">
        [{solution.join(', ')}]
      </div>
    </motion.div>
  );
};

const SolutionGallery: React.FC<SolutionGalleryProps> = ({
  solutions,
  boardSize,
  restricted,
  exhaustive,
  stoppedEarly,
}) => {
  const [page, setPage] = useState(0);
  const perPage = 6;

  const totalPages = Math.ceil(solutions.length / perPage);
  const pageSolutions = useMemo(
    () => solutions.slice(page * perPage, (page + 1) * perPage),
    [solutions, page]
  );

  if (solutions.length === 0) {
    return (
      <motion.div
        className="glass-card p-8 text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <XCircle size={48} className="text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">No Valid Arrangement Exists</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          All valid candidate placements were exhausted for this configuration.
          Try changing the restrictions or board size and retry.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers size={18} className="text-emerald-400" />
          Solutions Found: {solutions.length}
        </h3>

        {!exhaustive && stoppedEarly && (
          <span className="badge badge-amber">
            Search was limited
          </span>
        )}

        {exhaustive && (
          <span className="badge badge-emerald flex items-center gap-1">
            <CheckCircle size={12} /> Exhaustive
          </span>
        )}
      </div>

      {/* Solution grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {pageSolutions.map((sol, i) => (
            <MiniBoard
              key={page * perPage + i}
              solution={sol}
              size={boardSize}
              restricted={restricted}
              index={page * perPage + i}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            className="btn-secondary"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-slate-400 font-mono">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn-secondary"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(SolutionGallery);
