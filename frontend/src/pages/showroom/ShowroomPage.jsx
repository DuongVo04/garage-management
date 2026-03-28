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
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { Search, FilterAlt, Sort } from '@mui/icons-material';
import apiClient from '../../services/apiClient';
import CarCard from './CarCard';

const MOCK_DATA = [
  {
    id: '1',
    name: 'Toyota Camry 2.5Q',
    year: 2022,
    new_price: 1350000000,
    old_price: 1400000000,
    thumbnail: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
    color: 'Đen',
    latest_odo: 15000,
    brand: { name: 'Toyota' }
  },
  {
    id: '2',
    name: 'Mazda CX-5 2.0 Premium',
    year: 2021,
    new_price: 850000000,
    old_price: 900000000,
    thumbnail: 'https://drive.gianhangvn.com/image/2632672-2640991j33409.jpg',
    color: 'Đỏ',
    latest_odo: 20000,
    brand: { name: 'Mazda' }
  },
  {
    id: '3',
    name: 'Hyundai SantaFe 2.2 Dầu Cao cấp',
    year: 2023,
    new_price: 1250000000,
    old_price: 1300000000,
    thumbnail: 'https://drive.gianhangvn.com/image/new-santa-fe-2-2-dau-cao-cap-1793725j25260.jpg',
    color: 'Trắng',
    latest_odo: 5000,
    brand: { name: 'Hyundai' }
  },
  {
    id: '4',
    name: 'Honda CR-V L',
    year: 2020,
    new_price: 950000000,
    old_price: 1050000000,
    thumbnail: 'https://otohondaquan2.vn/wp-content/uploads/2024/07/honda-crv-hybrid-mau-xanh-2024-9.jpg',
    color: 'Xanh',
    latest_odo: 35000,
    brand: { name: 'Honda' }
  },
  {
    id: '5',
    name: 'VinFast VF8 Plus',
    year: 2023,
    new_price: 1100000000,
    old_price: 1200000000,
    thumbnail: 'https://autobikes.vn/stores/news_dataimages/nguyenthuy/072022/09/22/2804_VinFast_VF8.jpg?rt=20220709222836',
    color: 'Bạc',
    latest_odo: 1000,
    brand: { name: 'VinFast' }
  },
  {
    id: '6',
    name: 'Ford Ranger Wildtrak',
    year: 2022,
    new_price: 960000000,
    old_price: 990000000,
    thumbnail: 'https://bizweb.dktcdn.net/100/446/720/products/z4352085614436-383b3568144ede6c16445452f27fd9c5.jpg?v=1684918908720',
    color: 'Cam',
    latest_odo: 12000,
    brand: { name: 'Ford' }
  }
];

const BRANDS = ['Tất cả', 'Toyota', 'Mazda', 'Hyundai', 'Honda', 'VinFast', 'Ford'];

const ShowroomPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/v1/showroom-vehicles');
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          setCars(response.data.data);
        } else {
          setCars(MOCK_DATA);
        }
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
      if (sortBy === 'price-asc') return a.new_price - b.new_price;
      if (sortBy === 'price-desc') return b.new_price - a.new_price;
      if (sortBy === 'newest') return b.year - a.year;
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
            Khám phá những mẫu xe đẳng cấp và chất lượng hàng đầu
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
                borderRadius: 4, 
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
                Hãng sản xuất
              </Typography>
              <Stack spacing={1}>
                {BRANDS.map((brand) => (
                  <Box
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    sx={{ 
                      px: 2, 
                      py: 1, 
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: selectedBrand === brand ? 'primary.main' : 'transparent',
                      color: selectedBrand === brand ? 'white' : 'text.secondary',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: selectedBrand === brand ? 'primary.main' : 'rgba(99, 102, 241, 0.08)',
                        color: selectedBrand === brand ? 'white' : 'primary.main',
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={selectedBrand === brand ? 700 : 500}>
                      {brand}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper> {/* Kết thúc khối Paper ở đây */}
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
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
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
              <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
            ) : filteredCars.length === 0 ? (
              <Paper sx={{ textAlign: 'center', py: 10, borderRadius: 4, bgcolor: 'transparent' }} elevation={0}>
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

export default ShowroomPage;
