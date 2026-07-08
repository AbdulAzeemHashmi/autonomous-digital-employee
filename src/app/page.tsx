'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelegate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input }),
      });
      const data = await res.json();
      setOutput(data.status === 'success' ? data.output : 'Processing error');
    } catch {
      setOutput('Failed to contact agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
        <h1 className="text-2xl font-bold text-indigo-400 mb-4">🤖 Autonomous Digital Employee</h1>
        <textarea
          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
          rows={3}
          placeholder="Give your agent a manual task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleDelegate} disabled={loading} className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold">
          {loading ? 'Agent is executing...' : 'Delegate Task'}
        </button>
        {output && <div className="mt-6 p-4 bg-slate-900 border border-slate-700 rounded-lg whitespace-pre-line text-slate-300">{output}</div>}
      </div>
    </div>
  );
}
