import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { CartProvider } from './context/CartContext.jsx'; // 🔥 THÊM DÒNG NÀY

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  </React.StrictMode>
);