const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
jest.setTimeout(50000)

beforeEach(async () => {
    await Blog.deleteMany({})
  
    let BlogObject = new Blog(helper.initialBlogs[0])
    await BlogObject.save()
  
    BlogObject = new Blog(helper.initialBlogs[1])
    await BlogObject.save()
  })

test('blogs total', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(0)
  })
test('check if there is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('post blog', async () => {
    const blogi =  {
        title: "jokkeli",
        author: "pokkeli",
        url: "jokkesslls",
        likes: 10
    }

    await api
    .post('/api/blogs')
    .send(blogi)
    
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
    
    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      'jokkeli'
    )
  })

  test('Does blog has likes, if no 0', async () => {
    const makenewBlog ={
      title: 'Blogibloginen',
      author: 'Bloggeli',
      url: 'asdasdasd'
    }
    await api
      .post('/api/blogs')
      .send(makenewBlog)
  
    const blogsAtEnd = await helper.blogsInDb()
    const lastBlog = blogsAtEnd.pop()
    expect(lastBlog.likes).toBe(0)
  })


  test('url and title check 400 if not', async () => {
    const blogi ={
      author: 'authoriteetti',
      url: "jjjjj",
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(blogi)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  
  test('Delete blog', async () => {
    const blogiNew = {
      title: "Otsikko",
      author: "authori",
      url: '123123asdas',
      likes: 14
    }
  
    await api

      .post('/api/blogs')
      .send(blogiNew)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    await api

      .delete(`/api/blogs/${blogsAtEnd[0].id}`)
      .expect(204)
  

    const uusilista = await helper.blogsInDb()
  
    expect(uusilista.length).toBe(
      helper.initialBlogs.length
    )

    const listaTitle = uusilista.map(b => b.title)
  
    expect(listaTitle).not.toContain(blogsAtEnd[0].title)
  })

  test('update blog', async () => {
    const blogi = {
      title: 'asdasdas',
      author: 'asdasdas',
      url: 'asdasdas',
      likes: 123
    }
    const lahetys = await api
      .post('/api/blogs')
      .send(blogi)
      .expect(200)
  const blogi2 = blogi
   blogi2.title = "asdasd12312312323"
   blogi2.author = "djasdoasjdoasap"
   blogi2.likes = 123123123
  
    await api
      .put(`/api/blogs/${lahetys.body.id}`)
      .send(blogi2)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].title).toBe(blogi2.title)
  })
 