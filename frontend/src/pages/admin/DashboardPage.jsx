// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Grid,
	Paper,
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Chip,
	CircularProgress,
	Stack,
	Divider,
	Tooltip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

import {
	TrendingUp,
	AttachMoney,
	DirectionsCar,
	People,
	Schedule,
	LocalOffer,
	ArrowForward,
	Refresh,
	Receipt,
	Warning,
} from "@mui/icons-material";

// Import services
import { getAllShowroomVehicles } from "../../services/showroom.service";
import { getAllCustomers } from "../../services/customer.service";
import { getAllEmployees } from "../../services/employee.service";
import { getAllSpareParts } from "../../services/spare-parts.service";
import { getAllVouchers } from "../../services/voucher.service";
import { getAllInvoices } from "../../services/invoice.service";
import apiClient from "../../services/apiClient";

// Colors
const COLORS = {
	primary: "#1A237E",
	accent: "#5C6BC0",
	success: "#26A69A",
	warning: "#FFA726",
	danger: "#EF5350",
	surface: "#F8F9FE",
	border: "#E8EAF6",
	muted: "#7986CB",
};

const formatPrice = (v) =>
	v ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v) : "0₫";

const formatDate = (dateStr) => {
	if (!dateStr) return "—";
	const date = new Date(dateStr);
	return date.toLocaleDateString("vi-VN");
};

// ==================== HELPER FUNCTIONS FOR REVENUE ====================
const getMonthName = (monthIndex) => {
	const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
	return months[monthIndex];
};

const getEmptyMonthlyData = () => {
	return Array(12).fill().map((_, i) => ({
		month: i,
		revenue: 0,
		count: 0
	}));
};

const calculateRevenueFromInvoices = (invoices, year = new Date().getFullYear()) => {
	if (!invoices || invoices.length === 0) {
		return {
			totalRevenue: 0,
			monthlyRevenue: 0,
			revenueGrowth: 0,
			totalInvoices: 0,
			totalVehicleInvoices: 0,
			totalRepairInvoices: 0,
			averageInvoiceValue: 0,
			monthlyRevenueData: getEmptyMonthlyData().map((item, index) => ({
				month: getMonthName(index),
				revenue: 0,
				count: 0
			}))
		};
	}

	// Lọc invoices theo năm được chọn
	const invoicesInYear = invoices.filter(inv => {
		if (!inv.created_date) return false;
		const date = new Date(inv.created_date);
		return date.getFullYear() === year;
	});

	// Lấy tháng hiện tại
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	// Khởi tạo dữ liệu doanh thu theo tháng
	const monthlyData = getEmptyMonthlyData();

	let totalRevenue = 0;
	let totalVehicleInvoices = 0;
	let totalRepairInvoices = 0;
	let currentMonthRevenue = 0;
	let previousMonthRevenue = 0;

	// Duyệt qua từng invoice để tính toán
	invoicesInYear.forEach(invoice => {
		const date = new Date(invoice.created_date);
		const month = date.getMonth();
		const revenue = parseFloat(invoice.total_cost) || 0;

		// Cộng dồn doanh thu theo tháng
		monthlyData[month].revenue += revenue;
		monthlyData[month].count++;

		totalRevenue += revenue;

		// Phân loại invoice (dựa vào ticket_id)
		if (invoice.ticket_id) {
			totalRepairInvoices++;
		} else {
			totalVehicleInvoices++;
		}

		// Tính doanh thu tháng hiện tại và tháng trước
		if (year === currentYear && month === currentMonth) {
			currentMonthRevenue += revenue;
		}
		if (year === currentYear && month === currentMonth - 1) {
			previousMonthRevenue += revenue;
		}
	});

	// Tính doanh thu tháng này
	let monthlyRevenue = 0;
	let revenueGrowth = 0;

	if (year === currentYear) {
		monthlyRevenue = currentMonthRevenue;
		if (previousMonthRevenue > 0) {
			revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
		} else if (currentMonthRevenue > 0) {
			revenueGrowth = 100;
		}
	} else {
		// Nếu chọn năm khác, lấy doanh thu tháng cuối cùng có dữ liệu
		const lastMonthWithData = [...monthlyData].reverse().find(m => m.revenue > 0);
		if (lastMonthWithData) {
			monthlyRevenue = lastMonthWithData.revenue;
		}
	}

	// Chuyển đổi monthlyData thành mảng cho chart
	const monthlyRevenueData = monthlyData.map((item, index) => ({
		month: getMonthName(index),
		revenue: Math.round(item.revenue),
		count: item.count
	}));

	return {
		totalRevenue: Math.round(totalRevenue),
		monthlyRevenue: Math.round(monthlyRevenue),
		revenueGrowth: Math.round(revenueGrowth * 100) / 100,
		totalInvoices: invoicesInYear.length,
		totalVehicleInvoices,
		totalRepairInvoices,
		averageInvoiceValue: invoicesInYear.length > 0
			? Math.round(totalRevenue / invoicesInYear.length)
			: 0,
		monthlyRevenueData
	};
};

