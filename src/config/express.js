const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./swagger')
const routes = require('../routes')
const { logs } = require('./vars.js')
const error = require('../middlewares/error')
const app = express()

// request logging. dev: console | production: file
app.use(morgan(logs))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// mount api routes
app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use(error.converter)

// catch 404 and forward to error handler
app.use(error.notFound)

// error handler, send stacktrace only during development
app.use(error.handler)

module.exports = app
