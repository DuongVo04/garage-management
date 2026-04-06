import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, TextField, Button, 
  Stack, Snackbar, Alert, useTheme, alpha, Avatar
} from '@mui/material';
import {
  LocationOn, Phone, Email, AccessTime, Send, DirectionsCar
} from '@mui/icons-material';

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({ open: true, message: 'Gửi yêu cầu thành công!', severity: 'success' });
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 1500);
  };

  const contactDetails = [
    { icon: <LocationOn />, title: 'Địa chỉ Showroom', content: '793 QL13, Hiệp Bình Phước, Hiệp Bình, Hồ Chí Minh' },
    { icon: <Phone />, title: 'Hotline Tư Vấn & CSKH', content: '0969.444.757' },
    { icon: <Email />, title: 'Email Hỗ Trợ', content: 'autoproshowroom@gmail.com' },
    { icon: <AccessTime />, title: 'Giờ Làm Việc', content: '08:00 - 18:00 (Từ Thứ 2 - Chủ Nhật)' },
  ];

  // Style chung cho các ô Input VIP PRO
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3, // Bo góc to hơn
      bgcolor: alpha(theme.palette.primary.main, 0.03), // Nền xám xanh cực nhẹ
      transition: 'all 0.3s ease',
      '& fieldset': { 
        borderColor: alpha(theme.palette.common.black, 0.08), // Viền mặc định mờ
        borderWidth: 1.5,
      }, 
      '&:hover fieldset': { 
        borderColor: alpha(theme.palette.primary.main, 0.3), // Hover hiện viền xanh nhạt
      },
      '&.Mui-focused fieldset': { 
        borderColor: 'primary.main', // Focus viền xanh đậm
        borderWidth: 2,
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`, // Hiệu ứng glow nhẹ
      },
    }
  };

  return (
    <Box sx={{ bgcolor: '#f4f7fa', minHeight: '100vh', pb: 10 }}>
      {/* 1. HERO SECTION */}
      <Box sx={{ bgcolor: '#0b132b', color: 'white', pt: 10, pb: 20, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="900" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
            Liên hệ AutoPro
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
            Hệ thống quản lý và chăm sóc xe hơi chuyên nghiệp hàng đầu
          </Typography>
        </Container>
      </Box>

      {/* 2. CONTENT AREA */}
      <Container maxWidth="lg" sx={{ mt: -12 }}>
        <Grid container spacing={4} alignItems="stretch">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                borderRadius: 4, 
                height: '100%', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)', 
                borderTop: '5px solid', 
                borderColor: 'primary.main',
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <Typography variant="h4" fontWeight="800" mb={1}>Thông tin liên hệ</Typography>
              <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.6}>
                Đừng ngần ngại liên hệ với AutoPro. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi vấn đề về xe.
              </Typography>
              
              {/* Stack dùng justifyContent: 'space-between' để giãn đều lấp đầy khoảng trống */}
              <Stack sx={{ flexGrow: 1, justifyContent: 'space-between', pb: 2 }}>
                {contactDetails.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.08), 
                        color: 'primary.main',
                        width: 50, height: 50 
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" fontWeight="800" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {item.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* CỘT PHẢI: FORM GỬI YÊU CẦU */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                borderRadius: 4, 
                height: '100%', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h4" fontWeight="800" mb={1}>Gửi yêu cầu tư vấn</Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 24h.
              </Typography>
              
              <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={3}> {/* Đổi spacing từ 2 sang 3 để form thoáng hơn */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Họ tên *" name="name" value={formData.name} onChange={handleChange} required sx={inputStyles} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Số điện thoại *" name="phone" value={formData.phone} onChange={handleChange} required sx={inputStyles} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Email (Không bắt buộc)" name="email" value={formData.email} onChange={handleChange} sx={inputStyles} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Nội dung yêu cầu *" name="message" multiline rows={5} value={formData.message} onChange={handleChange} required sx={inputStyles} />
                  </Grid>
                </Grid>
                
                {/* Đẩy nút bấm xuống cuối cùng nếu form bị ngắn hơn cột trái */}
                <Box sx={{ mt: 'auto', pt: 4 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    endIcon={<Send />} 
                    sx={{ 
                      py: 2, 
                      borderRadius: 3, 
                      fontWeight: '800', 
                      fontSize: '1.05rem',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    {loading ? 'Đang xử lý...' : 'GỬI YÊU CẦU NGAY'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* HÀNG DƯỚI: BẢN ĐỒ */}
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', height: 500, border: '4px solid white' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.37495604657!2d106.72134867417395!3d10.864459557565548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527e4ff6e50b7%3A0x9b9d4e647a254ca1!2sShowroom%20To%C3%A0n%20Trung%209!5e1!3m2!1svi!2s!4v1775416807521!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                title="AutoPro Map"
              ></iframe>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;