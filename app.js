require('dotenv').config()
const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogiRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const http = require('http')

logger.info('connecting to', config.MONGODB_URI)
app.use(express.json())
const Blog = require('./models/blog')
const usersRouter = require('./controllers/users')

app.use('/api/users', usersRouter)
const loginRouter = require('./controllers/login')

app.use('/api/login', loginRouter)

//const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', blogiRouter)
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app