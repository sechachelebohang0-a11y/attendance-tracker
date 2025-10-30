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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special validation for employeeName field
    if (name === 'employeeName') {
      // Allow only letters and spaces
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({
        ...formData,
        [name]: lettersOnly
      });
      
      // Clear error when user starts typing
      if (errors.employeeName) {
        setErrors({
          ...errors,
          employeeName: ''
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Employee Name validation
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.employeeName)) {
      newErrors.employeeName = 'Employee name should contain only letters';
    } else if (formData.employeeName.trim().length < 2) {
      newErrors.employeeName = 'Employee name should be at least 2 characters';
    }
    
    // Employee ID validation
    if (!formData.employeeID.trim()) {
      newErrors.employeeID = 'Employee ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting to:', `${API_BASE_URL}/api/attendance`);
      const response = await axios.post(`${API_BASE_URL}/api/attendance`, {
        ...formData,
        employeeName: formData.employeeName.trim() // Trim whitespace before sending
      });
      setMessage('Attendance recorded successfully!');
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });

      // Clear errors
      setErrors({});

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
            placeholder="Enter employee name (letters only)"
            className={errors.employeeName ? 'error' : ''}
          />
          {errors.employeeName && (
            <div className="field-error">{errors.employeeName}</div>
          )}
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
            className={errors.employeeID ? 'error' : ''}
          />
          {errors.employeeID && (
            <div className="field-error">{errors.employeeID}</div>
          )}
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