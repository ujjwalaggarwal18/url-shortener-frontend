import { useState } from 'react'
import './App.css'
import Analytics from './Analytics'

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnalytics, setShowAnalytics] = useState(false)

  const handleShorten = async () => {
    setError('')
    setShortUrl('')
    setShortCode('')

    if (!originalUrl) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setShortCode(data.shortCode)
      setShortUrl(`http://localhost:3000/${data.shortCode}`)

    } catch (err) {
      setError('Could not connect to server. Is your backend running?')
    } finally {
      setLoading(false)
    }
  }

  if (showAnalytics) {
    return <Analytics shortCode={shortCode} onBack={() => setShowAnalytics(false)} />
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Paste your long URL here..."
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />

      <button onClick={handleShorten} disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>

      {shortUrl && (
        <div className="result">
          <p><strong>Your short URL:</strong></p>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
          <br /><br />
          <button
            onClick={() => setShowAnalytics(true)}
            style={{ background: '#059669' }}
          >
            View Analytics
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default App