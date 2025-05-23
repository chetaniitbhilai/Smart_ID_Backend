/**
 * @swagger
 * /course/add_course:
 *   post:
 *     summary: Add a new course
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - coursecode
 *               - professorId
 *             properties:
 *               course:
 *                 type: string
 *                 example: Data Structures
 *               coursecode:
 *                 type: string
 *                 example: CS201
 *               professorId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439011
 *               department:
 *                 type: string
 *                 example: Computer Science
 *               semester:
 *                 type: string
 *                 example: Fall 2025
 *               studentId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f6c5a8bcf86cd799439111", "60f6c5a8bcf86cd799439112"]
 *               taId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f6c5a8bcf86cd799439121"]
 *               slots:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mon 10-11", "Wed 2-3"]
 *     responses:
 *       201:
 *         description: Course successfully added
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Course or course code already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /course/get_courses:
 *   get:
 *     summary: Get courses for a specific student
 *     tags: [Course]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60f6c5a8bcf86cd799439111
 *         description: The ID of the student to fetch courses for
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   courseName:
 *                     type: string
 *                   courseCode:
 *                     type: string
 *                   professorName:
 *                     type: string
 *                   taNames:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Student ID is required
 *       500:
 *         description: Internal server error
 */
