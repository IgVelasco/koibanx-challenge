const logger = require('../config/logger')
const ExcelToJson = require('../models/excel_to_json')

exports.getStatus = async (req, res, next) => {
  logger.info(`Fetching status for id: ${req.params.id}`)
  let response
  const {status, errorCount} = (await ExcelToJson.get(req.params.id))
  if(status === 'done') {
    response = {status, errorCount}
  } else {
    response = {status}
  }
  res.json(response)
}
