import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { I18nProvider } from './i18n/index.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </I18nProvider>
  </React.StrictMode>
);
