const router = require('express').Router()
const Blog = require('../components/blog')
const User = require('../components/user')

router.post('/reset', async(request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router