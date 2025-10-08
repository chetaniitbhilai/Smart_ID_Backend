import Attendance from '../models/attendance.model.js';
import Course  from '../models/course.model.js';
import mongoose from 'mongoose';

export const add_attendance = async (req, res) => {
  try {
    const { coursecode, studentId, date, isHoliday } = req.body;

    if (!coursecode || !date) {
      return res.status(400).json({ message: "coursecode and date are required" });
    }

    // Find course by coursecode to get the ObjectId
    const course = await Course.findOne({ coursecode });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseObjectId = course._id;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Check if attendance record already exists for this date and course
    let attendance = await Attendance.findOne({
      coursecode: courseObjectId,
      date: new Date(date)
    });

    if (attendance) {
      // If attendance record exists, add student to the list if not already present
      if (!attendance.studentId.includes(studentObjectId)) {
        attendance.studentId.push(studentObjectId);
        await attendance.save();
      }
    } else {
      // Create new attendance record
      attendance = new Attendance({
        coursecode: courseObjectId,
        studentId: [studentObjectId],
        date: new Date(date),
        isHoliday: isHoliday || false
      });
      await attendance.save();
    }

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance: attendance
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

    if (!coursecode || !studentId || !date) {
      return res.status(400).json({ error: "coursecode, studentId, and date are required" });
    }

    // Find course by coursecode
    const course = await Course.findOne({ coursecode });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseObjectId = course._id;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // If taId is provided, check authorization
    if (taId && course.taId && course.taId.length > 0) {
      const taObjectId = new mongoose.Types.ObjectId(taId);
      if (!course.taId.includes(taObjectId)) {
        return res.status(403).json({ error: "TA not authorized for this course" });
      }
    }

    // Find existing attendance record for this date and course
    let attendance = await Attendance.findOne({
      coursecode: courseObjectId,
      date: new Date(date)
    });

    if (attendance) {
      // Remove student from attendance (mark as absent)
      attendance.studentId = attendance.studentId.filter(
        id => !id.equals(studentObjectId)
      );
      await attendance.save();
    } else {
      // Create new attendance record with empty student list (for absent students)
      attendance = new Attendance({
        coursecode: courseObjectId,
        studentId: [],
        date: new Date(date),
        isHoliday: false
      });
      await attendance.save();
    }

    res.status(200).json({ message: "Attendance updated", attendance });
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const bulk_attendance = async (req, res) => {
  try {
    const { coursecode, studentIds, date, isHoliday } = req.body;

    if (!coursecode || !studentIds || !date) {
      return res.status(400).json({ error: "coursecode, studentIds, and date are required" });
    }

    // Find course by coursecode to get the ObjectId
    const course = await Course.findOne({ coursecode });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseObjectId = course._id;
    const studentObjectIds = studentIds.map(id => new mongoose.Types.ObjectId(id));

    // Check if attendance record already exists for this date and course
    let attendance = await Attendance.findOne({
      coursecode: courseObjectId,
      date: new Date(date)
    });

    if (attendance) {
      // If attendance record exists, add all students to the list
      const existingStudentIds = attendance.studentId.map(id => id.toString());
      const newStudentIds = studentObjectIds.filter(id => !existingStudentIds.includes(id.toString()));
      
      if (newStudentIds.length > 0) {
        attendance.studentId.push(...newStudentIds);
        await attendance.save();
      }
    } else {
      // Create new attendance record with all students
      attendance = new Attendance({
        coursecode: courseObjectId,
        studentId: studentObjectIds,
        date: new Date(date),
        isHoliday: isHoliday || false
      });
      await attendance.save();
    }

    res.status(201).json({
      message: "Bulk attendance recorded successfully",
      attendance: attendance,
      studentsMarked: studentObjectIds.length
    });
  } catch (error) {
    console.error("Error recording bulk attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
