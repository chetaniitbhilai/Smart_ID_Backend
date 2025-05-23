/**
 * @swagger
 * /complain/add_complain:
 *   post:
 *     summary: Submit a complaint
 *     tags: [Complain]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coursecode
 *               - studentId
 *               - taId
 *               - complain
 *             properties:
 *               coursecode:
 *                 type: string
 *                 example: CS101
 *               studentId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439011
 *               taId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439012
 *               complain:
 *                 type: string
 *                 example: TA did not record attendance
 *               status:
 *                 type: boolean
 *                 example: false
 *               response:
 *                 type: string
 *                 example: Under review
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-05-23T10:00:00Z
 *     responses:
 *       201:
 *         description: Complain submitted successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /complain/get_complain:
 *   post:
 *     summary: Get all complaints assigned to a TA
 *     tags: [Complain]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taId
 *             properties:
 *               taId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439012
 *     responses:
 *       200:
 *         description: List of complaints for the TA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 complaints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       complain:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       response:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       coursecode:
 *                         type: object
 *                         properties:
 *                           course:
 *                             type: string
 *                           coursecode:
 *                             type: string
 *       400:
 *         description: taId is required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /complain/resolve_complain:
 *   post:
 *     summary: Resolve a complaint by a TA
 *     tags: [Complain]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complainId
 *               - status
 *               - response
 *             properties:
 *               complainId:
 *                 type: string
 *                 example: 60f6c5a8bcf86cd799439099
 *               status:
 *                 type: boolean
 *                 example: true
 *               response:
 *                 type: string
 *                 example: Attendance was noted manually
 *     responses:
 *       200:
 *         description: Complain resolved successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Complain not found
 *       500:
 *         description: Internal server error
 */

