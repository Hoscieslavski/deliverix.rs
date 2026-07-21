import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { DeliverixInitialData } from './types';

export function render(initialData: DeliverixInitialData) {
  const html = renderToString(
    <React.StrictMode>
      <App initialData={initialData} />
    </React.StrictMode>
  );
  return { html };
}
