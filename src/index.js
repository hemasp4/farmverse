import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './i18n';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
reportWebVitals();