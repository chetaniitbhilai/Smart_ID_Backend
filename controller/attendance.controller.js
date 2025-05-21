import Attendance from '../models/attendance.model.js';

export const add_attendance = async (req, res) => {
  try {
    const { coursecode, studentId, date, isHoliday } = req.body;

    if (!coursecode || !date) {
      return res.status(400).json({ message: "coursecode and date are required" });
    }

    const newAttendance = new Attendance({
      coursecode,
      studentId,
      date: new Date(date),
      isHoliday: isHoliday || false
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance: newAttendance
    });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
