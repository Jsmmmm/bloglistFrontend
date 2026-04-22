import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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
      setNotification({ message: 'wrong credentials', type: 'error' })
      console.log('wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setNotification({ message: 'Logged out', type: 'success' })
    setTimeout(() => {
        setNotification(null)
      }, 5000)
  }

  const handleBlogSubmit = async ({ title, author, url }) => {
  try {
    const newBlog = await blogService.create({ title, author, url })
    
    // add the new blog to state
    setBlogs(blogs.concat(newBlog))
    setNotification({ message: 'Added new blog', type: 'success' })
    setTimeout(() => {
        setNotification(null)
      }, 5000)
  } catch {
    setNotification({ message: 'error creating blog', type: 'error' })
      console.log('error creating blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
  }
}

  return (
    <div>
      <Notification message={notification?.message} type={notification?.type} />
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <div>
            <Togglable buttonLabel='new blog'>
              <BlogForm onCreate={handleBlogSubmit}/>
            </Togglable>
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