import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  coursecode: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' },
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  date: Date,
  isHoliday: Boolean,
});


const Attendance = mongoose.model("attendance", attendanceSchema); 
  
export default Attendance;