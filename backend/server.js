const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 8080; // Clever Cloud uses 8080

// Middleware - Allow all origins
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    environment: process.env.NODE_ENV,
    database: 'Clever Cloud MySQL'
  });
});

// Routes
app.use('/api/attendance', attendanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Attendance Tracker API',
    version: '1.0.0',
    status: 'Running',
    environment: process.env.NODE_ENV || 'production',
    database: 'Clever Cloud MySQL',
    deployed: true
  });
});

// Health check for Clever Cloud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    service: 'Attendance Tracker API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    provider: 'Clever Cloud'
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: [
      'GET /', 
      'GET /health', 
      'GET /test', 
      'POST /api/attendance', 
      'GET /api/attendance'
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('🚀 Employee Attendance Tracker API');
  console.log('=================================');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🏢 Provider: Clever Cloud`);
  console.log(`🗄️  Database: MySQL`);
  console.log(`📅 Started: ${new Date().toLocaleString()}`);
  console.log('=================================');
});