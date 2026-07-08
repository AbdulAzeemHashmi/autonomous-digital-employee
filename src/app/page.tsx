'use client';
import { useState, useRef, type ChangeEvent, type KeyboardEvent } from 'react';

const MAX_CHARS = 2000;

interface HistoryItem {
  input: string;
  output: string;
  ts: string;
  isError: boolean;
}

export default function Home() {
  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleDelegate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput('');
    setIsError(false);

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input }),
      });
      const data = await res.json();
      const success = data.status === 'success';
      const text = success ? data.output : (data.detail ?? 'Processing error');
      const errFlag = !success || text.startsWith('⚠️');

      setOutput(text);
      setIsError(errFlag);
      setHistory(prev => [{
        input: input.trim(),
        output: text,
        ts: new Date().toLocaleTimeString(),
        isError: errFlag,
      }, ...prev].slice(0, 5));

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    } catch {
      const errText = '❌ Failed to contact the agent. Is the backend running on port 8000?';
      setOutput(errText);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleDelegate();
  };

  const charPct = (input.length / MAX_CHARS) * 100;
  const charColor = charPct > 90 ? '#f87171' : charPct > 70 ? '#f59e0b' : '#94a3b8';

  return (
    <>
      {/* Grid overlay */}
      <div className="grid-overlay" />

      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

        {/* ── Hero Badge ── */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="chip">⚡ AI-Powered</span>
          <span className="chip">🔗 Gemini / GPT-4</span>
          <span className="chip">🗄️ Supabase</span>
        </div>

        {/* ── Title ── */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖</div>
          <h1 className="header-gradient" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Autonomous Digital Employee
          </h1>
          <p style={{ marginTop: '0.6rem', color: 'var(--color-muted)', fontSize: '0.9rem', maxWidth: '36ch', margin: '0.6rem auto 0' }}>
            Delegate tasks to your AI agent. Powered by LangChain&nbsp;+&nbsp;Gemini.
          </p>
        </div>

        {/* ── Main Card ── */}
        <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '2rem' }}>

          {/* Textarea */}
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Your Task
          </label>
          <textarea
            id="task-input"
            className="agent-textarea"
            rows={5}
            maxLength={MAX_CHARS}
            placeholder="e.g. Write a LinkedIn post about launching our new AI product…"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Char counter + hint */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
              <kbd style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.65rem' }}>Ctrl</kbd>
              &nbsp;+&nbsp;
              <kbd style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.65rem' }}>Enter</kbd>
              &nbsp; to submit
            </span>
            <span className="char-count" style={{ color: charColor }}>
              {input.length} / {MAX_CHARS}
            </span>
          </div>

          {/* Button */}
          <button
            id="delegate-btn"
            className="btn-primary"
            onClick={handleDelegate}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <><span className="spinner" />Agent is executing…</>
            ) : (
              <>⚡ Delegate Task</>
            )}
          </button>

          {/* Output */}
          {output && (
            <>
              <hr className="glow-divider" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Agent Response
                </span>
                <span className={`badge ${isError ? 'badge-warn' : 'badge-success'}`}>
                  <span className="badge-dot" />
                  {isError ? 'Needs Config' : 'Success'}
                </span>
              </div>
              <div ref={outputRef} className="output-box" id="agent-output">
                {output}
              </div>
              {!isError && (
                <button
                  onClick={() => { navigator.clipboard.writeText(output); }}
                  style={{ marginTop: '0.5rem', background: 'none', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', color: 'var(--color-muted)', fontSize: '0.75rem', padding: '0.35rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)')}
                >
                  📋 Copy to Clipboard
                </button>
              )}
            </>
          )}
        </div>

        {/* ── History ── */}
        {history.length > 0 && (
          <div style={{ width: '100%', maxWidth: '640px', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Recent Tasks
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => { setInput(h.input); setOutput(h.output); setIsError(h.isError); }}
                  style={{
                    background: 'rgba(13,18,40,0.5)',
                    border: '1px solid rgba(99,102,241,0.1)',
                    borderRadius: '0.6rem',
                    padding: '0.6rem 0.9rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)')}
                >
                  <span style={{ fontSize: '0.8rem', flex: 1, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.isError ? '⚠️' : '✅'} {h.input}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', flexShrink: 0 }}>{h.ts}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <p style={{ marginTop: '2.5rem', fontSize: '0.7rem', color: 'rgba(148,163,184,0.4)', textAlign: 'center' }}>
          Autonomous Digital Employee · Powered by LangChain, Gemini &amp; Supabase
        </p>
      </main>
    </>
  );
}
