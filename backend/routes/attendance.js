const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST - Add new attendance record
router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    const { employeeName, employeeID, date, status } = req.body;
    
    // Validation
    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({ 
        error: 'All fields are required',
        received: { employeeName, employeeID, date, status }
      });
    }
    
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Present or Absent' });
    }

    const attendance = await Attendance.create({
      employeeName: employeeName.trim(),
      employeeID: employeeID.trim(),
      date,
      status
    });
    
    console.log('Attendance recorded:', attendance);
    
    res.status(201).json({ 
      message: 'Attendance recorded successfully', 
      data: attendance 
    });
  } catch (error) {
    console.error('❌ Error creating attendance:', error);
    res.status(500).json({ 
      error: 'Failed to record attendance',
      details: error.message 
    });
  }
});

// GET - Retrieve all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.getAll();
    res.json(attendance);
  } catch (error) {
    console.error('❌ Error fetching attendance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch attendance records',
      details: error.message 
    });
  }
});

module.exports = router;