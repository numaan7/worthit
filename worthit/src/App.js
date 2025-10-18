import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './AuthContext';
import { CurrencyProvider } from './CurrencyContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InstallPWA from './components/InstallPWA';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      <CssBaseline />
      {currentUser ? <Dashboard /> : <Login />}
      <InstallPWA />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
