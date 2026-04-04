// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import {
	TrendingUp, TrendingDown, AttachMoney, DirectionsCar,
	People, Schedule, LocalOffer, ArrowForward,
	Refresh, Receipt, Warning, Build, Speed,
} from "@mui/icons-material";

import { getAllShowroomVehicles } from "../../services/showroom.service";
import { getAllCustomers } from "../../services/customer.service";
import { getAllEmployees } from "../../services/employee.service";
import { getAllSpareParts } from "../../services/spare-parts.service";
import { getAllVouchers } from "../../services/voucher.service";
import { getAllInvoices } from "../../services/invoice.service";
import { getTotalRevenue } from "../../services/admin.service";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
	bg: "#F0F2F8",
	surface: "#FFFFFF",
	card: "#FFFFFF",
	cardHover: "#F7F9FF",
	border: "#E2E8F4",
	borderHi: "#C8D4EE",

	navy: "#1A2B5E",
	navyLight: "#2D4080",
	gold: "#B8860B",
	goldLight: "#D4A017",
	goldBg: "#FDF8EC",
	goldBorder: "#E8D08A",

	green: "#1A8A5A",
	greenBg: "#EBF7F2",
	greenBorder: "#A8DFC5",

	blue: "#1B5FC4",
	blueBg: "#EBF2FD",
	blueBorder: "#A8C4F0",

	red: "#C0392B",
	redBg: "#FDECEA",
	redBorder: "#F0B8B3",

	orange: "#C0620A",
	orangeBg: "#FEF3E8",
	orangeBorder: "#F0CDA0",

	purple: "#6B3FA0",
	purpleBg: "#F3EEFB",
	purpleBorder: "#C8AEED",

	textPri: "#1A2238",
	textSec: "#4A5578",
	textDim: "#8A96B0",
	textMuted: "#B0B8CC",
};

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

			if (progress < 1) {
				animationFrame = requestAnimationFrame(updateCount);
			}
		};

		animationFrame = requestAnimationFrame(updateCount);

		return () => {
			if (animationFrame) cancelAnimationFrame(animationFrame);
		};
	}, [targetValue, duration]);

	return count;
};

