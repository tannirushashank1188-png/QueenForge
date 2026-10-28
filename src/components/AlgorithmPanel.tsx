import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, ArrowRight } from 'lucide-react';

const AlgorithmPanel: React.FC = () => {
  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
        <BookOpen size={18} className="text-violet-400" />
        Algorithm Explanation
      </h3>

      {/* What is backtracking? */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">What is Backtracking?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          Backtracking is a systematic approach to solving constraint-satisfaction problems.
          It builds a solution incrementally, one piece at a time, and abandons ("backtracks") a
          partial candidate as soon as it determines that the candidate cannot be completed to
          a valid solution.
        </p>
      </section>

      {/* Why is N-Queens a CSP? */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">Why is N-Queens a Constraint-Satisfaction Problem?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          The N-Queens problem requires placing N queens on an N×N board subject to multiple constraints:
          one queen per row, one per column, and no two on the same diagonal.
          With restricted squares, there's an additional spatial constraint — certain cells are forbidden.
          The search must satisfy all constraints simultaneously.
        </p>
      </section>

      {/* How are safe positions checked? */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">How Are Safe Positions Checked?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          We use three occupancy sets for O(1) conflict detection:
        </p>
        <ul className="text-sm text-slate-400 space-y-1 ml-4">
          <li className="flex items-start gap-2">
            <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
            <span><strong className="text-slate-300">Column set:</strong> Tracks which columns already have queens.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
            <span><strong className="text-slate-300">Main diagonal set:</strong> Uses (row − col) to identify diagonals.</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={12} className="text-violet-400 mt-1 shrink-0" />
            <span><strong className="text-slate-300">Anti-diagonal set:</strong> Uses (row + col) to identify anti-diagonals.</span>
          </li>
        </ul>
      </section>

      {/* Why reject restricted cells? */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">Why Do We Reject Restricted Cells?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          Restricted cells are positions where queens cannot be placed — like blocked squares.
          However, they don't block attack lines: a queen can still attack through a restricted cell
          along a row, column, or diagonal. The solver simply skips restricted cells when trying placements.
        </p>
      </section>

      {/* What causes backtracking? */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">What Causes Backtracking?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          Backtracking occurs when no valid column exists in the current row — every column is either
          restricted, attacked by an existing queen, or already occupied. The solver removes the most
          recently placed queen and tries the next available column in the previous row.
        </p>
      </section>

      {/* How recursion works */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">How Does Recursion Work Here?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          The solver processes one row at a time. For each row, it tries each column sequentially.
          When a safe position is found, it places a queen and recursively calls itself for the next row.
          If the recursive call fails (returns without finding a solution), the queen is removed and the
          next column is tried. This depth-first traversal naturally explores the solution space.
        </p>
      </section>

      {/* Pseudocode */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
          <Code size={14} />
          Pseudocode
        </h4>
        <div className="pseudocode p-4 rounded-xl bg-navy-950/80 border border-white/5 overflow-x-auto">
          <div className="text-violet-400">{'function'} <span className="text-cyan-300">solve</span>(<span className="text-amber-300">row</span>):</div>
          <div className="text-slate-400 ml-4">
            <span className="text-violet-400">if</span> row == N:
          </div>
          <div className="text-emerald-400 ml-8">record solution</div>
          <div className="text-violet-400 ml-8">return</div>
          <div className="mt-2" />
          <div className="text-slate-400 ml-4">
            <span className="text-violet-400">for</span> col <span className="text-violet-400">from</span> 0 <span className="text-violet-400">to</span> N - 1:
          </div>
          <div className="text-slate-400 ml-8">
            <span className="text-violet-400">if</span> cell(row, col) <span className="text-violet-400">is</span> <span className="text-rose-400">restricted</span>:
          </div>
          <div className="text-slate-500 ml-12">continue</div>
          <div className="mt-1" />
          <div className="text-slate-400 ml-8">
            <span className="text-violet-400">if</span> <span className="text-cyan-300">isSafe</span>(row, col):
          </div>
          <div className="text-emerald-400 ml-12">placeQueen(row, col)</div>
          <div className="text-cyan-300 ml-12">solve(row + 1)</div>
          <div className="text-amber-400 ml-12">removeQueen(row, col)</div>
        </div>
      </section>

      {/* Step-by-step explanation */}
      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-cyan-400">Step-by-Step Explanation</h4>
        <div className="space-y-2 text-sm">
          {[
            { code: 'if row == N', desc: 'All rows processed — a valid arrangement is found. Record it.' },
            { code: 'for col from 0 to N-1', desc: 'Try every column in the current row, left to right.' },
            { code: 'if cell is restricted', desc: 'Skip cells marked as restricted — queens cannot go there.' },
            { code: 'if isSafe(row, col)', desc: 'Check column, diagonal, and anti-diagonal occupancy in O(1).' },
            { code: 'placeQueen(row, col)', desc: 'Place the queen and update occupancy sets.' },
            { code: 'solve(row + 1)', desc: 'Recurse to the next row to place the next queen.' },
            { code: 'removeQueen(row, col)', desc: 'Undo the placement (backtrack) and try the next column.' },
          ].map((step, i) => (
            <div key={i} className="flex gap-3 p-2 rounded-lg bg-white/[0.02]">
              <code className="text-xs text-violet-300 bg-violet-500/10 px-2 py-1 rounded shrink-0 self-start font-mono">
                {step.code}
              </code>
              <span className="text-slate-400">{step.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default AlgorithmPanel;
