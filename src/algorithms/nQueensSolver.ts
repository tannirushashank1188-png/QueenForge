// ============================================================
// QUEENFORGE — N-Queens Backtracking Solver
// Event-driven solver supporting pause, resume, step, and instant solve
// ============================================================

import { isSafe } from './conflictDetection';
import type {
  SolverConfig,
  SolverResult,
  SolverEvent,
  Solution,
  SolverStats,
} from './solverTypes';

/**
 * Synchronous solver that generates the complete event trace.
 * Suitable for "Solve Instantly" and test scenarios.
 *
 * The algorithm performs row-by-row backtracking:
 *   1. For each column in the current row, skip restricted cells.
 *   2. Check safety using column/diagonal occupancy sets (O(1) per check).
 *   3. Place the queen if safe and recurse to the next row.
 *   4. If no column works, backtrack.
 *   5. When row == N, a solution is recorded.
 *
 * @param config - Solver configuration
 * @returns SolverResult with solutions, events, and statistics
 */
export function solveNQueens(config: SolverConfig): SolverResult {
  const { boardSize: N, restricted, findAll, maxSolutions } = config;
  const startTime = performance.now();

  const solutions: Solution[] = [];
  const events: SolverEvent[] = [];

  // Queen placement array: queens[row] = col, -1 means unplaced
  const queens: number[] = new Array(N).fill(-1);

  // Occupancy sets for O(1) conflict detection
  const colSet = new Set<number>();
  const diagSet = new Set<number>();       // row - col
  const antiDiagSet = new Set<number>();   // row + col

  // Statistics counters
  let nodeCount = 0;
  let backtrackCount = 0;
  let solutionCount = 0;
  let recursiveCalls = 0;
  let candidateChecks = 0;
  let successfulPlacements = 0;
  let stoppedEarly = false;

  function recordEvent(
    type: SolverEvent['type'],
    row: number,
    col: number
  ): void {
    events.push({
      type,
      position: { row, col },
      queens: [...queens],
      depth: row,
      nodeCount,
      backtrackCount,
      solutionCount,
      timestamp: performance.now() - startTime,
    });
  }

  /**
   * Recursive backtracking function.
   * Processes one row at a time, trying each column.
   */
  function solve(row: number): boolean {
    recursiveCalls++;

    // Base case: all queens placed — solution found
    if (row === N) {
      solutionCount++;
      const solution: Solution = [...queens];
      solutions.push(solution);
      recordEvent('solution', row - 1, queens[row - 1]);

      if (!findAll || solutionCount >= maxSolutions) {
        if (solutionCount >= maxSolutions) stoppedEarly = true;
        return true; // Signal to stop
      }
      return false; // Continue searching for more solutions
    }

    recordEvent('row-start', row, 0);

    // Try each column in the current row
    for (let col = 0; col < N; col++) {
      nodeCount++;
      candidateChecks++;

      // Step 1: Skip restricted cells
      if (restricted[row][col]) {
        recordEvent('restricted', row, col);
        continue;
      }

      // Step 2: Check if position is safe (no column/diagonal conflicts)
      recordEvent('try', row, col);

      if (!isSafe(row, col, queens, colSet, diagSet, antiDiagSet)) {
        recordEvent('conflict', row, col);
        continue;
      }

      // Step 3: Place the queen
      queens[row] = col;
      colSet.add(col);
      diagSet.add(row - col);
      antiDiagSet.add(row + col);
      successfulPlacements++;
      recordEvent('place', row, col);

      // Step 4: Recurse to the next row
      const shouldStop = solve(row + 1);
      if (shouldStop) return true;

      // Step 5: Backtrack — remove the queen and try next column
      queens[row] = -1;
      colSet.delete(col);
      diagSet.delete(row - col);
      antiDiagSet.delete(row + col);
      recordEvent('remove', row, col);
    }

    // No valid column found in this row — backtrack
    backtrackCount++;
    recordEvent('backtrack', row, -1);
    return false;
  }

  // Run the solver
  solve(0);

  const endTime = performance.now();

  // If we didn't find any solutions and weren't stopped early, we exhausted the search
  if (solutionCount === 0) {
    recordEvent('exhausted', 0, -1);
  }

  const stats: SolverStats = {
    nodeCount,
    backtrackCount,
    solutionCount,
    executionTimeMs: endTime - startTime,
    recursiveCalls,
    candidateChecks,
    successfulPlacements,
  };

  return {
    solutions,
    events,
    stats,
    exhaustive: !stoppedEarly,
    stoppedEarly,
  };
}

