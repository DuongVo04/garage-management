// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, useTheme } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import {
	TrendingUp, TrendingDown, AttachMoney, DirectionsCar,
	People, Schedule, LocalOffer, ArrowForward,
	Refresh, Receipt, Warning, Build, Speed,
} from "@mui/icons-material";

import { getAllShowroomVehicles } from "../../services/showroom.service";
import { getAllCustomers } from "../../services/customer.service";
import { getEmployees } from "../../services/employee.service";
import { getAllSpareParts } from "../../services/spare-parts.service";
import { getAllVouchers } from "../../services/voucher.service";
import { getAllInvoices } from "../../services/invoice.service";
import { getTotalRevenue } from "../../services/admin.service";
import { getAllAppointments } from "../../services/appointment.service"; // Thêm import

const formatPrice = (v) =>
	v != null ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v) : "0₫";

const formatDate = (d) =>
	d ? new Date(d).toLocaleDateString("vi-VN") : "—";

const getMonthName = (i) =>
	["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"][i];

const getEmptyMonthlyData = () =>
	Array(12).fill(null).map((_, i) => ({ month: i, revenue: 0, count: 0 }));

const calculateRevenueFromInvoices = (invoices, year = new Date().getFullYear()) => {
	const empty = {
		totalRevenue: 0, monthlyRevenue: 0, revenueGrowth: 0,
		totalInvoices: 0, totalVehicleInvoices: 0, totalRepairInvoices: 0,
		averageInvoiceValue: 0,
		monthlyRevenueData: getEmptyMonthlyData().map((_, i) => ({ month: getMonthName(i), revenue: 0, count: 0 })),
	};
	if (!invoices?.length) return empty;

	const inYear = invoices.filter(inv => inv.created_date && new Date(inv.created_date).getFullYear() === year);
	const now = new Date();
	const cm = now.getMonth(), cy = now.getFullYear();
	const monthly = getEmptyMonthlyData();
	let total = 0, vehicleInv = 0, repairInv = 0, curRev = 0, prevRev = 0;

	inYear.forEach(inv => {
		const m = new Date(inv.created_date).getMonth();
		const rev = parseFloat(inv.total_cost) || 0;
		monthly[m].revenue += rev;
		monthly[m].count++;
		total += rev;
		if (inv.ticket_id) repairInv++; else vehicleInv++;
		if (year === cy && m === cm) curRev += rev;
		if (year === cy && m === cm - 1) prevRev += rev;
	});

	const monthlyRevenue = year === cy ? curRev : ([...monthly].reverse().find(m => m.revenue > 0)?.revenue || 0);
	const revenueGrowth = prevRev > 0 ? ((curRev - prevRev) / prevRev) * 100 : (curRev > 0 ? 100 : 0);

	return {
		totalRevenue: Math.round(total),
		monthlyRevenue: Math.round(monthlyRevenue),
		revenueGrowth: Math.round(revenueGrowth * 100) / 100,
		totalInvoices: inYear.length,
		totalVehicleInvoices: vehicleInv,
		totalRepairInvoices: repairInv,
		averageInvoiceValue: inYear.length ? Math.round(total / inYear.length) : 0,
		monthlyRevenueData: monthly.map((item, i) => ({ month: getMonthName(i), revenue: Math.round(item.revenue), count: item.count })),
	};
};

