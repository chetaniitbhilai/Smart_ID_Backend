import Course from '../models/course.model.js';

export const add_course = async (req, res) => {
  try {
    const {
      course,
      coursecode,
      professorId,
      department,
      semester,
      studentId,
      taId,
      slots
    } = req.body;

    // Optional: Validate required fields
    if (!course || !coursecode || !professorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the course or coursecode already exists
    const existingCourse = await Course.findOne({
      $or: [{ course }, { coursecode }]
    });

    if (existingCourse) {
      return res.status(409).json({ message: "Course or course code already exists" });
    }

    const newCourse = new Course({
      course,
      coursecode,
      professorId,
      department,
      semester,
      studentId,
      taId,
      slots
    });

    await newCourse.save();
    console.log("Course added:", newCourse);

    res.status(201).json({
      message: "Course successfully added",
      course: newCourse
    });

  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
