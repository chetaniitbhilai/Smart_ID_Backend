import Complain from '../models/complain.model.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';

export const add_complain = async (req, res) => {
  try {
    const { coursecode, studentId, taName, complain, status, response, date } = req.body;

    // Validate that the course code exists
    const course = await Course.findOne({ coursecode: coursecode });
    if (!course) {
      return res.status(400).json({ error: "Invalid course code" });
    }

    // Validate that the TA name exists (if provided)
    if (taName && taName.trim() !== '') {
      const ta = await User.findOne({ name: taName, role: 'ta' });
      if (!ta) {
        return res.status(400).json({ error: "Invalid TA name" });
      }
    }

    const newComplain = new Complain({
      coursecode,
      studentId,
      taName: taName || '',
      complain,
      status,
      response,
      date
    });

    console.log('add_complain - saving complaint with taName:', taName || '');
    await newComplain.save();
    console.log('add_complain - complaint saved successfully');

    res.status(201).json({ message: "Complain submitted successfully" });
  } catch (error) {
    console.error("Error submitting complain:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const get_complain = async (req, res) => {
  try {
    const { taName } = req.query;
    console.log('get_complain - taName from query:', taName);

    if (!taName) {
      return res.status(400).json({ error: "taName query parameter is required" });
    }

    const complaints = await Complain.find({ taName: taName })
      .populate('studentId', 'name email') // Populate student details
      .populate('date', 'date'); // Populate attendance date

    console.log('get_complain - found complaints:', complaints.length);
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints for TA:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const resolve_complain = async (req, res) => {
  try {
    const { complainId, response: taResponse, status } = req.body;

    if (!complainId || typeof status !== "boolean" || !taResponse) {
      return res.status(400).json({ error: "complainId, status, and response are required" });
    }

    const updatedComplain = await Complain.findByIdAndUpdate(
      complainId,
      {
        response: taResponse,
        status: status
      },
      { new: true }
    );

    if (!updatedComplain) {
      return res.status(404).json({ error: "Complain not found" });
    }

    res.status(200).json({ message: "Complain resolved successfully", updatedComplain });
  } catch (error) {
    console.error("Error resolving complain:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
