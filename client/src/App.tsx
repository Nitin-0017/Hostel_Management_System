import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  success: boolean
  message: string
  uptime: number
  timestamp: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/health')
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data: HealthResponse = await response.json()
      setHealth(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <main className="app">
      <section className="card">
        <h1>Hostel Management System</h1>
        <p className="subtitle">Frontend connected with backend health route</p>

        <div className="status-row">
          <span className="label">Status:</span>
          {loading && <span className="badge neutral">Checking...</span>}
          {!loading && error && <span className="badge down">Down</span>}
          {!loading && !error && health?.success && <span className="badge up">Healthy</span>}
        </div>

        {error && <p className="error">{error}</p>}

        {health && !error && (
          <div className="details">
            <p>
              <strong>Message:</strong> {health.message}
            </p>
            <p>
              <strong>Uptime:</strong> {Math.floor(health.uptime)}s
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        <div className="actions">
          <button type="button" onClick={fetchHealth} className="refresh-btn" disabled={loading}>
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
