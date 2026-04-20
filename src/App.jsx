import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
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

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
    } catch {
      //setErrorMessage('wrong credentials')
      console.log('wrong credentials')
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          
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