/**
 * Generator-based solver for step-by-step visualization.
 * Yields one event at a time, allowing the UI to pause, resume, or step.
 */
export function* solveNQueensGenerator(
  config: SolverConfig
): Generator<SolverEvent, SolverResult, void> {
  const { boardSize: N, restricted, findAll, maxSolutions } = config;
  const startTime = performance.now();

  const solutions: Solution[] = [];
  const queens: number[] = new Array(N).fill(-1);

  const colSet = new Set<number>();
  const diagSet = new Set<number>();
  const antiDiagSet = new Set<number>();

  let nodeCount = 0;
  let backtrackCount = 0;
  let solutionCount = 0;
  let recursiveCalls = 0;
  let candidateChecks = 0;
  let successfulPlacements = 0;
  let stoppedEarly = false;

  function makeEvent(
    type: SolverEvent['type'],
    row: number,
    col: number
  ): SolverEvent {
    return {
      type,
      position: { row, col },
      queens: [...queens],
      depth: row,
      nodeCount,
      backtrackCount,
      solutionCount,
      timestamp: performance.now() - startTime,
    };
  }

  // Iterative backtracking using an explicit stack to avoid generator nesting issues
  // Stack entry: [row, colToStartFrom]
  const stack: [number, number][] = [[0, 0]];

  while (stack.length > 0) {
    const [row, startCol] = stack[stack.length - 1];

    if (row === N) {
      // Solution found
      solutionCount++;
      const solution: Solution = [...queens];
      solutions.push(solution);
      yield makeEvent('solution', row - 1, queens[row - 1]);

      if (!findAll || solutionCount >= maxSolutions) {
        if (solutionCount >= maxSolutions) stoppedEarly = true;
        break;
      }

      // Pop and continue searching (backtrack from solution)
      stack.pop();
      continue;
    }

    if (startCol === 0) {
      recursiveCalls++;
      yield makeEvent('row-start', row, 0);
    }

    let placed = false;

    for (let col = startCol; col < N; col++) {
      nodeCount++;
      candidateChecks++;

      if (restricted[row][col]) {
        yield makeEvent('restricted', row, col);
        continue;
      }

      yield makeEvent('try', row, col);

      if (!isSafe(row, col, queens, colSet, diagSet, antiDiagSet)) {
        yield makeEvent('conflict', row, col);
        continue;
      }

      // Place queen
      queens[row] = col;
      colSet.add(col);
      diagSet.add(row - col);
      antiDiagSet.add(row + col);
      successfulPlacements++;
      yield makeEvent('place', row, col);

      // Update stack: current row resumes at col+1 on backtrack, push next row
      stack[stack.length - 1] = [row, col + 1];
      stack.push([row + 1, 0]);
      placed = true;
      break;
    }

    if (!placed) {
      // No valid column — backtrack
      backtrackCount++;
      yield makeEvent('backtrack', row, -1);
      stack.pop();

      // Remove queen from previous row if we're backtracking
      if (stack.length > 0) {
        const [prevRow] = stack[stack.length - 1];
        if (prevRow < N && queens[prevRow] !== -1) {
          const prevCol = queens[prevRow];
          colSet.delete(prevCol);
          diagSet.delete(prevRow - prevCol);
          antiDiagSet.delete(prevRow + prevCol);
          yield makeEvent('remove', prevRow, prevCol);
          queens[prevRow] = -1;
        }
      }
    }
  }

  const endTime = performance.now();

  if (solutionCount === 0) {
    yield makeEvent('exhausted', 0, -1);
  }

  const stats: SolverStats = {
    nodeCount,
    backtrackCount,
    solutionCount,
    executionTimeMs: endTime - startTime,
    recursiveCalls,
    candidateChecks,
    successfulPlacements,
  };

  return {
    solutions,
    events: [], // Events were yielded; not stored
    stats,
    exhaustive: !stoppedEarly,
    stoppedEarly,
  };
}

/**
 * Create a default restricted grid (all false = no restrictions).
 */
export function createEmptyRestricted(size: number): boolean[][] {
  return Array.from({ length: size }, () => new Array(size).fill(false));
}

/**
 * Generate random restrictions on the board.
 * @param size Board size
 * @param density Fraction of cells to restrict (0 to ~0.3 recommended)
 */
export function generateRandomRestrictions(
  size: number,
  density: number
): boolean[][] {
  const restricted = createEmptyRestricted(size);
  const maxRestricted = Math.floor(size * size * Math.min(density, 0.4));
  let count = 0;

  while (count < maxRestricted) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (!restricted[row][col]) {
      restricted[row][col] = true;
      count++;
    }
  }

  return restricted;
}
