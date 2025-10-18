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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useCurrency } from '../CurrencyContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ItemList = ({ title, items, onAdd, onEdit, onDelete, showInterest = false }) => {
  const { formatCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    date: dayjs(),
  });

  const handleOpen = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        amount: item.amount.toString(),
        interestRate: item.interestRate ? item.interestRate.toString() : '',
        date: item.date ? dayjs(item.date.toDate()) : dayjs(),
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', amount: '', interestRate: '', date: dayjs() });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({ name: '', amount: '', interestRate: '', date: dayjs() });
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);
    const interestRate = formData.interestRate ? parseFloat(formData.interestRate) : 0;

    if (!formData.name || isNaN(amount)) {
      alert('Please fill in all required fields');
      return;
    }

    const itemData = {
      name: formData.name,
      amount: amount,
      date: formData.date.toDate(),
      ...(showInterest && { interestRate: interestRate }),
    };

    if (editingItem) {
      onEdit(editingItem.id, itemData);
    } else {
      onAdd(itemData);
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
          {title}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(-1px)',
            }
          }}
        >
          Add
        </Button>
      </Box>
      <Divider sx={{ mb: 2, opacity: 0.6 }} />
      <List>
        {items.length === 0 ? (
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
              No items added yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click "Add" to create your first entry
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    aria-label="edit" 
                    onClick={() => handleOpen(item)} 
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
                    onClick={() => onDelete(item.id)}
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
                primary={item.name}
                secondary={
                  <>
                    {showInterest && item.interestRate
                      ? `${formatCurrency(item.amount)} (${item.interestRate}% interest)`
                      : formatCurrency(item.amount)}
                    {item.date && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {dayjs(item.date.toDate()).format('MMM DD, YYYY')}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
          ))
        )}
      </List>

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
          {editingItem ? 'Edit' : 'Add'} {title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          {showInterest && (
            <TextField
              margin="dense"
              label="Interest Rate (%)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              inputProps={{ step: '0.1' }}
              sx={{ mb: 2 }}
            />
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
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
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ItemList;
