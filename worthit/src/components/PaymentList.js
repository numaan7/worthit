import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useCurrency } from '../CurrencyContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const PaymentList = ({ payments, loans, debts, onAdd, onEdit, onDelete }) => {
  const { formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    targetType: 'loan', // 'loan' or 'debt'
    targetId: '',
    targetName: '',
    amount: '',
    date: dayjs(),
  });

  // Combine loans and debts for selection
  const availableTargets = [
    ...loans.map(loan => {
      const principal = loan.amount;
      const interest = loan.interestRate ? (principal * loan.interestRate) / 100 : 0;
      const totalAmount = principal + interest;
      return {
        ...loan,
        type: 'loan',
        displayAmount: totalAmount,
        displayName: loan.interestRate 
          ? `${loan.name} (Loan - ${loan.interestRate}% interest)`
          : `${loan.name} (Loan)`
      };
    }),
    ...debts.map(debt => ({
      ...debt,
      type: 'debt',
      displayAmount: debt.amount,
      displayName: `${debt.name} (Debt)`
    })),
  ];

  const handleOpen = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        targetType: payment.targetType,
        targetId: payment.targetId,
        targetName: payment.targetName,
        amount: payment.amount.toString(),
        date: payment.date ? dayjs(payment.date.toDate()) : dayjs(),
      });
    } else {
      setEditingPayment(null);
      setFormData({
        targetType: 'loan',
        targetId: '',
        targetName: '',
        amount: '',
        date: dayjs(),
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPayment(null);
    setFormData({
      targetType: 'loan',
      targetId: '',
      targetName: '',
      amount: '',
      date: dayjs(),
    });
  };

  const handleTargetChange = (targetId) => {
    const selected = availableTargets.find(t => t.id === targetId);
    if (selected) {
      setFormData({
        ...formData,
        targetId: selected.id,
        targetName: selected.name,
        targetType: selected.type,
        amount: selected.displayAmount.toString(), // Pre-fill with full amount including interest
      });
    }
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);

    if (!formData.targetId || !formData.targetName || isNaN(amount) || amount <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    const paymentData = {
      targetType: formData.targetType,
      targetId: formData.targetId,
      targetName: formData.targetName,
      amount: amount,
      date: formData.date.toDate(),
    };

    if (editingPayment) {
      onEdit(editingPayment.id, paymentData);
    } else {
      onAdd(paymentData);
    }

    handleClose();
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Payments Made
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={availableTargets.length === 0}
          sx={{
            borderRadius: 2,
            background: availableTargets.length === 0 
              ? undefined 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: availableTargets.length === 0 
              ? undefined 
              : '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: availableTargets.length === 0 
                ? undefined 
                : '0 6px 16px rgba(102, 126, 234, 0.4)',
              transform: availableTargets.length === 0 
                ? undefined 
                : 'translateY(-1px)',
            }
          }}
        >
          Add
        </Button>
      </Box>
      <Divider sx={{ mb: 2, opacity: 0.6 }} />
      
      {availableTargets.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            px: 2,
            borderRadius: 2,
            bgcolor: '#f8f9fa',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Add loans or debts first to record payments
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Create a loan or debt entry to get started
          </Typography>
        </Box>
      ) : (
        <List>
          {payments.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 4,
                px: 2,
                borderRadius: 2,
                bgcolor: '#f8f9fa',
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No payments recorded yet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click "Add" to record your first payment
              </Typography>
            </Box>
          ) : (
            payments.map((payment) => (
              <ListItem
                key={payment.id}
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      onClick={() => handleOpen(payment)} 
                      sx={{ 
                        mr: 1,
                        color: '#667eea',
                        '&:hover': { 
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => onDelete(payment.id)}
                      sx={{ 
                        color: '#f5576c',
                        '&:hover': { 
                          bgcolor: 'rgba(245, 87, 108, 0.1)',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                sx={{ 
                  bgcolor: 'white',
                  mb: 1.5, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateX(4px)',
                    borderColor: '#667eea',
                  }
                }}
              >
                <ListItemText
                  primary={`Payment to: ${payment.targetName}`}
                  secondary={
                    <>
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        {formatCurrency(payment.amount)}
                      </Typography>
                      {payment.date && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {dayjs(payment.date.toDate()).format('MMM DD, YYYY')}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle 
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {editingPayment ? 'Edit' : 'Record'} Payment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="target-select-label">Pay Towards</InputLabel>
            <Select
              labelId="target-select-label"
              value={formData.targetId}
              label="Pay Towards"
              onChange={(e) => handleTargetChange(e.target.value)}
              disabled={!!editingPayment}
            >
              {availableTargets.map((target) => (
                <MenuItem key={target.id} value={target.id}>
                  {target.displayName} - {formatCurrency(target.displayAmount)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Payment Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            helperText="Enter full amount or partial payment"
            sx={{ mb: 2 }}
          />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Payment Date"
              value={formData.date}
              onChange={(newDate) => setFormData({ ...formData, date: newDate })}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPayment ? 'Update' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaymentList;
