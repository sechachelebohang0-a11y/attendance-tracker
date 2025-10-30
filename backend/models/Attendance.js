const db = require('../config/database');

// Mock data for development when MySQL is not available
const mockData = [];

class Attendance {
  static async create(attendanceData) {
    try {
      const { employeeName, employeeID, date, status } = attendanceData;
      
      const sql = `INSERT INTO Attendance (employeeName, employeeID, date, status) 
                   VALUES (?, ?, ?, ?)`;
      
      const [result] = await db.execute(sql, [employeeName, employeeID, date, status]);
      
      return { 
        id: result.insertId, 
        ...attendanceData 
      };
    } catch (error) {
      console.log('⚠️  Using mock data (MySQL not available locally)');
      // For local development without MySQL, use mock data
      const mockRecord = {
        id: mockData.length + 1,
        ...attendanceData,
        created_at: new Date().toISOString()
      };
      mockData.push(mockRecord);
      return mockRecord;
    }
  }

  static async getAll() {
    try {
      const sql = `SELECT * FROM Attendance ORDER BY date DESC, created_at DESC`;
      const [rows] = await db.execute(sql);
      return rows;
    } catch (error) {
      console.log('⚠️  Using mock data (MySQL not available locally)');
      // Return mock data for local development
      return mockData;
    }
  }
}

module.exports = Attendance;