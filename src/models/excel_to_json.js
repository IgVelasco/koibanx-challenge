const mongoose = require('mongoose')
const httpStatus = require('http-status')
const axios = require('axios')

const APIError = require('../errors/api-error')
const logger = require('../config/logger')

const INITIAL_STATUS = 'pending'

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
    callbackUrl: { type: String },
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
excelToJsonSchema.method({
  async incrementErrorCount() {
    this.errorCount++
    await this.save()
    return this
  },
})

/**
 * Pre's
 */
excelToJsonSchema.pre('save', async function () {
  if (this.isModified('status')) {
    const newStatus = this.status // new value
    if (newStatus !== INITIAL_STATUS && this.callbackUrl) {
      logger.info(`Status changed to ${newStatus}`)
      const options = {
        method: 'POST',
        url: 'http://httpbin.org/post',
        headers: { 'Content-Type': 'application/json' },
        data: { id: this._id, status: this.status },
      }
      try {
        const response = await axios.request(options)
        logger.info(`Information sent to callback:`)
        logger.info(JSON.stringify(response.data))
      } catch (error) {
        logger.error(error)
      }
    }
  }
})

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
