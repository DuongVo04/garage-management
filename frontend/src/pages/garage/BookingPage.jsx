import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
	Container, Paper, Typography, Box, Grid, TextField,
	Button, Divider, CircularProgress, Alert, Stack,
	Dialog, DialogContent, Card, CardContent,
	Breadcrumbs, Link, Chip, Fade,
	Select, MenuItem, FormControl, InputLabel, FormHelperText,
} from '@mui/material';
import {
	Person, Phone, Email, CheckCircle, Build,
	Schedule, AccessTime, NavigateNext,
	CheckCircleOutline, RadioButtonUnchecked,
	Verified, Home, DirectionsCar,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import { getMyCustomerInfo } from '../../services/customer.service';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const TOKEN = {
	coal: '#6a6ae1', ink: '#27272a', slate: '#3f3f46',
	muted: '#71717a', border: '#e4e4e7', borderLight: '#f4f4f5',
	surface: '#fafafa', white: '#ffffff',
	gold: '#b45309', goldLight: '#fef3c7', goldMid: '#d97706',
	green: '#15803d', greenLight: '#f0fdf4',
	red: '#dc2626',
};

// ─── Validators ───────────────────────────────────────────────────────────────
const validators = {
	customer_name: (v) => v.trim().length < 2 ? 'Họ tên tối thiểu 2 ký tự' : '',
	customer_phone: (v) => !/^(0|\+84)[0-9]{9}$/.test(v.trim()) ? 'Số điện thoại không hợp lệ (VD: 0987123456)' : '',
	customer_email: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Email không hợp lệ' : '',
	appointment_date: (v) => {
		if (!v) return 'Vui lòng chọn ngày hẹn';
		if (new Date(v) <= new Date()) return 'Ngày hẹn phải là thời gian trong tương lai';
		return '';
	},
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StepBadge = ({ number, active, done }) => (
	<Box sx={{
		width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
		display: 'flex', alignItems: 'center', justifyContent: 'center',
		border: '2px solid',
		borderColor: done ? TOKEN.green : active ? TOKEN.coal : TOKEN.border,
		bgcolor: done ? TOKEN.green : active ? TOKEN.coal : 'transparent',
		transition: 'all 0.3s ease',
	}}>
		{done
			? <CheckCircleOutline sx={{ fontSize: 18, color: '#fff' }} />
			: <Typography variant="caption" fontWeight={800} sx={{ color: done || active ? '#fff' : TOKEN.muted }}>
				{number}
			</Typography>
		}
	</Box>
);

const SectionTitle = ({ number, icon: Icon, title, isActive, isDone }) => (
	<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: number > 1 ? 5 : 0 }}>
		<StepBadge number={number} active={isActive} done={isDone} />
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
			<Icon sx={{ fontSize: 20, color: isDone ? TOKEN.green : isActive ? TOKEN.coal : TOKEN.muted }} />
			<Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em"
				sx={{ color: isDone ? TOKEN.green : isActive ? TOKEN.coal : TOKEN.muted, fontSize: '1rem' }}>
				{title}
			</Typography>
			{isDone && (
				<Chip label="Đã hoàn thành" size="small" sx={{
					bgcolor: TOKEN.greenLight, color: TOKEN.green,
					fontWeight: 700, fontSize: '0.7rem', height: 22,
					border: `1px solid ${TOKEN.green}22`
				}} />
			)}
		</Box>
	</Box>
);

const FormField = ({ label, name, value, onChange, onBlur, error, touched, ...props }) => (
	<TextField
		fullWidth label={label} name={name} value={value}
		onChange={onChange} onBlur={onBlur}
		error={touched && !!error}
		helperText={touched && error ? error : ' '}
		FormHelperTextProps={{ sx: { mx: 0, mt: 0.5 } }}
		sx={{
			'& .MuiOutlinedInput-root': {
				borderRadius: '10px', bgcolor: TOKEN.white, fontSize: '0.92rem',
				'& fieldset': { borderColor: TOKEN.border },
				'&:hover fieldset': { borderColor: TOKEN.coal },
				'&.Mui-focused fieldset': { borderColor: TOKEN.coal, borderWidth: 2 },
				'&.Mui-error fieldset': { borderColor: TOKEN.red },
			},
			'& .MuiInputLabel-root': { fontSize: '0.88rem' },
			'& .MuiInputLabel-root.Mui-focused': { color: TOKEN.coal },
			'& .MuiFormHelperText-root': { fontSize: '0.75rem', minHeight: '1.2em' },
		}}
		{...props}
	/>
);

