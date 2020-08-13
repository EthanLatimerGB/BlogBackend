const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../components/app')
const api = supertest(app)
const Blog = require('../components/blog')
const test_helper = require('./test_helper')
const logger = require('../components/logger')
const blogsRouter = require('../routers/blogs')
const { update } = require('../components/blog')
const User = require('../components/user')

beforeEach( async () => {
    await Blog.deleteMany({})
    for(let blog of test_helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }

    await User.deleteMany({})
    for(let user of test_helper.initialUsers){
        await api
            .post('/api/users')
            .send(user)
    }

})

test('Performs a GET request to the blog api', async () => {
    await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('checks for an ID in each porperty', async () => {
    const blogs = await api.get('/api/blogs')
    blogs.body.forEach((item) => {
        expect(item.id).toStrictEqual(expect.anything())
    })
})

test('making a POST request that creates a new Blog', async () => {
    const fetchedToken = await api.post('/api/login').send({
        username: "ethanlatimer",
        password: "BruhMoment"
    })


    const newBlog = new Blog({
        title: 'My New Blog',
        url: 'http://www.holymolyincorporated.com',
        likes: 91
    })

    const token = `bearer ${fetchedToken.body.token}`
    console.log(`The token is ${token}`)
    await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
    
    const numberOfBlogs = await api.get('/api/blogs')
    const lengthofBlogs = numberOfBlogs.body.length
    expect(lengthofBlogs).toEqual(4)
})

test('Makes a POST request with missing data', async() => {
    const blog = new Blog({
        author: 'Gareth MCSmelly',
        likes: 69
    })
    const response = await api.post(blog)
    expect(response.statusCode).toEqual(400)
})

test('Deletes a single blog post resource', async () => {
    const fetchedToken = await api.post('/api/login').send({
        username: "ethanlatimer",
        password: "BruhMoment"
    })

    const newBlog = new Blog({
        title: 'My New Blog',
        url: 'http://www.holymolyincorporated.com',
        likes: 91
    })

    const token = `bearer ${fetchedToken.body.token}`

    const deletingBlog = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)

    const createdBlog = await Blog.findOne({title: 'My New Blog'})
    await api
        .delete(`/api/blogs/${createdBlog.id}`)
        .set('Authorization', token)
        .expect(204)
})

test('Find a blog and update the information', async () => {
    const fetchedToken = await api.post('/api/login').send({
        username: "ethanlatimer",
        password: "BruhMoment"
    })

    const newBlog = new Blog({
        title: 'My New Blog',
        url: 'http://www.holymolyincorporated.com',
        likes: 91
    })

    const token = `bearer ${fetchedToken.body.token}`
    console.log(`Token is ${token}`)

    const deletingBlog = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
    
    const changingBlog = await Blog.findOne({title: 'My New Blog'})
    
    const updatedBlog = {
        title: changingBlog.title,
        author: changingBlog.author,
        url: 'http://www.sdlkafjhaklsfsd.com',
        likes: changingBlog.likes,
        id: changingBlog.id
    }

    const response = await api
        .put(`/api/blogs/${changingBlog.id}`)
        .set('Authorization', token)
        .send(updatedBlog)
    
    expect(response.statusCode).toEqual(200)

})

afterAll(() => {
    mongoose.connection.close()
})