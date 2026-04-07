import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Chip,
	Divider,
	Grid,
	Card,
	CardContent,
	Avatar,
	CircularProgress,
	Alert,
	IconButton,
	Tooltip
} from "@mui/material";
import {
	Close,
	Person,
	Phone,
	Email,
	LocationOn,
	AccountCircle,
	DirectionsCar,
	Edit,
	Delete,
	Add,
	Event,
	AccessTime,
} from "@mui/icons-material";
import customerService from "../services/customerService";
import VehicleForm from "./VehicleForm";

const CustomerDetail = ({ open, customerId, onClose, onRefresh }) => {
	const [customer, setCustomer] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
	const [selectedVehicle, setSelectedVehicle] = useState(null);

	useEffect(() => {
		if (open && customerId) {
			fetchCustomerDetail();
		}
	}, [open, customerId]);

	const fetchCustomerDetail = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await customerService.getCustomerById(customerId);
			// console.log("Customer detail response:", response.data);
			setCustomer(response.data);
		} catch (err) {
			setError("Không thể tải thông tin chi tiết khách hàng");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleVehicleSuccess = () => {
		fetchCustomerDetail(); // Refresh danh sách xe
		if (onRefresh) onRefresh();
	};

	const handleEditVehicle = (vehicle) => {
		setSelectedVehicle(vehicle);
		setVehicleFormOpen(true);
	};

	const handleAddVehicle = () => {
		setSelectedVehicle(null);
		setVehicleFormOpen(true);
	};

	const InfoRow = ({ icon, label, value }) => (
		<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
			<Box sx={{ mr: 2, color: "primary.main" }}>{icon}</Box>
			<Box>
				<Typography variant="caption" color="textSecondary">
					{label}
				</Typography>
				<Typography variant="body1">{value || "Chưa cập nhật"}</Typography>
			</Box>
		</Box>
	);

	const VehicleCard = ({ vehicle }) => (
		<Card variant="outlined" sx={{ mb: 2, position: "relative" }}>
			<CardContent>
				<Box sx={{
					position: "absolute",
					top: 8,
					right: 8,
					display: "flex",
					gap: 0.5,
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					borderRadius: 2,
					padding: "4px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					backdropFilter: "blur(4px)",
					zIndex: 1
				}}>
					<Tooltip title="Chỉnh sửa">
						<IconButton
							size="small"
							onClick={() => handleEditVehicle(vehicle)}
							sx={{
								bgcolor: "#1976d2",
								color: "white",
								"&:hover": { bgcolor: "#1565c0" },
								width: 32,
								height: 32
							}}
						>
							<Edit fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>

				{/* Layout flexbox: ảnh trái, thông tin phải */}
				<Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
					{/* Ảnh bên trái */}
					<Box sx={{ flexShrink: 0, width: 160 }}>
						{vehicle.image_path ? (
							<img
								src={`http://localhost:3000/${vehicle.image_path}`}
								alt={vehicle.name}
								style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
							/>
						) : (
							<Box
								sx={{
									width: 160,
									height: 120,
									bgcolor: "#f5f5f5",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 2
								}}
							>
								<DirectionsCar sx={{ fontSize: 48, color: "#ccc" }} />
							</Box>
						)}
					</Box>

					{/* Thông tin bên phải */}
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant="h6" gutterBottom>
							{vehicle.name}
						</Typography>

						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
							{/* Cột trái */}
							<Box sx={{ flex: 1, minWidth: "45%" }}>
								<Typography variant="body2" color="textSecondary" gutterBottom>
									<strong>Biển số:</strong> {vehicle.plate_number}
								</Typography>
								<Typography variant="body2" color="textSecondary" gutterBottom>
									<strong>Màu sắc:</strong> {vehicle.color}
								</Typography>
								<Typography variant="body2" color="textSecondary">
									<strong>Số km gần nhất:</strong> {vehicle.latest_odo?.toLocaleString()} km
								</Typography>

							</Box>

							<Box sx={{ flex: 1, minWidth: "45%" }}>
								<Typography variant="body2" color="textSecondary" gutterBottom>
									<strong>Năm SX:</strong> {vehicle.year}
								</Typography>
								<Typography variant="body2" color="textSecondary" gutterBottom>
									<strong>Loại xe:</strong> {vehicle.type}
								</Typography>
								{vehicle.brand && (
									<Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
										{vehicle.brand.logo_url && (
											<Avatar
												src={`http://localhost:3000/${vehicle.brand.logo_url}`}
												alt={vehicle.brand.name}
												sx={{ width: 24, height: 24, mr: 1 }}
											/>
										)}
										<Typography variant="body2">
											<strong>Hãng xe:</strong> {vehicle.brand.name} ({vehicle.brand.country})
										</Typography>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);

	// Component hiển thị lịch hẹn
	const AppointmentCard = ({ appointment }) => {
		const date = new Date(appointment.appointment_date);
		const formattedDate = date.toLocaleDateString('vi-VN');
		const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

		return (
			<Card variant="outlined" sx={{ mb: 2 }}>
				<CardContent>
					<Grid container spacing={2}>
						<Grid sx={{ xs: 6, md: 4 }}>
							<Box display="flex" alignItems="center" mb={1}>
								<Event sx={{ mr: 1, color: "primary.main" }} fontSize="small" />
								<Typography variant="body2">
									<strong>Ngày:</strong> {formattedDate}
								</Typography>
							</Box>
							<Box display="flex" alignItems="center">
								<AccessTime sx={{ mr: 1, color: "primary.main" }} fontSize="small" />
								<Typography variant="body2">
									<strong>Giờ:</strong> {formattedTime}
								</Typography>
							</Box>
						</Grid>
						<Grid sx={{ xs: 6, md: 4 }}>
							<Typography variant="body2">
								<strong>Trạng thái:</strong>
								<Chip
									label={appointment.status || "Pending"}
									size="small"
									color={
										appointment.status === "completed" ? "success" :
											appointment.status === "cancelled" ? "error" :
												"warning"
									}
									sx={{ ml: 1 }}
								/>
							</Typography>
						</Grid>
						<Grid sx={{ xs: 6, md: 4 }}>
							{appointment.vehicle && (
								<Typography variant="body2" gutterBottom>
									<strong>Xe:</strong> {appointment.vehicle.name} - {appointment.vehicle.plate_number}
								</Typography>
							)}
							{appointment.notes && (
								<Typography variant="body2">
									<strong>Ghi chú:</strong> {appointment.notes}
								</Typography>
							)}
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		);
	};

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="h6">Chi tiết khách hàng</Typography>
						<IconButton onClick={onClose} size="small">
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent dividers>
					{loading && (
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					)}

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					{customer && !loading && (
						<>
							{/* Thông tin cá nhân */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom color="primary">
									Thông tin cá nhân
								</Typography>
								<Divider sx={{ mb: 2 }} />
								<Grid container spacing={2}>
									<Grid sx={{ xs: 12, md: 6 }}>
										<InfoRow icon={<Person />} label="Họ tên" value={customer.full_name} />
										<InfoRow icon={<Phone />} label="Số điện thoại" value={customer.phone_number} />
									</Grid>
									<Grid sx={{ xs: 12, md: 6 }}>
										<InfoRow icon={<Email />} label="Email" value={customer.email} />
										<InfoRow icon={<LocationOn />} label="Địa chỉ" value={customer.address} />
									</Grid>
									<Grid sx={{ xs: 12 }}>
										<InfoRow
											icon={<AccountCircle />}
											label="Tài khoản"
											value={`${customer.account?.username} (ID: ${customer.account?.id})`}
										/>
									</Grid>
								</Grid>
							</Box>

							{/* Danh sách xe */}
							<Box sx={{ mb: 4 }}>
								<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
									<Typography variant="h6" color="primary">
										Danh sách xe ({customer.vehicles?.length || 0})
									</Typography>
									<Button
										variant="contained"
										size="small"
										startIcon={<Add />}
										onClick={handleAddVehicle}
									>
										Thêm xe
									</Button>
								</Box>
								<Divider sx={{ mb: 2 }} />
								{customer.vehicles && customer.vehicles.length > 0 ? (
									customer.vehicles.map((vehicle) => (
										<VehicleCard key={vehicle.id} vehicle={vehicle} />
									))
								) : (
									<Alert
										severity="info"
										action={
											<Button color="info" size="small" onClick={handleAddVehicle}>
												Thêm ngay
											</Button>
										}
									>
										Khách hàng chưa có xe nào
									</Alert>
								)}
							</Box>

							{/* Lịch hẹn */}
							<Box>
								<Typography variant="h6" gutterBottom color="primary">
									Lịch hẹn ({customer.appointments?.length || 0})
								</Typography>
								<Divider sx={{ mb: 2 }} />
								{customer.appointments && customer.appointments.length > 0 ? (
									customer.appointments.map((appointment) => (
										<AppointmentCard key={appointment.id} appointment={appointment} />
									))
								) : (
									<Alert severity="info">
										Khách hàng chưa có lịch hẹn nào
									</Alert>
								)}
							</Box>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} variant="contained">
						Đóng
					</Button>
				</DialogActions>
			</Dialog>

			{/* Vehicle Form Dialog */}
			<VehicleForm
				open={vehicleFormOpen}
				vehicle={selectedVehicle}
				customerId={customerId}
				onClose={() => {
					setVehicleFormOpen(false);
					setSelectedVehicle(null);
				}}
				onSuccess={handleVehicleSuccess}
			/>
		</>
	);
};

export default CustomerDetail;