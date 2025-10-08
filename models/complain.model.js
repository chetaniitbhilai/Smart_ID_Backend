import mongoose from "mongoose";
import express, { response } from 'express'

// models/Course.js
const complainSchema = new mongoose.Schema({
  coursecode: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  taName: { type: String, default: '' },
  complain: String,
  status: Boolean,
  response: String,
  date: { type: mongoose.Schema.Types.ObjectId, ref: 'attendance' }
});


const Complain = mongoose.model("complains", complainSchema); 
  
export default Complain;