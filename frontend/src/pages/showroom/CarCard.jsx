import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Button,
  Divider
} from '@mui/material';
import { DirectionsCar, Event, Payment } from '@mui/icons-material';

const CarCard = ({ car }) => {
  const { 
    name, 
    year, 
    new_price, 
    old_price, 
    thumbnail, 
    brand, 
    color, 
    latest_odo 
  } = car;

  // Hỗ trợ cả ảnh từ local upload và ảnh từ URL tuyệt đối (cho Mock data)
  const imageUrl = thumbnail 
    ? (thumbnail.startsWith('http') 
        ? thumbnail 
        : `${import.meta.env.VITE_API_URL}/uploads/showroom-vehicles/${thumbnail}`)
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'; // Ảnh xe mặc định đẹp hơn placeholder

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6
      },
      borderRadius: 2
    }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
            {name}
          </Typography>
          <Chip label={brand?.name || 'Unknown'} size="small" color="primary" variant="outlined" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
          <Event fontSize="small" />
          <Typography variant="body2">
            Năm sản xuất: {year}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
          <DirectionsCar fontSize="small" />
          <Typography variant="body2">
            Màu sắc: {color || 'N/A'} • {latest_odo?.toLocaleString()} km
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ mt: 'auto' }}>
          {old_price && old_price > new_price && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {formatPrice(old_price)}
            </Typography>
          )}
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {formatPrice(new_price)}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" color="primary" disableElevation>
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
};

export default CarCard;
