// ============================================================
// QUEENFORGE — Preset Configurations
// Validated preset boards for demos and testing
// ============================================================

import type { Preset } from '../algorithms/solverTypes';

/**
 * All presets are validated:
 * - Classic 4-Queens: 2 solutions (verified)
 * - Classic 8-Queens: 92 solutions (verified)
 * - Restricted Solvable: Has at least one solution
 * - Restricted Multiple: Has multiple solutions
 * - Restricted None: Genuinely has no solution
 */
export const PRESETS: Preset[] = [
  {
    id: 'classic-4',
    name: 'Classic 4-Queens',
    description: 'The classic 4×4 N-Queens problem with no restrictions. Has exactly 2 solutions.',
    boardSize: 4,
    restricted: [],
    expectedSolutions: 2,
    category: 'classic',
  },
  {
    id: 'classic-8',
    name: 'Classic 8-Queens',
    description: 'The classic 8×8 N-Queens problem with no restrictions. Has exactly 92 solutions.',
    boardSize: 8,
    restricted: [],
    expectedSolutions: 92,
    category: 'classic',
  },
  {
    id: 'restricted-solvable',
    name: 'Restricted — Solvable',
    description: 'A 6×6 board with carefully placed restrictions that still permits a solution.',
    boardSize: 6,
    restricted: [
      { row: 0, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 4 },
      { row: 3, col: 1 },
      { row: 4, col: 3 },
    ],
    expectedSolutions: null, // Will be computed
    category: 'restricted-solvable',
  },
  {
    id: 'restricted-multiple',
    name: 'Restricted — Multiple Solutions',
    description: 'A 5×5 board with mild restrictions that yields multiple solutions.',
    boardSize: 5,
    restricted: [
      { row: 0, col: 0 },
      { row: 4, col: 4 },
    ],
    expectedSolutions: null,
    category: 'restricted-multiple',
  },
  {
    id: 'restricted-none',
    name: 'Restricted — No Solution',
    description: 'A 4×4 board with restrictions that make it impossible to place 4 non-attacking queens.',
    boardSize: 4,
    restricted: [
      // Block column 1 in rows 0,1 and column 2 in rows 2,3
      // Combined with existing constraints this eliminates all solutions
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 3 },
      { row: 2, col: 0 },
      { row: 2, col: 3 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
    ],
    expectedSolutions: 0,
    category: 'restricted-none',
  },
];

/**
 * Convert a preset's restricted positions into a 2D boolean grid.
 */
export function presetToRestricted(preset: Preset): boolean[][] {
  const grid: boolean[][] = Array.from({ length: preset.boardSize }, () =>
    new Array(preset.boardSize).fill(false)
  );
  for (const pos of preset.restricted) {
    if (pos.row < preset.boardSize && pos.col < preset.boardSize) {
      grid[pos.row][pos.col] = true;
    }
  }
  return grid;
}
