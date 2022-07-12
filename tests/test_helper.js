const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
   
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
   
    title: "TDD asdasda",
    author: "Robert asdasdrtin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/0asdasdase.html",
    likes: 0,
  }
]

const nonExistingId = async () => {
  const note = new Blog({ title: 'willremovethissoon', author: "jaska jokunen" })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb,usersInDb
}