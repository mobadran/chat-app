import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from '@/context/theme-provider.tsx';
// import { createBrowserRouter, RouterProvider } from 'react-router';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/components/login-page.tsx';
import Register from '@/components/register-page.tsx';
import { AuthProvider } from '@/context/auth-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
