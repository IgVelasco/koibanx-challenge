const async = require('async')
const logger = require('../config/logger')
const { concurrencyLevels } = require('../config/vars')

class TaskQueue {
  constructor() {
    if (TaskQueue.instance) {
      return TaskQueue.instance
    }
    this.queue = async.queue(async (task) => {
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

  callback(id){
    // Perform the callback to indicate that the task has been completedk
    logger.info(`Task ended for id ${id}`)
  }

  async processTask(task) {
    // Perform the processing logic for the task
    // ...

    logger.info(`Performing processTask() on task with id: ${task.id}`)
  }
}

module.exports = TaskQueue

// // Example usage:
// const taskQueue = new TaskQueue(2); // Set concurrency level to 2

// const task1 = { id: 1, data: 'Task 1 data' };
// const task2 = { id: 2, data: 'Task 2 data' };

// taskQueue.addTask(task1);
// taskQueue.addTask(task2);
