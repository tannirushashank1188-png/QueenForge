// ============================================================
// QUEENFORGE — Solver Tests
// Validates the backtracking solver, conflict detection, and presets
// ============================================================

import { describe, it, expect } from 'vitest';
import { solveNQueens, createEmptyRestricted } from '../algorithms/nQueensSolver';
import { validateSolution, isSafe } from '../algorithms/conflictDetection';
import { PRESETS, presetToRestricted } from '../utils/presets';
import type { SolverConfig } from '../algorithms/solverTypes';

function makeConfig(
  boardSize: number,
  restricted?: boolean[][],
  findAll = true,
  maxSolutions = 100000
): SolverConfig {
  return {
    boardSize,
    restricted: restricted ?? createEmptyRestricted(boardSize),
    findAll,
    maxSolutions,
  };
}

describe('N-Queens Solver — Classic Problems', () => {
  it('should find exactly 2 solutions for classic 4-Queens', () => {
    const result = solveNQueens(makeConfig(4));
    expect(result.stats.solutionCount).toBe(2);
    expect(result.solutions).toHaveLength(2);
    expect(result.exhaustive).toBe(true);
  });

  it('should find exactly 92 solutions for classic 8-Queens', () => {
    const result = solveNQueens(makeConfig(8));
    expect(result.stats.solutionCount).toBe(92);
    expect(result.solutions).toHaveLength(92);
    expect(result.exhaustive).toBe(true);
  });

  it('should find exactly 10 solutions for classic 5-Queens', () => {
    const result = solveNQueens(makeConfig(5));
    expect(result.stats.solutionCount).toBe(10);
  });

  it('should find exactly 724 solutions for classic 10-Queens', () => {
    const result = solveNQueens(makeConfig(10));
    expect(result.stats.solutionCount).toBe(724);
  });
});

describe('Solution Validation', () => {
  it('should validate that no two queens share a column', () => {
    const result = solveNQueens(makeConfig(8, undefined, false));
    expect(result.solutions.length).toBeGreaterThan(0);

    const solution = result.solutions[0];
    const cols = new Set(solution);
    expect(cols.size).toBe(8); // All columns unique
  });

  it('should validate that no two queens share a diagonal', () => {
    const result = solveNQueens(makeConfig(8, undefined, false));
    const solution = result.solutions[0];

    const diags = new Set<number>();
    const antiDiags = new Set<number>();
    for (let row = 0; row < 8; row++) {
      diags.add(row - solution[row]);
      antiDiags.add(row + solution[row]);
    }
    expect(diags.size).toBe(8);
    expect(antiDiags.size).toBe(8);
  });

  it('should pass validateSolution for all 4-Queens solutions', () => {
    const restricted = createEmptyRestricted(4);
    const result = solveNQueens(makeConfig(4));

    for (const solution of result.solutions) {
      const validation = validateSolution(solution, 4, restricted);
      expect(validation.valid).toBe(true);
    }
  });

  it('should pass validateSolution for all 8-Queens solutions', () => {
    const restricted = createEmptyRestricted(8);
    const result = solveNQueens(makeConfig(8));

    for (const solution of result.solutions) {
      const validation = validateSolution(solution, 8, restricted);
      expect(validation.valid).toBe(true);
    }
  });

  it('should reject an invalid solution with column conflict', () => {
    const restricted = createEmptyRestricted(4);
    // Queens at columns [0, 0, 2, 3] — column 0 is duplicated
    const invalid = [0, 0, 2, 3];
    const validation = validateSolution(invalid, 4, restricted);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Column');
  });
});

describe('Restricted Board — Solvable Configurations', () => {
  it('should find at least one solution for a restricted solvable board', () => {
    const size = 6;
    const restricted = createEmptyRestricted(size);
    // Block a few cells that don't eliminate all solutions
    restricted[0][0] = true;
    restricted[2][2] = true;

    const result = solveNQueens(makeConfig(size, restricted));
    expect(result.solutions.length).toBeGreaterThan(0);

    // Verify no queen is on a restricted cell
    for (const solution of result.solutions) {
      for (let row = 0; row < size; row++) {
        expect(restricted[row][solution[row]]).toBe(false);
      }
    }
  });

  it('should not place queens on restricted cells', () => {
    const size = 8;
    const restricted = createEmptyRestricted(size);
    restricted[0][0] = true;
    restricted[3][3] = true;
    restricted[7][7] = true;

    const result = solveNQueens(makeConfig(size, restricted));
    for (const solution of result.solutions) {
      for (let row = 0; row < size; row++) {
        expect(restricted[row][solution[row]]).toBe(false);
      }
    }
  });
});

describe('Restricted Board — No Solution', () => {
  it('should correctly report no solution when board is heavily restricted', () => {
    const size = 4;
    const restricted = createEmptyRestricted(size);
    // Block key cells to make it unsolvable
    // The two 4-queens solutions are [1,3,0,2] and [2,0,3,1]
    // Block (0,1), (0,2) to eliminate both solutions' first-row placements
    restricted[0][1] = true;
    restricted[0][2] = true;
    restricted[1][0] = true;
    restricted[1][3] = true;
    restricted[2][0] = true;
    restricted[2][3] = true;
    restricted[3][1] = true;
    restricted[3][2] = true;

    const result = solveNQueens(makeConfig(size, restricted));
    expect(result.solutions).toHaveLength(0);
    expect(result.stats.solutionCount).toBe(0);
  });

  it('should report no solution when entire row is restricted', () => {
    const size = 4;
    const restricted = createEmptyRestricted(size);
    // Restrict all cells in row 0
    for (let col = 0; col < size; col++) {
      restricted[0][col] = true;
    }

    const result = solveNQueens(makeConfig(size, restricted));
    expect(result.solutions).toHaveLength(0);
  });
});

