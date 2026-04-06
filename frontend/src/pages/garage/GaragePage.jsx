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

// ─── Floating Booking Bar (Single Service) ────────────────────────────────────
const BookingBar = ({ selectedService, onClear, onBook }) => {
	const price = selectedService ? Number(selectedService.price) || 0 : 0;

	return (
		<Collapse in={selectedService !== null} timeout={300}>
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
						{/* Selected service */}
						<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
							<Typography variant="caption" fontWeight={800} sx={{ color: TOKEN.goldMid, mr: 0.5, flexShrink: 0 }}>
								Dịch vụ đã chọn:
							</Typography>
							{selectedService && (
								<Chip
									label={selectedService.name}
									size="small"
									onDelete={onClear}
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
							)}
						</Box>

						{/* Price + CTA */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0 }}>
							<Box sx={{ textAlign: 'right' }}>
								<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.2 }}>
									Giá dịch vụ
								</Typography>
								<Typography variant="subtitle1" fontWeight={900} sx={{ color: TOKEN.goldMid, letterSpacing: '-0.02em' }}>
									{formatCurrency(price)}
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
	const [selectedId, setSelectedId] = useState(null);

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
		setSelectedId(prev => prev === id ? null : id);
	}, []);

	const selectedService = services.find(s => s.id === selectedId) || null;

	const handleBook = () => {
		navigate('/booking', {
			state: { selectedIds: selectedId ? [selectedId] : [] }
		});
	};

	return (
		// Bottom padding to avoid content hidden behind fixed BookingBar
		<Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: selectedId ? 10 : 0 }}>

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
						Chọn một dịch vụ, sau đó đặt lịch.
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
							{selectedService && (
								<>
									<Divider sx={{ my: 3 }} />
									<Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ color: TOKEN.coal }}>
										Đã chọn
									</Typography>
									<Box sx={{
										display: 'flex', alignItems: 'center', justifyContent: 'space-between',
										p: 1, borderRadius: '8px', bgcolor: TOKEN.surface,
										border: `1px solid ${TOKEN.border}`, mb: 2
									}}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
											<CheckCircleIcon sx={{ fontSize: 13, color: TOKEN.green, flexShrink: 0 }} />
											<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.coal, lineHeight: 1.3 }}>
												{selectedService.name}
											</Typography>
										</Box>
										<IconButton size="small" onClick={() => setSelectedId(null)} sx={{ p: 0.3 }}>
											<CloseIcon sx={{ fontSize: 13, color: TOKEN.muted }} />
										</IconButton>
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
										Đặt lịch ngay
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
							{selectedService && (
								<Typography variant="caption" sx={{
									color: TOKEN.green, fontWeight: 700,
									bgcolor: TOKEN.greenLight, px: 1.5, py: 0.5, borderRadius: '8px',
									border: `1px solid ${TOKEN.green}33`
								}}>
									✓ Đã chọn "{selectedService.name}" — kéo xuống để đặt lịch
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
										<ServiceCard
											service={service}
											isSelected={selectedId === service.id}
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
				selectedService={selectedService}
				onClear={() => setSelectedId(null)}
				onBook={handleBook}
			/>
		</Box>
	);
};

export default GaragePage;