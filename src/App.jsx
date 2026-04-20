import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      //setErrorMessage('wrong credentials')
      console.log('wrong credentials')
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlogSubmit = async ({ title, author, url }) => {
  try {
    const newBlog = await blogService.create({ title, author, url })
    
    // add the new blog to state
    setBlogs(blogs.concat(newBlog))
  } catch {
    console.log('error creating new blog')
  }
}

  return (
    <div>
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <div>
            <BlogForm onCreate={handleBlogSubmit}/>
          </div>
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App