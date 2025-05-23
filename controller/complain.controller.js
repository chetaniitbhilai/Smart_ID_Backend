import Complain from '../models/complain.model.js';

export const add_complain = async (req, res) => {
  try {
    const { coursecode, studentId, taId, complain, status, response, date } = req.body;

    const newComplain = new Complain({
      coursecode,
      studentId,
      taId,
      complain,
      status,
      response,
      date
    });

    await newComplain.save();

    res.status(201).json({ message: "Complain submitted successfully" });
  } catch (error) {
    console.error("Error submitting complain:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const get_complain = async (req, res) => {
  try {
    const { taId } = req.body;

    if (!taId) {
      return res.status(400).json({ error: "taId query parameter is required" });
    }

    const complaints = await Complain.find({ taId: taId })
      .populate('studentId', 'name email') // Populate student details
      .populate('coursecode', 'course coursecode') // Populate course details
      .populate('date', 'date'); // Populate attendance date

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
