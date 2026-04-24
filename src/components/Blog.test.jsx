import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

//todo refactor to multiple tests
test('renders content and check that url and likes are in document but hidden by default and visible after clicking show', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(
    <Blog
      blog={blog}
      user={blog.user}
      onLike={() => {}}
      onDelete={() => {}}
    />
  )

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeInTheDocument()
  //screen.debug()
  const urlElement = screen.getByText((content) =>
    content.includes('http://example.com')
  )

  const likeElement = screen.getByText((content) =>
    content.includes('Likes:')
  )
  
  expect(urlElement).toBeInTheDocument()
  expect(urlElement).not.toBeVisible()
  expect(likeElement).toBeInTheDocument()
  expect(likeElement).not.toBeVisible()

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)
  expect(urlElement).toBeVisible()
  expect(likeElement).toBeVisible()
})

test('clicking the like button calls event handler once', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={blog.user}
      onLike={mockHandler}
      onDelete={() => {}}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
