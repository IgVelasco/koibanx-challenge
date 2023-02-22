const express = require('express')
const uploadController = require('../controllers/upload')
const validationMiddleware = require('../middlewares/validations')
const multer = require('multer')
const upload = multer()

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: Endpoints related to upload
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Uploads an Excel file with mapping and returns task ID for processing
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               mapping:
 *                 type: object
 *                 description: Mapping JSON of the xlsx columns
 *                 example:
 *                   A:
 *                     name: name
 *                     type: string
 *                   B:
 *                     name: age
 *                     type: number
 *               callbackUrl:
 *                 type: string
 *                 description: URL to send task completion notification to
 *     responses:
 *       200:
 *         description: Task ID for processing the uploaded file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *       400:
 *         description: Errors in the request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Errors in the request parameters
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Invalid value
 *                       param:
 *                         type: string
 *                         example: mapping
 *                       location:
 *                         type: string
 *                         example: body
 */

router
  .route('/')
  .post(
    upload.single('file'),
    validationMiddleware.uploadRequest,
    uploadController.upload
  )

module.exports = router
