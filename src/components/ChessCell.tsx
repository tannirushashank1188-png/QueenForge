import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown } from 'lucide-react';
import type { SolverEvent } from '../algorithms/solverTypes';

interface ChessCellProps {
  row: number;
  col: number;
  size: number;
  isRestricted: boolean;
  hasQueen: boolean;
  isAttacked: boolean;
  currentEvent: SolverEvent | null;
  onClick: () => void;
  isInteractive: boolean;
}

const ChessCell: React.FC<ChessCellProps> = ({
  row,
  col,
  isRestricted,
  hasQueen,
  isAttacked,
  currentEvent,
  onClick,
  isInteractive,
}) => {
  const isLight = (row + col) % 2 === 0;

  // Determine cell class based on state
  let cellClass = isLight ? 'chess-cell-light' : 'chess-cell-dark';
  let showIndicator = false;
  let indicatorType: 'trying' | 'conflict' | 'restricted-try' | null = null;

  if (isRestricted) {
    cellClass = 'chess-cell-restricted';
  } else if (hasQueen) {
    cellClass = 'chess-cell-queen';
  } else if (currentEvent) {
    const { position, type } = currentEvent;
    if (position.row === row && position.col === col) {
      if (type === 'try') {
        cellClass = 'chess-cell-trying';
        showIndicator = true;
        indicatorType = 'trying';
      } else if (type === 'conflict') {
        cellClass = 'chess-cell-conflict';
        showIndicator = true;
        indicatorType = 'conflict';
      } else if (type === 'restricted') {
        showIndicator = true;
        indicatorType = 'restricted-try';
      }
    }
  }

  if (!isRestricted && !hasQueen && isAttacked && !showIndicator) {
    cellClass += ' chess-cell-attacked';
  }

  return (
    <motion.div
      className={`chess-cell ${cellClass}`}
      onClick={isInteractive ? onClick : undefined}
      style={{
        cursor: isInteractive ? 'pointer' : 'default',
        aspectRatio: '1',
        borderRadius: '2px',
      }}
      whileHover={isInteractive ? { scale: 1.05 } : undefined}
      whileTap={isInteractive ? { scale: 0.95 } : undefined}
      layout
    >
      {hasQueen && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Crown
            size={20}
            className="text-violet-400"
            fill="currentColor"
            strokeWidth={1.5}
          />
        </motion.div>
      )}

      {isRestricted && !hasQueen && (
        <Lock size={14} className="text-rose-400/60" strokeWidth={2} />
      )}

      {showIndicator && indicatorType === 'trying' && (
        <motion.div
          className="absolute inset-0 rounded border-2 border-cyan-400/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
      )}

      {showIndicator && indicatorType === 'conflict' && (
        <motion.div
          className="absolute inset-0 rounded border-2 border-rose-400/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.div>
  );
};

export default React.memo(ChessCell);
