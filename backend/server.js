const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 8080; // Clever Cloud uses 8080

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/attendance', attendanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Attendance Tracker API',
    version: '1.0.0',
    status: 'Running',
    environment: process.env.NODE_ENV || 'production',
    database: 'Clever Cloud MySQL'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});