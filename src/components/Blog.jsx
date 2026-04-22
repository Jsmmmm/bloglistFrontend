import { useState } from 'react'

const Blog = ({ blog, user, onLike, onDelete })  => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [viewMode, setViewMode] = useState('snippet')

  return (
    <div style={blogStyle}>
      <div> 
        {blog.title} 
      </div>

      <div style={{ display: viewMode === 'full' ? 'block' : 'none' }}>
        Author: {blog.author} <br></br>
        Url: {blog.url} <br></br>
        Likes: {blog.likes} 
        <button onClick={() => onLike(blog)}>like</button>
        <div>
          {user && blog.user && user.username === blog.user.username && (
            <button onClick={() => onDelete(blog)}>remove</button>
          )}
        </div>
      </div>

      <div>
        <button
          onClick={() => setViewMode(viewMode === 'snippet' ? 'full' : 'snippet')}>  {viewMode === 'snippet' ? 'show' : 'hide'}
        </button>
      </div>
  </div>
)}

export default Blog