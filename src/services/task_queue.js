const async = require('async')
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
        // There was no specification on what to do with the output of the process
        await task.processTask(task)
      } catch (err) {
        // Handle errors
        logger.error(`Error processing task ${task.id}: ${err.message}`)
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
}
module.exports = TaskQueue
