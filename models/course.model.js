import mongoose from "mongoose";
import express from 'express'

// models/Course.js
const courseSchema = new mongoose.Schema({
  course: { type: String, required: true, unique: true },
  coursecode: { type: String, required: true, unique: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: String,
  semester: String,
  studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  taId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  slots: Array
});


const Course = mongoose.model("courses", courseSchema); 
  
export default Course;