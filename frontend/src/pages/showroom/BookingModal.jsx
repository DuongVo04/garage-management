import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Stack, 
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close, CalendarToday, Person, Phone } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient.jsx';

const BookingModal = ({ open, handleClose, vehicleId, vehicleName }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    viewer_name: '',
    phone_number: '',
    view_at: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (user && user.role_name === 'CUSTOMER') {
        try {
          const response = await apiClient.get('/customers/me');
          if (response.data && response.data.data) {
            const customer = response.data.data;
            setFormData(prev => ({
              ...prev,
              viewer_name: customer.full_name || user.username || '',
              phone_number: customer.phone_number || ''
            }));
          }
        } catch (err) {
          console.error('Error fetching customer info:', err);
          // Fallback to username if fetch fails
          setFormData(prev => ({
            ...prev,
            viewer_name: user.username || '',
          }));
        }
      } else if (user) {
        setFormData(prev => ({
          ...prev,
          viewer_name: user.username || '',
        }));
      }
    };

    if (open) {
      fetchCustomerInfo();
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const dataToSubmit = {
        ...formData,
        showroom_vehicle_id: vehicleId,
        status: 'pending'
      };
      
      await apiClient.post('/car-review-appointments', dataToSubmit);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
        setFormData({
          viewer_name: user?.full_name || user?.username || '',
          phone_number: user?.phone_number || '',
          view_at: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="800">
          Đặt lịch xem xe
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {success ? (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </Alert>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  Bạn đang đặt lịch xem xe: <strong>{vehicleName}</strong>
                </Typography>

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                <TextField
                  label="Họ và tên"
                  name="viewer_name"
                  value={formData.viewer_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                    }
                  }}
                />

                <TextField
                  label="Số điện thoại"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />
                    }
                  }}
                />

                <TextField
                  label="Thời gian xem xe"
                  name="view_at"
                  type="datetime-local"
                  value={formData.view_at}
                  onChange={handleChange}
                  fullWidth
                  required
                  slotProps={{
                    input: {
                      startAdornment: <CalendarToday sx={{ color: 'action.active', mr: 1 }} />
                    },
                    inputLabel: {
                      shrink: true,
                    }
                  }}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        
        {!success && (
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                px: 4, 
                py: 1.2, 
                borderRadius: 2, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Xác nhận đặt lịch'}
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default BookingModal;