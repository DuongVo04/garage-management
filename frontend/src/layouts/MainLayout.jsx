import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  IconButton,
  Stack
} from '@mui/material';
import { DirectionsCar, Login } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
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
              <Button color="inherit">Dịch vụ</Button>
              <Button color="inherit">Liên hệ</Button>
              {/* <Button 
                variant="contained" 
                startIcon={<Login />} 
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Đăng nhập
              </Button> */}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider', mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} AutoPro Garage Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
