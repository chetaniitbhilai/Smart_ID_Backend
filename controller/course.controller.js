import Course from '../models/course.model.js';
import User from '../models/user.model.js';

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


export const get_courses = async (req, res) => {
  try {
    const studentId = req.query.userId;


    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    // Find courses where studentId matches
    const courses = await Course.find({ studentId: studentId })
      .populate('professorId', 'name') // only get professor name
      .populate('taId', 'name');       // get TA names

    // Transform response to include only required fields
    const result = courses.map(course => ({
      courseName: course.course,
      courseCode: course.coursecode,
      professorName: course.professorId?.name || null,
      taNames: course.taId?.map(ta => ta.name) || []
    }));

    res.status(200).json(result);

  } catch (error) {
    console.log("Error fetching student courses:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
