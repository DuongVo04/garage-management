import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, CircularProgress,
  Alert, TextField, InputAdornment, Paper, MenuItem,
  Select, FormControl, Divider, Button, Chip, Collapse,
  IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import apiClient from '../../services/apiClient';
import ServiceCard from './ServiceCard';

// ─── Design Tokens (sync với BookingPage) ────────────────────────────────────
const TOKEN = {
  coal: '#6a6ae1',
  ink: '#27272a',
  border: '#e4e4e7',
  borderLight: '#f4f4f5',
  surface: '#fafafa',
  white: '#ffffff',
  gold: '#ffffff',
  goldLight: '#fef3c7',
  goldMid: '#ffffff',
  muted: '#71717a',
  green: '#15803d',
  greenLight: '#f0fdf4',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// ─── Floating Cart Bar ────────────────────────────────────────────────────────
const BookingBar = ({ selectedServices, onRemove, onClear, onBook }) => {
  const total = selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const count = selectedServices.length;

  return (
    <Collapse in={count > 0} timeout={300}>
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200,
        bgcolor: TOKEN.coal,
        borderTop: `3px solid ${TOKEN.goldMid}`,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.25)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            py: 2, display: 'flex',
            alignItems: 'center', gap: 2, flexWrap: 'wrap',
          }}>
            {/* Selected chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
              <Typography variant="caption" fontWeight={800} sx={{ color: TOKEN.goldMid, mr: 0.5, flexShrink: 0 }}>
                {count} dịch vụ:
              </Typography>
              {selectedServices.map(s => (
                <Chip
                  key={s.id}
                  label={s.name}
                  size="small"
                  onDelete={() => onRemove(s.id)}
                  deleteIcon={<CloseIcon sx={{ fontSize: '14px !important', color: 'rgba(255,255,255,0.5) !important' }} />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 26,
                    border: '1px solid rgba(255,255,255,0.15)',
                    '& .MuiChip-deleteIcon:hover': { color: '#fff !important' }
                  }}
                />
              ))}
              <Tooltip title="Bỏ chọn tất cả">
                <IconButton
                  size="small"
                  onClick={onClear}
                  sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' }, ml: 0.5 }}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Total + CTA */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.2 }}>
                  Tạm tính
                </Typography>
                <Typography variant="subtitle1" fontWeight={900} sx={{ color: TOKEN.goldMid, letterSpacing: '-0.02em' }}>
                  {formatCurrency(total)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={onBook}
                startIcon={<CalendarMonthIcon sx={{ fontSize: '18px !important' }} />}
                disableElevation
                sx={{
                  bgcolor: TOKEN.goldMid,
                  color: TOKEN.coal,
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3, py: 1.2,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: TOKEN.gold, boxShadow: '0 6px 20px rgba(217,119,6,0.4)' }
                }}
              >
                Đặt lịch ngay
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Collapse>
  );
};

// ─── GaragePage ───────────────────────────────────────────────────────────────
const GaragePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedIds, setSelectedIds] = useState([]);

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
        if (isMounted)
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchServices();
    return () => { isMounted = false; };
  }, []);

  const filteredServices = (services || [])
    .filter(s =>
      (s?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      return 0;
    });

  const toggleService = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const removeService = useCallback((id) => {
    setSelectedIds(prev => prev.filter(x => x !== id));
  }, []);

  const selectedServices = services.filter(s => selectedIds.includes(s.id));

  const handleBook = () => {
    navigate('/booking', {
      state: { selectedIds }
    });
  };

  return (
    // Bottom padding to avoid content hidden behind fixed BookingBar
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: selectedIds.length > 0 ? 10 : 0 }}>

      {/* Hero */}
      <Box sx={{
        bgcolor: 'primary.main', color: 'white',
        py: { xs: 6, md: 10 }, mb: 6,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={900} gutterBottom
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Dịch vụ Garage
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, opacity: 0.9, fontWeight: 400 }}>
            Chăm sóc xế yêu chuyên nghiệp với đội ngũ kỹ thuật tay nghề cao.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Chọn một hoặc nhiều dịch vụ, sau đó đặt lịch cùng lúc.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider',
              position: 'sticky', top: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                <FilterAltIcon color="primary" fontSize="small" /> Bộ lọc
              </Typography>

              <Typography variant="subtitle2" fontWeight={800} mb={1}>Tìm kiếm</Typography>
              <TextField
                fullWidth size="small" placeholder="Tên dịch vụ..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" fontWeight={800} mb={1}>Sắp xếp theo giá</Typography>
              <FormControl fullWidth size="small">
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 1 }}>
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
                  <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
                </Select>
              </FormControl>

              {/* Selected summary in sidebar */}
              {selectedIds.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ color: TOKEN.coal }}>
                    Đã chọn ({selectedIds.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {selectedServices.map(s => (
                      <Box key={s.id} sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        p: 1, borderRadius: '8px', bgcolor: TOKEN.surface,
                        border: `1px solid ${TOKEN.border}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <CheckCircleIcon sx={{ fontSize: 13, color: TOKEN.green, flexShrink: 0 }} />
                          <Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.coal, lineHeight: 1.3 }}>
                            {s.name}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => removeService(s.id)} sx={{ p: 0.3 }}>
                          <CloseIcon sx={{ fontSize: 13, color: TOKEN.muted }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    fullWidth variant="contained" disableElevation
                    onClick={handleBook}
                    startIcon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{
                      bgcolor: TOKEN.coal, color: '#fff',
                      fontWeight: 800, textTransform: 'none',
                      borderRadius: '10px', fontSize: '0.82rem',
                      '&:hover': { bgcolor: TOKEN.ink }
                    }}
                  >
                    Đặt lịch ({selectedIds.length})
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          {/* Service grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1" fontWeight={600} color="text.secondary">
                Hiển thị{' '}
                <Box component="span" sx={{ color: '#111827' }}>{filteredServices.length}</Box>
                {' '}dịch vụ
              </Typography>
              {selectedIds.length > 0 && (
                <Typography variant="caption" sx={{
                  color: TOKEN.green, fontWeight: 700,
                  bgcolor: TOKEN.greenLight, px: 1.5, py: 0.5, borderRadius: '8px',
                  border: `1px solid ${TOKEN.green}33`
                }}>
                  ✓ Đã chọn {selectedIds.length} dịch vụ — kéo xuống để đặt lịch
                </Typography>
              )}
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
                    {/*
                      ServiceCard nhận thêm 2 props mới:
                      - isSelected: boolean
                      - onToggle: (id) => void
                    */}
                    <ServiceCard
                      service={service}
                      isSelected={selectedIds.includes(service.id)}
                      onToggle={toggleService}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Floating booking bar */}
      <BookingBar
        selectedServices={selectedServices}
        onRemove={removeService}
        onClear={() => setSelectedIds([])}
        onBook={handleBook}
      />
    </Box>
  );
};

export default GaragePage;