import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ProviderContextProvider } from './context/ProviderContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProviderContextProvider>
      <App />
    </ProviderContextProvider>
  </React.StrictMode>
);
