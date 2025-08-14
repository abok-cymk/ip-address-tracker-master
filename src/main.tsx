import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Preload critical resources
const preloadResources = () => {
  const resources = [
    { href: '/pattern-bg-desktop.png', as: 'image' },
    { href: '/pattern-bg-mobile.png', as: 'image' },
    { href: '/icon-location.svg', as: 'image' },
    { href: '/icon-arrow.svg', as: 'image' },
  ];

  resources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

// Initialize preloading
preloadResources();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
