'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!supabase) return setMsg('Supabase env vars not configured.');
    setMsg('');
    const fn = mode === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await fn({ email, password });
    if (error) return setMsg(error.message);
    router.push('/journal');
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 460, margin: '40px auto' }}>
        <h1>Journal MVP</h1>
        <p className="muted">Sign up or log in with email/password</p>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 8 }}><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div style={{ marginBottom: 12 }}><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button className="primary" type="submit">{mode === 'signup' ? 'Sign up' : 'Login'}</button>
        </form>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
            Switch to {mode === 'signup' ? 'Login' : 'Sign up'}
          </button>
        </div>
        {msg ? <p className="muted" style={{ marginTop: 10 }}>{msg}</p> : null}
      </div>
    </main>
  );
}
