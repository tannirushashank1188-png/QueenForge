import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import AlgorithmGuide from './pages/AlgorithmGuide';
import AnalysisPage from './pages/AnalysisPage';
import PresetsPage from './pages/PresetsPage';
import PresentationPage from './pages/PresentationPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/algorithm" element={<AlgorithmGuide />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/presets" element={<PresetsPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
