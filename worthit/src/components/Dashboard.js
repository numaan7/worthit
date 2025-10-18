import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../AuthContext';
import { useCurrency } from '../CurrencyContext';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import NetWorthCalculator from './NetWorthCalculator';
import ItemList from './ItemList';
import PaymentList from './PaymentList';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const [loans, setLoans] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Set up real-time listeners for all collections
    const collections = [
      { name: 'loans', setter: setLoans },
      { name: 'debts', setter: setDebts },
      { name: 'payments', setter: setPayments },
      { name: 'liabilities', setter: setLiabilities },
    ];

    const unsubscribes = collections.map(({ name, setter }) => {
      const q = query(collection(db, name), where('userId', '==', currentUser.uid));
      return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setter(items);
      });
    });

    setLoading(false);

    // Cleanup subscriptions on unmount
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [currentUser]);

  const handleAdd = async (collectionName, data) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleEdit = async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/logo192.png`}
              alt="WorthIt Logo"
              sx={{
                height: 40,
                width: 40,
                mr: 1.5,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              WorthIt
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 2, 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Track Your Financial Journey
            </Typography>
          </Box>
          <FormControl 
            sx={{ 
              minWidth: 120, 
              mr: 2,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }} 
            size="small"
          >
            <InputLabel 
              id="currency-select-label" 
              sx={{ 
                color: 'white',
                '&.Mui-focused': { color: 'white' },
              }}
            >
              Currency
            </InputLabel>
            <Select
              labelId="currency-select-label"
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
              sx={{ 
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                }
              }}
            >
              {currencies.map((curr) => (
                <MenuItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography 
            variant="body1" 
            sx={{ 
              mr: 2,
              display: { xs: 'none', md: 'block' },
              opacity: 0.95,
            }}
          >
            {currentUser?.displayName || currentUser?.email}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 5, mb: 6, px: { xs: 2, sm: 3 } }}>
        <NetWorthCalculator
          loans={loans}
          debts={debts}
          payments={payments}
          liabilities={liabilities}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ItemList
              title="Loans"
              items={loans}
              onAdd={(data) => handleAdd('loans', data)}
              onEdit={(id, data) => handleEdit('loans', id, data)}
              onDelete={(id) => handleDelete('loans', id)}
              showInterest={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ItemList
              title="Debts"
              items={debts}
              onAdd={(data) => handleAdd('debts', data)}
              onEdit={(id, data) => handleEdit('debts', id, data)}
              onDelete={(id) => handleDelete('debts', id)}
              showInterest={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PaymentList
              payments={payments}
              loans={loans}
              debts={debts}
              onAdd={(data) => handleAdd('payments', data)}
              onEdit={(id, data) => handleEdit('payments', id, data)}
              onDelete={(id) => handleDelete('payments', id)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ItemList
              title="Other Liabilities"
              items={liabilities}
              onAdd={(data) => handleAdd('liabilities', data)}
              onEdit={(id, data) => handleEdit('liabilities', id, data)}
              onDelete={(id) => handleDelete('liabilities', id)}
              showInterest={false}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
