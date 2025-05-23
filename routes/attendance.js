/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management APIs
 */

/**
 * @swagger
 * /attendance/add_attendance:
 *   post:
 *     summary: Record attendance for a student on a specific date
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coursecode
 *               - date
 *             properties:
 *               coursecode:
 *                 type: string
 *                 example: CS101
 *               studentId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439011
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-23
 *               isHoliday:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 attendance:
 *                   type: object
 *                   example:
 *                     coursecode: CS101
 *                     studentId: 60f6c5a8bcf86cd799439011
 *                     date: 2025-05-23T00:00:00.000Z
 *                     isHoliday: false
 *       400:
 *         description: coursecode and date are required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attendance/check_attendance:
 *   get:
 *     summary: Get attendance dates for a student in a course
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: coursecode
 *         required: true
 *         schema:
 *           type: string
 *         example: CS101
 *         description: The course code to check attendance for
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60f6c5a8bcf86cd799439011
 *         description: The student ID to check attendance for
 *     responses:
 *       200:
 *         description: List of dates student was present
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presentDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date-time
 *                   example: ["2025-05-10T00:00:00.000Z", "2025-05-12T00:00:00.000Z"]
 *       400:
 *         description: coursecode and studentId are required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attendance/update_attendance:
 *   post:
 *     summary: Update attendance for a course on a specific date (TA only)
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coursecode
 *               - taId
 *               - studentId
 *               - date
 *             properties:
 *               coursecode:
 *                 type: string
 *                 example: CS101
 *               taId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439099
 *               studentId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439011
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-23
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 attendance:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: TA not authorized for this course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
