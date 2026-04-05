import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { updateMyCustomerInfo } from '../../../services/customer.service';

const PersonalInfoTab = ({ customerData, onUpdateSuccess, setSnackbar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: customerData?.full_name || '',
    phone_number: customerData?.phone_number || '',
    email: customerData?.email || '',
    address: customerData?.address || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: customerData?.full_name || '',
      phone_number: customerData?.phone_number || '',
      email: customerData?.email || '',
      address: customerData?.address || '',
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateMyCustomerInfo(formData);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Cập nhật thông tin thành công!',
          severity: 'success',
        });
        setIsEditing(false);
        onUpdateSuccess();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Cập nhật thất bại',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const InfoField = ({ label, value, icon: Icon, name }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
      <Box sx={{ color: 'primary.main', mt: 0.5 }}>
        <Icon />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {isEditing ? (
          <TextField
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            fullWidth
            size="small"
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        ) : (
          <Typography variant="body1">
            {value || <span style={{ color: '#999' }}>Chưa cập nhật</span>}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ textAlign: 'center', height: '100%' }}>
          <CardContent>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {customerData?.full_name || 'Chưa có tên'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{customerData?.account?.username || 'username'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountCircleIcon fontSize="small" />
                ID: {customerData?.id?.slice(0, 8)}...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Thông tin chi tiết</Typography>
              {!isEditing ? (
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  variant="outlined"
                  size="small"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    variant="outlined"
                    size="small"
                    color="error"
                  >
                    Hủy
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    variant="contained"
                    size="small"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Lưu'}
                  </Button>
                </Box>
              )}
            </Box>

            <InfoField
              label="Họ và tên"
              value={customerData?.full_name}
              icon={PersonIcon}
              name="full_name"
            />
            <InfoField
              label="Số điện thoại"
              value={customerData?.phone_number}
              icon={PhoneIcon}
              name="phone_number"
            />
            <InfoField
              label="Email"
              value={customerData?.email}
              icon={EmailIcon}
              name="email"
            />
            <InfoField
              label="Địa chỉ"
              value={customerData?.address}
              icon={LocationOnIcon}
              name="address"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PersonalInfoTab;