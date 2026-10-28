import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Play,
  GitBranch,
  Shield,
  BarChart3,
  Cpu,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.header
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 badge badge-violet"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Cpu size={12} />
            DAA Algorithm Lab
          </motion.div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              <Crown size={44} className="text-violet-400" fill="currentColor" strokeWidth={1} />
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-bold gradient-text tracking-tight">
              QUEENFORGE
            </h1>
          </div>

          <p className="text-lg text-slate-400 font-medium">
            Restricted Board — Complete the Queen Placement
          </p>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            An interactive algorithm visualization platform that solves the N-Queens problem on a
            chessboard containing restricted cells. Place N queens such that no two share a row,
            column, or diagonal — while avoiding blocked squares.
          </p>

          {/* CTA */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              className="btn-primary text-base px-8 py-3"
              onClick={() => navigate('/visualizer')}
            >
              <Play size={18} />
              Start Visualizer
              <ArrowRight size={16} />
            </button>
            <button
              className="btn-secondary text-base px-6 py-3"
              onClick={() => navigate('/algorithm')}
            >
              <BookOpen size={16} />
              Learn Algorithm
            </button>
          </motion.div>
        </motion.header>

        {/* Feature cards */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          {...fadeIn}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          <motion.div
            className="glass-card glass-card-hover p-6 space-y-3 transition-all duration-300"
            {...fadeIn}
            transition={{ delay: 0.5 }}
          >
            <div className="p-3 rounded-xl bg-violet-500/10 w-fit">
              <GitBranch size={24} className="text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Backtracking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Watch the genuine recursive backtracking algorithm explore the solution space
              step by step, placing and removing queens as it searches.
            </p>
            <span className="badge badge-violet">Core Algorithm</span>
          </motion.div>

          <motion.div
            className="glass-card glass-card-hover p-6 space-y-3 transition-all duration-300"
            {...fadeIn}
            transition={{ delay: 0.6 }}
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 w-fit">
              <Shield size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Conflict Detection</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              O(1) conflict checks using column and diagonal occupancy sets.
              See conflicts and safe positions highlighted in real time.
            </p>
            <span className="badge badge-cyan">O(1) Checks</span>
          </motion.div>

          <motion.div
            className="glass-card glass-card-hover p-6 space-y-3 transition-all duration-300"
            {...fadeIn}
            transition={{ delay: 0.7 }}
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 w-fit">
              <BarChart3 size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Complexity Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time statistics and theoretical complexity comparison.
              Track nodes explored, backtracks, and execution time.
            </p>
            <span className="badge badge-emerald">O(N!) Analysis</span>
          </motion.div>
        </motion.section>

        {/* Algorithm info card */}
        <motion.section
          className="glass-card p-8 mb-16"
          {...fadeIn}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10 shrink-0">
              <Sparkles size={24} className="text-violet-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-200">
                N-Queens with Restricted Squares
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                The classic N-Queens problem asks you to place N chess queens on an N×N board
                so that no two queens threaten each other. Our variant adds <strong className="text-rose-400">restricted cells</strong> —
                positions where queens cannot be placed, but which don't block attack lines.
                This transforms the problem into a more challenging constraint-satisfaction puzzle
                where some configurations may have no solution at all.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="badge badge-violet">Backtracking</span>
                <span className="badge badge-cyan">Constraint Satisfaction</span>
                <span className="badge badge-rose">Restricted Squares</span>
                <span className="badge badge-amber">NP-Hard Class</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick nav */}
        <motion.section
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          {...fadeIn}
          transition={{ delay: 0.9 }}
        >
          {[
            { label: 'Visualizer', icon: Play, path: '/visualizer', color: 'text-violet-400' },
            { label: 'Algorithm', icon: BookOpen, path: '/algorithm', color: 'text-cyan-400' },
            { label: 'Analysis', icon: BarChart3, path: '/analysis', color: 'text-emerald-400' },
            { label: 'Presets', icon: Layers, path: '/presets', color: 'text-amber-400' },
          ].map((item) => (
            <motion.button
              key={item.path}
              className="glass-card glass-card-hover p-4 flex items-center gap-3 transition-all duration-300 text-left"
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} className={item.color} />
              <span className="text-sm font-medium text-slate-300">{item.label}</span>
              <ArrowRight size={14} className="text-slate-500 ml-auto" />
            </motion.button>
          ))}
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="text-center mt-16 pt-8 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-slate-600">
            QUEENFORGE — Design & Analysis of Algorithms • Backtracking Visualization Platform
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Dashboard;
