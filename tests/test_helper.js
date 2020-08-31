const Blog = require('../components/blog')

const initialBlogs = [
    {
        title: 'my dog bit me cog',
        user: '5f31469bab2b8f1c365d078d',
        author: 'Deez Nuts man',
        url: 'LOL',
        likes: 2000000,
    },
    {
        title: 'Tyler Stud',
        author: 'Tyler lol',
        user: '5f31469bab2b8f1c365d078e',
        url: 'LOL BRUH',
        likes: 32942874,
    },
    {
        title: 'The day me knob went green',
        author: 'Ethan',
        user: '5f31469bab2b8f1c365d078e',
        url: 'http://steam.getgud.org or some shit',
        likes: 930474,
    }
]

const initialUsers = [
    {
        username: "garethbale",
        name: "Gary Bale",
        password: "holyMoly"
    },
    {
        username: "ethanlatimer",
        name: "Ethan Latimer",
        password: "BruhMoment"
    },
    {
        username: "TylerD",
        name: "Tyler Donaghy",
        password: "Yoooo"
    }
]

const notesInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

module.exports = {
    initialBlogs,
    notesInDB,
    initialUsers
}