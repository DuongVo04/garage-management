import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import { 
  Build, 
  DirectionsCar, 
  Settings, 
  CleaningServices, 
  Speed, 
  Handyman,
  CalendarToday,
  CheckCircle
} from '@mui/icons-material';

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const price = Number(service.price) || 0;
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  const getServiceIcon = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('bảo dưỡng')) return <Settings sx={{ fontSize: 35 }} />;
    if (n.includes('vệ sinh') || n.includes('rửa')) return <CleaningServices sx={{ fontSize: 35 }} />;
    if (n.includes('phanh') || n.includes('lốp')) return <Build sx={{ fontSize: 35 }} />;
    if (n.includes('động cơ') || n.includes('dầu')) return <Handyman sx={{ fontSize: 35 }} />;
    if (n.includes('đánh bóng')) return <Speed sx={{ fontSize: 35 }} />;
    return <DirectionsCar sx={{ fontSize: 35 }} />;
  };

  const handleBooking = () => {
    alert(`Bạn đang chọn dịch vụ: ${service.name}\nGiá: ${formattedPrice}\n\nChức năng đặt lịch trực tuyến đang được đồng bộ với hệ thống. Vui lòng đợi trong giây lát!`);
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'divider',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        borderColor: 'primary.main',
        '& .booking-btn': {
          bgcolor: 'primary.main',
          color: 'white'
        }
      }
    }}>
      {/* Header with Icon */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        bgcolor: 'rgba(25, 118, 210, 0.04)'
      }}>
        <Avatar sx={{ 
          width: 60, 
          height: 60, 
          bgcolor: 'white', 
          color: 'primary.main', 
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {getServiceIcon(service.name)}
        </Avatar>
        <Box>
          <Typography variant="h6" color="primary.main" fontWeight="900" sx={{ lineHeight: 1.2 }}>
            {formattedPrice}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
            <CheckCircle sx={{ fontSize: 14 }} color="success" /> Đang sẵn sàng
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
        <Typography variant="h5" component="h2" fontWeight="900" gutterBottom sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '3.5rem',
          lineHeight: 1.3,
          mb: 2
        }}>
          {service.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 3,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '3.8rem',
          lineHeight: 1.6
        }}>
          {service.description || 'Dịch vụ chuyên nghiệp tối ưu cho xế yêu của bạn.'}
        </Typography>

        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

        <Stack spacing={1.5}>
          <Button 
            fullWidth 
            variant="contained" 
            className="booking-btn"
            startIcon={<CalendarToday />}
            onClick={handleBooking}
            sx={{ 
              borderRadius: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: '900',
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)' }
            }}
          >
            Đặt lịch ngay
          </Button>
          
          <Typography variant="caption" color="text.disabled" textAlign="center">
            Miễn phí tư vấn & kiểm tra tổng quát
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
