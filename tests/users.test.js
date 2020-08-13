const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../components/app')
const api = supertest(app)
const User = require('../components/user')
const jwt = require('jsonwebtoken')
const config = require('../components/config')
const creatingUsers = require('./test_helper').initialUsers

beforeEach( async () => {
    await User.deleteMany({})

    for(let user of creatingUsers){
        await api
            .post('/api/users')
            .send(user)
    }
})


describe("Testing for Creating Users", () => {
    test('Handling a taken username', async () => {
        const takenUsername = {
            username: "TylerD",
            name: "Gary Bol",
            password: "bryhfgsd"
        }
    
        await api 
            .post('/api/users')
            .send(takenUsername)
            .expect(400)
    })
    
    test('Handling a missing password', async () => {
        const missingInfoUser = {
            username: "TylerD",
            name: "Gary Bol"
        }
    
        await api
            .post('/api/users')
            .send(missingInfoUser)
            .expect(400)
    })

    test('Handling null data', async() => {
        const nullUser = {

        }

        await api
            .post('/api/users')
            .send(nullUser)
            .expect(400)
    })

    test('Handling a valid user', async() => {
        const validUser = {
            username: "ValidUser",
            name: "John Doe",
            password: "password"
        }

        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
    })
})

describe("Logging in to API", () => {
    test("Handling incorrect credentials", async () => {
        const wrongPasswordUser = {
            username: "garethbale",
            password: "lol"
        }

        await api
            .post('/api/login')
            .send(wrongPasswordUser)
            .expect(401)
    })

    test('Handling missing credentials', async () => {
        const missingDataUser = {
            username: 'ehdnc'
        }

        await api
            .post('/api/login')
            .send(missingDataUser)
            .expect(401)
    })
    test('Handling a valid credential', async () => {
        const user = {
            username: 'ethanlatimer',
            password: 'BruhMoment'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
        
        expect(response.body.token).toEqual(expect.anything())
    })
})


afterAll(() => {
    mongoose.connection.close()
})