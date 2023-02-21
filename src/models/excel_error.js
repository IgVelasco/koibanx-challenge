const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../errors/api-error')

/**
 * ExcelErrorSchema
 * @private
 */
const ExcelErrorSchema = new mongoose.Schema({
  row: { type: Number, required: true },
  column: { type: String, required: true },
  error: { type: String, required: true },
  excelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelToJson',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// excelSchema.pre('save', async function save(next) {

// });

/**
 * Methods
 */
// excelSchema.method({
// });

/**
 * Statics
 */
ExcelErrorSchema.statics = {
  //   errors,

  /**
   * Get excel error
   *
   * @param {ObjectId} id - The objectId of excel error.
   * @returns {Promise<ExcelToJson, APIError>}
   */
  async get(id) {
    let excelError

    if (mongoose.Types.ObjectId.isValid(id)) {
      excelError = await this.findById(id).exec()
    }
    if (excelError) {
      return excelError
    }

    throw new APIError({
      message: 'Excel error does not exist',
      status: httpStatus.NOT_FOUND,
    })
  },
}

/**
 * @typedef ExcelError
 */
module.exports = mongoose.model('ExcelError', ExcelErrorSchema)