// ServiceCard với kích thước cố định
const ServiceCard = ({ service, isSelected, onToggle, formatCurrency }) => (
	<Card elevation={0} onClick={() => onToggle(service.id)} sx={{
		height: '100%', // Chiều cao tự động theo nội dung
		minHeight: 180, // Chiều cao tối thiểu cố định
		cursor: 'pointer', borderRadius: '14px',
		border: '1.5px solid',
		borderColor: isSelected ? TOKEN.coal : TOKEN.border,
		bgcolor: isSelected ? TOKEN.coal : TOKEN.white,
		transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
		display: 'flex',
		flexDirection: 'column',
		'&:hover': {
			borderColor: TOKEN.coal,
			transform: 'translateY(-3px)',
			boxShadow: isSelected ? '0 16px 32px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.08)',
		}
	}}>
		<CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Box sx={{
					width: 22, height: 22, borderRadius: '50%', border: '2px solid',
					borderColor: isSelected ? TOKEN.goldMid : TOKEN.border,
					bgcolor: isSelected ? TOKEN.goldMid : 'transparent',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					transition: 'all 0.2s ease', flexShrink: 0,
				}}>
					{isSelected && <CheckCircle sx={{ fontSize: 14, color: '#fff' }} />}
				</Box>
				<Chip label={formatCurrency(service.price)} size="small" sx={{
					bgcolor: isSelected ? TOKEN.goldLight : TOKEN.borderLight,
					color: isSelected ? TOKEN.gold : TOKEN.slate,
					fontWeight: 800, fontSize: '0.72rem', height: 22,
					border: isSelected ? `1px solid ${TOKEN.goldMid}55` : 'none',
				}} />
			</Box>
			<Typography variant="subtitle2" fontWeight={800}
				sx={{ mb: 1, color: isSelected ? TOKEN.white : TOKEN.coal, lineHeight: 1.35, fontSize: '0.88rem' }}>
				{service.name}
			</Typography>
			<Typography variant="body2" sx={{
				color: isSelected ? 'rgba(255,255,255,0.6)' : TOKEN.muted,
				fontSize: '0.78rem', lineHeight: 1.5,
				display: '-webkit-box', WebkitLineClamp: 2,
				WebkitBoxOrient: 'vertical', overflow: 'hidden',
				flex: 1,
			}}>
				{service.description || 'Dịch vụ bảo trì chuyên nghiệp giúp xe vận hành ổn định.'}
			</Typography>
		</CardContent>
	</Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const BookingPage = () => {
	const { serviceId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();

	const [allServices, setAllServices] = useState([]);
	const [selectedServiceId, setSelectedServiceId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [touched, setTouched] = useState({});
	const [customerData, setCustomerData] = useState(null);
	const [selectedVehicleId, setSelectedVehicleId] = useState('');

	const [formData, setFormData] = useState({
		appointment_date: '',
		customer_name: user?.full_name || '',
		customer_phone: user?.phone_number || '',
		customer_email: user?.email || '',
	});

	// ── Seed selected ID: router state (Garage) → URL param → null ──────────
	useEffect(() => {
		const stateIds = location.state?.selectedIds;
		if (stateIds?.length > 0) {
			setSelectedServiceId(stateIds[0]);
		} else if (serviceId) {
			setSelectedServiceId(parseInt(serviceId));
		}
	}, [location.state, serviceId]);

	// ── Fetch services + customer info ──────────────────────────────────────
	useEffect(() => {
		const fetchAll = async () => {
			try {
				const [servicesRes, customerRes] = await Promise.all([
					apiClient.get('/services?is_deleted=false'),
					getMyCustomerInfo(),
				]);

				// Services
				const services = servicesRes.data?.data || servicesRes.data || [];
				setAllServices(Array.isArray(services) ? services : []);

				// Customer info → auto-fill form
				if (customerRes?.success && customerRes.data) {
					const c = customerRes.data;
					setCustomerData(c);
					setFormData(prev => ({
						...prev,
						customer_name: c.full_name || prev.customer_name || '',
						customer_phone: c.phone_number || prev.customer_phone || '',
						customer_email: c.email || prev.customer_email || '',
					}));
					// Pre-select vehicle if only one
					if (c.vehicles?.length === 1) {
						setSelectedVehicleId(c.vehicles[0].id);
					}
				}
			} catch (err) {
				setFetchError('Không thể kết nối với hệ thống. Vui lòng thử lại sau.');
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, []);

	// ── Handlers ──────────────────────────────────────────────────────────────
	const toggleService = useCallback((id) => {
		setSelectedServiceId(prev => prev === id ? null : id);
	}, []);

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	}, []);

	const handleBlur = useCallback((e) => {
		setTouched(prev => ({ ...prev, [e.target.name]: true }));
	}, []);

	// ── Derived state ─────────────────────────────────────────────────────────
	const fieldErrors = useMemo(() => {
		const errs = {};
		Object.keys(validators).forEach(key => {
			errs[key] = validators[key](formData[key] || '');
		});
		return errs;
	}, [formData]);

	const selectedService = useMemo(() =>
		selectedServiceId ? allServices.find(s => s.id === selectedServiceId) : null,
		[allServices, selectedServiceId]);

	const vehicles = customerData?.vehicles || [];

	const selectedVehicle = useMemo(() =>
		selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null,
		[vehicles, selectedVehicleId]);

	const totalPrice = useMemo(() =>
		selectedService ? Number(selectedService.price) || 0 : 0,
		[selectedService]);

	const isFormValid = useMemo(() =>
		selectedServiceId !== null && Object.values(fieldErrors).every(e => e === ''),
		[fieldErrors, selectedServiceId]);

	const stepStatus = useMemo(() => ({
		services: selectedServiceId !== null,
		vehicle: vehicles.length === 0 || !!selectedVehicleId, // optional if no vehicles
		personal: !fieldErrors.customer_name && !fieldErrors.customer_phone && !fieldErrors.customer_email
			&& !!formData.customer_name && !!formData.customer_phone && !!formData.customer_email,
		schedule: !fieldErrors.appointment_date && !!formData.appointment_date,
	}), [fieldErrors, formData, selectedServiceId, selectedVehicleId, vehicles.length]);

	const totalSteps = vehicles.length > 0 ? 4 : 3;
	const completedSteps = Object.values(stepStatus).filter(Boolean).length;

	const formatCurrency = useCallback((amount) =>
		new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount), []);

	const formatDateTime = useCallback((dt) =>
		dt ? new Date(dt).toLocaleString('vi-VN', {
			weekday: 'long', day: '2-digit', month: '2-digit',
			year: 'numeric', hour: '2-digit', minute: '2-digit'
		}) : null, []);

	// ── Submit ────────────────────────────────────────────────────────────────
	const handleSubmit = async (e) => {
		e?.preventDefault();
		if (!isFormValid) {
			setTouched({ customer_name: true, customer_phone: true, customer_email: true, appointment_date: true });
			return;
		}
		setSubmitting(true);
		setSubmitError(null);
		try {
			const payload = {
				appointment_date: formData.appointment_date,
				customer_id: user?.id,
				service_id: selectedServiceId,  // <-- ID này quan trọng
				vehicle_id: selectedVehicleId || undefined,
				customer_info: {
					full_name: formData.customer_name,
					phone_number: formData.customer_phone,
					email: formData.customer_email,
				}
			};

			// 🔍 DEBUG: In ra console để kiểm tra
			console.log('=== DEBUG BOOKING ===');
			console.log('1. Selected Service ID:', selectedServiceId);
			console.log('2. Selected Service Object:', selectedService);
			console.log('3. Full Payload:', payload);
			console.log('=====================');

			const response = await apiClient.post('/repair-appointments', payload);

			// 🔍 DEBUG: In response từ server
			console.log('4. Server Response:', response.data);

			if (response.data.success) {
				setSuccess(true);
			} else {
				throw new Error(response.data.message || 'Không thể đặt lịch. Vui lòng thử lại.');
			}
		} catch (err) {
			console.error('Submit error:', err);
			setSubmitError(err?.response?.data?.message || err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
		} finally {
			setSubmitting(false);
		}
	};

	// ── Loading ───────────────────────────────────────────────────────────────
	if (loading) return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: 2 }}>
			<Box sx={{
				width: 48, height: 48, borderRadius: '50%',
				border: `3px solid ${TOKEN.border}`, borderTopColor: TOKEN.coal,
				animation: 'spin 0.8s linear infinite',
				'@keyframes spin': { to: { transform: 'rotate(360deg)' } }
			}} />
			<Typography variant="body2" color="text.secondary" fontWeight={600}>Đang tải dịch vụ...</Typography>
		</Box>
	);

	// ── Render ────────────────────────────────────────────────────────────────
	return (
		<Box sx={{ bgcolor: TOKEN.surface, minHeight: '100vh', pb: 12 }}>

			{/* Header bar */}
			<Box sx={{ bgcolor: TOKEN.white, borderBottom: `1px solid ${TOKEN.border}` }}>
				<Container maxWidth="lg" sx={{ py: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16, color: TOKEN.muted }} />}>
							<Link component="button" underline="hover" variant="body2"
								onClick={() => navigate('/')}
								sx={{ color: TOKEN.muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.82rem' }}>
								<Home sx={{ fontSize: 15 }} /> Trang chủ
							</Link>
							<Link component="button" underline="hover" variant="body2"
								onClick={() => navigate('/garage')}
								sx={{ color: TOKEN.muted, fontWeight: 500, fontSize: '0.82rem' }}>
								Garage
							</Link>
							<Typography variant="body2" fontWeight={700} sx={{ color: TOKEN.coal, fontSize: '0.82rem' }}>
								Đặt lịch
							</Typography>
						</Breadcrumbs>

						{/* Progress */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.muted }}>
								Hoàn thành {completedSteps}/{totalSteps} bước
							</Typography>
							<Box sx={{ width: 80, height: 4, bgcolor: TOKEN.borderLight, borderRadius: 2, overflow: 'hidden' }}>
								<Box sx={{
									height: '100%', borderRadius: 2, bgcolor: TOKEN.coal,
									width: `${(completedSteps / totalSteps) * 100}%`,
									transition: 'width 0.4s ease',
								}} />
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>

			{/* ── Banner: pre-selected từ Garage ── */}
			{location.state?.selectedIds?.length > 0 && (
				<Box sx={{ bgcolor: TOKEN.goldLight, borderBottom: `1px solid ${TOKEN.goldMid}44` }}>
					<Container maxWidth="lg" sx={{ py: 1.5 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
							<CheckCircle sx={{ fontSize: 16, color: TOKEN.gold }} />
							<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.gold }}>
								Bạn đã chọn{' '}
								<strong>{location.state.selectedIds.length} dịch vụ</strong>{' '}
								từ trang Garage. Có thể điều chỉnh thêm bên dưới.
							</Typography>
						</Box>
					</Container>
				</Box>
			)}

			<Container maxWidth="lg" sx={{ pt: 5 }}>
				{fetchError && (
					<Alert severity="error" sx={{ mb: 4, borderRadius: 3 }} onClose={() => setFetchError(null)}>
						{fetchError}
					</Alert>
				)}

				<Box sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 0.9fr' },
					gap: 5,
					alignItems: 'start',
				}}>
					{/* ── LEFT: Form (Dịch vụ + Thông tin + Thời gian) ── */}
					<Box>
						<form onSubmit={handleSubmit} noValidate>

							{/* STEP 1 */}
							<SectionTitle number={1} icon={Build} title="Chọn dịch vụ"
								isActive={!stepStatus.services} isDone={stepStatus.services} />

							{allServices.length === 0 ? (
								<Box sx={{ py: 8, textAlign: 'center', border: `1.5px dashed ${TOKEN.border}`, borderRadius: '14px', bgcolor: TOKEN.white }}>
									<Build sx={{ fontSize: 40, color: TOKEN.border, mb: 1.5 }} />
									<Typography variant="body2" color="text.secondary">Không có dịch vụ nào khả dụng</Typography>
								</Box>
							) : (
								// FIX: Mỗi hàng cố định 2 ô dịch vụ
								<Box sx={{
									display: 'grid',
									gridTemplateColumns: {
										xs: '1fr',        // Mobile: 1 cột
										sm: 'repeat(2, 1fr)'  // Tablet & Desktop: cố định 2 cột
									},
									gap: 2
								}}>
									{allServices.map((service) => (
										<ServiceCard
											key={service.id}
											service={service}
											isSelected={selectedServiceId === service.id}
											onToggle={toggleService}
											formatCurrency={formatCurrency}
										/>
									))}
								</Box>
							)}

							{/* STEP 2 — Phương tiện (chỉ hiện nếu có xe) */}
							{vehicles.length > 0 && (
								<>
									<SectionTitle number={2} icon={DirectionsCar} title="Chọn phương tiện"
										isActive={stepStatus.services && !stepStatus.vehicle} isDone={stepStatus.vehicle && !!selectedVehicleId} />
									<Paper elevation={0} sx={{ p: 3.5, borderRadius: '16px', border: `1px solid ${TOKEN.border}`, bgcolor: TOKEN.white }}>
										<Box sx={{
											display: 'grid',
											gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
											gap: 2,
										}}>
											{/* Option: không chọn xe */}
											<Box
												onClick={() => setSelectedVehicleId('')}
												sx={{
													p: 2, borderRadius: '12px', cursor: 'pointer',
													border: '1.5px dashed',
													borderColor: !selectedVehicleId ? TOKEN.coal : TOKEN.border,
													bgcolor: !selectedVehicleId ? `${TOKEN.coal}08` : TOKEN.white,
													display: 'flex', alignItems: 'center', gap: 1.5,
													transition: 'all 0.18s ease',
													'&:hover': { borderColor: TOKEN.coal },
												}}
											>
												<Box sx={{
													width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
													display: 'flex', alignItems: 'center', justifyContent: 'center',
													bgcolor: !selectedVehicleId ? TOKEN.coal : TOKEN.borderLight,
												}}>
													<DirectionsCar sx={{ fontSize: 18, color: !selectedVehicleId ? '#fff' : TOKEN.muted }} />
												</Box>
												<Box>
													<Typography variant="caption" fontWeight={700}
														sx={{ color: !selectedVehicleId ? TOKEN.coal : TOKEN.slate, display: 'block' }}>
														Chưa chọn xe
													</Typography>
													<Typography variant="caption" sx={{ color: TOKEN.muted, fontSize: '0.72rem' }}>
														Bỏ qua bước này
													</Typography>
												</Box>
												{!selectedVehicleId && (
													<CheckCircle sx={{ fontSize: 16, color: TOKEN.coal, ml: 'auto', flexShrink: 0 }} />
												)}
											</Box>

											{vehicles.map((vehicle) => (
												<Box
													key={vehicle.id}
													onClick={() => setSelectedVehicleId(vehicle.id)}
													sx={{
														p: 2, borderRadius: '12px', cursor: 'pointer',
														border: '1.5px solid',
														borderColor: selectedVehicleId === vehicle.id ? TOKEN.coal : TOKEN.border,
														bgcolor: selectedVehicleId === vehicle.id ? TOKEN.coal : TOKEN.white,
														display: 'flex', alignItems: 'center', gap: 1.5,
														transition: 'all 0.18s ease',
														'&:hover': {
															borderColor: TOKEN.coal,
															transform: 'translateY(-2px)',
															boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
														},
													}}
												>
													<Box sx={{
														width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
														display: 'flex', alignItems: 'center', justifyContent: 'center',
														bgcolor: selectedVehicleId === vehicle.id ? 'rgba(255,255,255,0.15)' : TOKEN.borderLight,
													}}>
														<DirectionsCar sx={{
															fontSize: 18,
															color: selectedVehicleId === vehicle.id ? '#fff' : TOKEN.muted,
														}} />
													</Box>
													<Box sx={{ flex: 1, minWidth: 0 }}>
														<Typography variant="caption" fontWeight={700} noWrap
															sx={{ color: selectedVehicleId === vehicle.id ? TOKEN.white : TOKEN.coal, display: 'block' }}>
															{vehicle.name || `${vehicle.brand?.name || ''} ${vehicle.type || ''}`.trim() || 'Xe của tôi'}
														</Typography>
														<Typography variant="caption" noWrap
															sx={{ color: selectedVehicleId === vehicle.id ? 'rgba(255,255,255,0.6)' : TOKEN.muted, fontSize: '0.72rem' }}>
															{vehicle.plate_number || 'Chưa có biển số'}
														</Typography>
													</Box>
													{selectedVehicleId === vehicle.id && (
														<CheckCircle sx={{ fontSize: 16, color: '#fff', flexShrink: 0 }} />
													)}
												</Box>
											))}
										</Box>
									</Paper>
								</>
							)}

							{/* STEP 2 or 3 — Thông tin cá nhân */}
							<SectionTitle number={vehicles.length > 0 ? 3 : 2} icon={Person} title="Thông tin cá nhân"
								isActive={stepStatus.services && !stepStatus.personal} isDone={stepStatus.personal} />
							<Paper elevation={0} sx={{ p: 3.5, borderRadius: '16px', border: `1px solid ${TOKEN.border}`, bgcolor: TOKEN.white }}>
								{/* Auto-fill badge */}
								{customerData && (
									<Box sx={{
										display: 'flex', alignItems: 'center', gap: 1,
										mb: 2.5, px: 1.5, py: 1, borderRadius: '8px',
										bgcolor: TOKEN.greenLight, border: `1px solid ${TOKEN.green}22`,
									}}>
										<CheckCircle sx={{ fontSize: 14, color: TOKEN.green }} />
										<Typography variant="caption" fontWeight={600} sx={{ color: TOKEN.green }}>
											Đã tự động điền từ hồ sơ của bạn — có thể chỉnh sửa nếu cần
										</Typography>
									</Box>
								)}
								<Grid container spacing={2.5}>
									<Grid item xs={12}>
										<FormField label="Họ và tên *" name="customer_name"
											placeholder="Nguyễn Văn A" value={formData.customer_name}
											onChange={handleChange} onBlur={handleBlur}
											error={fieldErrors.customer_name} touched={touched.customer_name}
											InputProps={{ startAdornment: <Person sx={{ mr: 1, fontSize: 18, color: TOKEN.muted }} /> }}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<FormField label="Số điện thoại *" name="customer_phone"
											placeholder="0987 123 456" value={formData.customer_phone}
											onChange={handleChange} onBlur={handleBlur}
											error={fieldErrors.customer_phone} touched={touched.customer_phone}
											InputProps={{ startAdornment: <Phone sx={{ mr: 1, fontSize: 18, color: TOKEN.muted }} /> }}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<FormField label="Email *" name="customer_email" type="email"
											placeholder="example@email.com" value={formData.customer_email}
											onChange={handleChange} onBlur={handleBlur}
											error={fieldErrors.customer_email} touched={touched.customer_email}
											InputProps={{ startAdornment: <Email sx={{ mr: 1, fontSize: 18, color: TOKEN.muted }} /> }}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel sx={{ fontSize: '0.88rem' }}>Phương tiện</InputLabel>
											<Select
												value={selectedVehicleId}
												onChange={(e) => setSelectedVehicleId(e.target.value)}
												label="Phương tiện"
												sx={{
													borderRadius: '10px', bgcolor: TOKEN.white, fontSize: '0.92rem',
													'& fieldset': { borderColor: TOKEN.border },
													'&:hover fieldset': { borderColor: TOKEN.coal },
													'&.Mui-focused fieldset': { borderColor: TOKEN.coal, borderWidth: 2 },
												}}
											>
												<MenuItem value="">
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
														<DirectionsCar sx={{ fontSize: 16, color: TOKEN.muted }} />
														<Typography variant="body2" sx={{ color: TOKEN.muted }}>Không chọn xe</Typography>
													</Box>
												</MenuItem>
												{vehicles.map((vehicle) => (
													<MenuItem key={vehicle.id} value={vehicle.id}>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
															<DirectionsCar sx={{ fontSize: 16, color: TOKEN.coal }} />
															<Box>
																<Typography variant="body2" fontWeight={600} sx={{ color: TOKEN.coal, lineHeight: 1.3 }}>
																	{vehicle.name || `${vehicle.brand?.name || ''} ${vehicle.type || ''}`.trim() || 'Xe của tôi'}
																</Typography>
																{vehicle.plate_number && (
																	<Typography variant="caption" sx={{ color: TOKEN.muted, fontSize: '0.72rem', display: 'block' }}>
																		{vehicle.plate_number}
																	</Typography>
																)}
															</Box>
														</Box>
													</MenuItem>
												))}
											</Select>
											<FormHelperText sx={{ mx: 0, mt: 0.5, fontSize: '0.75rem', minHeight: '1.2em' }}>
												{vehicles.length === 0
													? 'Chưa có xe — thêm xe trong hồ sơ của bạn'
													: 'Tùy chọn — chọn xe để kỹ thuật viên chuẩn bị tốt hơn'}
											</FormHelperText>
										</FormControl>
									</Grid>
								</Grid>
							</Paper>

							{/* STEP 3 or 4 — Thời gian hẹn */}
							<SectionTitle number={vehicles.length > 0 ? 4 : 3} icon={Schedule} title="Thời gian hẹn"
								isActive={stepStatus.personal && !stepStatus.schedule} isDone={stepStatus.schedule} />
							<Paper elevation={0} sx={{ p: 3.5, borderRadius: '16px', border: `1px solid ${TOKEN.border}`, bgcolor: TOKEN.white }}>
								<Grid container spacing={2.5}>
									<Grid item xs={12} md={8}>
										<FormField label="Ngày và giờ hẹn *" name="appointment_date"
											type="datetime-local" value={formData.appointment_date}
											onChange={handleChange} onBlur={handleBlur}
											error={fieldErrors.appointment_date} touched={touched.appointment_date}
											InputLabelProps={{ shrink: true }}
											inputProps={{ min: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16) }}
										/>
									</Grid>
								</Grid>
							</Paper>
						</form>
					</Box>

					{/* ── RIGHT: Summary (Tóm tắt đặt lịch) ── */}
					<Box sx={{ position: 'sticky', top: 88 }}>
						<Paper elevation={0} sx={{
							borderRadius: '20px', border: `1.5px solid ${TOKEN.border}`,
							bgcolor: TOKEN.white, overflow: 'hidden',
						}}>
							<Box sx={{ px: 3.5, pt: 3.5, pb: 2.5, borderBottom: `1px solid ${TOKEN.borderLight}` }}>
								<Typography variant="subtitle1" fontWeight={900} letterSpacing="-0.02em" sx={{ color: TOKEN.coal }}>
									Tóm tắt đặt lịch
								</Typography>
								<Typography variant="caption" sx={{ color: TOKEN.muted }}>
									Kiểm tra thông tin trước khi xác nhận
								</Typography>
							</Box>

							<Box sx={{ px: 3.5, py: 3 }}>
								{selectedService === null ? (
									<Box sx={{ py: 4, textAlign: 'center', border: `1.5px dashed ${TOKEN.borderLight}`, borderRadius: '12px', mb: 2.5 }}>
										<Build sx={{ fontSize: 32, color: TOKEN.border, mb: 1 }} />
										<Typography variant="caption" sx={{ color: TOKEN.muted, display: 'block' }}>Chưa chọn dịch vụ</Typography>
									</Box>
								) : (
									<Box sx={{
										display: 'flex', justifyContent: 'space-between',
										alignItems: 'flex-start', gap: 1.5,
										p: 1.5, borderRadius: '10px',
										bgcolor: TOKEN.surface, border: `1px solid ${TOKEN.borderLight}`,
										mb: 2.5
									}}>
										<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
											<CheckCircle sx={{ fontSize: 14, color: TOKEN.green, mt: 0.3, flexShrink: 0 }} />
											<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.coal, lineHeight: 1.4 }}>
												{selectedService.name}
											</Typography>
										</Box>
										<Typography variant="caption" fontWeight={800} sx={{ color: TOKEN.gold, flexShrink: 0 }}>
											{formatCurrency(selectedService.price)}
										</Typography>
									</Box>
								)}

								{selectedVehicle && (
									<Box sx={{
										display: 'flex', justifyContent: 'space-between',
										alignItems: 'flex-start', gap: 1.5,
										p: 1.5, borderRadius: '10px',
										bgcolor: TOKEN.surface, border: `1px solid ${TOKEN.borderLight}`,
										mb: 2.5,
									}}>
										<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
											<DirectionsCar sx={{ fontSize: 14, color: TOKEN.coal, mt: 0.3, flexShrink: 0 }} />
											<Box>
												<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.coal, lineHeight: 1.4, display: 'block' }}>
													{selectedVehicle.name || `${selectedVehicle.brand?.name || ''} ${selectedVehicle.type || ''}`.trim() || 'Xe của tôi'}
												</Typography>
												{selectedVehicle.plate_number && (
													<Typography variant="caption" sx={{ color: TOKEN.muted, fontSize: '0.7rem' }}>
														{selectedVehicle.plate_number}
													</Typography>
												)}
											</Box>
										</Box>
									</Box>
								)}

								{formData.appointment_date && (
									<Box sx={{
										display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5,
										p: 1.5, borderRadius: '10px', bgcolor: TOKEN.surface, border: `1px solid ${TOKEN.borderLight}`
									}}>
										<AccessTime sx={{ fontSize: 15, color: TOKEN.gold, mt: 0.2, flexShrink: 0 }} />
										<Box>
											<Typography variant="caption" sx={{ color: TOKEN.muted, fontWeight: 600, display: 'block' }}>
												Thời gian hẹn
											</Typography>
											<Typography variant="caption" fontWeight={800} sx={{ color: TOKEN.coal, lineHeight: 1.5 }}>
												{formatDateTime(formData.appointment_date)}
											</Typography>
										</Box>
									</Box>
								)}

								{selectedService !== null && (
									<>
										<Divider sx={{ borderStyle: 'dashed', my: 2 }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
											<Typography variant="body2" fontWeight={700} sx={{ color: TOKEN.muted }}>
												Tổng cộng
											</Typography>
											<Typography variant="h5" fontWeight={900} letterSpacing="-0.03em" sx={{ color: TOKEN.coal }}>
												{formatCurrency(totalPrice)}
											</Typography>
										</Box>
									</>
								)}

								{submitError && (
									<Alert severity="error" sx={{ mb: 2, borderRadius: '10px', fontSize: '0.8rem' }}
										onClose={() => setSubmitError(null)}>
										{submitError}
									</Alert>
								)}

								{/* Validation hints */}
								{!isFormValid && (
									<Box sx={{ mb: 2 }}>
										{selectedServiceId === null && (
											<Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', mb: 0.5 }}>
												<RadioButtonUnchecked sx={{ fontSize: 12, color: TOKEN.muted }} />
												<Typography variant="caption" sx={{ color: TOKEN.muted }}>Chọn một dịch vụ</Typography>
											</Box>
										)}
										{(fieldErrors.customer_name || fieldErrors.customer_phone || fieldErrors.customer_email) && (
											<Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', mb: 0.5 }}>
												<RadioButtonUnchecked sx={{ fontSize: 12, color: TOKEN.muted }} />
												<Typography variant="caption" sx={{ color: TOKEN.muted }}>Điền đầy đủ thông tin cá nhân</Typography>
											</Box>
										)}
										{fieldErrors.appointment_date && (
											<Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
												<RadioButtonUnchecked sx={{ fontSize: 12, color: TOKEN.muted }} />
												<Typography variant="caption" sx={{ color: TOKEN.muted }}>Chọn ngày và giờ hẹn hợp lệ</Typography>
											</Box>
										)}
									</Box>
								)}

								<Button onClick={handleSubmit} fullWidth variant="contained" size="large"
									disabled={submitting || success} disableElevation
									sx={{
										py: 2, borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem',
										textTransform: 'none', letterSpacing: '-0.01em',
										bgcolor: isFormValid ? TOKEN.coal : TOKEN.border,
										color: isFormValid ? TOKEN.white : TOKEN.muted,
										transition: 'all 0.2s ease',
										'&:hover': {
											bgcolor: isFormValid ? TOKEN.ink : TOKEN.border,
											boxShadow: isFormValid ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
										},
										'&:disabled': { bgcolor: TOKEN.border, color: TOKEN.muted },
									}}
								>
									{submitting
										? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<CircularProgress size={18} sx={{ color: TOKEN.muted }} />
											<span>Đang xử lý...</span>
										</Box>
										: 'Xác nhận đặt lịch'
									}
								</Button>

								<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2.5 }}>
									{[{ icon: Verified, label: 'Xác thực' }, { icon: AccessTime, label: 'Phản hồi nhanh' }].map(({ icon: Icon, label }) => (
										<Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3 }}>
											<Icon sx={{ fontSize: 16, color: TOKEN.muted }} />
											<Typography variant="caption" sx={{ color: TOKEN.muted, fontSize: '0.68rem' }}>{label}</Typography>
										</Box>
									))}
								</Box>
							</Box>
						</Paper>
					</Box>
				</Box>
			</Container>

			{/* Success Dialog */}
			<Dialog open={success} onClose={() => navigate('/garage')} maxWidth="xs" fullWidth
				TransitionComponent={Fade}
				PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' } }}>
				<DialogContent sx={{ p: 0 }}>
					<Box sx={{ bgcolor: TOKEN.coal, py: 4, textAlign: 'center' }}>
						<Box sx={{
							width: 72, height: 72, borderRadius: '50%',
							bgcolor: 'rgba(255,255,255,0.1)',
							display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
							border: '2px solid rgba(255,255,255,0.2)',
						}}>
							<CheckCircle sx={{ fontSize: 42, color: '#4ade80' }} />
						</Box>
					</Box>
					<Box sx={{ p: 4, textAlign: 'center' }}>
						<Typography variant="h5" fontWeight={900} letterSpacing="-0.03em" gutterBottom sx={{ color: TOKEN.coal }}>
							Đặt lịch thành công!
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
							Chúng tôi sẽ liên hệ qua số{' '}
							<Box component="span" sx={{ fontWeight: 800, color: TOKEN.coal }}>{formData.customer_phone}</Box>{' '}
							để xác nhận lịch hẹn.
						</Typography>
						<Box sx={{ bgcolor: TOKEN.surface, borderRadius: '12px', p: 2.5, mb: 3, textAlign: 'left' }}>
							{selectedService && (
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography variant="caption" fontWeight={600} sx={{ color: TOKEN.slate }}>{selectedService.name}</Typography>
									<Typography variant="caption" fontWeight={700}>{formatCurrency(selectedService.price)}</Typography>
								</Box>
							)}
							{formData.appointment_date && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: `1px solid ${TOKEN.border}` }}>
									<AccessTime sx={{ fontSize: 14, color: TOKEN.gold }} />
									<Typography variant="caption" fontWeight={700} sx={{ color: TOKEN.coal }}>
										{formatDateTime(formData.appointment_date)}
									</Typography>
								</Box>
							)}
						</Box>
						<Button variant="contained" fullWidth onClick={() => navigate('/garage')} disableElevation
							sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800, textTransform: 'none', bgcolor: TOKEN.coal, '&:hover': { bgcolor: TOKEN.ink } }}>
							Về trang Garage
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default BookingPage;