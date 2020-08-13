const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const mongoose = require('mongoose')
const config = require('./config')
const middleware = require('./middleware')
const logger = require('./logger')
const blogsRouter = require('../routers/blogs')
const usersRouter = require('../routers/users')
const loginRouter = require('../routers/login')

app.use(cors())

logger.info(`Connecting to MongoDB at weblink: ${config.mongoUrl}`)

mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        logger.info(`Connected to MongoDB`)
    })
    .catch((error)=> {
        logger.error(`Failed to connect to MongoDB. Error: ${error.message}`)
    })


app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app