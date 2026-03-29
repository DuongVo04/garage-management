import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Button,
  Divider,
  Stack
} from '@mui/material';
import { DirectionsCar, Event, Payment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { 
    id,
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
  // Lưu ý: VITE_API_BASE_URL thường là http://localhost:3000/api/v1
  // Ta cần lấy base URL của server (không có /api/v1) để truy cập /uploads
  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  
  const imageUrl = thumbnail 
    ? (thumbnail.startsWith('http') 
        ? thumbnail 
        : `${serverBaseUrl}/${thumbnail}`)
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'; 

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
      borderRadius: 1
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
          <Stack direction="row" spacing={1}>
            {car.is_mock && <Chip label="Demo" size="small" color="warning" variant="filled" sx={{ fontWeight: 'bold' }} />}
            <Chip label={brand?.name || 'Unknown'} size="small" color="primary" variant="outlined" />
          </Stack>
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
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          disableElevation
          onClick={() => navigate(`/vehicle/${id}`)}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Card>
  );
};

export default CarCard;
