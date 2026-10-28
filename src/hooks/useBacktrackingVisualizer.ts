// ============================================================
// QUEENFORGE — Backtracking Visualizer Hook
// Manages solver execution state, animation, stepping, and event history
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { solveNQueens, solveNQueensGenerator, createEmptyRestricted } from '../algorithms/nQueensSolver';
import type {
  SolverConfig,
  SolverEvent,
  SolverStats,
  SolverStatus,
  Solution,
} from '../algorithms/solverTypes';

interface VisualizerState {
  status: SolverStatus;
  currentEvent: SolverEvent | null;
  eventIndex: number;
  eventHistory: SolverEvent[];
  solutions: Solution[];
  stats: SolverStats;
  queens: number[];
  exhaustive: boolean;
  stoppedEarly: boolean;
}

const INITIAL_STATS: SolverStats = {
  nodeCount: 0,
  backtrackCount: 0,
  solutionCount: 0,
  executionTimeMs: 0,
  recursiveCalls: 0,
  candidateChecks: 0,
  successfulPlacements: 0,
};

export function useBacktrackingVisualizer(boardSize: number, restricted: boolean[][]) {
  const [state, setState] = useState<VisualizerState>({
    status: 'idle',
    currentEvent: null,
    eventIndex: -1,
    eventHistory: [],
    solutions: [],
    stats: { ...INITIAL_STATS },
    queens: new Array(boardSize).fill(-1),
    exhaustive: false,
    stoppedEarly: false,
  });

  const [animationSpeed, setAnimationSpeed] = useState(50); // ms per step
  const generatorRef = useRef<Generator<SolverEvent, { solutions: Solution[]; events: SolverEvent[]; stats: SolverStats; exhaustive: boolean; stoppedEarly: boolean }, void> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isRunningRef = useRef(false);
  const speedRef = useRef(animationSpeed);
  const solutionsRef = useRef<Solution[]>([]);
  const stoppedRef = useRef(false);

  // Keep speed ref in sync
  useEffect(() => {
    speedRef.current = animationSpeed;
  }, [animationSpeed]);

  // Reset when board config changes
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize]);

  const reset = useCallback(() => {
    // Stop any running animation
    if (animationFrameRef.current !== null) {
      clearTimeout(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    isRunningRef.current = false;
    isPausedRef.current = false;
    stoppedRef.current = false;
    generatorRef.current = null;
    solutionsRef.current = [];

    setState({
      status: 'idle',
      currentEvent: null,
      eventIndex: -1,
      eventHistory: [],
      solutions: [],
      stats: { ...INITIAL_STATS },
      queens: new Array(boardSize).fill(-1),
      exhaustive: false,
      stoppedEarly: false,
    });
  }, [boardSize]);

  const processEvent = useCallback((event: SolverEvent) => {
    setState((prev) => {
      const newHistory = [...prev.eventHistory, event];
      return {
        ...prev,
        currentEvent: event,
        eventIndex: newHistory.length - 1,
        eventHistory: newHistory,
        queens: [...event.queens],
        stats: {
          ...prev.stats,
          nodeCount: event.nodeCount,
          backtrackCount: event.backtrackCount,
          solutionCount: event.solutionCount,
          candidateChecks: event.nodeCount,
          recursiveCalls: prev.stats.recursiveCalls + (event.type === 'row-start' ? 1 : 0),
          successfulPlacements: prev.stats.successfulPlacements + (event.type === 'place' ? 1 : 0),
          executionTimeMs: event.timestamp,
        },
        solutions: solutionsRef.current,
      };
    });
  }, []);

  const runAnimation = useCallback(() => {
    if (!generatorRef.current || !isRunningRef.current || isPausedRef.current || stoppedRef.current) {
      return;
    }

    const result = generatorRef.current.next();

    if (result.done) {
      // Solver finished
      isRunningRef.current = false;
      const finalResult = result.value;

      if (finalResult) {
        solutionsRef.current = finalResult.solutions;
      }

      setState((prev) => ({
        ...prev,
        status: solutionsRef.current.length > 0 ? 'completed' : 'no-solution',
        solutions: solutionsRef.current,
        exhaustive: finalResult?.exhaustive ?? true,
        stoppedEarly: finalResult?.stoppedEarly ?? false,
        stats: {
          ...prev.stats,
          executionTimeMs: finalResult?.stats.executionTimeMs ?? prev.stats.executionTimeMs,
          solutionCount: solutionsRef.current.length,
        },
      }));
      return;
    }

    const event = result.value;

    // Collect solutions
    if (event.type === 'solution') {
      solutionsRef.current = [...solutionsRef.current, [...event.queens]];
    }

    processEvent(event);

    // Schedule next step
    animationFrameRef.current = window.setTimeout(runAnimation, speedRef.current);
  }, [processEvent]);

  const startSolving = useCallback((findAll = false, maxSolutions = 1000) => {
    reset();

    const config: SolverConfig = {
      boardSize,
      restricted: restricted.length === boardSize ? restricted : createEmptyRestricted(boardSize),
      findAll,
      maxSolutions,
    };

    // Use generator for animated solving
    generatorRef.current = solveNQueensGenerator(config);
    isRunningRef.current = true;
    isPausedRef.current = false;
    stoppedRef.current = false;
    solutionsRef.current = [];

    setState((prev) => ({
      ...prev,
      status: 'running',
    }));

    // Start animation loop
    animationFrameRef.current = window.setTimeout(runAnimation, speedRef.current);
  }, [boardSize, restricted, reset, runAnimation]);

  const pause = useCallback(() => {
    if (isRunningRef.current) {
      isPausedRef.current = true;
      if (animationFrameRef.current !== null) {
        clearTimeout(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setState((prev) => ({ ...prev, status: 'paused' }));
    }
  }, []);

  const resume = useCallback(() => {
    if (isPausedRef.current && isRunningRef.current) {
      isPausedRef.current = false;
      setState((prev) => ({ ...prev, status: 'running' }));
      animationFrameRef.current = window.setTimeout(runAnimation, speedRef.current);
    }
  }, [runAnimation]);

  const stepForward = useCallback(() => {
    if (!generatorRef.current) return;

    // If not yet started, initialize
    if (!isRunningRef.current) {
      const config: SolverConfig = {
        boardSize,
        restricted: restricted.length === boardSize ? restricted : createEmptyRestricted(boardSize),
        findAll: false,
        maxSolutions: 1000,
      };
      generatorRef.current = solveNQueensGenerator(config);
      isRunningRef.current = true;
      isPausedRef.current = true;
      stoppedRef.current = false;
      solutionsRef.current = [];
      setState((prev) => ({ ...prev, status: 'paused' }));
    }

    const result = generatorRef.current.next();

    if (result.done) {
      isRunningRef.current = false;
      const finalResult = result.value;
      if (finalResult) {
        solutionsRef.current = finalResult.solutions;
      }
      setState((prev) => ({
        ...prev,
        status: solutionsRef.current.length > 0 ? 'completed' : 'no-solution',
        solutions: solutionsRef.current,
        exhaustive: finalResult?.exhaustive ?? true,
        stoppedEarly: finalResult?.stoppedEarly ?? false,
      }));
      return;
    }

    const event = result.value;
    if (event.type === 'solution') {
      solutionsRef.current = [...solutionsRef.current, [...event.queens]];
    }
    processEvent(event);
  }, [boardSize, restricted, processEvent]);

  const stepBackward = useCallback(() => {
    setState((prev) => {
      if (prev.eventIndex <= 0) return prev;
      const newIndex = prev.eventIndex - 1;
      const event = prev.eventHistory[newIndex];
      return {
        ...prev,
        currentEvent: event,
        eventIndex: newIndex,
        queens: [...event.queens],
        stats: {
          ...prev.stats,
          nodeCount: event.nodeCount,
          backtrackCount: event.backtrackCount,
          solutionCount: event.solutionCount,
        },
      };
    });
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    isRunningRef.current = false;
    isPausedRef.current = false;
    if (animationFrameRef.current !== null) {
      clearTimeout(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    generatorRef.current = null;
    setState((prev) => ({
      ...prev,
      status: 'stopped',
      stoppedEarly: true,
    }));
  }, []);

  const solveInstantly = useCallback((findAll = false, maxSolutions = 1000) => {
    reset();

    const config: SolverConfig = {
      boardSize,
      restricted: restricted.length === boardSize ? restricted : createEmptyRestricted(boardSize),
      findAll,
      maxSolutions,
    };

    const result = solveNQueens(config);

    setState({
      status: result.solutions.length > 0 ? 'completed' : 'no-solution',
      currentEvent: result.events[result.events.length - 1] ?? null,
      eventIndex: result.events.length - 1,
      eventHistory: result.events,
      solutions: result.solutions,
      stats: result.stats,
      queens: result.solutions.length > 0 ? [...result.solutions[0]] : new Array(boardSize).fill(-1),
      exhaustive: result.exhaustive,
      stoppedEarly: result.stoppedEarly,
    });
  }, [boardSize, restricted, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        clearTimeout(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...state,
    animationSpeed,
    setAnimationSpeed,
    startSolving,
    pause,
    resume,
    stepForward,
    stepBackward,
    stop,
    reset,
    solveInstantly,
  };
}
