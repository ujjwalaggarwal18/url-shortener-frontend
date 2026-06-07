import { useState, useEffect } from 'react'

function Analytics({ shortCode, onBack }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`https://url-shortener-backend-51ib.onrender.com/analytics/${shortCode}`)
                const result = await response.json()

                if (!response.ok) {
                    setError(result.error || 'Could not fetch analytics')
                    return
                }

                setData(result)
            } catch (err) {
                setError('Could not connect to server')
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [shortCode])

    if (loading) return <p style={{ padding: '20px' }}>Loading analytics...</p>
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>

    return (
        <div className="container">
            <button onClick={onBack} style={{ marginBottom: '20px', width: 'auto', padding: '8px 16px' }}>
                ← Back
            </button>

            <h1>Analytics</h1>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <p><strong>Original URL:</strong> {data.originalUrl}</p>
                <p><strong>Short Code:</strong> {data.shortCode}</p>
                <p style={{ fontSize: '24px', marginTop: '12px' }}>
                    <strong>Total Clicks: {data.totalClicks}</strong>
                </p>
            </div>

            {data.clicks.length === 0 ? (
                <p>No clicks yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                            <th style={th}>Timestamp</th>
                            <th style={th}>Browser</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.clicks.map((click, index) => (
                            <tr key={index}>
                                <td style={td}>{new Date(click.timestamp).toLocaleString()}</td>
                                <td style={td}>{click.browser}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

const th = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }
const td = { padding: '10px', borderBottom: '1px solid #eee', fontSize: '13px' }

export default Analytics