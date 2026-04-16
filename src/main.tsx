import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const SESSION_KEY = 'meli-session-id';

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateLocalSession(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const fresh = makeId();
  localStorage.setItem(SESSION_KEY, fresh);
  return fresh;
}

function Root() {
  const path = window.location.pathname;

  // Shared session: /s/:id — both seller and client use full app
  const sharedMatch = path.match(/^\/s\/([^/]+)\/?$/);
  if (sharedMatch) {
    const sessionId = decodeURIComponent(sharedMatch[1]);
    return <App sessionId={sessionId} />;
  }

  // Own session from localStorage
  return <App sessionId={getOrCreateLocalSession()} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
