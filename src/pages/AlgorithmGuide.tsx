import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';
import AlgorithmPanel from '../components/AlgorithmPanel';

const AlgorithmGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-950 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Crown size={22} className="text-violet-400" fill="currentColor" strokeWidth={1} />
            <span className="text-lg font-bold gradient-text">Algorithm Guide</span>
          </div>
        </div>

        <AlgorithmPanel />
      </div>
    </div>
  );
};

export default AlgorithmGuide;
