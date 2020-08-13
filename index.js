const http = require('http')
const app = require('./components/app')
const cors = require('cors')
const config = require('./components/config')
const logger = require('./components/logger')

const server = http.createServer(app)

app.listen(config.Port, () => {
    logger.info(`Listening to requests on port ${config.Port}`)
})