import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Divider,
  Fade,
  Grow,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useCurrency } from '../CurrencyContext';

const NetWorthCalculator = ({ loans, debts, payments, liabilities }) => {
  const { formatCurrency } = useCurrency();
  const [targetAmount, setTargetAmount] = useState('');
  const [timePeriod, setTimePeriod] = useState('year');

  // Calculate total payments made
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate total loans with interest (before any payments)
  const totalLoansWithInterest = loans.reduce((sum, loan) => {
    const principal = loan.amount;
    const interest = loan.interestRate ? (principal * loan.interestRate) / 100 : 0;
    return sum + principal + interest;
  }, 0);

  // Calculate total debts (before any payments)
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

  // Calculate total other liabilities
  const totalOtherLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);

  // Net Worth Formula: -(Loans with Interest) + Payments Made - Debts - Other Liabilities
  const netWorth = -totalLoansWithInterest + totalPayments - totalDebts - totalOtherLiabilities;
  const isPositive = netWorth >= 0;

  // Calculate earnings needed per period
  const calculateEarningsNeeded = () => {
    if (isPositive) return null;

    const amountNeeded = targetAmount ? parseFloat(targetAmount) : Math.abs(netWorth);
    const daysInPeriod = {
      day: 1,
      week: 7,
      month: 30,
      year: 365,
    };

    const days = daysInPeriod[timePeriod];
    const perDay = amountNeeded / days;

    return {
      perDay: perDay,
      perWeek: perDay * 7,
      perMonth: perDay * 30,
      perYear: perDay * 365,
      target: amountNeeded,
      period: timePeriod,
    };
  };

  const earningsNeeded = calculateEarningsNeeded();

  return (
    <Box sx={{ mb: 4 }}>
      {/* Net Worth Display */}
      <Grow in={true} timeout={1000}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 3,
            background: isPositive
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 3,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            {isPositive ? (
              <TrendingUpIcon sx={{ fontSize: 48, mr: 2, animation: 'pulse 2s infinite' }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 48, mr: 2, animation: 'pulse 2s infinite' }} />
            )}
            <Typography variant="h4" component="h1" fontWeight="bold">
              Your Net Worth
            </Typography>
          </Box>
          <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
            {isPositive ? '+' : '-'}
            {formatCurrency(netWorth)}
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.95 }}>
            {isPositive ? '🎉 Your finances are in the positive!' : '⚠️ Your finances are negative'}
          </Typography>
        </Paper>
      </Grow>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1200}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffe8ec 100%)',
                border: '2px solid',
                borderColor: '#ffccd5',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(255, 87, 108, 0.15)',
                  borderColor: '#f5576c',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(245, 87, 108, 0.1)',
                      mr: 2,
                    }}
                  >
                    <AccountBalanceWalletIcon sx={{ fontSize: 28, color: '#f5576c' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                    Total Loans (with Interest)
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#f5576c', fontWeight: 700 }}>
                  {formatCurrency(totalLoansWithInterest)}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1400}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #e8f5ff 0%, #d4edff 100%)',
                border: '2px solid',
                borderColor: '#a8d8ff',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(46, 125, 50, 0.15)',
                  borderColor: '#2e7d32',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(46, 125, 50, 0.1)',
                      mr: 2,
                    }}
                  >
                    <PaymentsIcon sx={{ fontSize: 28, color: '#2e7d32' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                    Payments Made
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 700 }}>
                  {formatCurrency(totalPayments)}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1600}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #fff4e6 0%, #ffe9d0 100%)',
                border: '2px solid',
                borderColor: '#ffd4a8',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(255, 152, 0, 0.15)',
                  borderColor: '#ff9800',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      mr: 2,
                    }}
                  >
                    <CreditCardIcon sx={{ fontSize: 28, color: '#ff9800' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                    Total Debts & Liabilities
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {formatCurrency(totalDebts + totalOtherLiabilities)}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Earnings Calculator for Negative Net Worth */}
      {!isPositive && (
        <Fade in={true} timeout={1800}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              💰 Calculate Earnings Needed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              See how much you need to earn per day/week/month/year to reach your target
            </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Amount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder={formatCurrency(Math.abs(netWorth))}
                helperText="Leave empty to break even (reach $0)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Time Period"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <MenuItem value="day">Per Day</MenuItem>
                <MenuItem value="week">Per Week</MenuItem>
                <MenuItem value="month">Per Month</MenuItem>
                <MenuItem value="year">Per Year</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {earningsNeeded && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                To reach {formatCurrency(earningsNeeded.target)} in one {earningsNeeded.period}, you need to earn:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Per Day
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(earningsNeeded.perDay)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Per Week
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(earningsNeeded.perWeek)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Per Month
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(earningsNeeded.perMonth)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">
                        Per Year
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(earningsNeeded.perYear)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default NetWorthCalculator;
