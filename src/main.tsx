import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// PWA: register in production builds (use `npm run build` + `npm run preview` to test locally).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('[FocusForge] Service worker registered:', registration.scope);
      })
      .catch((err) => {
        console.warn('[FocusForge] Service worker registration failed:', err);
      });
  });
}