// ─── HOOK ĐẾM SỐ ───────────────────────────────────────────────────────────
const useCountUp = (targetValue, duration = 1000) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (targetValue === undefined || targetValue === null) {
			setCount(0);
			return;
		}

		let startTime;
		let animationFrame;
		const startValue = count;
		const endValue = targetValue;
		const change = endValue - startValue;

		const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

		const updateCount = (currentTime) => {
			if (!startTime) startTime = currentTime;
			const elapsed = currentTime - startTime;
			const progress = Math.min(1, elapsed / duration);
			const easedProgress = easeOutCubic(progress);
			const currentCount = Math.floor(startValue + change * easedProgress);
			setCount(currentCount);
			if (progress < 1) animationFrame = requestAnimationFrame(updateCount);
		};

		animationFrame = requestAnimationFrame(updateCount);
		return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
	}, [targetValue, duration]);

	return count;
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, iconBg, sub, trend, mono }) => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const countedValue = useCountUp(value, 800);

	const T = getTokens(isDark);

	return (
		<div style={{
			background: T.card,
			border: `1px solid ${T.border}`,
			borderRadius: 20,
			padding: "22px 24px",
			height: "100%",
			transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
		}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = T.borderHi;
				e.currentTarget.style.boxShadow = `0 12px 48px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(26,43,94,0.12)"}`;
				e.currentTarget.style.transform = "translateY(-3px)";
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = T.border;
				e.currentTarget.style.boxShadow = "none";
				e.currentTarget.style.transform = "translateY(0)";
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim, marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>{title}</div>
					<div style={{
						fontFamily: mono ? "'Inter', monospace" : "'Outfit', sans-serif",
						fontWeight: 800,
						color: T.textPri,
						fontSize: mono ? 24 : 32,
						lineHeight: 1.1,
						letterSpacing: mono ? "-0.5px" : "-1px",
					}}>
						{mono ? formatPrice(countedValue) : countedValue.toLocaleString("vi-VN")}
					</div>

					{trend !== undefined && (
						<div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
							<span style={{
								display: "inline-flex", alignItems: "center", gap: 2,
								padding: "2px 7px", borderRadius: 20, fontSize: 11, fontWeight: 700,
								background: trend >= 0 ? T.greenBg : T.redBg,
								color: trend >= 0 ? T.green : T.red,
								border: `1px solid ${trend >= 0 ? T.greenBorder : T.redBorder}`,
							}}>
								{trend >= 0 ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
								{Math.abs(trend).toFixed(1)}%
							</span>
							<span style={{ fontSize: 11, color: T.textDim }}>vs tháng trước</span>
						</div>
					)}
					{sub && <div style={{ fontSize: 11, color: T.textDim, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
				</div>
				<div style={{
					width: 48, height: 48, borderRadius: 14,
					display: "flex", alignItems: "center", justifyContent: "center",
					background: iconBg || T.blueBg,
					flexShrink: 0, marginLeft: 12,
				}}>
					{icon}
				</div>
			</div>
		</div>
	);
};

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
const RevenueChart = ({ data, totalRevenue, monthlyRevenue, avgValue, yearFilter, availableYears, setYearFilter, onRefresh }) => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const T = getTokens(isDark);
	const maxRev = Math.max(...data.map(d => d.revenue), 1);
	const hasData = data.some(d => d.revenue > 0);
	const countedTotal = useCountUp(totalRevenue, 1000);
	const countedMonthly = useCountUp(monthlyRevenue, 800);

	const barColors = [
		`linear-gradient(180deg, #4A90D9, #1B5FC4)`,
		`linear-gradient(180deg, #D4A017, #B8860B)`,
		`linear-gradient(180deg, #3DBF8A, #1A8A5A)`,
		`linear-gradient(180deg, #A07AE0, #6B3FA0)`,
	];

	return (
		<div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "24px 28px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
				<div>
					<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim, marginBottom: 4 }}>Biểu đồ doanh thu</div>
					<div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: T.navy, fontSize: 22 }}>Theo tháng — {yearFilter}</div>
				</div>
				<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
					<select
						value={yearFilter}
						onChange={e => setYearFilter(Number(e.target.value))}
						style={{
							background: T.bg, border: `1px solid ${T.border}`,
							color: T.textSec, padding: "6px 12px", borderRadius: 10,
							fontSize: 13, fontFamily: "'Inter', monospace",
							cursor: "pointer", outline: "none",
						}}
					>
						{availableYears.map(y => <option key={y} value={y}>{y}</option>)}
					</select>
					<button onClick={onRefresh} style={{
						display: "inline-flex", alignItems: "center", gap: 6,
						padding: "6px 10px", borderRadius: 12,
						border: `1px solid ${T.border}`,
						background: T.surface, color: T.textSec,
						fontSize: 12, fontWeight: 600, cursor: "pointer",
						fontFamily: "'Inter', sans-serif",
					}}>
						<Refresh sx={{ fontSize: 16 }} />
					</button>
				</div>
			</div>

			{!hasData ? (
				<div style={{ textAlign: "center", padding: "52px 0", color: T.textDim }}>
					<Speed sx={{ fontSize: 44, color: T.textMuted }} />
					<div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>Chưa có dữ liệu doanh thu</div>
				</div>
			) : (
				<>
					<div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 160, padding: "0 4px" }}>
						{data.map((item, idx) => {
							const pct = item.revenue > 0 ? Math.max((item.revenue / maxRev) * 100, 4) : 0;
							return (
								<div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: 160, flex: 1 }}>
									<div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1 }}>
										<div
											title={formatPrice(item.revenue)}
											style={{
												width: "100%", borderRadius: "8px 8px 0 0",
												minHeight: 3,
												height: `${pct}%`,
												background: item.revenue > 0 ? barColors[idx % barColors.length] : T.border,
												opacity: item.revenue > 0 ? 1 : 0.4,
												transition: "height 0.7s cubic-bezier(0.34,1.56,0.64,1)",
												cursor: "pointer",
											}}
										/>
									</div>
									<div style={{ fontSize: 10, color: T.textDim, fontFamily: "'Inter', monospace", fontWeight: 500 }}>{item.month}</div>
								</div>
							);
						})}
					</div>

					<div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.border}, transparent)`, margin: "20px 0" }} />

					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
						{[
							{ label: "Tổng năm", value: countedTotal, color: T.blue, bg: T.blueBg, border: T.blueBorder },
							{ label: "Tháng này", value: countedMonthly, color: T.green, bg: T.greenBg, border: T.greenBorder },
							{ label: "TB/Hóa đơn", value: avgValue, color: T.gold, bg: T.goldBg, border: T.goldBorder },
						].map(({ label, value, color, bg, border }) => (
							<div key={label} style={{ padding: "12px 18px", background: bg, borderRadius: 12, border: `1px solid ${border}` }}>
								<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim, marginBottom: 4 }}>{label}</div>
								<div style={{ fontFamily: "'Inter', monospace", fontWeight: 600, fontSize: 14, color }}>{formatPrice(value)}</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

// ─── MINI TABLE ───────────────────────────────────────────────────────────────
const MiniTable = ({ title, icon, columns, data, viewAllPath, navigate }) => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const T = getTokens(isDark);

	return (
		<div style={{
			background: T.card, border: `1px solid ${T.border}`, borderRadius: 20,
			overflow: "hidden", height: "100%", display: "flex", flexDirection: "column",
		}}>
			<div style={{
				padding: "14px 18px",
				borderBottom: `1px solid ${T.border}`,
				display: "flex", justifyContent: "space-between", alignItems: "center",
				background: isDark ? "rgba(255,255,255,0.03)" : "#FAFBFF",
			}}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ fontSize: 18 }}>{icon}</span>
					<span style={{ fontWeight: 700, fontSize: 14, color: T.textPri }}>{title}</span>
				</div>
				<button
					onClick={() => navigate(viewAllPath)}
					style={{
						display: "inline-flex", alignItems: "center", gap: 6,
						padding: "5px 11px", borderRadius: 12,
						border: `1px solid ${T.border}`, background: T.surface,
						color: T.textSec, fontSize: 11, fontWeight: 600, cursor: "pointer",
						fontFamily: "'Inter', sans-serif",
					}}
				>
					Xem tất cả <ArrowForward sx={{ fontSize: 12 }} />
				</button>
			</div>
			<div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 268, flex: 1 }}>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							{columns.map(c => (
								<th key={c.key} style={{
									background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFE",
									color: T.textDim, fontSize: 11, fontWeight: 600,
									letterSpacing: 1, textTransform: "uppercase",
									padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
									textAlign: "left", fontFamily: "'Inter', sans-serif",
								}}>{c.label}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.length === 0 ? (
							<tr>
								<td colSpan={columns.length} style={{ textAlign: "center", padding: "32px 0", color: T.textDim, fontFamily: "'Inter', sans-serif" }}>
									Không có dữ liệu
								</td>
							</tr>
						) : data.map((item, idx) => (
							<tr key={item.id || idx}
								onMouseEnter={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F8FAFE")}
								onMouseLeave={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "transparent")}
							>
								{columns.map(c => (
									<td key={c.key} style={{
										padding: "12px 16px", fontSize: 13, color: T.textSec,
										borderBottom: idx < data.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#F0F3FA"}` : "none",
										fontFamily: "'Inter', sans-serif", background: "transparent", transition: "background 0.15s",
									}}>
										{c.render ? c.render(item) : (item[c.key] || "—")}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
