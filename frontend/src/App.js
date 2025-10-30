import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './styles/App.css';

// Always use the Clever Cloud URL - no localhost fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);

function App() {
  // Set dashboard as the default page (currentPage = 'dashboard')
  const [currentPage, setCurrentPage] = useState('dashboard');
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
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 View Dashboard
          </button>
          <button 
            className={currentPage === 'form' ? 'active' : ''}
            onClick={() => setCurrentPage('form')}
          >
            ✅ Mark Attendance
          </button>
        </nav>
      </header>

      <main className="app-main">
        {/* Show Dashboard by default */}
        {currentPage === 'dashboard' && (
          <AttendanceDashboard key={refreshKey} />
        )}
        {currentPage === 'form' && (
          <AttendanceForm onAttendanceAdded={handleAttendanceAdded} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Employee Attendance Tracker. All rights reserved.</p>
          <div className="footer-links">
            <span>HR System v1.0</span>
            <span>|</span>
            <span>Deployed on Clever Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;