import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting to:', `${API_BASE_URL}/api/attendance`);
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, formData);
      setMessage('Attendance recorded successfully!');
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });

      // Notify parent to refresh dashboard
      if (onAttendanceAdded) {
        onAttendanceAdded();
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      if (error.response) {
        setMessage(`Error: ${error.response.data.error || 'Failed to record attendance'}`);
      } else if (error.request) {
        setMessage('Network error: Cannot connect to server. Please check if backend is running.');
      } else {
        setMessage('Error: Failed to record attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form">
      <h2>Mark Attendance</h2>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name *</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            placeholder="Enter employee name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeID">Employee ID *</label>
          <input
            type="text"
            id="employeeID"
            name="employeeID"
            value={formData.employeeID}
            onChange={handleChange}
            required
            placeholder="Enter employee ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Recording...' : 'Record Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;