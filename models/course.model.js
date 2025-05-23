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
  slots: Array
});


const Course = mongoose.model("courses", courseSchema); 
  
export default Course;