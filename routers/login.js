const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../components/blog')
const User = require('../components/user')
const config = require('../components/config')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({username: body.username})
    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordCorrect)){
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, config.Secret)

    response.status(200)
        .send({ token, username: user.username, name: user.name })
})



module.exports = loginRouter