describe('Preset Validation', () => {
  it('classic-4 preset should have exactly 2 solutions', () => {
    const preset = PRESETS.find((p) => p.id === 'classic-4')!;
    const restricted = presetToRestricted(preset);
    const result = solveNQueens(makeConfig(preset.boardSize, restricted));
    expect(result.stats.solutionCount).toBe(2);
  });

  it('classic-8 preset should have exactly 92 solutions', () => {
    const preset = PRESETS.find((p) => p.id === 'classic-8')!;
    const restricted = presetToRestricted(preset);
    const result = solveNQueens(makeConfig(preset.boardSize, restricted));
    expect(result.stats.solutionCount).toBe(92);
  });

  it('restricted-none preset should have 0 solutions', () => {
    const preset = PRESETS.find((p) => p.id === 'restricted-none')!;
    const restricted = presetToRestricted(preset);
    const result = solveNQueens(makeConfig(preset.boardSize, restricted));
    expect(result.stats.solutionCount).toBe(0);
  });

  it('restricted-solvable preset should have at least 1 solution', () => {
    const preset = PRESETS.find((p) => p.id === 'restricted-solvable')!;
    const restricted = presetToRestricted(preset);
    const result = solveNQueens(makeConfig(preset.boardSize, restricted));
    expect(result.solutions.length).toBeGreaterThanOrEqual(1);
  });

  it('restricted-multiple preset should have multiple solutions', () => {
    const preset = PRESETS.find((p) => p.id === 'restricted-multiple')!;
    const restricted = presetToRestricted(preset);
    const result = solveNQueens(makeConfig(preset.boardSize, restricted));
    expect(result.solutions.length).toBeGreaterThan(1);
  });
});

describe('Solver Statistics', () => {
  it('should track node count accurately', () => {
    const result = solveNQueens(makeConfig(4));
    expect(result.stats.nodeCount).toBeGreaterThan(0);
    expect(result.stats.candidateChecks).toBeGreaterThan(0);
  });

  it('should track backtrack count', () => {
    const result = solveNQueens(makeConfig(8));
    expect(result.stats.backtrackCount).toBeGreaterThan(0);
  });

  it('should track execution time', () => {
    const result = solveNQueens(makeConfig(8));
    expect(result.stats.executionTimeMs).toBeGreaterThan(0);
  });

  it('should generate events during execution', () => {
    const result = solveNQueens(makeConfig(4, undefined, false));
    expect(result.events.length).toBeGreaterThan(0);
    // Should contain place, try, and solution events
    const eventTypes = new Set(result.events.map((e) => e.type));
    expect(eventTypes.has('try')).toBe(true);
    expect(eventTypes.has('place')).toBe(true);
    expect(eventTypes.has('solution')).toBe(true);
  });
});

describe('Max Solutions Limit', () => {
  it('should respect maxSolutions limit', () => {
    const result = solveNQueens(makeConfig(8, undefined, true, 5));
    expect(result.solutions).toHaveLength(5);
    expect(result.stoppedEarly).toBe(true);
    expect(result.exhaustive).toBe(false);
  });

  it('should mark exhaustive=true when all solutions found within limit', () => {
    const result = solveNQueens(makeConfig(4, undefined, true, 100));
    expect(result.solutions).toHaveLength(2);
    expect(result.exhaustive).toBe(true);
    expect(result.stoppedEarly).toBe(false);
  });
});

describe('Conflict Detection — isSafe', () => {
  it('should detect column conflict', () => {
    const queens = [0, -1, -1, -1];
    const colSet = new Set([0]);
    const diagSet = new Set([0]);
    const antiDiagSet = new Set([0]);
    expect(isSafe(1, 0, queens, colSet, diagSet, antiDiagSet)).toBe(false);
  });

  it('should detect diagonal conflict', () => {
    const queens = [0, -1, -1, -1];
    const colSet = new Set([0]);
    const diagSet = new Set([0]); // row-col = 0
    const antiDiagSet = new Set([0]); // row+col = 0
    // Position (1,1): row-col = 0 → conflict
    expect(isSafe(1, 1, queens, colSet, diagSet, antiDiagSet)).toBe(false);
  });

  it('should allow safe placement', () => {
    const queens = [0, -1, -1, -1];
    const colSet = new Set([0]);
    const diagSet = new Set([0]);
    const antiDiagSet = new Set([0]);
    // Position (1,2): col=2 not in set, row-col=−1 not in set, row+col=3 not in set
    expect(isSafe(1, 2, queens, colSet, diagSet, antiDiagSet)).toBe(true);
  });
});

describe('Board Configuration Changes', () => {
  it('should produce different results for different restrictions', () => {
    const restricted1 = createEmptyRestricted(4);
    const result1 = solveNQueens(makeConfig(4, restricted1));

    const restricted2 = createEmptyRestricted(4);
    restricted2[0][1] = true;
    const result2 = solveNQueens(makeConfig(4, restricted2));

    // With a restriction, we should get fewer solutions
    expect(result2.solutions.length).toBeLessThanOrEqual(result1.solutions.length);
  });

  it('should not produce duplicate solutions', () => {
    const result = solveNQueens(makeConfig(8));
    const solutionStrings = result.solutions.map((s) => s.join(','));
    const uniqueSet = new Set(solutionStrings);
    expect(uniqueSet.size).toBe(result.solutions.length);
  });
});
