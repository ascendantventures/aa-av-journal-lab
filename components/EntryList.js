'use client';

export default function EntryList({ entries, activeId, setActiveId }) {
  return (
    <div className="card">
      <h2>Entries</h2>
      {entries.length === 0 ? <p className="muted">No entries found.</p> : null}
      {entries.map((e) => (
        <button
          key={e.id}
          className={`entry ${activeId === e.id ? 'active' : ''}`}
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => setActiveId(e.id)}
        >
          <strong>{e.title || '(Untitled)'}</strong>
          <div className="muted">{new Date(e.updated_at || e.created_at).toLocaleString()} • {e.mood}</div>
          <div className="tags">{(e.tags || []).map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        </button>
      ))}
    </div>
  );
}
