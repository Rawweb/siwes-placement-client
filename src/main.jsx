import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* One Toaster for the whole app; toasts fired anywhere appear here. */}
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              fontSize: '13px',
              borderRadius: '10px',
            },
            success: {
              iconTheme: { primary: '#175E3F', secondary: '#fff' },
            },
          }}
        />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
