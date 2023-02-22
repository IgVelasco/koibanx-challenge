// const xlsx = require('xlsx');
// const { validationResult } = require('express-validator');
const logger = require('../config/logger')
const TaskQueue = require('../services/task_queue')
const ExcelToJson = require('../models/excel_to_json')
const fileProcessing = require('../services/file_processing')

const queue = new TaskQueue()

exports.upload = async (req, res, next) => {
  try {
    logger.info(`File uploaded: ${req.file.originalname}`)
    const excelToJson = new ExcelToJson({
      fileName: req.file.originalname,
      mapping: JSON.parse(req.body.mapping),
      callbackUrl: req.body.callbackUrl,
    })
    await excelToJson.save() // Save the new document to the database
    const taskId = excelToJson._id
    queue.addTask({
      id: taskId,
      data: { file: req.file.buffer, mapping: JSON.parse(req.body.mapping) },
      processTask: fileProcessing.processTask,
    })
    res.json({ taskId })
  } catch (err) {
    next(err)
  }
}
