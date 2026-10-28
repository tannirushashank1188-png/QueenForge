// ============================================================
// QUEENFORGE — Solver Type Definitions
// Core types for the N-Queens backtracking solver and visualization
// ============================================================

/** Represents the state of a single cell on the board */
export type CellState = 'empty' | 'queen' | 'restricted' | 'attacked';

/** Represents a position on the board */
export interface Position {
  row: number;
  col: number;
}

/** Types of events produced during solver execution */
export type SolverEventType =
  | 'try'          // Attempting to place a queen at this position
  | 'place'        // Queen successfully placed
  | 'conflict'     // Position conflicts with existing queen(s)
  | 'restricted'   // Position is a restricted cell — skip
  | 'remove'       // Removing queen during backtrack
  | 'backtrack'    // Backtracking to a previous row
  | 'solution'     // A complete solution was found
  | 'exhausted'    // All possibilities explored — no (more) solutions
  | 'row-start';   // Starting to process a new row

/** A single event in the solver's execution trace */
export interface SolverEvent {
  type: SolverEventType;
  position: Position;
  queens: number[];           // Current queen placement: queens[row] = col, -1 if unplaced
  depth: number;              // Current recursion depth (= current row being processed)
  nodeCount: number;          // Cumulative candidate positions checked
  backtrackCount: number;     // Cumulative backtrack operations
  solutionCount: number;      // Solutions found so far
  timestamp: number;          // Performance timestamp (ms)
}

/** A complete solution: array of column indices, one per row */
export type Solution = number[];

/** Statistics from a solver run */
export interface SolverStats {
  nodeCount: number;
  backtrackCount: number;
  solutionCount: number;
  executionTimeMs: number;
  recursiveCalls: number;
  candidateChecks: number;
  successfulPlacements: number;
}

/** Configuration for the solver */
export interface SolverConfig {
  boardSize: number;
  restricted: boolean[][];    // restricted[row][col] = true if cell is blocked
  findAll: boolean;           // Whether to find all solutions or stop at first
  maxSolutions: number;       // Safety cap on stored solutions
}

/** Result returned by the solver */
export interface SolverResult {
  solutions: Solution[];
  events: SolverEvent[];
  stats: SolverStats;
  exhaustive: boolean;        // True if entire search space was explored
  stoppedEarly: boolean;      // True if stopped by user or limit
}

/** Solver execution state */
export type SolverStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'no-solution'
  | 'stopped';

/** Board state for the UI */
export interface BoardState {
  size: number;
  restricted: boolean[][];
  queens: number[];           // queens[row] = col, -1 if no queen in that row
}

/** Preset configuration */
export interface Preset {
  id: string;
  name: string;
  description: string;
  boardSize: number;
  restricted: Position[];
  expectedSolutions: number | null; // null = unknown
  category: 'classic' | 'restricted-solvable' | 'restricted-multiple' | 'restricted-none';
}
