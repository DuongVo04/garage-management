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
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { Search, FilterAlt } from '@mui/icons-material';
import apiClient from '../../services/apiClient';
import CarCard from './CarCard';

const MOCK_DATA = [
  {
    id: 'mock-1',
    name: 'Toyota Camry 2.5Q',
    year: 2022,
    new_price: 1350000000,
    old_price: 1400000000,
    thumbnail: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    color: 'Đen',
    latest_odo: 15000,
    brand: { name: 'Toyota' },
    is_mock: true
  },
  {
    id: 'mock-2',
    name: 'Mazda CX-5 2.0 Premium',
    year: 2021,
    new_price: 850000000,
    old_price: 900000000,
    thumbnail: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    color: 'Đỏ',
    latest_odo: 20000,
    brand: { name: 'Mazda' },
    is_mock: true
  },
  {
    id: 'mock-3',
    name: 'Hyundai SantaFe 2.2 Dầu Cao cấp',
    year: 2023,
    new_price: 1250000000,
    old_price: 1300000000,
    thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    color: 'Trắng',
    latest_odo: 5000,
    brand: { name: 'Hyundai' },
    is_mock: true
  },
  {
    id: 'mock-4',
    name: 'Honda CR-V L',
    year: 2020,
    new_price: 950000000,
    old_price: 1050000000,
    thumbnail: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800',
    color: 'Xanh',
    latest_odo: 35000,
    brand: { name: 'Honda' },
    is_mock: true
  },
  {
    id: 'mock-5',
    name: 'VinFast VF8 Plus',
    year: 2023,
    new_price: 1100000000,
    old_price: 1200000000,
    thumbnail: 'https://xevinfastluot.com/wp-content/uploads/2025/06/z6665285875121_25a4ad82720bf58ea7de3fcf0a9c3abf.jpg',
    color: 'Bạc',
    latest_odo: 1000,
    brand: { name: 'VinFast' },
    is_mock: true
  },
  {
    id: 'mock-6',
    name: 'Ford Ranger Wildtrak',
    year: 2022,
    new_price: 960000000,
    old_price: 990000000,
    thumbnail: 'https://bizweb.dktcdn.net/100/446/720/products/z4352085614436-383b3568144ede6c16445452f27fd9c5.jpg?v=1684918908720',
    color: 'Cam',
    latest_odo: 12000,
    brand: { name: 'Ford' },
    is_mock: true
  }
];

// Loại bỏ mảng BRANDS cố định cũ
const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');

  // Tạo danh sách thương hiệu động dựa trên dữ liệu xe đang có
  const dynamicBrands = ['Tất cả', ...new Set(cars.map(car => car.brand?.name).filter(Boolean))];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/showroom-vehicles');
        const dbData = response.data?.data || [];
        setCars([...dbData, ...MOCK_DATA]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setCars(MOCK_DATA);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'Tất cả' || car.brand?.name === selectedBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.is_mock !== b.is_mock) return a.is_mock ? 1 : -1;
        return b.year - a.year;
      }
      if (sortBy === 'price-asc') return a.new_price - b.new_price;
      if (sortBy === 'price-desc') return b.new_price - a.new_price;
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
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="900" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
            AutoPro Showroom
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            Hàng ngàn mẫu xe chất lượng, giá cả ưu đãi và dịch vụ bảo hành uy tín.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {/* LEFT SIDEBAR: Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 1, 
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky', 
                top: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                <FilterAlt color="primary" /> Bộ lọc tìm kiếm
              </Typography>
              
              <Typography variant="subtitle2" fontWeight="800" mb={1.5} color="text.primary">
                Tên xe
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm xe..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" fontWeight="800" mb={2} color="text.primary">
                Danh mục
              </Typography>
              
              <FormControl fullWidth size="small">
                <InputLabel>Thương hiệu</InputLabel>
                <Select
                  value={selectedBrand}
                  label="Thương hiệu"
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  sx={{ borderRadius: 1 }}
                >
                  {dynamicBrands.map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT: Car List */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Toolbar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Typography variant="body1" fontWeight="600" color="text.secondary">
                Hiển thị <span style={{ color: '#111827' }}>{filteredCars.length}</span> kết quả
              </Typography>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" fontWeight="700">Sắp xếp:</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ borderRadius: 1, bgcolor: 'white' }}
                  >
                    <MenuItem value="newest">Đời xe mới nhất</MenuItem>
                    <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
                    <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* List */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress thickness={4} size={50} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>
            ) : filteredCars.length === 0 ? (
              <Paper sx={{ textAlign: 'center', py: 10, borderRadius: 1, bgcolor: 'transparent' }} elevation={0}>
                <Typography variant="h6" color="text.secondary">
                  Rất tiếc, chúng tôi không tìm thấy xe phù hợp.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredCars.map((car) => (
                  <Grid key={car.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <CarCard car={car} />
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

export default HomePage;
