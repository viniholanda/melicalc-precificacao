# Setup Supabase — compartilhamento em tempo real

Guia rápido para ligar o modo "cliente vê em tempo real".

## 1. Criar projeto Supabase

1. Entre em https://app.supabase.com e crie um projeto (free tier).
2. Espere provisionar (~1 min).

## 2. Criar a tabela `quotes`

Em **SQL Editor → New query**, rode:

```sql
create table if not exists public.quotes (
  id uuid primary key,
  records jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS: permitir leitura/escrita anônima (qualquer um com o uuid do link acessa).
alter table public.quotes enable row level security;

create policy "quotes_select_anon"
  on public.quotes for select
  to anon
  using (true);

create policy "quotes_insert_anon"
  on public.quotes for insert
  to anon
  with check (true);

create policy "quotes_update_anon"
  on public.quotes for update
  to anon
  using (true)
  with check (true);
```

## 3. Habilitar Realtime

1. Vá em **Database → Replication**.
2. Na tabela `quotes`, habilite a replicação (toggle).

## 4. Pegar as chaves

**Project Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public key` → `VITE_SUPABASE_ANON_KEY`

## 5. Local

Crie `.env` na raiz:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Rode `npm run dev`. O botão **Compartilhar** aparece no header.

## 6. Deploy Vercel

No painel do projeto na Vercel: **Settings → Environment Variables** → adicione as duas `VITE_SUPABASE_*` em *Production* e *Preview*. **Redeploy**.

O `vercel.json` já cuida do fallback da rota `/v/:id`.

## Como funciona

- No primeiro acesso, o app gera um `session id` (uuid) e guarda em `localStorage` (`meli-session-id`).
- Toda alteração em `savedRecords` faz `upsert` na linha `quotes[id]` (debounce 600ms).
- A rota `/v/<id>` lê a linha e assina mudanças via Realtime — atualiza sem reload.
- Para isolar por cliente, limpe `meli-session-id` no DevTools (Application → Local Storage) antes de gerar novo link. (Podemos adicionar um botão "Novo orçamento" se quiser.)

## Segurança

- A `anon key` é pública por design — pode ir no bundle.
- Qualquer um com o `uuid` do link consegue ler/editar a linha. Use uuids (não sequenciais) — já é o caso via `crypto.randomUUID()`.
- Se quiser restringir escrita apenas ao dono, precisa de auth. Fora de escopo da v1.
