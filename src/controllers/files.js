const logger = require('../config/logger')
const ExcelToJson = require('../models/excel_to_json')

exports.getStatus = async (req, res, next) => {
  logger.info(`Fetching status for id: ${req.params.id}`)
  const status = (await ExcelToJson.get(req.params.id)).status
  res.json({ status })
}
