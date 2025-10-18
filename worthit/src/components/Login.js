import React from 'react';
import { Box, Button, Container, Typography, Paper, Fade, Zoom } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import { useAuth } from '../AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveBackground 20s linear infinite',
        },
        '@keyframes moveBackground': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={24} 
            sx={{ 
              p: 5, 
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Zoom in={true} timeout={800}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/logo192.png`}
                    alt="WorthIt Logo"
                    sx={{
                      height: 80,
                      width: 80,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                    }}
                  />
                </Box>
              </Zoom>
              
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                WorthIt
              </Typography>
              
              <Typography variant="h5" sx={{ color: '#666', fontWeight: 500, mb: 2 }}>
                Track Your Net Worth
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
                Manage your finances, calculate your net worth, and plan your financial future with ease
              </Typography>

              {/* Feature Pills */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: '#f0f4ff',
                  }}
                >
                  <TrendingUpIcon sx={{ color: '#667eea', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600 }}>
                    Track Growth
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: '#f0f4ff',
                  }}
                >
                  <AccountBalanceWalletIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#764ba2', fontWeight: 600 }}>
                    Manage Debts
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: '#f0f4ff',
                  }}
                >
                  <SavingsIcon sx={{ color: '#667eea', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600 }}>
                    Plan Future
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{ 
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              Sign in with Google
            </Button>
            
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 3,
                color: '#999',
              }}
            >
              Secure • Private • Easy to Use
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
