
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')




blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    console.log(blogs)
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
      if (blog) {
        response.json(blog.toJson())
      } else {
        response.status(404).end()
      }
    })


blogsRouter.post('/', async (request, response) => {
  const body = request.body 

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Blog({
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes === undefined ? 0 : body.likes,
          user: user._id,
          id: body.id
        })
  if (body.title === undefined || body.url === undefined) {
    return response.status(400)
  }
    console.log("Onko muutakun id" ,note.title)
    const savedNote = await note.save()
    await user.save()
    console.log("NOTEEEE" ,savedNote)
    response.status(200).json(savedNote)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'blog does not exist' })
  }

 
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() != request.user.id) {
    return response.status(401).json({ error: 'wrong user' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blogi = {
    title: body.title,
    author: body.author,
    url:  body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blogi, { new: true })
    .then(updatedBlog=> {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter