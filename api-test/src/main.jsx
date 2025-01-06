import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root element
root.render(  // Use this method to render your app
  <StrictMode>
    <App />
  </StrictMode>
);
