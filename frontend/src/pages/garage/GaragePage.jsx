import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const GaragePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Dịch vụ Garage
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Trang dịch vụ sửa chữa và bảo dưỡng đang được phát triển.
        </Typography>
      </Box>
    </Container>
  );
};

export default GaragePage;
