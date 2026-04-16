import { useEffect, useState } from 'react';
import { Package, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

type CommentColor = 'green' | 'yellow' | 'red' | '';

interface SavedRecord {
  id: string;
  name: string;
  link: string;
  sellingPrice: number;
  comment: string;
  commentColor: CommentColor;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

interface Props {
  sessionId: string;
}

export default function ClientView({ sessionId }: Props) {
  const [records, setRecords] = useState<SavedRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('meli-theme') === 'dark';
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Aplicação não configurada.');
      return;
    }

    let cancelled = false;

    const load = async () => {
      const { data, error: err } = await supabase
        .from('quotes')
        .select('records')
        .eq('id', sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (err) {
        setError('Não foi possível carregar este orçamento.');
        return;
      }
      setRecords(((data?.records as SavedRecord[]) ?? []));
    };

    void load();

    const channel = supabase
      .channel(`quote:${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotes', filter: `id=eq.${sessionId}` },
        (payload) => {
          const next = (payload.new as { records?: SavedRecord[] } | null)?.records;
          if (Array.isArray(next)) setRecords(next);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-error" size={40} />
          <p className="text-on-surface">{error}</p>
        </div>
      </div>
    );
  }

  if (records === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 flex items-center px-6 bg-surface border-b border-outline-variant/20">
        <h1 className="text-xl font-bold text-primary dark:text-white tracking-wide uppercase">MeliCalc</h1>
        <span className="ml-4 text-xs text-outline">Orçamento do cliente</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ml-green">
          <span className="w-2 h-2 rounded-full bg-ml-green animate-pulse" />
          ao vivo
        </span>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-10">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-6">
          Proposta de preços
        </h2>

        {records.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-10 text-center text-outline">
            Nenhum produto adicionado ainda. Esta página atualiza automaticamente.
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl overflow-hidden">
            <ul className="divide-y divide-outline-variant/10">
              {records.map((r) => {
                const borderColor =
                  r.commentColor === 'green'
                    ? 'border-l-green-500'
                    : r.commentColor === 'yellow'
                    ? 'border-l-amber-400'
                    : r.commentColor === 'red'
                    ? 'border-l-red-500'
                    : 'border-l-transparent';
                return (
                  <li
                    key={r.id}
                    className={`p-5 border-l-4 ${borderColor} flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6`}
                  >
                    <div className="w-9 h-9 rounded bg-surface-container flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-outline" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface truncate" title={r.name}>
                        {r.name || 'Sem nome'}
                      </p>
                      {r.link && (
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary dark:text-white hover:underline text-xs mt-1"
                        >
                          <ExternalLink size={11} />
                          ver anúncio
                        </a>
                      )}
                      {r.comment && (
                        <p className="text-xs text-on-surface-variant mt-2">{r.comment}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-outline font-bold">
                        Preço
                      </p>
                      <p className="font-mono font-extrabold text-xl text-on-surface">
                        {formatCurrency(r.sellingPrice)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-outline mt-8">
          Esta página é atualizada automaticamente conforme novos itens são adicionados.
        </p>
      </main>
    </div>
  );
}
