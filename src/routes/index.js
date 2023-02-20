const express = require('express')
const filesRoutes = require('./files')
const uploadRoutes = require('./upload')

const router = express.Router()

router.get('/status', (req, res) => res.send('OK'))
router.use('/upload', uploadRoutes)
router.use('/files', filesRoutes)

module.exports = router
