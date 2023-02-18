const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../errors/api-error')

const mappingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

/**
 * Excel Schema
 * @private
 */
const excelToJsonSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    // filePath: { type: String, required: true },
    mapping: {
      type: Map,
      of: mappingSchema,
      required: true,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done'],
      default: 'pending',
    },
    errorCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
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
excelToJsonSchema.statics = {
  //   errors,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<ExcelToJson, APIError>}
   */
  async get(id) {
    let excelData

    if (mongoose.Types.ObjectId.isValid(id)) {
      excelData = await this.findById(id).exec()
    }
    if (excelData) {
      return excelData
    }

    throw new APIError({
      message: 'Excel data does not exist',
      status: httpStatus.NOT_FOUND,
    })
  },
}

/**
 * @typedef ExcelToJson
 */
module.exports = mongoose.model('ExcelToJson', excelToJsonSchema)
