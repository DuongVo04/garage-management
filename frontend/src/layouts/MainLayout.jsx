import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon
} from '@mui/material';
import { 
  DirectionsCar, 
  Login, 
  AccountCircle, 
  History, 
  Logout,
  Dashboard
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

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

            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="inherit" onClick={() => navigate('/')}>Trang chủ</Button>
              <Button color="inherit" onClick={() => navigate('/garage')}>Dịch vụ</Button>
              <Button color="inherit">Liên hệ</Button>
              {user ? (
                <>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleClick}
                    startIcon={<AccountCircle />}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                  >
                    Xin chào, {user.username}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    {user.role_name === 'ADMIN' && (
                      <MenuItem onClick={() => handleMenuClick('/admin')}>
                        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                        Trang quản trị
                      </MenuItem>
                    )}
                    {user.role_name === 'CUSTOMER' && (
                      <MenuItem onClick={() => handleMenuClick('/user/my-info')}>
                        <ListItemIcon><History fontSize="small" /></ListItemIcon>
                        Thông tin tài khoản
                      </MenuItem>
                    )}
                    {/* <MenuItem onClick={() => handleMenuClick('/user')}>
                      <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                      Thông tin cá nhân
                    </MenuItem> */}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  startIcon={<Login />} 
                  onClick={() => navigate('/login')}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Đăng nhập
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
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
