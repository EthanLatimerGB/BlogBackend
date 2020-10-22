const blogsRouter = require('express').Router()
const Blog = require('../components/blog')
const logger = require('../components/logger')
const User = require('../components/user')
const blog = require('../components/blog')
const jwt = require('jsonwebtoken')
const config = require('../components/config')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    response.json(blog)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, config.Secret)
    if(!request.token || !decodedToken.id){
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    console.log(user)
    const blog = new Blog({
        title: body.title,
        user: user._id,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    
    console.log(blog.toJSON())
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).send(savedBlog)
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, config.Secret)
    if(!request.token || !decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    const changedBlog = {
        title: body.title,
        user: user.id,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, changedBlog, { new: true })
        response.json(updatedBlog).status(200).end()
    }catch(err){
        response.status(500).json({error: err})
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const id = request.params.id //id of specific blog deletion

    const decodedToken = jwt.verify(request.token, config.Secret)
    logger.info(decodedToken)
    
    if(!request.token || !decodedToken.id){
        return response.status(401).json({error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    console.log(user)
    const foundBlog = user.blogs.filter((blog) => {
        if(blog == id){
            return blog
        }
    })
    
    if(foundBlog.length){
        await Blog.findOneAndDelete({_id: id})
        response.status(204).end()
    }else{
        response.status(401).send({error: "Unauthorised access"})
    }    
})

module.exports = blogsRouter