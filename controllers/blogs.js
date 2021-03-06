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
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })


blogsRouter.post('/', async (request, response) => {
  const body = request.body 
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
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
  const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON())

    
})

blogsRouter.delete('/:id', async (request, response) => { 
    const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) {
      response.status(400).send({error: 'bad username or password'})
      return
    } 

    const findBlog = await Blog.findById(request.params.id)

    await Blog.findByIdAndRemove(request.params.id)
      
      if(findBlog.user.toString() === decodedToken.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(400).end()
    }
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