'use client';
import { MOODS } from '../lib/moods';

export default function EntryEditor({ draft, setDraft, onSave, onDelete, isEditing }) {
  return (
    <div className="card">
      <h2>{isEditing ? 'Edit entry' : 'New entry'}</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <textarea
          rows={10}
          placeholder="Write your thoughts... (markdown supported)"
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
        />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <select value={draft.mood} onChange={(e) => setDraft((d) => ({ ...d, mood: e.target.value }))}>
          {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          placeholder="Comma tags: work,ideas"
          value={draft.tagsInput}
          onChange={(e) => setDraft((d) => ({ ...d, tagsInput: e.target.value }))}
        />
      </div>
      <div className="row">
        <button className="primary" onClick={onSave}>Save</button>
        {isEditing ? <button className="danger" onClick={onDelete}>Delete</button> : null}
      </div>
    </div>
  );
}
