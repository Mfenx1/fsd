import './globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatApp } from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ChatApp />
    </StrictMode>
  );
}