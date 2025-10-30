import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './styles/App.css';

// Dynamic API URL for both development and production
const getApiBaseUrl = () => {
  // If we're in development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }
  // In production, use the Railway backend URL
  return process.env.REACT_APP_API_URL || window.location.origin.replace('3000', '5000');
};

export const API_BASE_URL = getApiBaseUrl();

console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAttendanceAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Employee Attendance Tracker</h1>
        <nav className="nav-tabs">
          <button 
            className={currentPage === 'form' ? 'active' : ''}
            onClick={() => setCurrentPage('form')}
          >
            Mark Attendance
          </button>
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            View Records
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === 'form' && (
          <AttendanceForm onAttendanceAdded={handleAttendanceAdded} />
        )}
        {currentPage === 'dashboard' && (
          <AttendanceDashboard key={refreshKey} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Employee Attendance Tracker. All rights reserved.</p>
          <div className="footer-links">
            <span>HR System v1.0</span>
            <span>|</span>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;