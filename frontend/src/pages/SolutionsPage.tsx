import { useState } from 'react'
import type { Solution, SolutionStatus } from '../api/types'
import { useApi } from '../hooks/useApi'

const STATUSES: SolutionStatus[] = ['PUBLISHED', 'DRAFT', 'IN_REVIEW', 'APPROVED', 'DEPRECATED', 'ARCHIVED']

export default function SolutionsPage() {
  const [status, setStatus] = useState<SolutionStatus>('PUBLISHED')
  const { data, error, loading } = useApi<Solution[]>(`/solutions?status=${status}`)

  return (
    <section>
      <h1>Solutions</h1>
      <label>
        Status{' '}
        <select value={status} onChange={(e) => setStatus(e.target.value as SolutionStatus)}>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && data.length === 0 && <p>No {status} solutions yet.</p>}
      <ul className="cards">
        {data?.map((s) => (
          <li key={s.id}>
            <span className={`badge ${s.status}`}>{s.status}</span>
            <h3>{s.title}</h3>
            {s.applicability && <p>{s.applicability}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}