const LiveClock = () => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const T = getTokens(isDark);
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
			<div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim }}>THỜI GIAN THỰC</div>
			<div style={{ fontFamily: "'Inter', monospace", fontSize: 20, fontWeight: 700, color: T.navy, letterSpacing: 1 }}>
				{currentTime.toLocaleTimeString("vi-VN")}
			</div>
			<div style={{ fontSize: 11, color: T.textDim, fontWeight: 500 }}>
				{currentTime.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
			</div>
		</div>
	);
};

// ─── DESIGN TOKENS (aware of dark mode) ──────────────────────────────────────
function getTokens(isDark) {
	return {
		bg: isDark ? "#0f1117" : "#F0F2F8",
		surface: isDark ? "#1a1f2e" : "#FFFFFF",
		card: isDark ? "#1a1f2e" : "#FFFFFF",
		border: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F4",
		borderHi: isDark ? "rgba(255,255,255,0.18)" : "#C8D4EE",

		navy: isDark ? "#93b4ff" : "#1A2B5E",
		navyLight: isDark ? "#b8ccff" : "#2D4080",
		gold: isDark ? "#f0c040" : "#B8860B",
		goldBg: isDark ? "rgba(184,134,11,0.12)" : "#FDF8EC",
		goldBorder: isDark ? "rgba(184,134,11,0.35)" : "#E8D08A",

		green: isDark ? "#4ade80" : "#1A8A5A",
		greenBg: isDark ? "rgba(26,138,90,0.15)" : "#EBF7F2",
		greenBorder: isDark ? "rgba(26,138,90,0.35)" : "#A8DFC5",

		blue: isDark ? "#60a5fa" : "#1B5FC4",
		blueBg: isDark ? "rgba(27,95,196,0.15)" : "#EBF2FD",
		blueBorder: isDark ? "rgba(27,95,196,0.35)" : "#A8C4F0",

		red: isDark ? "#f87171" : "#C0392B",
		redBg: isDark ? "rgba(192,57,43,0.15)" : "#FDECEA",
		redBorder: isDark ? "rgba(192,57,43,0.35)" : "#F0B8B3",

		orange: isDark ? "#fb923c" : "#C0620A",
		orangeBg: isDark ? "rgba(192,98,10,0.15)" : "#FEF3E8",
		orangeBorder: isDark ? "rgba(192,98,10,0.35)" : "#F0CDA0",

		purple: isDark ? "#c084fc" : "#6B3FA0",
		purpleBg: isDark ? "rgba(107,63,160,0.15)" : "#F3EEFB",
		purpleBorder: isDark ? "rgba(107,63,160,0.35)" : "#C8AEED",

		textPri: isDark ? "#f1f5f9" : "#1A2238",
		textSec: isDark ? "#94a3b8" : "#4A5578",
		textDim: isDark ? "#64748b" : "#8A96B0",
		textMuted: isDark ? "#475569" : "#B0B8CC",
	};
}

