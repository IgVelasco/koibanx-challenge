const { port, env } = require('./config/vars')
const logger = require('./config/logger')
const app = require('./config/express')
const mongoose = require('./config/mongoose')
const TaskQueue = require('./services/task_queue')

// open mongoose connection
mongoose.connect()
new TaskQueue()

// listen to requests
app.listen(port, () => {
  logger.info(`server started on port ${port} (${env})`)
})
/**
 * Exports express
 * @public
 */
module.exports = app
