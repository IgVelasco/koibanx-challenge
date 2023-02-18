const express = require('express')
const uploadController = require('../controllers/upload')
const multer = require('multer')
const upload = multer()
const { check } = require('express-validator')

const router = express.Router()

router
  .route('/')
  .post(
    upload.single('file'),
    validationMiddleware.uploadRequest,
    uploadController.upload
  )

module.exports = router
