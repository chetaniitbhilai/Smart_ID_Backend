import mongoose from "mongoose";
import express, { response } from 'express'

// models/Course.js
const complainSchema = new mongoose.Schema({
  coursecode: { type: mongoose.Schema.Types.ObjectId, ref: 'courses' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  taId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  complain: String,
  status: Boolean,
  response: String,
  date: { type: mongoose.Schema.Types.ObjectId, ref: 'attendance' }
});


const Complain = mongoose.model("complains", complainSchema); 
  
export default Complain;