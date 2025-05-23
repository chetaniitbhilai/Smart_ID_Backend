import Attendance from '../models/attendance.model.js';
import Course  from '../models/course.model.js';
import mongoose from 'mongoose';

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

export const check_attendance = async (req, res) => {
  try {
    const { coursecode, studentId } = req.body;

    if (!coursecode || !studentId) {
      return res.status(400).json({ error: "coursecode and studentId are required" });
    }

    // 1. Find course _id using coursecode
    const course = await Course.findOne({ coursecode });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseObjectId = course._id;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // 2. Find attendance entries where student was present
    const attendanceRecords = await Attendance.find({
      coursecode: courseObjectId,
      studentId: studentObjectId,
      isHoliday: { $ne: true }
    }).select('date');

    // 3. Extract just the dates
    const presentDates = attendanceRecords.map(record => record.date);

    res.status(200).json({ presentDates });
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const update_attendance = async (req, res) => {
  try {
    const { coursecode, taId, studentId, date } = req.body;

    if (!coursecode || !taId || !studentId || !date) {
      return res.status(400).json({ error: "coursecode, taId, studentId, and date are required" });
    }

    // Find course by coursecode
    const course = await Course.findOne({ coursecode });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if taId is assigned to this course
    if (!course.taId.includes(taId)) {
      return res.status(403).json({ error: "TA not authorized for this course" });
    }

    // Find or create attendance document
    const attendance = await Attendance.findOneAndUpdate(
      {
        coursecode: course._id,
        date: new Date(date)
      },
      {
        $addToSet: { studentId: studentId }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({ message: "Attendance updated", attendance });
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
