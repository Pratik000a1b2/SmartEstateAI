import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress unhandled third-party DOM/reCAPTCHA style access errors
window.addEventListener('error', (event) => {
  if (event.message && (event.message.includes("reading 'style'") || event.message.includes("Cannot read properties of null"))) {
    console.warn('Prevented unhandled third-party DOM style access exception:', event.message);
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
