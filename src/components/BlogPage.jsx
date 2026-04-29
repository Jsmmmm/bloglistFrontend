import { useParams } from 'react-router-dom'

const BlogPage = ({ blogs, onLike, onDelete, user }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>Blog not found</div>

  return (
    <div>
      <h2>{blog.title}</h2>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><strong>URL:</strong> {blog.url}</p>
      <p>
        <strong>Likes:</strong> {blog.likes}
        {user && (
            <button onClick={() => onLike(blog)}>like</button>
        )}
    </p>

      {user && blog.user && user.username === blog.user.username && (
        <button onClick={() => onDelete(blog)}>remove</button>
      )}
    </div>
  )
}

export default BlogPage