import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ChessCell from './ChessCell';
import { computeAttackedCells } from '../algorithms/conflictDetection';
import type { SolverEvent } from '../algorithms/solverTypes';

interface ChessBoardProps {
  size: number;
  restricted: boolean[][];
  queens: number[];
  currentEvent: SolverEvent | null;
  onCellClick: (row: number, col: number) => void;
  isInteractive: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  size,
  restricted,
  queens,
  currentEvent,
  onCellClick,
  isInteractive,
}) => {
  const attacked = useMemo(
    () => computeAttackedCells(size, queens),
    [size, queens]
  );

  const colLabels = useMemo(
    () => Array.from({ length: size }, (_, i) => String.fromCharCode(65 + i)),
    [size]
  );

  const rowLabels = useMemo(
    () => Array.from({ length: size }, (_, i) => (size - i).toString()),
    [size]
  );

  // Dynamic cell size based on board size
  const cellSize = useMemo(() => {
    if (size <= 6) return 56;
    if (size <= 8) return 48;
    if (size <= 10) return 40;
    return 36;
  }, [size]);

  return (
    <motion.div
      className="glass-card p-4 inline-block"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Column labels */}
      <div className="flex" style={{ marginLeft: '24px' }}>
        {colLabels.map((label) => (
          <div
            key={label}
            className="text-center text-xs text-slate-500 font-medium"
            style={{ width: cellSize, height: 20 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Board rows */}
      {Array.from({ length: size }, (_, row) => (
        <div key={row} className="flex items-center">
          {/* Row label */}
          <div
            className="text-xs text-slate-500 font-medium text-right pr-2"
            style={{ width: 24 }}
          >
            {rowLabels[row]}
          </div>

          {/* Cells */}
          {Array.from({ length: size }, (_, col) => (
            <div
              key={`${row}-${col}`}
              style={{ width: cellSize, height: cellSize }}
            >
              <ChessCell
                row={row}
                col={col}
                size={size}
                isRestricted={restricted[row]?.[col] ?? false}
                hasQueen={queens[row] === col}
                isAttacked={attacked[row][col]}
                currentEvent={currentEvent}
                onClick={() => onCellClick(row, col)}
                isInteractive={isInteractive}
              />
            </div>
          ))}

          {/* Row label (right side) */}
          <div
            className="text-xs text-slate-500 font-medium text-left pl-2"
            style={{ width: 24 }}
          >
            {rowLabels[row]}
          </div>
        </div>
      ))}

      {/* Column labels (bottom) */}
      <div className="flex" style={{ marginLeft: '24px' }}>
        {colLabels.map((label) => (
          <div
            key={`b-${label}`}
            className="text-center text-xs text-slate-500 font-medium"
            style={{ width: cellSize, height: 20, lineHeight: '20px' }}
          >
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(ChessBoard);
