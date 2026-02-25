import './globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ProductsApp } from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ProductsApp />
    </React.StrictMode>
  );
}