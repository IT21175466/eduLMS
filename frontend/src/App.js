import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseList from './components/CourseList';
import AssignmentList from './components/AssignmentList';
import Calculate from './components/Calculate';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header with App name */}
        <header className="app-header">
          <h1>EduCalc LMS</h1>
          <nav>
            <ul>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/assignments">Assignments</Link></li>
              <li><Link to="/calculate">Calculate</Link></li>
            </ul>
          </nav>
        </header>

        <div className="content">
          {/* Routes */}
          <Routes>
            <Route path="/courses" element={<CourseList />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/calculate" element={<Calculate />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
