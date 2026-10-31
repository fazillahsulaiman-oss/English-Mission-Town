import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import './styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setupEmbedResize } from './embed';
import type { Mode } from './sections/Pricing';

const root = document.getElementById('root')!;
const mode: Mode = root.dataset.mode === 'owner' ? 'owner' : 'customer';

createRoot(root).render(
  <StrictMode>
    <App mode={mode} />
  </StrictMode>,
);

setupEmbedResize();
