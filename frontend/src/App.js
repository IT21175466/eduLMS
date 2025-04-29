import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseList from './components/CourseList';
import AssignmentList from './components/AssignmentList';
import Calculate from './components/Calculate';
import Login from './components/Login';
import './App.css';
import Register from './components/Register';

function App() {

  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '/register') {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app">
        {/* Conditionally render the header based on current pathname */}
        {showHeader && (
          <header className="app-header">
            <h1>Edu LMS</h1>
            <nav>
              <ul>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/assignments">Assignments</Link></li>
                <li><Link to="/calculate">Calculate</Link></li>
              </ul>
            </nav>
            {/* Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </header>
        )}

        <div className="content">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
