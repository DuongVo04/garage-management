import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Stack, 
  Divider,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer
} from '@mui/material';
import { 
  ArrowBack, 
  Close,
  Info,
  Assignment,
  CalendarToday,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import apiClient from '../../services/apiClient';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  
  const [openSpecModal, setOpenSpecModal] = useState(false);

  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/showroom-vehicles/${id}`);
        
        if (response.data && response.data.data) {
          const carData = response.data.data;
          setCar(carData);
          
          const mainImg = carData.thumbnail 
            ? (carData.thumbnail.startsWith('http') ? carData.thumbnail : `${serverBaseUrl}/${carData.thumbnail}`)
            : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
          setActiveImage(mainImg);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicle detail:', err);
        setError('Không thể tải thông tin chi tiết xe.');
        setLoading(false);
      }
    };

    fetchVehicleDetail();
  }, [id, serverBaseUrl]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
      <CircularProgress thickness={4} size={60} />
    </Box>
  );

  if (error || !car) return (
    <Container sx={{ py: 10 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>{error || 'Không tìm thấy thông tin xe.'}</Alert>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>Quay lại showroom</Button>
    </Container>
  );

  const galleryImages = car.images?.map(img => 
    img.image_path.startsWith('http') ? img.image_path : `${serverBaseUrl}/${img.image_path}`
  ) || [];

  const allImages = car.thumbnail 
    ? [car.thumbnail.startsWith('http') ? car.thumbnail : `${serverBaseUrl}/${car.thumbnail}`, ...galleryImages]
    : galleryImages;

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    if (currentIndex <= 0) {
      setActiveImage(allImages[allImages.length - 1]);
    } else {
      setActiveImage(allImages[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(activeImage);
    if (currentIndex >= allImages.length - 1) {
      setActiveImage(allImages[0]);
    } else {
      setActiveImage(allImages[currentIndex + 1]);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const SpecRow = ({ label, value, isHighlight = false, isModal = false }) => (
    <TableRow sx={!isModal ? { '&:last-child td, &:last-child th': { border: 0 } } : {}}>
      <TableCell 
        component="th" 
        scope="row" 
        sx={{ 
          color: 'text.secondary', 
          py: isModal ? 1.8 : 1.2, 
          pl: isModal ? 3 : 0, 
          width: isModal ? '45%' : 'auto',
          fontSize: isModal ? '0.95rem' : '0.9rem'
        }}
      >
        {label}
      </TableCell>
      <TableCell 
        align="right" 
        sx={{ 
          fontWeight: isHighlight ? '700' : '600', 
          py: isModal ? 1.8 : 1.2, 
          pr: isModal ? 3 : 0,
          fontSize: isModal ? '0.95rem' : '0.9rem'
        }}
      >
        {value || 'N/A'}
      </TableCell>
    </TableRow>
  );

  const SpecSectionTitle = ({ title }) => (
    <TableRow>
      <TableCell colSpan={2} sx={{ 
        bgcolor: 'background.default', 
        py: 2, 
        px: 3, 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="subtitle1" fontWeight="700" color="primary.main" textTransform="uppercase" letterSpacing={0.5}>
          {title}
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ pb: 10, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/')} color="inherit">
            <ArrowBack />
          </IconButton>
          <Breadcrumbs separator="›">
            <Link component="button" underline="hover" color="inherit" onClick={() => navigate('/')}>Showroom</Link>
            <Typography color="text.primary" fontWeight="medium">{car.name}</Typography>
          </Breadcrumbs>
        </Stack>

        <Grid container spacing={4}>
          
          {/* LEFT: Image Gallery - DÙNG SIZE V6 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                mb: 2.5,
                width: '100%',
                aspectRatio: '4/3', 
                bgcolor: '#f1f5f9'
              }}
            >
              <Box 
                component="img" 
                src={activeImage} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  transition: 'transform 0.4s ease'
                }} 
              />

              {allImages.length > 1 && (
                <>
                  <IconButton 
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(4px)',
                      color: 'black',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.95)' }
                    }}
                  >
                    <ChevronLeft fontSize="large" />
                  </IconButton>

                  <IconButton 
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(4px)',
                      color: 'black',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.95)' }
                    }}
                  >
                    <ChevronRight fontSize="large" />
                  </IconButton>
                </>
              )}
            </Paper>

            {/* Thumbnail Gallery - SỬ DỤNG FLEXBOX THAY VÌ GRID CHO CHUẨN */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                overflowX: 'auto', 
                pb: 1, 
                '&::-webkit-scrollbar': { height: 6 }, 
                '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 10 } 
              }}
            >
              {allImages.map((img, index) => (
                <Paper 
                  key={index}
                  elevation={0} 
                  onClick={() => setActiveImage(img)}
                  sx={{ 
                    minWidth: { xs: 80, md: 100 }, 
                    height: { xs: 60, md: 70 },
                    border: '3px solid', 
                    borderColor: activeImage === img ? 'primary.main' : 'transparent',
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    opacity: activeImage === img ? 1 : 0.6,
                    transition: 'all 0.25s ease',
                    flexShrink: 0,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <Box 
                    component="img" 
                    src={img} 
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* RIGHT: Info & Quick Specs - DÙNG SIZE V6 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Box>
                <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap">
                  {car.is_mock && <Chip label="Demo" color="warning" size="small" sx={{ borderRadius: 1, fontWeight: 'bold' }} />}
                  <Chip label={car.brand?.name} color="primary" variant="outlined" size="small" sx={{ borderRadius: 1 }} />
                </Stack>

                <Typography variant="h4" fontWeight="900" gutterBottom sx={{ lineHeight: 1.2 }}>
                  {car.name}
                </Typography>

                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1.5,
                    color: '#4211f0', // Đổi sang màu đỏ đun (chuẩn màu giá tiền e-commerce VN)
                    fontWeight: 700, // Giảm từ 900 xuống 700 để nét chữ thanh thoát hơn
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // Ép dùng font hệ thống sạch sẽ
                    letterSpacing: '-0.5px' // Ép các con số nhích lại gần nhau một chút nhìn sẽ gọn và sang hơn
                  }}
                >
                  {formatPrice(car.new_price)}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="h6" fontWeight="700" mb={2} display="flex" alignItems="center" gap={1}>
                  <Info color="primary" /> Thông số nổi bật
                </Typography>

                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: '#ffffff', 
                    p: 2.5, 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <SpecRow label="Năm sản xuất" value={car.year} isHighlight />
                        <SpecRow label="Số KM (ODO)" value={car.latest_odo ? `${car.latest_odo.toLocaleString()} km` : '0 km'} isHighlight />
                        <SpecRow label="Màu sắc" value={car.color} />
                        <SpecRow label="Nhiên liệu" value={car.fuel?.fuel_type} />
                        <SpecRow label="Số chỗ ngồi" value={car.interior?.seat_count ? `${car.interior.seat_count} chỗ` : null} />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="inherit"
                  startIcon={<Assignment />}
                  onClick={() => setOpenSpecModal(true)}
                  sx={{ 
                    borderRadius: 2, 
                    mt: 3, 
                    py: 1.5, 
                    textTransform: 'none', 
                    fontWeight: '700',
                    borderColor: 'divider'
                  }}
                >
                  Xem đầy đủ thông số kỹ thuật
                </Button>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  sx={{ 
                    py: 1.8, 
                    borderRadius: 2, 
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  Liên hệ tư vấn ngay
                </Button>

                <Button 
                  variant="outlined" 
                  size="large" 
                  fullWidth 
                  startIcon={<CalendarToday />}
                  sx={{ 
                    py: 1.8, 
                    borderRadius: 2, 
                    fontWeight: '700',
                    fontSize: '1.05rem'
                  }}
                >
                  Đặt lịch xem xe
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* BOTTOM: Description - DÙNG SIZE V6 */}
          <Grid size={{ xs: 12 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#ffffff'
              }}
            >
              <Typography variant="h5" fontWeight="700" gutterBottom>
                Mô tả chi tiết
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  whiteSpace: 'pre-line', 
                  lineHeight: 1.85,
                  fontSize: '1.02rem'
                }}
              >
                {car.description || 'Chưa có mô tả chi tiết cho chiếc xe này. Vui lòng liên hệ với đội ngũ tư vấn để biết thêm thông tin.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal Thông số */}
      <Dialog 
        open={openSpecModal} 
        onClose={() => setOpenSpecModal(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' } }}
      >
        <DialogTitle sx={{ m: 0, p: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight="900" textTransform="uppercase" letterSpacing={1}>
            Thông số kỹ thuật chi tiết
          </Typography>
          <IconButton onClick={() => setOpenSpecModal(false)} size="small" sx={{ bgcolor: 'action.hover' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9' } }}>
              <TableBody>
                <SpecSectionTitle title="Động cơ & Vận hành" />
                <SpecRow isModal label="Loại động cơ" value={car.engine_spec?.engine_type} />
                <SpecRow isModal label="Dung tích động cơ" value={car.engine_spec?.engine_capacity ? `${car.engine_spec.engine_capacity}L` : null} />
                <SpecRow isModal label="Công suất tối đa" value={car.engine_spec?.max_power ? `${car.engine_spec.max_power} HP` : null} />
                <SpecRow isModal label="Mô-men xoắn tối đa" value={car.engine_spec?.max_torque ? `${car.engine_spec.max_torque} Nm` : null} />
                <SpecRow isModal label="Hộp số" value={car.steering_system?.transmission} />
                <SpecRow isModal label="Hệ dẫn động" value={car.steering_system?.drivetrain} />

                <SpecSectionTitle title="Nhiên liệu & Tiêu thụ" />
                <SpecRow isModal label="Loại nhiên liệu" value={car.fuel?.fuel_type} />
                <SpecRow isModal label="Mức tiêu thụ" value={car.fuel?.fuel_consumption} />
                <SpecRow isModal label="Dung tích bình" value={car.fuel?.fuel_tank_capacity} />

                <SpecSectionTitle title="Kích thước & Trọng lượng" />
                <SpecRow isModal label="Dài x Rộng x Cao" value={car.size ? `${car.size.length_mm} × ${car.size.width_mm} × ${car.size.height_mm} mm` : null} />
                <SpecRow isModal label="Chiều dài cơ sở" value={car.size?.wheelbase_mm ? `${car.size.wheelbase_mm} mm` : null} />

                <SpecSectionTitle title="Nội thất & Tiện nghi" />
                <SpecRow isModal label="Số chỗ ngồi" value={car.interior ? `${car.interior.seat_count} chỗ` : null} />
                <SpecRow isModal label="Hỗ trợ giải trí" value={car.interior?.is_androidauto_applecarplay ? 'Android Auto / Apple CarPlay' : 'Cơ bản'} />
                <SpecRow isModal label="Màu sắc ngoại thất" value={car.color} />
                <SpecRow isModal label="Năm sản xuất" value={car.year} />
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VehicleDetailPage;