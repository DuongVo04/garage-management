import { useState, useEffect } from "react";
import {
	Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
	TableHead, TableRow, Paper, IconButton, Chip, Dialog,
	DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
	Grid, Stack, InputAdornment, Tooltip, CircularProgress, Snackbar,
	Alert, Divider, alpha
} from "@mui/material";
import {
	Search, Close, Refresh, FilterList, 
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
	Schedule as ScheduleIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
	Edit as EditIcon
} from "@mui/icons-material";
import {
	getAllRepairAppointments,
	updateRepairAppointmentStatus,
	deleteRepairAppointment
} from "../../services/repair-appointment.service";

const COLORS = {
	primary: "#1A237E",
	accent: "#5C6BC0",
	surface: "#F8F9FE",
	cardBg: "#FFFFFF",
	border: "#E8EAF6",
	text: "#1A1A2E",
	muted: "#7986CB",
	danger: "#EF5350",
	success: "#26A69A",
	warning: "#FFA726",
	info: "#29B6F6"
};

const STATUS_CONFIG = {
	booked: { label: "Đã đặt lịch", color: "info", icon: <ScheduleIcon fontSize="small" /> },
	confirmed: { label: "Đã xác nhận", color: "primary", icon: <CheckCircleIcon fontSize="small" /> },
	done: { label: "Hoàn thành", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
	cancelled: { label: "Đã hủy", color: "error", icon: <CancelIcon fontSize="small" /> },
};

const RepairAppointmentsPage = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [newStatus, setNewStatus] = useState("");

	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const fetchAppointments = async () => {
		setLoading(true);
		try {
			const params = {};
			if (statusFilter !== "all") params.status = statusFilter;
			
			const res = await getAllRepairAppointments(params);
			if (res.success) {
				setAppointments(res.data);
			}
		} catch (error) {
			showSnackbar("Lỗi khi tải danh sách lịch hẹn", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAppointments();
	}, [statusFilter]);

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	const handleStatusChange = async () => {
		try {
			const res = await updateRepairAppointmentStatus(selectedAppointment.id, newStatus);
			if (res.success) {
				showSnackbar("Cập nhật trạng thái thành công");
				setStatusDialogOpen(false);
				fetchAppointments();
			}
		} catch (error) {
			showSnackbar("Lỗi khi cập nhật trạng thái", "error");
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
			try {
				const res = await deleteRepairAppointment(id);
				if (res.success) {
					showSnackbar("Xóa lịch hẹn thành công");
					fetchAppointments();
				}
			} catch (error) {
				showSnackbar("Lỗi khi xóa lịch hẹn", "error");
			}
		}
	};

	const filteredAppointments = Array.isArray(appointments) ? appointments.filter(app => 
		app.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		app.customer?.phone_number?.includes(searchTerm)
	) : [];

	const formatDate = (dateString) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleString("vi-VN", {
			year: 'numeric', month: '2-digit', day: '2-digit',
			hour: '2-digit', minute: '2-digit'
		});
	};

	return (
		<Box sx={{ p: 3, bgcolor: COLORS.surface, minHeight: "100%" }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
				<Box>
					<Typography variant="h4" fontWeight="800" color={COLORS.primary}>
						Lịch Hẹn Sửa Chữa
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Quản lý danh sách khách hàng đặt lịch sửa chữa tại gara
					</Typography>
				</Box>
				<Button 
					variant="contained" 
					startIcon={<Refresh />} 
					onClick={fetchAppointments}
					sx={{ borderRadius: 2, bgcolor: COLORS.primary }}
				>
					Làm mới
				</Button>
			</Stack>

			{/* Filters */}
			<Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							placeholder="Tìm kiếm theo tên khách hàng hoặc số điện thoại..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search color="action" />
									</InputAdornment>
								),
								sx: { borderRadius: 2 }
							}}
							size="small"
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							select
							fullWidth
							label="Trạng thái"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							size="small"
							sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
						>
							<MenuItem value="all">Tất cả trạng thái</MenuItem>
							{Object.entries(STATUS_CONFIG).map(([key, value]) => (
								<MenuItem key={key} value={key}>{value.label}</MenuItem>
							))}
						</TextField>
					</Grid>
				</Grid>
			</Paper>

			{/* Table */}
			<TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
						<CircularProgress />
					</Box>
				) : (
					<Table>
						<TableHead sx={{ bgcolor: alpha(COLORS.primary, 0.05) }}>
							<TableRow>
								<TableCell sx={{ fontWeight: "bold" }}>Khách hàng</TableCell>
								<TableCell sx={{ fontWeight: "bold" }}>Số điện thoại</TableCell>
								<TableCell sx={{ fontWeight: "bold" }}>Ngày hẹn</TableCell>
								<TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
								<TableCell align="right" sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredAppointments.length > 0 ? (
								filteredAppointments.map((app) => (
									<TableRow key={app.id} hover>
										<TableCell>
											<Typography variant="body2" fontWeight="bold">
												{app.customer?.full_name || "—"}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{app.customer?.email}
											</Typography>
										</TableCell>
										<TableCell>{app.customer?.phone_number || "—"}</TableCell>
										<TableCell>{formatDate(app.appointment_date)}</TableCell>
										<TableCell>
											<Chip 
												icon={STATUS_CONFIG[app.status]?.icon}
												label={STATUS_CONFIG[app.status]?.label || app.status} 
												color={STATUS_CONFIG[app.status]?.color || "default"}
												size="small"
												sx={{ fontWeight: "bold", borderRadius: 1 }}
											/>
										</TableCell>
										<TableCell align="right">
											<Stack direction="row" spacing={1} justifyContent="flex-end">
												<Tooltip title="Xem chi tiết">
													<IconButton 
														size="small" 
														onClick={() => {
															setSelectedAppointment(app);
															setDetailDialogOpen(true);
														}}
														sx={{ color: COLORS.info }}
													>
														<VisibilityIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												<Tooltip title="Đổi trạng thái">
													<IconButton 
														size="small" 
														onClick={() => {
															setSelectedAppointment(app);
															setNewStatus(app.status);
															setStatusDialogOpen(true);
														}}
														sx={{ color: COLORS.warning }}
													>
														<EditIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												<Tooltip title="Xóa">
													<IconButton 
														size="small" 
														onClick={() => handleDelete(app.id)}
														sx={{ color: COLORS.danger }}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Stack>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5} align="center" sx={{ py: 3 }}>
										<Typography color="text.secondary">Không tìm thấy lịch hẹn nào</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				)}
			</TableContainer>

			{/* Detail Dialog */}
			<Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
				<DialogTitle sx={{ bgcolor: COLORS.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					Chi tiết lịch hẹn
					<IconButton onClick={() => setDetailDialogOpen(false)} sx={{ color: "#fff" }}><Close /></IconButton>
				</DialogTitle>
				<DialogContent dividers sx={{ p: 3 }}>
					{selectedAppointment && (
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="overline" color="text.secondary">Thông tin khách hàng</Typography>
								<Typography variant="h6" fontWeight="bold">{selectedAppointment.customer?.full_name}</Typography>
								<Typography variant="body2">SĐT: {selectedAppointment.customer?.phone_number}</Typography>
								<Typography variant="body2">Email: {selectedAppointment.customer?.email}</Typography>
								<Typography variant="body2">Địa chỉ: {selectedAppointment.customer?.address || "—"}</Typography>
							</Grid>
							<Divider sx={{ width: "100%", my: 2 }} />
							<Grid item xs={12}>
								<Typography variant="overline" color="text.secondary">Thông tin lịch hẹn</Typography>
								<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
									<Typography variant="body1">Ngày hẹn:</Typography>
									<Typography variant="body1" fontWeight="bold">{formatDate(selectedAppointment.appointment_date)}</Typography>
								</Box>
								<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
									<Typography variant="body1">Trạng thái:</Typography>
									<Chip 
										label={STATUS_CONFIG[selectedAppointment.status]?.label || selectedAppointment.status} 
										color={STATUS_CONFIG[selectedAppointment.status]?.color || "default"}
										size="small"
									/>
								</Box>
								<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
									<Typography variant="body1">Ngày tạo:</Typography>
									<Typography variant="body1">{formatDate(selectedAppointment.created_date)}</Typography>
								</Box>
							</Grid>
						</Grid>
					)}
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button onClick={() => setDetailDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>Đóng</Button>
				</DialogActions>
			</Dialog>

			{/* Status Dialog */}
			<Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
				<DialogTitle>Cập nhật trạng thái</DialogTitle>
				<DialogContent>
					<Box sx={{ minWidth: 300, mt: 2 }}>
						<TextField
							select
							fullWidth
							label="Trạng thái mới"
							value={newStatus}
							onChange={(e) => setNewStatus(e.target.value)}
						>
							{Object.entries(STATUS_CONFIG).map(([key, value]) => (
								<MenuItem key={key} value={key}>{value.label}</MenuItem>
							))}
						</TextField>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
					<Button onClick={handleStatusChange} variant="contained" color="primary">Cập nhật</Button>
				</DialogActions>
			</Dialog>

			<Snackbar 
				open={snackbar.open} 
				autoHideDuration={6000} 
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default RepairAppointmentsPage;
