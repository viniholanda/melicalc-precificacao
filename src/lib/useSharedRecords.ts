import { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export type SyncStatus = 'disabled' | 'loading' | 'idle' | 'saving' | 'saved' | 'error';

/**
 * Bidirectional sync of savedRecords with Supabase.
 * - On mount: loads records from Supabase for this sessionId.
 * - Realtime subscription: remote changes update local state.
 * - Local changes: debounced upsert to Supabase (skips if change came from remote).
 */
export function useSharedRecords<T>(
  sessionId: string,
  localFallback: T[]
): [T[], React.Dispatch<React.SetStateAction<T[]>>, SyncStatus] {
  const [records, setRecords] = useState<T[]>(localFallback);
  const [status, setStatus] = useState<SyncStatus>(
    isSupabaseConfigured ? 'loading' : 'disabled'
  );

  const fromRemote = useRef(false);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial + subscribe to realtime
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('records')
        .eq('id', sessionId)
        .maybeSingle();

      if (cancelled) return;
      if (error) { setStatus('error'); return; }

      if (data?.records) {
        fromRemote.current = true;
        setRecords(data.records as T[]);
      } else {
        // First time this session — create row with current local records
        await supabase
          .from('quotes')
          .upsert({ id: sessionId, records: localFallback });
      }
      loaded.current = true;
      setStatus('idle');
    };

    void load();

    const channel = supabase
      .channel(`quote:${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotes', filter: `id=eq.${sessionId}` },
        (payload) => {
          const next = (payload.new as { records?: T[] } | null)?.records;
          if (Array.isArray(next)) {
            fromRemote.current = true;
            setRecords(next);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Push local changes to Supabase (debounced)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (!loaded.current) return;

    // Change came from remote — skip push to avoid echo loop
    if (fromRemote.current) {
      fromRemote.current = false;
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    setStatus('saving');
    timer.current = setTimeout(async () => {
      const { error } = await supabase!
        .from('quotes')
        .upsert({ id: sessionId, records, updated_at: new Date().toISOString() });
      setStatus(error ? 'error' : 'saved');
    }, 600);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [records, sessionId]);

  return [records, setRecords, status];
}