// ─── STYLE INJECTION ─────────────────────────────────────────────────────────
const injectStyles = () => {
	if (document.getElementById("gd-light-styles")) return;
	const s = document.createElement("style");
	s.id = "gd-light-styles";
	s.textContent = `
		@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Outfit:wght@400;500;600;700;800&display=swap');

		.gd-root * { box-sizing: border-box; }
		.gd-root { font-family: 'Inter', sans-serif; }

		.gd-card {
			background: ${T.card};
			border: 1px solid ${T.border};
			border-radius: 20px;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}
		.gd-card:hover {
			border-color: ${T.borderHi};
			box-shadow: 0 12px 48px rgba(26,43,94,0.12);
			transform: translateY(-3px);
		}

		.gd-heading {
			font-family: 'Outfit', sans-serif;
			font-weight: 700;
			color: ${T.navy};
			letter-spacing: -0.3px;
		}
		.gd-label {
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 1.2px;
			text-transform: uppercase;
			color: ${T.textDim};
		}
		.gd-mono {
			font-family: 'Inter', monospace;
			font-weight: 500;
		}

		/* ── STAT CARDS ── */
		.stat-num {
			font-family: 'Outfit', sans-serif;
			font-weight: 800;
			color: ${T.textPri};
			font-size: 32px;
			line-height: 1.1;
			letter-spacing: -1px;
		}
		.stat-num.mono {
			font-family: 'Inter', monospace;
			font-size: 24px;
			letter-spacing: -0.5px;
		}

		.stat-icon-box {
			width: 48px; height: 48px; border-radius: 14px;
			display: flex; align-items: center; justify-content: center;
			flex-shrink: 0;
		}

		/* ── CHART BARS ── */
		.bar-wrap {
			display: flex; flex-direction: column; align-items: center;
			gap: 8px; height: 160px;
		}
		.bar-inner { width: 100%; display: flex; flex-direction: column; justify-content: flex-end; flex: 1; }
		.bar-rect {
			width: 100%; border-radius: 8px 8px 0 0;
			min-height: 3px;
			transition: height 0.7s cubic-bezier(0.34,1.56,0.64,1);
			position: relative; cursor: pointer;
		}
		.bar-rect::after {
			content: attr(data-tip);
			position: absolute; bottom: calc(100% + 8px); left: 50%;
			transform: translateX(-50%);
			background: ${T.navy}; color: #fff;
			font-size: 11px; padding: 4px 8px; border-radius: 8px;
			white-space: nowrap; opacity: 0; pointer-events: none;
			transition: opacity 0.2s; font-family: 'Inter', monospace;
			box-shadow: 0 4px 12px rgba(26,43,94,0.2);
		}
		.bar-rect:hover::after { opacity: 1; }
		.bar-rect:hover { filter: brightness(1.08); }
		.bar-label { font-size: 10px; color: ${T.textDim}; font-family: 'Inter', monospace; font-weight: 500; }

		/* ── TABLES ── */
		.gd-table { width: 100%; border-collapse: collapse; }
		.gd-table th {
			background: #F8FAFE;
			color: ${T.textDim};
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 1px;
			text-transform: uppercase;
			padding: 12px 16px;
			border-bottom: 1px solid ${T.border};
			text-align: left;
			font-family: 'Inter', sans-serif;
		}
		.gd-table td {
			padding: 12px 16px;
			font-size: 13px;
			color: ${T.textSec};
			border-bottom: 1px solid #F0F3FA;
			font-family: 'Inter', sans-serif;
		}
		.gd-table tr:last-child td { border-bottom: none; }
		.gd-table tr:hover td { background: #F8FAFE; }

		/* ── CHIPS/TAGS ── */
		.tag {
			display: inline-flex; align-items: center; gap: 4px;
			padding: 4px 10px; border-radius: 24px;
			font-size: 11px; font-weight: 600; border: 1px solid;
		}
		.tag-green  { background:${T.greenBg};  color:${T.green};  border-color:${T.greenBorder}; }
		.tag-red    { background:${T.redBg};    color:${T.red};    border-color:${T.redBorder}; }
		.tag-gold   { background:${T.goldBg};   color:${T.gold};   border-color:${T.goldBorder}; font-family:'Inter',monospace; }
		.tag-blue   { background:${T.blueBg};   color:${T.blue};   border-color:${T.blueBorder}; }
		.tag-gray   { background:#F0F3FA; color:${T.textDim}; border-color:${T.border}; }

		/* ── BUTTON ── */
		.gd-btn {
			display: inline-flex; align-items: center; gap: 6px;
			padding: 8px 16px; border-radius: 12px;
			border: 1px solid ${T.border};
			background: ${T.surface};
			color: ${T.textSec};
			font-size: 12px; font-weight: 600;
			cursor: pointer; transition: all 0.2s;
			font-family: 'Inter', sans-serif;
		}
		.gd-btn:hover {
			border-color: ${T.navy}; color: ${T.navy};
			box-shadow: 0 2px 12px rgba(26,43,94,0.12);
			transform: translateY(-1px);
		}
		.gd-btn.primary {
			background: ${T.navy}; color: #fff; border-color: ${T.navy};
		}
		.gd-btn.primary:hover { background: ${T.navyLight}; border-color: ${T.navyLight}; }

		/* ── DIVIDER ── */
		.gd-divider {
			height: 1px;
			background: linear-gradient(90deg, transparent, ${T.border}, transparent);
			margin: 20px 0;
		}

		/* ── LIVE DOT ── */
		.live-dot {
			width: 8px; height: 8px; border-radius: 50%;
			background: ${T.green};
			box-shadow: 0 0 0 0 rgba(26,138,90,0.4);
			animation: livepulse 2s infinite;
		}
		@keyframes livepulse {
			0%   { box-shadow: 0 0 0 0 rgba(26,138,90,0.4); }
			70%  { box-shadow: 0 0 0 8px rgba(26,138,90,0); }
			100% { box-shadow: 0 0 0 0 rgba(26,138,90,0); }
		}

		/* ── SCROLL ── */
		.gd-scroll::-webkit-scrollbar { width: 4px; }
		.gd-scroll::-webkit-scrollbar-track { background: transparent; }
		.gd-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }

		/* ── SECTION DIVIDER ── */
		.section-line {
			display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
		}
		.section-line::after {
			content: ''; flex: 1; height: 1px; background: ${T.border};
		}

		/* ── SUMMARY ROW ── */
		.summary-pill {
			padding: 12px 18px;
			background: ${T.bg};
			border-radius: 12px;
			border: 1px solid ${T.border};
		}

		/* ── COUNTUP ANIMATION ── */
		@keyframes countUp {
			from {
				opacity: 0;
				transform: translateY(10px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
		.countup-number {
			animation: countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
	`;
	document.head.appendChild(s);
};

