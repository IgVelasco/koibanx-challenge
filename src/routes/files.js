const express = require('express')
const filesController = require('../controllers/files')

const router = express.Router()

router.get('/:id/status', filesController.getStatus)

module.exports = router