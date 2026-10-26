import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ResponsiveRouter from './app/ResponsiveRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter><ResponsiveRouter /></BrowserRouter>
  </StrictMode>
);