export default function AdminDashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
	const [availableYears, setAvailableYears] = useState([]);

	// State dữ liệu
	const [stats, setStats] = useState({
		totalRevenue: 0,
		monthlyRevenue: 0,
		revenueGrowth: 0,
		totalVehiclesSold: 0,
		totalRepairTickets: 0,
		activeVouchers: 0,
		totalCustomers: 0,
		totalEmployees: 0,
		workingEmployees: 0,
		lowStockParts: 0,
		pendingAppointments: 0,
		averageInvoiceValue: 0,
		totalInvoices: 0,
		totalVehicles: 0,
		activeVehicles: 0,
	});

	const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
	const [recentVehicles, setRecentVehicles] = useState([]);
	const [recentCustomers, setRecentCustomers] = useState([]);
	const [recentInvoices, setRecentInvoices] = useState([]);
	const [recentVouchers, setRecentVouchers] = useState([]);
	const [recentAppointments, setRecentAppointments] = useState([]);
	const [lowStockPartsList, setLowStockPartsList] = useState([]);

	// ==================== FETCH ALL DATA ====================
	const fetchDashboardData = async () => {
		setLoading(true);
		try {
			// Fetch song song tất cả dữ liệu
			const [
				vehiclesRes,
				customersRes,
				employeesRes,
				sparePartsRes,
				vouchersRes,
				invoicesRes,
				appointmentsRes,
			] = await Promise.allSettled([
				getAllShowroomVehicles(),
				getAllCustomers(),
				getAllEmployees("all"),
				getAllSpareParts(),
				getAllVouchers("all"),
				getAllInvoices({ sort: "created_date:desc" }),
				apiClient.get("/repair-appointments", { params: { limit: 10, sort: "created_date:desc" } }),
			]);

			// ===== XỬ LÝ XE =====
			const vehicles = vehiclesRes.status === "fulfilled" ? (vehiclesRes.value?.data || []) : [];
			setRecentVehicles(vehicles.slice(0, 5));
			const totalVehicles = vehicles.length;
			const activeVehicles = vehicles.filter(v => v.status === 1 || v.status === true).length;

			// ===== XỬ LÝ KHÁCH HÀNG =====
			const customers = customersRes.status === "fulfilled" ? (customersRes.value?.data || []) : [];
			setRecentCustomers(customers.slice(0, 5));
			const totalCustomers = customers.length;

			// ===== XỬ LÝ NHÂN VIÊN =====
			const employees = employeesRes.status === "fulfilled" ? (employeesRes.value?.data || []) : [];
			const totalEmployees = employees.length;
			const workingEmployees = employees.filter(e => e.is_working === 1 || e.is_working === true).length;

			// ===== XỬ LÝ PHỤ TÙNG (tồn kho thấp) =====
			const spareParts = sparePartsRes.status === "fulfilled" ? (sparePartsRes.value?.data || []) : [];
			const lowStock = spareParts.filter(p => (p.quantity_in_stock || 0) < 10);
			setLowStockPartsList(lowStock.slice(0, 5));
			const lowStockCount = lowStock.length;

			// ===== XỬ LÝ VOUCHER (đang hoạt động) =====
			const vouchers = vouchersRes.status === "fulfilled" ? (vouchersRes.value?.data || []) : [];
			const now = new Date();
			const activeVouchersList = vouchers.filter(v => {
				const from = new Date(v.from);
				const to = new Date(v.to);
				return v.is_available && from <= now && to >= now;
			});
			setRecentVouchers(activeVouchersList.slice(0, 5));
			const activeVouchersCount = activeVouchersList.length;

			// ===== XỬ LÝ DOANH THU TỪ INVOICE =====
			const invoices = invoicesRes.status === "fulfilled" ? (invoicesRes.value?.data || []) : [];
			setRecentInvoices(invoices.slice(0, 5));
			const revenueStats = calculateRevenueFromInvoices(invoices, yearFilter);

			// Lấy danh sách các năm có dữ liệu
			const years = [...new Set(invoices.map(inv => inv.created_date ? new Date(inv.created_date).getFullYear() : null).filter(Boolean))].sort((a, b) => b - a);
			setAvailableYears(years);

			// ===== XỬ LÝ LỊCH HẸN =====
			const appointments = appointmentsRes.status === "fulfilled" ? (appointmentsRes.value?.data || []) : [];
			const pendingAppointments = appointments.filter(a => a.status === "pending" || a.status === "scheduled").length;
			setRecentAppointments(appointments.slice(0, 5));

			// ===== CẬP NHẬT STATE =====
			setStats({
				totalRevenue: revenueStats.totalRevenue,
				monthlyRevenue: revenueStats.monthlyRevenue,
				revenueGrowth: revenueStats.revenueGrowth,
				totalVehiclesSold: revenueStats.totalVehicleInvoices,
				totalRepairTickets: revenueStats.totalRepairInvoices,
				activeVouchers: activeVouchersCount,
				totalCustomers,
				totalEmployees,
				workingEmployees,
				lowStockParts: lowStockCount,
				pendingAppointments,
				averageInvoiceValue: revenueStats.averageInvoiceValue,
				totalInvoices: revenueStats.totalInvoices,
				totalVehicles,
				activeVehicles,
			});

			setMonthlyRevenueData(revenueStats.monthlyRevenueData);

		} catch (error) {
			console.error("Lỗi tải dashboard:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, [yearFilter]);

	// ==================== COMPONENTS ====================

	const StatCard = ({ title, value, icon, color, subtext, trend }) => (
		<Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: `4px solid ${color}`, height: "100%" }}>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
				<Box>
					<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
					<Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, color }}>{value}</Typography>
					{trend !== undefined && trend !== 0 && (
						<Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
							<TrendingUp sx={{ fontSize: 14, color: trend >= 0 ? COLORS.success : COLORS.danger }} />
							<Typography variant="caption" color={trend >= 0 ? COLORS.success : COLORS.danger}>
								{Math.abs(trend)}% so với tháng trước
							</Typography>
						</Stack>
					)}
					{subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
				</Box>
				<Box sx={{ bgcolor: `${color}20`, borderRadius: 2, p: 1 }}>
					{icon}
				</Box>
			</Stack>
		</Paper>
	);

	const RevenueChart = () => {
		const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.revenue), 0);

		return (
			<Paper sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
					<Typography fontWeight={700}>Doanh thu theo tháng {yearFilter}</Typography>
					<Stack direction="row" spacing={1}>
						<FormControl size="small" sx={{ minWidth: 100 }}>
							<Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
								{availableYears.map(year => (
									<MenuItem key={year} value={year}>{year}</MenuItem>
								))}
								{availableYears.length === 0 && (
									<MenuItem value={new Date().getFullYear()}>Năm nay</MenuItem>
								)}
							</Select>
						</FormControl>
						<Tooltip title="Làm mới">
							<IconButton size="small" onClick={fetchDashboardData}>
								<Refresh fontSize="small" />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				{monthlyRevenueData.length === 0 || monthlyRevenueData.every(d => d.revenue === 0) ? (
					<Box sx={{ textAlign: "center", py: 6 }}>
						<Typography color="text.secondary">Chưa có dữ liệu doanh thu</Typography>
					</Box>
				) : (
					<>
						<Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 200 }}>
							{monthlyRevenueData.map((item, idx) => (
								<Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
									<Tooltip title={formatPrice(item.revenue)}>
										<Box
											sx={{
												height: maxRevenue > 0 ? `${(item.revenue / maxRevenue) * 160}px` : '0px',
												bgcolor: COLORS.primary,
												borderRadius: 1,
												transition: "0.3s",
												"&:hover": { bgcolor: COLORS.accent, opacity: 0.8 },
											}}
										/>
									</Tooltip>
									<Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>{item.month}</Typography>
								</Box>
							))}
						</Box>
						<Divider sx={{ my: 2 }} />
						<Stack direction="row" justifyContent="space-between">
							<Box>
								<Typography variant="caption" color="text.secondary">Tổng doanh thu năm</Typography>
								<Typography variant="h6" fontWeight={700} color={COLORS.primary}>{formatPrice(stats.totalRevenue)}</Typography>
							</Box>
							<Box sx={{ textAlign: "right" }}>
								<Typography variant="caption" color="text.secondary">Doanh thu tháng này</Typography>
								<Typography variant="h6" fontWeight={700} color={COLORS.success}>{formatPrice(stats.monthlyRevenue)}</Typography>
							</Box>
							<Box sx={{ textAlign: "right" }}>
								<Typography variant="caption" color="text.secondary">Trung bình/hóa đơn</Typography>
								<Typography variant="h6" fontWeight={700} color={COLORS.accent}>{formatPrice(stats.averageInvoiceValue)}</Typography>
							</Box>
						</Stack>
					</>
				)}
			</Paper>
		);
	};

	const QuickTable = ({ title, columns, data, onViewAll, viewAllPath, loading: tableLoading }) => (
		<Paper sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
			<Box sx={{ p: 2, borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography fontWeight={700}>{title}</Typography>
				<Button size="small" onClick={() => navigate(viewAllPath)} endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
					Xem tất cả
				</Button>
			</Box>
			<TableContainer sx={{ maxHeight: 320 }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow sx={{ bgcolor: COLORS.surface }}>
							{columns.map(col => (
								<TableCell key={col.key} sx={{ fontWeight: 700, fontSize: 12 }}>{col.label}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{tableLoading ? (
							<TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell></TableRow>
						) : data.length === 0 ? (
							<TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}><Typography color="text.secondary">Không có dữ liệu</Typography></TableCell></TableRow>
						) : (
							data.map((item, idx) => (
								<TableRow key={item.id || idx} hover>
									{columns.map(col => (
										<TableCell key={col.key}>
											{col.render ? col.render(item) : item[col.key] || "—"}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ minHeight: "100vh", bgcolor: COLORS.surface, p: 3 }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" fontWeight={800} sx={{ color: COLORS.primary }}>Dashboard</Typography>
				<Typography variant="body2" color="text.secondary">Tổng quan doanh thu và hoạt động kinh doanh</Typography>
			</Box>

			{/* Grid thống kê chính - Hàng 1 */}
			<Grid container spacing={2.5} sx={{ mb: 3 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Tổng doanh thu"
						value={formatPrice(stats.totalRevenue)}
						icon={<AttachMoney sx={{ color: COLORS.success }} />}
						color={COLORS.success}
						trend={stats.revenueGrowth}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Xe đã bán"
						value={stats.totalVehiclesSold}
						icon={<DirectionsCar sx={{ color: COLORS.primary }} />}
						color={COLORS.primary}
						subtext={`${stats.activeVehicles} xe đang bán`}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Lịch hẹn chờ"
						value={stats.pendingAppointments}
						icon={<Schedule sx={{ color: COLORS.warning }} />}
						color={COLORS.warning}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Voucher đang hoạt động"
						value={stats.activeVouchers}
						icon={<LocalOffer sx={{ color: COLORS.accent }} />}
						color={COLORS.accent}
					/>
				</Grid>
			</Grid>

			{/* Grid thống kê phụ - Hàng 2 */}
			<Grid container spacing={2.5} sx={{ mb: 3 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Khách hàng"
						value={stats.totalCustomers}
						icon={<People sx={{ color: COLORS.accent }} />}
						color={COLORS.accent}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Nhân viên"
						value={stats.totalEmployees}
						icon={<People sx={{ color: COLORS.primary }} />}
						color={COLORS.primary}
						subtext={`${stats.workingEmployees} đang làm việc`}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Số hóa đơn"
						value={stats.totalInvoices}
						icon={<Receipt sx={{ color: COLORS.warning }} />}
						color={COLORS.warning}
						subtext={`${stats.totalRepairTickets} sửa chữa`}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Phụ tùng sắp hết"
						value={stats.lowStockParts}
						icon={<Warning sx={{ color: COLORS.danger }} />}
						color={COLORS.danger}
					/>
				</Grid>
			</Grid>

			{/* Biểu đồ doanh thu */}
			<Box sx={{ mb: 3 }}>
				<RevenueChart />
			</Box>

			{/* Các bảng xem nhanh */}
			<Grid container spacing={2.5}>
				{/* Hóa đơn gần đây */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="💰 Hóa đơn gần đây"
						columns={[
							{ key: "created_date", label: "Ngày", render: (item) => formatDate(item.created_date) },
							{ key: "total_cost", label: "Tổng tiền", render: (item) => formatPrice(item.total_cost) },
							{ key: "payment_method", label: "PT thanh toán" },
						]}
						data={recentInvoices}
						viewAllPath="/admin/invoices"
					/>
				</Grid>

				{/* Xe mới nhất */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="🚗 Xe mới nhất"
						columns={[
							{ key: "name", label: "Tên xe" },
							{ key: "new_price", label: "Giá", render: (item) => formatPrice(item.new_price) },
							{
								key: "status", label: "Trạng thái", render: (item) => (
									<Chip label={item.status ? "Đang bán" : "Tạm ngừng"} size="small" color={item.status ? "success" : "default"} />
								)
							},
						]}
						data={recentVehicles}
						viewAllPath="/admin/vehicles"
					/>
				</Grid>

				{/* Khách hàng mới nhất */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="👤 Khách hàng mới"
						columns={[
							{ key: "full_name", label: "Họ tên" },
							{ key: "phone_number", label: "SĐT" },
							{ key: "email", label: "Email" },
						]}
						data={recentCustomers}
						viewAllPath="/admin/customers"
					/>
				</Grid>

				{/* Voucher đang hoạt động */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="🎫 Voucher đang hoạt động"
						columns={[
							{ key: "code", label: "Mã code" },
							{ key: "percent", label: "Giảm %", render: (item) => `${item.percent}%` },
							{ key: "to", label: "HSD", render: (item) => formatDate(item.to) },
						]}
						data={recentVouchers}
						viewAllPath="/admin/vouchers"
					/>
				</Grid>

				{/* Phụ tùng sắp hết hàng */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="⚠️ Phụ tùng sắp hết hàng"
						columns={[
							{ key: "name", label: "Tên phụ tùng" },
							{
								key: "quantity_in_stock", label: "Tồn kho", render: (item) => (
									<Chip label={item.quantity_in_stock || 0} size="small" color="error" />
								)
							},
							{ key: "unit_of_measure", label: "Đơn vị" },
						]}
						data={lowStockPartsList}
						viewAllPath="/admin/spare-parts"
					/>
				</Grid>

				{/* Lịch hẹn sắp tới */}
				<Grid item xs={12} md={6} lg={4}>
					<QuickTable
						title="📅 Lịch hẹn sắp tới"
						columns={[
							{ key: "appointment_date", label: "Ngày hẹn", render: (item) => formatDate(item.appointment_date) },
							{
								key: "status", label: "Trạng thái", render: (item) => (
									<Chip label={item.status} size="small" color={item.status === "completed" ? "success" : "warning"} />
								)
							},
						]}
						data={recentAppointments}
						viewAllPath="/admin/appointments"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}