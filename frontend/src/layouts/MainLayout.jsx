import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  Grid,
  Link,
  Divider,
  alpha,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  DirectionsCar, 
  Facebook, 
  Instagram, 
  YouTube, 
  Twitter, 
  LocationOn, 
  Phone, 
  Email, 
  KeyboardArrowRight
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  // Style cho các đường link hover mượt mà ở Footer
  const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.light,
      transform: 'translateX(5px)',
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* ================= HEADER ================= */}
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <Box sx={{
                bgcolor: 'primary.main',
                p: 0.5,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DirectionsCar sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="800" color="primary.main">
                AutoPro Showroom
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button color="inherit" onClick={() => navigate('/')}>Trang chủ</Button>
              <Button color="inherit" onClick={() => navigate('/garage')}>Dịch vụ</Button>
              <Button color="inherit" onClick={() => navigate('/contact')}>Liên hệ</Button>
              {user ? (
                <Button color="inherit" onClick={() => {
                  if (user.role_name === "ADMIN") {
                    navigate('/admin')
                  } else {
                    navigate('/user')
                  }
                }}>
                  Xin chào {user.username}
                </Button>
              ) : (
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ================= MAIN CONTENT ================= */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* ================= FOOTER VIP PRO ================= */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#0f172a',
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: 4,
          borderTop: '4px solid',
          borderColor: 'primary.main',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ mb: 8 }}>
            
            {/* CỘT 1: BRAND INFO */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5, display: 'flex' }}>
                  <DirectionsCar sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight="900" color="white" letterSpacing={1}>
                  AUTOPRO
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.8 }}>
                Hệ thống Showroom mua bán xe hơi và Garage chăm sóc, bảo dưỡng xe chuyên nghiệp hàng đầu Việt Nam. Khẳng định đẳng cấp, vững bước thành công.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                {[<Facebook />, <Instagram />, <YouTube />, <Twitter />].map((icon, i) => (
                  <IconButton 
                    key={i} 
                    sx={{ 
                      bgcolor: alpha('#ffffff', 0.05), 
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.main', transform: 'translateY(-3px)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>

            {/* CỘT 2: LIÊN KẾT NHANH */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                Khám Phá
              </Typography>
              <Stack spacing={2}>
                <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Trang chủ
                </Link>
                <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Showroom Xe
                </Link>
                <Link href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Liên hệ
                </Link>
              </Stack>
            </Grid>

            {/* CỘT 3: DỊCH VỤ */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                Dịch Vụ Nổi Bật
              </Typography>
              <Stack spacing={2}>
                <Link href="/garage" sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Bảo dưỡng định kỳ
                </Link>
                <Link href="/garage" sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Sửa chữa gầm, máy
                </Link>
                <Link href="/garage" sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Đồng sơn công nghệ cao
                </Link>
                <Link href="/garage" sx={linkStyle}>
                  <KeyboardArrowRight fontSize="small" sx={{ mr: 0.5 }} /> Thay thế phụ tùng
                </Link>
              </Stack>
            </Grid>

            {/* CỘT 4: LIÊN HỆ */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                Thông Tin Liên Hệ
              </Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <LocationOn sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    793 QL13, Hiệp Bình Phước, Hiệp Bình, Hồ Chí Minh
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Phone sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    0969.444.757
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Email sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    autoproshowroom@gmail.com
                  </Typography>
                </Box>
              </Stack>
            </Grid>

          </Grid>

          <Divider sx={{ borderColor: alpha('#ffffff', 0.1), mb: 3 }} />

          {/* BOTTOM COPYRIGHT */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              © {new Date().getFullYear()} AutoPro Garage System. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="#" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: 'white' } }}>Chính sách bảo mật</Link>
              <Link href="#" sx={{ color: '#64748b', textDecoration: 'none', '&:hover': { color: 'white' } }}>Điều khoản dịch vụ</Link>
            </Stack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default MainLayout;