// ─── STAT CARD (có hiệu ứng đếm số) ────────────────────────────────────────
const StatCard = ({ title, value, icon, iconBg, iconColor, sub, trend, mono }) => {
	const countedValue = useCountUp(value, 800);

	return (
		<div className="gd-card" style={{ padding: "22px 24px", height: "100%" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div style={{ flex: 1 }}>
					<div className="gd-label" style={{ marginBottom: 12 }}>{title}</div>
					<div className={`stat-num ${mono ? "mono" : ""} countup-number`}>
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
				<div className="stat-icon-box" style={{ background: iconBg, marginLeft: 12 }}>
					{icon}
				</div>
			</div>
		</div>
	);
};

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
const RevenueChart = ({ data, totalRevenue, monthlyRevenue, avgValue, yearFilter, availableYears, setYearFilter, onRefresh }) => {
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
		<div className="gd-card" style={{ padding: "24px 28px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
				<div>
					<div className="gd-label" style={{ marginBottom: 4 }}>Biểu đồ doanh thu</div>
					<div className="gd-heading" style={{ fontSize: 22 }}>Theo tháng — {yearFilter}</div>
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
					<button onClick={onRefresh} className="gd-btn" style={{ padding: "6px 10px" }}>
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
					<div style={{
						display: "flex", gap: 8, alignItems: "flex-end",
						height: 160, padding: "0 4px",
					}}>
						{data.map((item, idx) => {
							const pct = item.revenue > 0 ? Math.max((item.revenue / maxRev) * 100, 4) : 0;
							return (
								<div key={idx} className="bar-wrap" style={{ flex: 1, height: 160 }}>
									<div className="bar-inner">
										<div
											className="bar-rect"
											data-tip={formatPrice(item.revenue)}
											style={{
												height: `${pct}%`,
												background: item.revenue > 0 ? barColors[idx % barColors.length] : T.border,
												opacity: item.revenue > 0 ? 1 : 0.4,
											}}
										/>
									</div>
									<div className="bar-label">{item.month}</div>
								</div>
							);
						})}
					</div>

					<div className="gd-divider" />

					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
						{[
							{ label: "Tổng năm", value: countedTotal, dot: T.blue, bg: T.blueBg, border: T.blueBorder },
							{ label: "Tháng này", value: countedMonthly, dot: T.green, bg: T.greenBg, border: T.greenBorder },
							{ label: "TB/Hóa đơn", value: avgValue, dot: T.gold, bg: T.goldBg, border: T.goldBorder },
						].map(({ label, value, dot, bg, border }) => (
							<div key={label} className="summary-pill" style={{ background: bg, border: `1px solid ${border}` }}>
								<div className="gd-label" style={{ marginBottom: 4 }}>{label}</div>
								<div className="gd-mono" style={{ fontSize: 14, color: dot, fontWeight: 600 }}>{formatPrice(value)}</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

// ─── MINI TABLE ───────────────────────────────────────────────────────────────
const MiniTable = ({ title, icon, columns, data, viewAllPath, navigate }) => (
	<div className="gd-card" style={{ overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
		<div style={{
			padding: "14px 18px",
			borderBottom: `1px solid ${T.border}`,
			display: "flex", justifyContent: "space-between", alignItems: "center",
			background: "#FAFBFF",
		}}>
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<span style={{ fontSize: 18 }}>{icon}</span>
				<span style={{ fontWeight: 700, fontSize: 14, color: T.textPri }}>{title}</span>
			</div>
			<button className="gd-btn" onClick={() => navigate(viewAllPath)} style={{ fontSize: 11, padding: "5px 11px" }}>
				Xem tất cả <ArrowForward sx={{ fontSize: 12 }} />
			</button>
		</div>
		<div className="gd-scroll" style={{ overflowX: "auto", overflowY: "auto", maxHeight: 268, flex: 1 }}>
			<table className="gd-table">
				<thead>
					<tr>
						{columns.map(c => <th key={c.key}>{c.label}</th>)}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} style={{ textAlign: "center", padding: "32px 0", color: T.textDim }}>
								Không có dữ liệu
							</td>
						</tr>
					) : data.map((item, idx) => (
						<tr key={item.id || idx}>
							{columns.map(c => (
								<td key={c.key}>{c.render ? c.render(item) : (item[c.key] || "—")}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);

// ─── COMPONENT HIỂN THỊ THỜI GIAN ───────────────────────────────────────────
const LiveClock = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-end",
			gap: 4,
		}}>
			<div className="gd-label" style={{ fontSize: 10 }}>THỜI GIAN THỰC</div>
			<div style={{
				fontFamily: "'Inter', monospace",
				fontSize: 20,
				fontWeight: 700,
				color: T.navy,
				letterSpacing: 1,
			}}>
				{currentTime.toLocaleTimeString("vi-VN")}
			</div>
			<div style={{
				fontSize: 11,
				color: T.textDim,
				fontWeight: 500,
			}}>
				{currentTime.toLocaleDateString("vi-VN", {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</div>
		</div>
	);
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
	const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);

	const [stats, setStats] = useState({
		totalRevenue: 0, monthlyRevenue: 0, revenueGrowth: 0,
		totalVehiclesSold: 0, activeVehicles: 0, activeVouchers: 0,
		totalCustomers: 0, totalEmployees: 0, workingEmployees: 0,
		lowStockParts: 0, totalInvoices: 0, totalRepairTickets: 0, averageInvoiceValue: 0,
	});

	const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
	const [recentVehicles, setRecentVehicles] = useState([]);
	const [recentCustomers, setRecentCustomers] = useState([]);
	const [recentInvoices, setRecentInvoices] = useState([]);
	const [recentVouchers, setRecentVouchers] = useState([]);
	const [lowStockPartsList, setLowStockPartsList] = useState([]);

	useEffect(() => { injectStyles(); }, []);

	const fetchDashboardData = async () => {
		setLoading(true);
		try {
			const [vehiclesRes, customersRes, employeesRes, sparePartsRes, vouchersRes, invoicesRes, revenueRes] =
				await Promise.allSettled([
					getAllShowroomVehicles(), getAllCustomers(), getAllEmployees("all"),
					getAllSpareParts(), getAllVouchers("all"),
					getAllInvoices({ sort: "created_date:desc" }), getTotalRevenue(),
				]);

			const vehicles = vehiclesRes.status === "fulfilled" ? (vehiclesRes.value?.data || []) : [];
			const customers = customersRes.status === "fulfilled" ? (customersRes.value?.data || []) : [];
			const employees = employeesRes.status === "fulfilled" ? (employeesRes.value?.data || []) : [];
			const parts = sparePartsRes.status === "fulfilled" ? (sparePartsRes.value?.data || []) : [];
			const vouchers = vouchersRes.status === "fulfilled" ? (vouchersRes.value?.data || []) : [];
			const invoices = invoicesRes.status === "fulfilled" ? (invoicesRes.value?.data || []) : [];

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
			});
		} catch (e) {
			console.error("Dashboard error:", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchDashboardData(); }, [yearFilter]);

	if (loading) return (
		<div style={{
			background: T.bg, minHeight: "100vh",
			display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14,
		}}>
			<div style={{ position: "relative", width: 56, height: 56 }}>
				<CircularProgress size={56} thickness={2} sx={{ color: T.navy }} />
				<DirectionsCar sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: T.navy, fontSize: 22 }} />
			</div>
			<div className="gd-label">Đang tải dữ liệu...</div>
		</div>
	);

	return (
		<div className="gd-root" style={{ background: T.bg, minHeight: "100vh" }}>
			<div style={{ height: 4, background: `linear-gradient(90deg, ${T.navy}, ${T.blue}, ${T.gold}, ${T.green})` }} />
			<div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px 40px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
					<div>
						<div className="gd-label" style={{ marginBottom: 6 }}>Hệ thống quản lý</div>
						<div className="gd-heading" style={{ fontSize: 36, lineHeight: 1 }}>DASHBOARD</div>
						<div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
							<div className="live-dot" />
							<span style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>Live — cập nhật thời gian thực</span>
						</div>
					</div>
					<LiveClock />
				</div>

				<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
					<button className="gd-btn" onClick={fetchDashboardData}>
						<Refresh sx={{ fontSize: 16 }} /> Làm mới
					</button>
				</div>

				<div style={{ marginBottom: 8 }}>
					<div className="section-line">
						<span className="gd-label">Tổng quan kinh doanh</span>
					</div>
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
					<StatCard
						title="Tổng doanh thu"
						value={stats.totalRevenue}
						icon={<AttachMoney sx={{ color: T.green, fontSize: 22 }} />}
						iconBg={T.greenBg} trend={stats.revenueGrowth} mono
					/>
					<StatCard
						title="Xe đã bán"
						value={stats.totalVehiclesSold}
						icon={<DirectionsCar sx={{ color: T.blue, fontSize: 22 }} />}
						iconBg={T.blueBg} sub={`${stats.activeVehicles} xe đang trưng bày`}
					/>
					<StatCard
						title="Khách hàng"
						value={stats.totalCustomers}
						icon={<People sx={{ color: T.purple, fontSize: 22 }} />}
						iconBg={T.purpleBg}
					/>
					<StatCard
						title="Lịch hẹn chờ"
						value="—"
						icon={<Schedule sx={{ color: T.orange, fontSize: 22 }} />}
						iconBg={T.orangeBg} sub="Đang phát triển"
					/>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
					<StatCard
						title="Nhân viên"
						value={stats.totalEmployees}
						icon={<Build sx={{ color: T.gold, fontSize: 22 }} />}
						iconBg={T.goldBg} sub={`${stats.workingEmployees} đang làm việc`}
					/>
					<StatCard
						title="Hóa đơn"
						value={stats.totalInvoices}
						icon={<Receipt sx={{ color: T.blue, fontSize: 22 }} />}
						iconBg={T.blueBg} sub={`${stats.totalRepairTickets} phiếu sửa chữa`}
					/>
					<StatCard
						title="Voucher hoạt động"
						value={stats.activeVouchers}
						icon={<LocalOffer sx={{ color: T.purple, fontSize: 22 }} />}
						iconBg={T.purpleBg}
					/>
					<StatCard
						title="Phụ tùng sắp hết"
						value={stats.lowStockParts}
						icon={<Warning sx={{ color: T.red, fontSize: 22 }} />}
						iconBg={T.redBg} sub="Tồn kho < 10 đơn vị"
					/>
				</div>

				<div style={{ marginBottom: 8 }}>
					<div className="section-line"><span className="gd-label">Biểu đồ doanh thu</span></div>
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

				<div style={{ marginBottom: 8 }}>
					<div className="section-line"><span className="gd-label">Dữ liệu chi tiết</span></div>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
					<MiniTable
						title="Hóa đơn gần đây" icon="💰" navigate={navigate} viewAllPath="/admin/invoices"
						columns={[
							{ key: "created_date", label: "Ngày", render: i => <span className="gd-mono" style={{ fontSize: 11 }}>{formatDate(i.created_date)}</span> },
							{ key: "total_cost", label: "Tổng tiền", render: i => <span style={{ color: T.green, fontWeight: 700, fontSize: 12 }}>{formatPrice(i.total_cost)}</span> },
							{ key: "payment_method", label: "PT TT", render: i => <span className="tag tag-blue" style={{ fontSize: 10 }}>{i.payment_method || "—"}</span> },
						]}
						data={recentInvoices}
					/>
					<MiniTable
						title="Xe trưng bày" icon="🚗" navigate={navigate} viewAllPath="/carandshowroom"
						columns={[
							{ key: "name", label: "Tên xe", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.name || "—"}</span> },
							{ key: "new_price", label: "Giá", render: i => <span style={{ color: T.blue, fontWeight: 600, fontSize: 11 }}>{formatPrice(i.new_price)}</span> },
							{
								key: "status", label: "TT", render: i => i.status
									? <span className="tag tag-green">● Đang bán</span>
									: <span className="tag tag-gray">Tạm ngừng</span>
							},
						]}
						data={recentVehicles}
					/>
					<MiniTable
						title="Khách hàng mới" icon="👤" navigate={navigate} viewAllPath="/admin/customers"
						columns={[
							{ key: "full_name", label: "Họ tên", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.full_name}</span> },
							{ key: "phone_number", label: "SĐT", render: i => <span className="gd-mono" style={{ fontSize: 11 }}>{i.phone_number}</span> },
							{ key: "email", label: "Email", render: i => <span style={{ fontSize: 11, color: T.textDim }}>{i.email || "—"}</span> },
						]}
						data={recentCustomers}
					/>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
					<MiniTable
						title="Voucher đang chạy" icon="🎫" navigate={navigate} viewAllPath="/carandshowroom"
						columns={[
							{ key: "code", label: "Mã code", render: i => <span className="tag tag-gold">{i.code}</span> },
							{ key: "percent", label: "Giảm", render: i => <span style={{ color: T.green, fontWeight: 700 }}>-{i.percent}%</span> },
							{ key: "event", label: "Sự kiện", render: i => <span style={{ fontSize: 11 }}>{i.event}</span> },
							{ key: "to", label: "HSD", render: i => <span className="gd-mono" style={{ fontSize: 11, color: T.textDim }}>{formatDate(i.to)}</span> },
						]}
						data={recentVouchers}
					/>
					<MiniTable
						title="Phụ tùng sắp hết" icon="⚠️" navigate={navigate} viewAllPath="/admin/spare-parts"
						columns={[
							{ key: "name", label: "Tên phụ tùng", render: i => <span style={{ color: T.textPri, fontWeight: 600, fontSize: 12 }}>{i.name}</span> },
							{ key: "quantity_in_stock", label: "Tồn kho", render: i => <span className="tag tag-red">{i.quantity_in_stock || 0}</span> },
							{ key: "unit_of_measure", label: "Đơn vị" },
						]}
						data={lowStockPartsList}
					/>
				</div>


			</div>
		</div>
	);
}