// ─── TAG STYLES ───────────────────────────────────────────────────────────────
function makeTagStyle(bg, color, border) {
	return {
		display: "inline-flex", alignItems: "center", gap: 4,
		padding: "3px 10px", borderRadius: 20,
		fontSize: 11, fontWeight: 600,
		border: `1px solid ${border}`,
		background: bg, color,
	};
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
	const navigate = useNavigate();
	const { accessToken } = useAuth || { accessToken: null };
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const T = getTokens(isDark);

	const [loading, setLoading] = useState(true);
	const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
	const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);

	const [stats, setStats] = useState({
		totalRevenue: 0, monthlyRevenue: 0, revenueGrowth: 0,
		totalVehiclesSold: 0, activeVehicles: 0, activeVouchers: 0,
		totalCustomers: 0, totalEmployees: 0, workingEmployees: 0,
		lowStockParts: 0, totalInvoices: 0, totalRepairTickets: 0, averageInvoiceValue: 0,
		totalAppointments: 0, // Thêm state cho tổng lịch hẹn
	});

	const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
	const [recentVehicles, setRecentVehicles] = useState([]);
	const [recentCustomers, setRecentCustomers] = useState([]);
	const [recentInvoices, setRecentInvoices] = useState([]);
	const [recentVouchers, setRecentVouchers] = useState([]);
	const [lowStockPartsList, setLowStockPartsList] = useState([]);

	// Inject Google Fonts once
	useEffect(() => {
		if (!document.getElementById("gd-fonts")) {
			const s = document.createElement("link");
			s.id = "gd-fonts";
			s.rel = "stylesheet";
			s.href = "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Outfit:wght@400;500;600;700;800&display=swap";
			document.head.appendChild(s);
		}
	}, []);

	const fetchDashboardData = async () => {
		setLoading(true);
		try {
			const [vehiclesRes, customersRes, employeesRes, sparePartsRes, vouchersRes, invoicesRes, revenueRes, appointmentsRes] =
				await Promise.allSettled([
					getAllShowroomVehicles(), getAllCustomers(), getEmployees({ is_working: "all" }),
					getAllSpareParts(), getAllVouchers("all"),
					getAllInvoices({ sort: "created_date:desc" }), getTotalRevenue(),
					getAllAppointments(), // Fetch tất cả lịch hẹn
				]);

			const vehicles = vehiclesRes.status === "fulfilled" ? (vehiclesRes.value?.data || []) : [];
			const customers = customersRes.status === "fulfilled" ? (customersRes.value?.data || []) : [];
			const employees = employeesRes.status === "fulfilled" ? (employeesRes.value?.data || []) : [];
			const parts = sparePartsRes.status === "fulfilled" ? (sparePartsRes.value?.data || []) : [];
			const vouchers = vouchersRes.status === "fulfilled" ? (vouchersRes.value?.data || []) : [];
			const invoices = invoicesRes.status === "fulfilled" ? (invoicesRes.value?.data || []) : [];
			const appointments = appointmentsRes.status === "fulfilled" ? (appointmentsRes.value?.data || []) : [];

			setRecentVehicles(vehicles.slice(0, 5));
			setRecentCustomers(customers.slice(0, 5));
			setRecentInvoices(invoices.slice(0, 5));

			const now = new Date();
			const activeVouchersList = vouchers.filter(v => v.is_available && new Date(v.from) <= now && new Date(v.to) >= now);
			setRecentVouchers(activeVouchersList.slice(0, 5));

			const lowStock = parts.filter(p => (p.quantity_in_stock || 0) < 10);
			setLowStockPartsList(lowStock.slice(0, 5));

			const rev = calculateRevenueFromInvoices(invoices, yearFilter);
			setMonthlyRevenueData(rev.monthlyRevenueData);

			const years = [...new Set(invoices.map(i => i.created_date ? new Date(i.created_date).getFullYear() : null).filter(Boolean))].sort((a, b) => b - a);
			if (years.length) setAvailableYears(years);

			let apiRevenue = 0;
			if (revenueRes.status === "fulfilled" && revenueRes.value?.data) {
				apiRevenue = revenueRes.value.data.total_cost || revenueRes.value.data.totalRevenue || 0;
			}

			// Thống kê lịch hẹn theo trạng thái
			const pendingAppointments = appointments.filter(a => a.status === "pending" || a.status === "chờ xác nhận");
			const confirmedAppointments = appointments.filter(a => a.status === "confirmed" || a.status === "xác nhận");
			const completedAppointments = appointments.filter(a => a.status === "completed" || a.status === "hoàn thành");
			const cancelledAppointments = appointments.filter(a => a.status === "cancelled" || a.status === "hủy");

			setStats({
				totalRevenue: apiRevenue || rev.totalRevenue,
				monthlyRevenue: rev.monthlyRevenue,
				revenueGrowth: rev.revenueGrowth,
				totalVehiclesSold: rev.totalVehicleInvoices,
				activeVehicles: vehicles.filter(v => v.status === 1 || v.status === true).length,
				activeVouchers: activeVouchersList.length,
				totalCustomers: customers.length,
				totalEmployees: employees.length,
				workingEmployees: employees.filter(e => e.is_working === 1 || e.is_working === true).length,
				lowStockParts: lowStock.length,
				totalInvoices: rev.totalInvoices,
				totalRepairTickets: rev.totalRepairInvoices,
				averageInvoiceValue: rev.averageInvoiceValue,
				totalAppointments: appointments.length, // Tổng số lịch hẹn
				pendingAppointments: pendingAppointments.length, // Lịch hẹn chờ xác nhận
				confirmedAppointments: confirmedAppointments.length,
				completedAppointments: completedAppointments.length,
				cancelledAppointments: cancelledAppointments.length,
			});
		} catch (e) {
			console.error("Dashboard error:", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) fetchDashboardData();
	}, [yearFilter]);

	// ── tag helpers ──
	const tagGreen = makeTagStyle(T.greenBg, T.green, T.greenBorder);
	const tagBlue = makeTagStyle(T.blueBg, T.blue, T.blueBorder);
	const tagGold = makeTagStyle(T.goldBg, T.gold, T.goldBorder);
	const tagRed = makeTagStyle(T.redBg, T.red, T.redBorder);
	const tagGray = makeTagStyle(isDark ? "rgba(255,255,255,0.06)" : "#F0F3FA", T.textDim, T.border);

	if (loading) return (
		<div style={{
			background: T.bg, minHeight: "100vh",
			display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14,
		}}>
			<div style={{ position: "relative", width: 56, height: 56 }}>
				<CircularProgress size={56} thickness={2} sx={{ color: T.navy }} />
				<DirectionsCar sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: T.navy, fontSize: 22 }} />
			</div>
			<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim }}>Đang tải dữ liệu...</div>
		</div>
	);

	return (
		<div style={{ fontFamily: "'Inter', sans-serif", background: T.bg, minHeight: "100vh" }}>
			<div style={{ height: 4, background: `linear-gradient(90deg, ${T.navy}, ${T.blue}, ${T.gold}, ${T.green})` }} />
			<div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px 40px" }}>

				{/* HEADER */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
					<div>
						<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim, marginBottom: 6 }}>Hệ thống quản lý</div>
						<div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: T.textPri, fontSize: 36, lineHeight: 1 }}>DASHBOARD</div>
						<div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
							<div style={{
								width: 8, height: 8, borderRadius: "50%",
								background: T.green,
								boxShadow: `0 0 0 0 ${T.green}66`,
								animation: "livepulse 2s infinite",
							}} />
							<style>{`@keyframes livepulse{0%{box-shadow:0 0 0 0 rgba(26,138,90,0.4)}70%{box-shadow:0 0 0 8px rgba(26,138,90,0)}100%{box-shadow:0 0 0 0 rgba(26,138,90,0)}}`}</style>
							<span style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>Live — cập nhật thời gian thực</span>
						</div>
					</div>
					<LiveClock />
				</div>

				{/* REFRESH */}
				<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
					<button onClick={fetchDashboardData} style={{
						display: "inline-flex", alignItems: "center", gap: 6,
						padding: "8px 16px", borderRadius: 12,
						border: `1px solid ${T.border}`, background: T.surface,
						color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer",
						fontFamily: "'Inter', sans-serif",
					}}>
						<Refresh sx={{ fontSize: 16 }} /> Làm mới
					</button>
				</div>

				{/* STATS ROW 1 */}
				<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
					<span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim }}>Tổng quan kinh doanh</span>
					<div style={{ flex: 1, height: 1, background: T.border }} />
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
					<StatCard title="Tổng doanh thu" value={stats.totalRevenue} icon={<AttachMoney sx={{ color: T.green, fontSize: 22 }} />} iconBg={T.greenBg} trend={stats.revenueGrowth} mono />
					<StatCard title="Xe đang trưng bày" value={stats.activeVehicles} icon={<DirectionsCar sx={{ color: T.blue, fontSize: 22 }} />} iconBg={T.blueBg} />
					<StatCard title="Khách hàng" value={stats.totalCustomers} icon={<People sx={{ color: T.purple, fontSize: 22 }} />} iconBg={T.purpleBg} />
					<StatCard
						title="Lịch hẹn xem xe"
						value={stats.totalAppointments}
						icon={<Schedule sx={{ color: T.orange, fontSize: 22 }} />}
						iconBg={T.orangeBg}
						sub={`${stats.pendingAppointments || 0} đang chờ xác nhận`}
					/>
				</div>

				{/* STATS ROW 2 */}
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
					<StatCard title="Nhân viên" value={stats.totalEmployees} icon={<Build sx={{ color: T.gold, fontSize: 22 }} />} iconBg={T.goldBg} sub={`${stats.workingEmployees} đang làm việc`} />
					<StatCard title="Hóa đơn" value={stats.totalInvoices} icon={<Receipt sx={{ color: T.blue, fontSize: 22 }} />} iconBg={T.blueBg} sub={`${stats.totalRepairTickets} phiếu sửa chữa`} />
					<StatCard title="Voucher hoạt động" value={stats.activeVouchers} icon={<LocalOffer sx={{ color: T.purple, fontSize: 22 }} />} iconBg={T.purpleBg} />
					<StatCard title="Phụ tùng sắp hết" value={stats.lowStockParts} icon={<Warning sx={{ color: T.red, fontSize: 22 }} />} iconBg={T.redBg} sub="Tồn kho < 10 đơn vị" />
				</div>

				{/* REVENUE CHART */}
				<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
					<span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim }}>Biểu đồ doanh thu</span>
					<div style={{ flex: 1, height: 1, background: T.border }} />
				</div>
				<div style={{ marginBottom: 28 }}>
					<RevenueChart
						data={monthlyRevenueData}
						totalRevenue={stats.totalRevenue}
						monthlyRevenue={stats.monthlyRevenue}
						avgValue={stats.averageInvoiceValue}
						yearFilter={yearFilter}
						availableYears={availableYears}
						setYearFilter={setYearFilter}
						onRefresh={fetchDashboardData}
					/>
				</div>

				{/* DETAIL TABLES */}
				<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
					<span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.textDim }}>Dữ liệu chi tiết</span>
					<div style={{ flex: 1, height: 1, background: T.border }} />
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
					<MiniTable
						title="Hóa đơn gần đây" icon="💰" navigate={navigate} viewAllPath="/admin/invoicemanagement"
						columns={[
							{ key: "created_date", label: "Ngày", render: i => <span style={{ fontFamily: "'Inter', monospace", fontWeight: 500, fontSize: 11 }}>{formatDate(i.created_date)}</span> },
							{ key: "total_cost", label: "Tổng tiền", render: i => <span style={{ color: T.green, fontWeight: 700, fontSize: 12 }}>{formatPrice(i.total_cost)}</span> },
							{ key: "payment_method", label: "PT TT", render: i => <span style={{ ...tagBlue, fontSize: 10 }}>{i.payment_method || "—"}</span> },
						]}
						data={recentInvoices}
					/>
					<MiniTable
						title="Xe trưng bày" icon="🚗" navigate={navigate} viewAllPath="/admin/carandshowroom"
						columns={[
							{ key: "name", label: "Tên xe", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.name || "—"}</span> },
							{ key: "new_price", label: "Giá", render: i => <span style={{ color: T.blue, fontWeight: 600, fontSize: 11 }}>{formatPrice(i.new_price)}</span> },
							{ key: "status", label: "TT", render: i => i.status ? <span style={tagGreen}>● Đang bán</span> : <span style={tagGray}>Tạm ngừng</span> },
						]}
						data={recentVehicles}
					/>
					<MiniTable
						title="Khách hàng mới" icon="👤" navigate={navigate} viewAllPath="/admin/customers"
						columns={[
							{ key: "full_name", label: "Họ tên", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.full_name}</span> },
							{ key: "phone_number", label: "SĐT", render: i => <span style={{ fontFamily: "'Inter', monospace", fontWeight: 500, fontSize: 11 }}>{i.phone_number}</span> },
							{ key: "email", label: "Email", render: i => <span style={{ fontSize: 11, color: T.textDim }}>{i.email || "—"}</span> },
						]}
						data={recentCustomers}
					/>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
					<MiniTable
						title="Voucher đang chạy" icon="🎫" navigate={navigate} viewAllPath="/admin/carandshowroom"
						columns={[
							{ key: "code", label: "Mã code", render: i => <span style={tagGold}>{i.code}</span> },
							{ key: "percent", label: "Giảm", render: i => <span style={{ color: T.green, fontWeight: 700 }}>-{i.percent}%</span> },
							{ key: "event", label: "Sự kiện", render: i => <span style={{ fontSize: 11 }}>{i.event}</span> },
							{ key: "to", label: "HSD", render: i => <span style={{ fontFamily: "'Inter', monospace", fontWeight: 500, fontSize: 11, color: T.textDim }}>{formatDate(i.to)}</span> },
						]}
						data={recentVouchers}
					/>
					<MiniTable
						title="Phụ tùng sắp hết" icon="⚠️" navigate={navigate} viewAllPath="/admin/spare-parts"
						columns={[
							{ key: "name", label: "Tên phụ tùng", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.name}</span> },
							{ key: "quantity_in_stock", label: "Tồn kho", render: i => <span style={tagRed}>{i.quantity_in_stock || 0}</span> },
							{ key: "unit_of_measure", label: "Đơn vị" },
						]}
						data={lowStockPartsList}
					/>
				</div>

			</div>
		</div>
	);
}