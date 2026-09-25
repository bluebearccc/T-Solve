import type { TicketSnapshot } from '../api/types'
import { useApi } from '../hooks/useApi'

export default function TicketsPage() {
  const { data, error, loading } = useApi<TicketSnapshot[]>('/tickets')

  return (
    <section>
      <h1>Resolved ticket snapshots</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && data.length === 0 && <p>No tickets imported yet.</p>}
      {data && data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>External ID</th>
              <th>Title</th>
              <th>Source status</th>
              <th>Resolved</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id}>
                <td>{t.source}</td>
                <td>{t.sourceUrl ? <a href={t.sourceUrl}>{t.externalId}</a> : t.externalId}</td>
                <td>{t.title}</td>
                <td>{t.sourceStatus}</td>
                <td>{t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
