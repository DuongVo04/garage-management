import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Paper,
  MenuItem,
  Select,
  FormControl,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import apiClient from '../../services/apiClient';
import ServiceCard from './ServiceCard';

const GaragePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/services?is_deleted=false');
        if (isMounted) {
          const data = response.data?.data || response.data || [];
          setServices(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        if (isMounted) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối MySQL của bạn.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => { isMounted = false; };
  }, []);

  const filteredServices = (services || [])
    .filter(service => 
      (service?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      return 0;
    });

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: { xs: 6, md: 10 },
        mb: 6,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="900" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Dịch vụ Garage
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Chăm sóc xế yêu chuyên nghiệp với đội ngũ kỹ thuật tay nghề cao.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                <FilterAltIcon color="primary" fontSize="small" /> Bộ lọc
              </Typography>

              <Typography variant="subtitle2" fontWeight="800" mb={1} color="text.primary">
                Tìm kiếm
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Tên dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" fontWeight="800" mb={1} color="text.primary">
                Sắp xếp theo giá
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
                  <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* List Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography variant="body1" fontWeight="600" color="text.secondary">
                Hiển thị <span style={{ color: '#111827' }}>{filteredServices.length}</span> dịch vụ
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress thickness={4} size={40} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            ) : filteredServices.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography color="text.secondary">Không tìm thấy dịch vụ nào phù hợp.</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredServices.map((service) => (
                  <Grid key={service.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <ServiceCard service={service} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GaragePage;
