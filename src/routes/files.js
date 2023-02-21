const express = require('express')
const filesController = require('../controllers/files')

const router = express.Router()

/**
 * @swagger
 *
 * /api/files/status:
 *   get:
 *     summary: Get the status of a file
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
 *       404:
 *         description: The requested file ID was not found
 */
router.get('/:id/status', filesController.getStatus)

router.get('/:id/errors', filesController.getError)

module.exports = router
