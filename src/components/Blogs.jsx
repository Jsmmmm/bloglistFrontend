import Blog from './Blog'

const Blogs = ({ blogs, user, onLike, onDelete }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={onLike}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default Blogs