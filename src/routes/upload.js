const express = require('express')
const uploadController = require('../controllers/upload')
const validationMiddleware = require('../middlewares/validations')
const multer = require('multer')
const upload = multer()

const router = express.Router()


/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Uploads an Excel file with mapping and returns task ID for processing
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
 *                 properties:
 *                   A:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                   B:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                 required:
 *                   - A
 *                   - B
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
