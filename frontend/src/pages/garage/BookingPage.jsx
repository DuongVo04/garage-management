import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Dialog,
  DialogContent,
  Checkbox,
  Autocomplete,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Phone,
  Email,
  Notes,
  ArrowBack,
  CheckCircle,
  Build,
  ReceiptLong,
  LocalOffer,
  ChevronRight,
  VerifiedUser,
  CheckBoxOutlineBlank,
  CheckBox as CheckBoxIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    appointment_date: '',
    note: '',
    customer_name: user?.full_name || '',
    customer_phone: user?.phone_number || '',
    customer_email: user?.email || ''
  });

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await apiClient.get('/services?is_deleted=false');
        const services = response.data?.data || response.data || [];
        setAllServices(services);
        
        if (serviceId) {
          setSelectedServiceIds([parseInt(serviceId)]);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Không thể kết nối với hệ thống dịch vụ.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllServices();
  }, [serviceId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.full_name || '',
        customer_phone: user.phone_number || '',
        customer_email: user.email || ''
      }));
    }
  }, [user]);

  const handleServiceChange = (event, newValue) => {
    setSelectedServiceIds(newValue.map(service => service.id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedServices = useMemo(() => 
    allServices.filter(s => selectedServiceIds.includes(s.id)),
  [allServices, selectedServiceIds]);

  const totalPrice = useMemo(() => 
    selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0),
  [selectedServices]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isFormValid = useMemo(() => {
    const { customer_name, customer_phone, customer_email, appointment_date } = formData;
    return (
      selectedServiceIds.length > 0 &&
      customer_name.trim() !== '' &&
      customer_phone.trim() !== '' &&
      customer_email.trim() !== '' &&
      appointment_date !== '' &&
      new Date(appointment_date) > new Date()
    );
  }, [formData, selectedServiceIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <Icon color="primary" sx={{ fontSize: 24 }} />
      <Typography variant="h6" fontWeight="800" sx={{ color: '#1e293b' }}>
        {title}
      </Typography>
    </Box>
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress color="primary" />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      {/* Top Header & Breadcrumbs */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', mb: 4 }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>Trang chủ</Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/garage')} sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>Garage</Link>
            <Typography color="text.primary" fontWeight="600" fontSize="0.875rem">Đặt lịch dịch vụ</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* CỘT TRÁI (~67%) */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Card 1: Lựa chọn dịch vụ */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <SectionHeader icon={Build} title="Lựa chọn dịch vụ" />
                <Autocomplete
                  multiple
                  id="services-autocomplete"
                  options={allServices}
                  disableCloseOnSelect
                  limitTags={2}
                  getOptionLabel={(option) => option.name}
                  value={selectedServices}
                  onChange={handleServiceChange}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} style={{ padding: '12px 16px' }}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} size="small" sx={{ mr: 1 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="700">{option.name}</Typography>
                        <Typography variant="caption" color="primary.main" fontWeight="800">
                          {formatCurrency(option.price)}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="Tìm kiếm dịch vụ..." 
                      variant="outlined"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                    />
                  )}
                />
              </Paper>

              {/* Card 2: Thông tin khách hàng */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <SectionHeader icon={Person} title="Thông tin khách hàng" />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Họ và tên" name="customer_name"
                      value={formData.customer_name} onChange={handleChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Số điện thoại" name="customer_phone"
                      value={formData.customer_phone} onChange={handleChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Email" name="customer_email" type="email"
                      value={formData.customer_email} onChange={handleChange} required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Card 3: Thời gian & Ghi chú */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <SectionHeader icon={CalendarToday} title="Thời gian & Ghi chú" />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth label="Ngày giờ hẹn" name="appointment_date" type="datetime-local"
                      value={formData.appointment_date} onChange={handleChange} required
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                      inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth label="Ghi chú thêm" name="note" multiline rows={1}
                      placeholder="Tình trạng xe hoặc yêu cầu đặc biệt của bạn..."
                      value={formData.note} onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#fcfcfc' } }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* CỘT PHẢI (~33%): HÓA ĐƠN DỰ KIẾN - Cố định vị trí khi cuộn */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: '24px', zIndex: 10 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, borderRadius: 2, border: '1px solid', borderColor: 'primary.light',
                  bgcolor: 'white', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
                  maxHeight: 'calc(100vh - 48px)', overflowY: 'auto'
                }}
              >
                <SectionHeader icon={ReceiptLong} title="Hóa đơn dự kiến" />
                
                <Box sx={{ mt: 2 }}>
                  {selectedServices.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: 2, mb: 3 }}>
                      <LocalOffer sx={{ fontSize: 32, color: '#cbd5e1', mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Chưa chọn dịch vụ nào
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2} sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                      {selectedServices.map(s => (
                        <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="700" sx={{ color: '#1e293b' }}>{s.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Dịch vụ chính hãng</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="800" sx={{ color: 'primary.main' }}>
                            {formatCurrency(s.price)}
                          </Typography>
                        </Box>
                      ))}
                      <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                    </Stack>
                  )}

                  <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 2, mb: 4, border: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="subtitle1" fontWeight="800" color="#64748b">Tổng cộng</Typography>
                      <Typography variant="h5" fontWeight="900" color="primary.main">
                        {formatCurrency(totalPrice)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleSubmit} fullWidth variant="contained" size="large"
                    disabled={submitting || success || !isFormValid}
                    endIcon={!submitting && <ChevronRight />}
                    sx={{ 
                      py: 2, borderRadius: 1.5, fontWeight: '900', 
                      textTransform: 'none', fontSize: '1rem', 
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)' }
                    }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận Đặt lịch ngay'}
                  </Button>

                  <Stack spacing={2} sx={{ mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <VerifiedUser sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Cam kết chất lượng & uy tín</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Đội ngũ kỹ thuật tay nghề cao</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Success Dialog */}
      <Dialog open={success} onClose={() => navigate('/garage')} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, textAlign: 'center' } }}>
        <DialogContent>
          <Box sx={{ mb: 3, display: 'inline-flex', p: 3, bgcolor: '#f0fdf4', borderRadius: '50%' }}>
            <CheckCircle sx={{ fontSize: 60, color: '#22c55e' }} />
          </Box>
          <Typography variant="h5" fontWeight="900" gutterBottom color="#1e293b">Đặt lịch thành công!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            Yêu cầu của bạn đã được tiếp nhận. Đội ngũ Garage sẽ liên hệ xác nhận sớm nhất có thể.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate('/garage')} sx={{ py: 1.5, borderRadius: 2, fontWeight: '800', textTransform: 'none' }}>
            Về trang Garage
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BookingPage;
