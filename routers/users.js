const usersRouter = require('express').Router()
const User = require('../components/user')
const logger = require('../components/logger')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if(!body.password){ response.status(400).send({ error: "password is missing"} )}
    else{
        const passwordHash = await bcrypt.hash(body.password, 10)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash,
        })

        const savedUser = await user.save()
        response.status(201).send(savedUser)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter