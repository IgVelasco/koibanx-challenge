const async = require('async')
const axios = require('axios')
const logger = require('../config/logger')
const { concurrencyLevels } = require('../config/vars')

class TaskQueue {
  constructor(processTask) {
    if (TaskQueue.instance) {
      return TaskQueue.instance
    }
    this.processTask = processTask
    this.queue = async.queue(async task => {
      try {
        // Process the task
        logger.info(`Processing task ${task.id}...`)
        const result = await task.processTask(task)

        // Call the callback
        this.callback(task.id, result)
      } catch (err) {
        // Handle errors
        logger.error(err)
        console.error(`Error processing task ${task.id}: ${err.message}`)
        this.callback(err)
        throw err
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

  callback(id, result) {
    // Perform the callback to indicate that the task has been completedk
    logger.info(`Making callback for id ${id}`)
  }
}
module.exports = TaskQueue
