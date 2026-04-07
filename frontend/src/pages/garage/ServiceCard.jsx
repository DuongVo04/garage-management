import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card, CardContent, CardActions, Typography, Box,
	Button, Chip, Skeleton, Tooltip, Zoom
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const TOKEN = {
	coal: '#6a6ae1', ink: '#27272a', slate: '#3f3f46',
	muted: '#71717a', border: '#e4e4e7', borderLight: '#f4f4f5',
	surface: '#fafafa', white: '#ffffff',
	gold: '#b45309', goldLight: '#fef3c7', goldMid: '#d97706',
	success: '#10b981', successLight: '#d1fae5',
	info: '#3b82f6', infoLight: '#dbeafe'
};

const formatCurrency = (amount) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDuration = (minutes) => {
	if (!minutes) return '';
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours === 0) return `${mins} phút`;
	return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
};

const ServiceCard = ({ service, loading = false, featured = false, onBookNow }) => {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
	const [imageError, setImageError] = useState(false);

	if (loading) {
		return (
			<Card elevation={0} sx={{ borderRadius: '16px', height: '100%' }}>
				<CardContent sx={{ p: 2.5 }}>
					<Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '10px', mb: 2 }} />
					<Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
					<Skeleton variant="text" width="100%" height={60} />
				</CardContent>
			</Card>
		);
	}

	const handleBookClick = () => {
		if (onBookNow) {
			onBookNow(service);
		} else {
			navigate('/booking', { state: { selectedService: service } });
		}
	};

	return (
		<Card
			elevation={0}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '20px',
				border: featured ? '2px solid' : '1.5px solid',
				borderColor: featured ? TOKEN.gold : TOKEN.border,
				bgcolor: TOKEN.white,
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				position: 'relative',
				overflow: 'visible',
				'&:hover': {
					boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
					transform: 'translateY(-4px)',
					borderColor: featured ? TOKEN.goldMid : TOKEN.coal,
				},
			}}
		>
			{/* Featured Badge */}
			{featured && (
				<Box
					sx={{
						position: 'absolute',
						top: -12,
						right: 16,
						bgcolor: TOKEN.gold,
						color: TOKEN.white,
						px: 1.5,
						py: 0.5,
						borderRadius: '20px',
						fontSize: '0.7rem',
						fontWeight: 700,
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						zIndex: 1,
						boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
					}}
				>
					<StarIcon sx={{ fontSize: 12 }} />
					Phổ biến
				</Box>
			)}

			<CardContent sx={{ p: 2.5, flex: 1 }}>
				{/* Icon + Giá + Thời gian */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>

					<Box sx={{
						width: 44, height: 44, borderRadius: '12px',
						bgcolor: TOKEN.surface,
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						border: `1px solid ${TOKEN.border}`,
						transition: 'all 0.2s',
						...(isHovered && {
							bgcolor: TOKEN.coal,
							borderColor: TOKEN.coal,
							'& svg': { color: TOKEN.white }
						})
					}}>
						{service.icon ? (
							<img src={service.icon} alt="" style={{ width: 22, height: 22 }} onError={() => setImageError(true)} />
						) : (
							<BuildIcon sx={{ fontSize: 22, color: isHovered ? TOKEN.white : TOKEN.muted, transition: 'color 0.2s' }} />
						)}
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
						<Chip
							label={formatCurrency(service.price)}
							size="small"
							icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
							sx={{
								bgcolor: featured ? TOKEN.goldLight : TOKEN.borderLight,
								color: featured ? TOKEN.gold : TOKEN.slate,
								fontWeight: 800, fontSize: '0.75rem', height: 28,
								'& .MuiChip-icon': { fontSize: 14, color: 'inherit' }
							}}
						/>
						{service.duration && (
							<Chip
								label={formatDuration(service.duration)}
								size="small"
								variant="outlined"
								icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
								sx={{
									height: 22, fontSize: '0.65rem',
									borderColor: TOKEN.border,
									color: TOKEN.muted,
								}}
							/>
						)}
					</Box>
				</Box>

				{/* Tên dịch vụ */}
				<Typography
					variant="subtitle1"
					fontWeight={800}
					sx={{
						mb: 1,
						lineHeight: 1.35,
						fontSize: '1rem',
						color: TOKEN.coal,
						transition: 'color 0.2s',
						...(isHovered && { color: TOKEN.ink })
					}}
				>
					{service.name}
				</Typography>

				{/* Mô tả */}
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.8rem',
						lineHeight: 1.6,
						color: TOKEN.muted,
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						mb: service.benefits ? 1.5 : 0
					}}
				>
					{service.description || 'Dịch vụ bảo trì chuyên nghiệp giúp xe vận hành ổn định và bền lâu.'}
				</Typography>

				{/* Benefits */}
				{service.benefits && service.benefits.length > 0 && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
						{service.benefits.slice(0, 2).map((benefit, idx) => (
							<Chip
								key={idx}
								label={benefit}
								size="small"
								sx={{
									height: 20,
									fontSize: '0.65rem',
									bgcolor: TOKEN.infoLight,
									color: TOKEN.info,
									fontWeight: 500
								}}
							/>
						))}
					</Box>
				)}
			</CardContent>

			{/* <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
				<Tooltip title="Đặt lịch ngay" arrow TransitionComponent={Zoom}>
					<Button
						fullWidth
						variant="contained"
						size="medium"
						disableElevation
						startIcon={<CalendarMonthIcon sx={{ fontSize: '18px' }} />}
						onClick={handleBookClick}
						sx={{
							borderRadius: '12px',
							fontWeight: 700,
							textTransform: 'none',
							fontSize: '0.85rem',
							py: 1,
							bgcolor: featured ? TOKEN.gold : TOKEN.coal,
							color: TOKEN.white,
							transition: 'all 0.2s',
							'&:hover': {
								bgcolor: featured ? TOKEN.goldMid : TOKEN.ink,
								transform: 'scale(1.02)',
							},
							'&:active': {
								transform: 'scale(0.98)',
							}
						}}
					>
						Đặt lịch hẹn
					</Button>
				</Tooltip>
			</CardActions> */}
		</Card>
	);
};

export default ServiceCard;