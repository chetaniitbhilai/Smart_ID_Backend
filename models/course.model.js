import mongoose from "mongoose";
import express from 'express'

// models/Course.js
const courseSchema = new mongoose.Schema({
  course: { type: String, required: true, unique: true },
  coursecode: { type: String, required: true, unique: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  department: String,
  semester: String,
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  taId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  // Slots now structured as day + start/end times
  slots: [{
    day: { type: String, enum: ['sun','mon','tue','wed','thu','fri','sat'], required: true },
    start: { type: String, required: true }, // e.g., "10:00"
    end: { type: String, required: true }    // e.g., "11:00"
  }]
});


const Course = mongoose.model("courses", courseSchema); 
  
export default Course;