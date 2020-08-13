const logger = require("./logger")
const { response } = require("express")

const requestLogger = (request, response, next) => {
    console.log(`Method: ${request.method}`)
    console.log(`Path: ${request.path}`)
    console.log(`Body: ${JSON.stringify(request.body)}`)
    console.log('--------')
    next()   
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "Unknown Endpoint"})
}

const errorHandler = (error, request, response, next) => {
    logger.error(`Encountered error: ${error.message}`)
    switch(error.name){
        case 'CastError':
            response.status(400).send({error: 'Malformed ID'})
            break
        case 'ValidationError':
            response.status(400).send({error: error.message})
            break
        case 'JsonWebTokenError':
            response.status(401).send({error: 'invalid token'})
            break
        default: 
            break
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    let token = null
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        request.token = authorization.substring(7)
    }
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}