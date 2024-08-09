import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TimeToProductivityDashboard from './TimeToProductivityDashboard';

const App: React.FC = () => {
  return (
    <Router basename="/time-to-productivity-dashboard">
      <Routes>
        <Route path="/" element={<TimeToProductivityDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
