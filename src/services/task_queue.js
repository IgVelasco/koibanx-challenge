const async = require('async')
const xlsx = require('xlsx')
const logger = require('../config/logger')
const { concurrencyLevels } = require('../config/vars')
const ExcelToJson = require('../models/excel_to_json')
const ExcelError = require('../models/excel_error')
const utils = require('../utils/string')

class TaskQueue {
  constructor() {
    if (TaskQueue.instance) {
      return TaskQueue.instance
    }
    this.queue = async.queue(async task => {
      try {
        // Process the task
        logger.info(`Processing task ${task.id}...`)
        await this.processTask(task)

        // Call the callback
        this.callback(task.id)
      } catch (err) {
        // Handle errors
        logger.error(err)
        // console.error(`Error processing task ${task.id}: ${err.message}`)
        this.callback(err)
      }
    }, concurrencyLevels)

    this.queue.drain(() => {
      console.log('All tasks have been processed')
    })
  }

  addTask(task) {
    this.queue.push(task, err => {
      if (err) {
        console.error(`Error processing task ${task.id}: ${err.message}`)
      } else {
        console.log(`Task ${task.id} completed successfully`)
      }
    })
  }

  callback(id) {
    // Perform the callback to indicate that the task has been completedk
    logger.info(`Making callback for id ${id}`)
  }

  async processTask(task) {
    let excelToJson = await ExcelToJson.get(task.id)
    excelToJson.status = 'processing'
    await excelToJson.save()
    const workbook = xlsx.read(task.data.file)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 })
    const headers = rows[0]
    const data = []
    const mapping = task.data.mapping

    // await new Promise(resolve => setTimeout(resolve, 1000 * 20)); // Used for testing big excels

    // Loop through the rows, starting from the second row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const item = {}

      // Loop through the cells in the row and map to JSON
      for (let j = 0; j < headers.length; j++) {
        const value = row[j]

        // Get the mapping for the current column
        const mappingInfo = mapping[xlsx.utils.encode_col(j)]

        if (mappingInfo) {
          // TODO: add object support (not asked but NTH)
          const { name, type } = mappingInfo
          // Perform type conversion if necessary
          try{
            if (type === 'number') {
              if (utils.containsOnlyNumbers(value)) {
                item[name] = parseFloat(value)
              } else {
                throw Error(`Value: ${value} is not full number`)
              }
            } else {
              item[name] = value
            }
          } catch (error) {
            await new ExcelError({
              row: i + 1,
              column: xlsx.utils.encode_col(j),
              error: error.message,
              excelId: task.id,
            }).save()
            excelToJson = await excelToJson.incrementErrorCount()
            item[name] = null
          }
        }
      }
      data.push(item)
    }

    excelToJson.status = 'done'
    excelToJson.output = data
    await excelToJson.save()
  }
}
module.exports = TaskQueue

// // Example usage:
// const taskQueue = new TaskQueue(2); // Set concurrency level to 2

// const task1 = { id: 1, data: 'Task 1 data' };
// const task2 = { id: 2, data: 'Task 2 data' };

// taskQueue.addTask(task1);
// taskQueue.addTask(task2);
