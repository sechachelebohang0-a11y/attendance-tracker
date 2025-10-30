import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      console.log('Fetching from:', `${API_BASE_URL}/api/attendance`);
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      setAttendance(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching attendance:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.error || 'Failed to load records'}`);
      } else if (error.request) {
        setError('Network error: Cannot connect to server');
      } else {
        setError('Error: Failed to load attendance records');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="attendance-dashboard">
      <h2>Attendance Records</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading attendance records...</div>
      ) : attendance.length === 0 ? (
        <div className="no-records">No attendance records found.</div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className={record.status.toLowerCase()}>
                  <td>{record.employeeName}</td>
                  <td>{record.employeeID}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;