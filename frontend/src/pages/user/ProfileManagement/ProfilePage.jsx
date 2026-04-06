import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getMyCustomerInfo, createCustomerInfo, linkCustomerAccount } from '../../../services/customer.service';
import PersonalInfoTab from './PersonalInfoTab';
import VehiclesTab from './VehiclesTab';
import AppointmentsTab from './AppointmentsTab';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkingAccount, setLinkingAccount] = useState(false);

  // Link account form state
  const [createForm, setCreateForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
  });
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const fetchCustomerInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyCustomerInfo();

      if (result.success) {
        setCustomerData(result.data);
      } else {
        if (result.message === 'Not a customer') {
          setError('NOT_A_CUSTOMER');
        } else {
          setError('UNKNOW');
          // setSnackbar({
          //   open: true,
          //   message: result.message || 'Không thể tải thông tin',
          //   severity: 'error',
          // });
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('GENERAL_ERROR');
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải thông tin',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle linking account
  const handleLinkAccount = async () => {
    if (!phoneNumber.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập số điện thoại',
        severity: 'error',
      });
      return;
    }

    setLinkingAccount(true);
    try {
      const result = await linkCustomerAccount(phoneNumber);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Liên kết tài khoản thành công!',
          severity: 'success',
        });
        setLinkDialogOpen(false);
        setPhoneNumber('');
        await fetchCustomerInfo();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Liên kết thất bại',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi liên kết tài khoản',
        severity: 'error',
      });
    } finally {
      setLinkingAccount(false);
    }
  };

  // Handle creating new customer info
  const handleCreateCustomer = async () => {
    if (!createForm.full_name.trim() || !createForm.phone_number.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đầy đủ họ tên và số điện thoại',
        severity: 'error',
      });
      return;
    }

    setCreatingCustomer(true);
    try {
      const result = await createCustomerInfo(createForm);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Tạo thông tin thành công!',
          severity: 'success',
        });
        await fetchCustomerInfo();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Tạo thông tin thất bại',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo thông tin',
        severity: 'error',
      });
    } finally {
      setCreatingCustomer(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show link account dialog for "Not a customer" error
  if (error === 'UNKNOW') {
    return (
      <>
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Tài khoản chưa được liên kết
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tài khoản của bạn chưa được liên kết với thông tin khách hàng.
              Vui lòng nhập số điện thoại để liên kết hoặc tạo thông tin mới.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLinkDialogOpen(true)}
              >
                Liên kết tài khoản
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setError('CREATE_NEW')}
              >
                Tạo thông tin mới
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Link Account Dialog */}
        <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
          <DialogTitle>Liên kết tài khoản</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Số điện thoại"
              type="tel"
              fullWidth
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="VD: 0912345678"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLinkDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleLinkAccount} variant="contained" disabled={linkingAccount}>
              {linkingAccount ? <CircularProgress size={24} /> : 'Liên kết'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // Show create customer form
  if (error === 'CREATE_NEW') {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Tạo thông tin khách hàng
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng nhập thông tin của bạn để tạo hồ sơ khách hàng
          </Typography>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Họ và tên *"
              required
              fullWidth
              value={createForm.full_name}
              onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
            />
            <TextField
              label="Số điện thoại *"
              required
              fullWidth
              value={createForm.phone_number}
              onChange={(e) => setCreateForm({ ...createForm, phone_number: e.target.value })}
              placeholder="VD: 0912345678"
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
            <TextField
              label="Địa chỉ"
              fullWidth
              value={createForm.address}
              onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={() => setError('UNKNOW')}>
                Quay lại
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateCustomer}
                disabled={creatingCustomer}
              >
                {creatingCustomer ? <CircularProgress size={24} /> : 'Tạo thông tin'}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  // Show general error
  if (error === 'GENERAL_ERROR') {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchCustomerInfo}>
              Thử lại
            </Button>
          }
        >
          Không thể tải thông tin. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  // Main profile page with improved spacing - narrower and more breathing room
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Vertical Tabs - Left Side */}
          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              flexShrink: 0,
              borderRight: { xs: 0, md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              sx={{
                height: '100%',
                '& .MuiTabs-flexContainer': {
                  flexDirection: { xs: 'row', md: 'column' },
                },
                '& .MuiTab-root': {
                  py: { xs: 1.5, md: 2.5 },
                  px: { xs: 1.5, md: 2.5 },
                  fontSize: { xs: '0.875rem', md: '0.95rem' },
                  fontWeight: 500,
                  minHeight: 'auto',
                  minWidth: { xs: 'auto', md: '100%' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  gap: { xs: 1, md: 1.5 },
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                  },
                },
                '& .MuiTabs-indicator': {
                  left: { xs: 0, md: 0 },
                  right: { xs: 0, md: 'auto' },
                  width: { xs: 'auto', md: 3 },
                  height: { xs: 3, md: 'auto' },
                  bottom: { xs: 0, md: 'auto' },
                  top: { xs: 'auto', md: 0 },
                },
              }}
            >
              <Tab
                icon={<PersonOutlineIcon fontSize="small" />}
                iconPosition="start"
                label="Thông tin cá nhân"
              />
              <Tab
                icon={<DirectionsCarIcon fontSize="small" />}
                iconPosition="start"
                label={`Xe của tôi (${customerData?.vehicles?.length || 0})`}
              />
              <Tab
                icon={<CalendarTodayIcon fontSize="small" />}
                iconPosition="start"
                label={`Lịch đặt sửa xe (${customerData?.appointments?.length || 0})`}
              />
            </Tabs>
          </Box>

          {/* Content - Right Side */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              minWidth: 0, // Prevents overflow
            }}
          >
            {activeTab === 0 && (
              <PersonalInfoTab
                customerData={customerData}
                onUpdateSuccess={fetchCustomerInfo}
                setSnackbar={setSnackbar}
              />
            )}
            {activeTab === 1 && (
              <VehiclesTab
                vehicles={customerData?.vehicles || []}
                customerId={customerData?.id}
                setSnackbar={setSnackbar}
                onRefresh={fetchCustomerInfo} // Đảm bảo prop này được truyền đúng
              />
            )}
            {activeTab === 2 && (
              <AppointmentsTab
                appointments={customerData?.appointments || []}
                setSnackbar={setSnackbar}
              />
            )}
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProfilePage;