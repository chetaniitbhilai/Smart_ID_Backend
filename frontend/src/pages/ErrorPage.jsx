import { Link, useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError()
  const message = (error && (error.statusText || error.message)) || 'Something went wrong.'

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: 8 }}>Oops!</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>An unexpected error occurred.</p>
      <pre style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', textAlign: 'left', overflowX: 'auto' }}>
        {message}
      </pre>
      <div style={{ marginTop: 24 }}>
        <Link to="/" style={{ color: '#0d6efd' }}>Go to Home</Link>
      </div>
    </div>
  )
}

export default ErrorPage


