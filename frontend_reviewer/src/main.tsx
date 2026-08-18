import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ReviewerContextProvider } from './context/ReviewerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReviewerContextProvider>
      <App />
    </ReviewerContextProvider>
  </React.StrictMode>
);
