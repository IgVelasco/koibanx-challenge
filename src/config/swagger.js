const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'This is a simple Express API with Swagger documentation.',
    },
  },
  apis: ['src/routes/*.js'],
}

// Initialize the Swagger documentation
const specs = swaggerJsdoc(options)

module.exports = specs
