import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Play,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Maximize,
} from 'lucide-react';
import ChessBoard from '../components/ChessBoard';
import { solveNQueens, createEmptyRestricted } from '../algorithms/nQueensSolver';
import { PRESETS, presetToRestricted } from '../utils/presets';
import type { SolverStats, SolverEvent } from '../algorithms/solverTypes';

const INITIAL_STATS: SolverStats = {
  nodeCount: 0,
  backtrackCount: 0,
  solutionCount: 0,
  executionTimeMs: 0,
  recursiveCalls: 0,
  candidateChecks: 0,
  successfulPlacements: 0,
};

interface Slide {
  title: string;
  content: React.ReactNode;
}

const PresentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [demoRan, setDemoRan] = useState(false);
  const [demoStats, setDemoStats] = useState<SolverStats>(INITIAL_STATS);
  const [demoQueens, setDemoQueens] = useState<number[]>(new Array(8).fill(-1));
  const [demoRestricted, setDemoRestricted] = useState<boolean[][]>(createEmptyRestricted(8));
  const [demoEvent] = useState<SolverEvent | null>(null);

  const runDemo = useCallback(() => {
    // Use the classic 8-queens preset for a deterministic demo
    const preset = PRESETS.find((p) => p.id === 'classic-8')!;
    const restricted = presetToRestricted(preset);
    setDemoRestricted(restricted);

    const result = solveNQueens({
      boardSize: 8,
      restricted,
      findAll: false,
      maxSolutions: 1,
    });

    setDemoStats(result.stats);
    if (result.solutions.length > 0) {
      setDemoQueens([...result.solutions[0]]);
    }
    setDemoRan(true);
  }, []);

  const slides: Slide[] = [
    // Slide 1: Title
    {
      title: 'Problem Statement',
      content: (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown size={48} className="text-violet-400" fill="currentColor" strokeWidth={1} />
            <h1 className="text-5xl font-bold gradient-text">QUEENFORGE</h1>
          </div>
          <p className="text-xl text-slate-300 font-medium">
            Restricted Board — Complete the Queen Placement
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="badge badge-violet">DAA</span>
            <span className="badge badge-cyan">Backtracking</span>
            <span className="badge badge-rose">N-Queens</span>
            <span className="badge badge-emerald">Constraint Satisfaction</span>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed mt-6">
            Place N queens on an N×N chessboard with restricted cells such that no two queens
            share a row, column, or diagonal — and no queen occupies a restricted cell.
          </p>
        </div>
      ),
    },
    // Slide 2: Input Configuration
    {
      title: 'Input Configuration',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Input & Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-base font-semibold text-violet-400">Input Parameters</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
                  <span><strong className="text-slate-300">N:</strong> Board size (4 to 12)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
                  <span><strong className="text-slate-300">Restricted cells:</strong> Set of (row, col) pairs where queens cannot be placed</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
                  <span><strong className="text-slate-300">Mode:</strong> Find first solution or all solutions</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-base font-semibold text-cyan-400">Constraints</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✅ Exactly one queen per row</li>
                <li>✅ No two queens share a column</li>
                <li>✅ No two queens share a diagonal</li>
                <li>🔒 No queen on a restricted cell</li>
                <li>⚠️ Restricted cells don't block attack lines</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 3: Algorithm Steps
    {
      title: 'Algorithm Steps',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Backtracking Algorithm</h2>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Start at row 0', detail: 'Process one row at a time, top to bottom.' },
              { step: '2', text: 'Try each column', detail: 'For the current row, iterate columns 0 to N−1.' },
              { step: '3', text: 'Skip restricted cells', detail: 'If cell is restricted, move to next column.' },
              { step: '4', text: 'Check safety', detail: 'Verify no conflict using column and diagonal occupancy sets (O(1)).' },
              { step: '5', text: 'Place queen', detail: 'If safe, place queen and update occupancy sets.' },
              { step: '6', text: 'Recurse', detail: 'Move to next row and repeat.' },
              { step: '7', text: 'Backtrack', detail: 'If no valid column exists, remove last queen and try next column in previous row.' },
              { step: '8', text: 'Solution found', detail: 'When row == N, all queens placed successfully.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Number(item.step) * 0.08 }}
              >
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400 shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{item.text}</div>
                  <div className="text-xs text-slate-400">{item.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    // Slide 4: Live Demo Result
    {
      title: 'Demo Result',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Live Demo — 8-Queens</h2>

          {!demoRan ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-400">
                Click the button below to run the solver on a classic 8×8 board.
              </p>
              <button className="btn-primary text-base px-8 py-3" onClick={runDemo}>
                <Play size={18} />
                Run Demo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <ChessBoard
                size={8}
                restricted={demoRestricted}
                queens={demoQueens}
                currentEvent={demoEvent}
                onCellClick={() => {}}
                isInteractive={false}
              />
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="glass-card p-3 text-center">
                  <div className="text-xs text-slate-400">Nodes</div>
                  <div className="text-lg font-bold text-violet-400 font-mono">
                    {demoStats.nodeCount.toLocaleString()}
                  </div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-xs text-slate-400">Backtracks</div>
                  <div className="text-lg font-bold text-rose-400 font-mono">
                    {demoStats.backtrackCount.toLocaleString()}
                  </div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-xs text-slate-400">Time</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {demoStats.executionTimeMs.toFixed(2)}ms
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    // Slide 5: Complexity Analysis
    {
      title: 'Complexity',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Complexity Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-violet-400">Time Complexity</h3>
              <div className="text-3xl font-bold text-slate-200 font-mono">O(N!)</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upper-bound for row-by-row placement. Column and diagonal conflict checks are O(1)
                using occupancy sets. Restrictions and pruning reduce actual work significantly.
              </p>
            </div>
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Space Complexity</h3>
              <div className="text-3xl font-bold text-slate-200 font-mono">O(N)</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Recursive call stack depth is N. Occupancy sets use O(N) space.
                Solution storage is O(K×N) for K solutions. Event history uses additional
                memory proportional to recorded events.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 6: Key Learnings
    {
      title: 'Key Learnings',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Key Learnings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Backtracking is powerful', desc: 'Systematically explores and prunes the solution space without exhaustive enumeration.' },
              { title: 'Constraint propagation', desc: 'Occupancy sets provide O(1) conflict detection, avoiding redundant row/column scans.' },
              { title: 'Restrictions add complexity', desc: 'Blocked cells can eliminate solutions entirely, requiring the solver to verify reachability.' },
              { title: 'Visualization aids understanding', desc: 'Watching the algorithm step-by-step builds intuition about recursion and backtracking.' },
              { title: 'Not all configurations are solvable', desc: 'The solver must correctly report when no valid arrangement exists.' },
              { title: 'Event-driven architecture', desc: 'Generator-based execution allows pausing, stepping, and resuming without blocking the UI.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="glass-card p-4 space-y-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="text-sm font-semibold text-emerald-400">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide, navigate]);

  return (
    <div className="min-h-screen bg-navy-950 relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={14} />
            Exit
          </button>
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-slate-300">Presentation Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button
            className="btn-secondary text-xs"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
          >
            <Maximize size={12} />
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-t border-white/5">
        <button
          className="btn-secondary"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide
                  ? 'bg-violet-400 w-6'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              onClick={() => setCurrentSlide(i)}
              title={slide.title}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={nextSlide}
          disabled={currentSlide >= totalSlides - 1}
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default PresentationPage;
