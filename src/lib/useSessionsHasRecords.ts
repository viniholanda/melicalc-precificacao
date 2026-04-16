import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * For a given list of session IDs, returns a map { sessionId -> hasRecords }.
 * Subscribes to realtime updates so the dot flips as soon as a mentee
 * adds (or removes) products in their session.
 */
export function useSessionsHasRecords(sessionIds: string[]): Record<string, boolean> {
  const idsKey = useMemo(
    () => [...sessionIds].sort().join(','),
    [sessionIds]
  );

  const [map, setMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const ids = idsKey ? idsKey.split(',') : [];
    if (ids.length === 0) return;

    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase!
        .from('quotes')
        .select('id, records')
        .in('id', ids);
      if (cancelled || error || !data) return;

      const next: Record<string, boolean> = {};
      for (const id of ids) next[id] = false;
      for (const row of data as { id: string; records: unknown }[]) {
        next[row.id] = Array.isArray(row.records) && row.records.length > 0;
      }
      setMap(next);
    };

    void load();

    const channel = supabase!
      .channel('mentees-has-records')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotes' },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | { id?: string; records?: unknown }
            | null;
          if (!row?.id || !ids.includes(row.id)) return;
          const has = Array.isArray(row.records) && row.records.length > 0;
          setMap(prev => (prev[row.id!] === has ? prev : { ...prev, [row.id!]: has }));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase!.removeChannel(channel);
    };
  }, [idsKey]);

  return map;
}
