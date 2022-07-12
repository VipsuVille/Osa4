
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


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
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)


// *******SITTEN KUN TOIMII TAAS*****
  //const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
 // if (!token || !decodedToken.id) {
 //   return response.status(401).json({ error: 'token missing or invalid' })
 // }
 // const user = await User.findById(decodedToken.id)

  const blog = new Blog({
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes === undefined ? 0 : body.likes,
          user: user._id,
          id: body.id
        })
 // if (body.title === undefined || body.url === undefined) {
 //   return response.status(400)
 // }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(200).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', (request, response, next) => {
  
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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