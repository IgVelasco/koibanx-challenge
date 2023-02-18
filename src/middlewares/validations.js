const { check, validationResult } = require('express-validator')
const httpStatus = require('http-status')
const APIError = require('../errors/api-error')
const path = require('path');

exports.uploadRequest = [
  check('mapping').exists(),
  check('file').custom((value, { req }) => {
    const file = req.file
    if (!file) {
      throw new Error('File not provided')
    }
    const ext = path.extname(file.originalname)
    if (ext !== '.xlsx') {
      throw new Error('Invalid file type. Only .xlsx files are allowed')
    }
    return true
  }),   
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(generateBadRequestError("Errors in the request parameters", errors.array()))
    }
    next()
  },
]

const generateBadRequestError = (msg, errors) => {
  const error = new Error(msg)
  return new APIError({
    message: error.message,
    status: httpStatus.BAD_REQUEST,
    stack: error.stack,
    errors: errors
  })
}
