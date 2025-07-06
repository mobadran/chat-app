import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from '@/context/theme-provider.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/components/login-page.tsx';
import Register from '@/components/register-page.tsx';
import { AuthProvider } from '@/context/auth-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/query-client.ts';
import Conversation from '@/components/conversation.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/conversations/:id" element={<Conversation />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
