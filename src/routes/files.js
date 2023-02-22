const express = require('express')
const filesController = require('../controllers/files')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: Endpoints to get information of the files processed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NotFoundError:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: Excel data does not exist
 *     ExcelError:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         row:
 *           type: integer
 *         column:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 *
 * /api/files/:id/status:
 *   get:
 *     summary: Get the status of a file
 *     tags: [Files]
 *     description: Retrieve the status of a file given its ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the file to get the status for
 *     responses:
 *       200:
 *         description: The status of the file with the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The current status of the file
 *                 errorCount:
 *                   type: number
 *                   description: The number of errors in the file (if applicable)
 *       '404':
 *         description: The requested Excel document does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get('/:id/status', filesController.getStatus)

/**
 * @swagger
 * /api/files/:id/errors:
 *   get:
 *     summary: Get Excel errors with pagination
 *     tags: [Files]
 *     description: Retrieve Excel errors with pagination using the provided page number and Excel ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the Excel document to retrieve errors for
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageNumber
 *         description: Page number to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A list of Excel errors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExcelError'
 *       '404':
 *         description: The requested Excel document does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.get('/:id/errors', filesController.getError)

module.exports = router
