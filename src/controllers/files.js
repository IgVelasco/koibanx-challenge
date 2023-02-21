const logger = require('../config/logger')
const ExcelToJson = require('../models/excel_to_json')
const ExcelError = require('../models/excel_error')

const PAGE_SIZE = 10

exports.getStatus = async (req, res, next) => {
  try {
    logger.info(`Fetching status for id: ${req.params.id}`)
    let response
    const { status, errorCount } = await ExcelToJson.get(req.params.id)
    if (status === 'done') {
      response = { status, errorCount }
    } else {
      response = { status }
    }
    res.json(response)
  } catch(error) {
    next(error)
  }
}

exports.getError = async (req, res, next) => {
  try {
    const pageNumber = req.query.pageNumber
    const { id } = req.params
    await ExcelToJson.get(id)
    const condition = { excelId: id }
    const documents = await ExcelError.find(condition)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .exec()
    res.json(documents)
  } catch (error) {
    next(error)
  }
}
