import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DeliverixInitialData } from './types';

const container = document.getElementById('root')!;

// Preuzimanje jedinstvenog objekta sa inicijalnim podacima koje je server ubacio u window
const initialData: DeliverixInitialData | undefined = (window as any).__DELIVERIX_INITIAL_DATA__;

if ((window as any).__DELIVERIX_SSR__) {
  hydrateRoot(
    container,
    <StrictMode>
      <App initialData={initialData} />
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <App initialData={initialData} />
    </StrictMode>
  );
}
