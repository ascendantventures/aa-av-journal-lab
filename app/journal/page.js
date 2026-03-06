'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { MOODS } from '../../lib/moods';
import EntryList from '../../components/EntryList';
import EntryEditor from '../../components/EntryEditor';

const emptyDraft = { title: '', content: '', mood: 'neutral', tagsInput: '' };

export default function JournalPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return router.push('/auth');
      setSession(data.session);
    });
  }, [router]);

  useEffect(() => {
    if (!session) return;
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const loadEntries = async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('updated_at', { ascending: false });
    const rows = data || [];
    setEntries(rows);
    if (!activeId && rows[0]) setActiveId(rows[0].id);
  };

  const activeEntry = entries.find((e) => e.id === activeId) || null;

  useEffect(() => {
    if (!activeEntry) {
      setDraft(emptyDraft);
      return;
    }
    setDraft({
      title: activeEntry.title || '',
      content: activeEntry.content || '',
      mood: activeEntry.mood || 'neutral',
      tagsInput: (activeEntry.tags || []).join(', '),
    });
  }, [activeId]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const txt = `${e.title || ''} ${e.content || ''} ${(e.tags || []).join(' ')}`.toLowerCase();
      if (query && !txt.includes(query.toLowerCase())) return false;
      if (tagFilter && !(e.tags || []).includes(tagFilter)) return false;
      if (moodFilter && e.mood !== moodFilter) return false;
      const created = e.created_at ? new Date(e.created_at) : null;
      if (fromDate && created && created < new Date(fromDate)) return false;
      if (toDate && created && created > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });
  }, [entries, query, tagFilter, moodFilter, fromDate, toDate]);

  const allTags = [...new Set(entries.flatMap((e) => e.tags || []))];

  const save = async () => {
    if (!draft.title.trim() && !draft.content.trim()) return;
    const payload = {
      title: draft.title.trim(),
      content: draft.content,
      mood: draft.mood,
      tags: draft.tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };
    if (activeEntry) {
      await supabase.from('journal_entries').update(payload).eq('id', activeEntry.id);
    } else {
      await supabase.from('journal_entries').insert([{ ...payload, user_id: session.user.id }]);
    }
    await loadEntries();
  };

  const remove = async () => {
    if (!activeEntry) return;
    if (!confirm('Delete this entry?')) return;
    await supabase.from('journal_entries').delete().eq('id', activeEntry.id);
    setActiveId(null);
    await loadEntries();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (!supabase) return <main className="container"><div className="card">Missing Supabase env vars.</div></main>;

  return (
    <main className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Journal</h1>
        <div className="row">
          <button onClick={() => { setActiveId(null); setDraft(emptyDraft); }}>New entry</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <input placeholder="Search title/content/tags" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
            <option value="">All moods</option>
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="grid">
        <EntryList entries={filtered} activeId={activeId} setActiveId={setActiveId} />
        <EntryEditor draft={draft} setDraft={setDraft} onSave={save} onDelete={remove} isEditing={!!activeEntry} />
      </div>
    </main>
  );
}
