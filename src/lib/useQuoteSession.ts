import { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const SESSION_KEY = 'meli-session-id';

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type SyncStatus = 'disabled' | 'idle' | 'saving' | 'saved' | 'error';

export function useQuoteSession<T>(records: T[]) {
  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = makeId();
    localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  });

  const [status, setStatus] = useState<SyncStatus>(
    isSupabaseConfigured ? 'idle' : 'disabled'
  );

  const firstRun = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (firstRun.current) {
      firstRun.current = false;
      void supabase
        .from('quotes')
        .upsert({ id: sessionId, records })
        .then(({ error }) => {
          if (error) setStatus('error');
        });
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    setStatus('saving');
    timer.current = setTimeout(async () => {
      const { error } = await supabase
        .from('quotes')
        .upsert({ id: sessionId, records, updated_at: new Date().toISOString() });
      setStatus(error ? 'error' : 'saved');
    }, 600);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [records, sessionId]);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/v/${sessionId}`
      : '';

  return { sessionId, status, shareUrl };
}
