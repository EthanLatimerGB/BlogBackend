const { mongo } = require("mongoose")

const dotenv = require('dotenv').config()

const password = process.env.password

let database = 'blogs'
if(process.env.NODE_ENV === 'test'){
    database = 'testBlogs'
}

const mongoUrl = `mongodb+srv://fullstack:${password}@fso.rth9w.mongodb.net/${database}}?retryWrites=true&w=majority`
const Port = process.env.PORT
const Secret = process.env.SECRET

module.exports = {
    password,
    mongoUrl,
    Port,
    Secret
}