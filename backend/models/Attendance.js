const db = require('../config/database');

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
      console.error('Database Error:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const sql = `SELECT * FROM Attendance ORDER BY date DESC, created_at DESC`;
      const [rows] = await db.execute(sql);
      return rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw error;
    }
  }
}

module.exports = Attendance;