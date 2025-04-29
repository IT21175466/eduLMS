// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CourseList from './components/CourseList';
import AssignmentList from './components/AssignmentList';
import Calculate from './components/Calculate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/calculate" element={<Calculate />} />
      </Routes>
    </Router>
  );
}

export default App;
