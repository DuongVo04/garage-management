import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import EngineeringIcon from '@mui/icons-material/Engineering';

const AppointmentsTab = ({ appointments, setSnackbar }) => {
  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Đang chờ', color: 'warning', icon: <PendingIcon /> },
      confirmed: { label: 'Đã xác nhận', color: 'info', icon: <CheckCircleIcon /> },
      in_progress: { label: 'Đang sửa', color: 'primary', icon: <EngineeringIcon /> },
      completed: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleIcon /> },
      cancelled: { label: 'Đã hủy', color: 'error', icon: <CancelIcon /> },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatDateOnly = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatTimeOnly = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!appointments || appointments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Chưa có lịch đặt sửa xe
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Bạn chưa có lịch hẹn sửa chữa nào. Hãy đặt lịch ngay!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {appointments.map((appointment) => (
        <Grid item xs={12} key={appointment.id}>
          <Card>
            <CardContent>
              {/* Vùng chứa thông tin chính */}
              <Grid container spacing={2} alignItems="flex-start">
                
                {/* 1. Cột Ngày hẹn */}
                <Grid item xs={12} sm={6} md={2.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EventIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Ngày hẹn</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDateOnly(appointment.appointment_date)}
                  </Typography>
                </Grid>

                {/* 2. Cột Giờ */}
                <Grid item xs={12} sm={6} md={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTimeIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Giờ</Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatTimeOnly(appointment.appointment_date) || '08:00'}
                  </Typography>
                </Grid>

                {/* 3. Cột Xe */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DirectionsCarIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Xe</Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.vehicle?.name || 'Chưa có thông tin'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {appointment.vehicle?.plate_number}
                  </Typography>
                </Grid>

                {/* 4. Cột Thợ sửa */}
                <Grid item xs={12} sm={6} md={2.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">Thợ sửa</Typography>
                  </Box>
                  <Typography variant="body1">
                    {appointment.mechanic?.name || 'Chưa phân công'}
                  </Typography>
                </Grid>

                {/* 5. Cột Trạng thái */}
                <Grid item xs={12} md={2.5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Box>
                    {getStatusChip(appointment.status)}
                  </Box>
                </Grid>

                {/* 6. DÒNG MÔ TẢ - BỊ ÉP XUỐNG DƯỚI CÙNG (xs=12) */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    mt: 1, 
                    pt: 2, 
                    borderTop: '1px dashed #e0e0e0', // Đường kẻ đứt phân cách
                    display: 'flex', 
                    gap: 1 
                  }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ whiteSpace: 'nowrap' }}>
                      Mô tả:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.description || 'Không có mô tả'}
                    </Typography>
                  </Box>
                </Grid>

                {/* 7. Nút thao tác (Chỉ hiện khi Pending) */}
                {appointment.status?.toLowerCase() === 'pending' && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                      <Button size="small" variant="outlined" color="error">
                        Hủy lịch
                      </Button>
                      <Button size="small" variant="contained">
                        Sửa lịch
                      </Button>
                    </Box>
                  </Grid>
                )}

              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AppointmentsTab;