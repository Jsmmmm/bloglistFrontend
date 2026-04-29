import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogPage from './components/BlogPage'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import NewBlogPage from './components/NewBlogPage'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

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
      navigate('/')
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


const handleBlogLike = async (blog) => {
  try {
    const updatedBlog = await blogService.like(blog.id)

    setBlogs(prev =>
      prev.map(b => b.id === blog.id ? updatedBlog : b)
    )

    return updatedBlog // 👈 important
  } catch {
    setNotification({ message: 'error liking blog', type: 'error' })
    setTimeout(() => setNotification(null), 5000)
    return null
  }
}

const handleBlogDelete = async (blog) => {
  try {
    await blogService.remove(blog.id)

    setBlogs(prevBlogs =>
      prevBlogs.filter(b => b.id !== blog.id)
    )

    setNotification({ message: 'Blog removed', type: 'success' })
    setTimeout(() => setNotification(null), 5000)
    navigate('/blogs')

  } catch {
    setNotification({ message: 'error deleting blog', type: 'error' })
    setTimeout(() => setNotification(null), 5000)
  }
}

  const padding = {
    padding: 5
  }
  
  

  return (
    <div>
      <div>
        <Link style={padding} to="/blogs">Blogs</Link>
        <Link style={padding} to="/blogs/new">New Blog</Link>
        {!user && (
          <Link style={padding} to="/login">Login</Link>
        )}
        {user && (
          <button style={padding} onClick={handleLogout}>Logout</button>
        )}
      </div>
      <Routes>
        <Route path="/blogs" element={
          <Blogs 
            blogs={blogs}
            user={user}
            onLike={handleBlogLike}
            onDelete={handleBlogDelete}
          />
        } />
        <Route path="/login" element={
          <LoginForm onLogin={handleLogin}/> 
        } />
        <Route path="/" element={<Blogs blogs={blogs} />} />

        <Route path="/blogs/:id" element={
          <BlogPage 
            user={user}
            onLike={handleBlogLike}
            onDelete={handleBlogDelete}
          />
        } />

        <Route path="/blogs/new" element={
          user 
            ? <NewBlogPage onCreate={handleBlogSubmit} />
            : <LoginForm onLogin={handleLogin} />
        } />

      </Routes>
      <div>
        <Notification message={notification?.message} type={notification?.type} />
        
        {user && (
          <div>
            <p>{user.name} logged in</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App