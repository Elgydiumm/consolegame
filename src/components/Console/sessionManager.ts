import { Session } from '@supabase/supabase-js';

// Current session storage
let currentSession: Session | null = null;

// Store session
export function setSession(session: Session | null): void {
  currentSession = session;
  
  // Also store in localStorage for persistence across page reloads
  if (session) {
    localStorage.setItem('consoleGameSession', JSON.stringify(session));
  } else {
    localStorage.removeItem('consoleGameSession');
  }
  
  window.dispatchEvent(new CustomEvent('sessionChanged', { 
    detail: { session } 
  }));
}

export function getSession(): Session | null {
  if (!currentSession) {

    const savedSession = localStorage.getItem('consoleGameSession');
    if (savedSession) {
      try {
        currentSession = JSON.parse(savedSession);
      } catch (e) {
        console.error('Failed to parse saved session:', e);
      }
    }
  }
  return currentSession;
}

if (typeof window !== 'undefined') {
  getSession();
}