import '@fontsource/nunito/600.css';
import '@fontsource/nunito/800.css';
import '@fontsource/baloo-2/600.css';
import '@fontsource/baloo-2/800.css';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
