import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	Box,
	Typography,
	Button,
	IconButton,
	TextField,
	InputAdornment,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	Snackbar,
	CircularProgress,
	Grow,
	Slide,
	useTheme,
} from "@mui/material";
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as ViewIcon,
	Print as PrintIcon,
	Refresh as RefreshIcon,
	Receipt as ReceiptIcon,
	Payment as PaymentIcon,
	LocalOffer as DiscountIcon,
	Close as CloseIcon,
	FileDownload as ExportIcon,
	Filter as FilterIcon,
	Clear as ClearIcon,
	AttachMoney as MoneyIcon,
	Email as EmailIcon,
	Save as SaveIcon,
	Warning as WarningIcon,
	LockOutlined as LockIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import {
	getAllInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
} from "../../services/invoice.service";

dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

// ─── DESIGN TOKENS (dark/light aware) ───────────────────────────────────────
function getTokens(isDark) {
	return {
		bg: isDark ? "#0f1117" : "#F0F2F8",
		surface: isDark ? "#1a1f2e" : "#FFFFFF",
		card: isDark ? "#1a1f2e" : "#FFFFFF",
		cardHover: isDark ? "#1f2538" : "#F7F9FF",
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

		tableTh: isDark ? "rgba(255,255,255,0.04)" : "#F5F7FC",
		tableTrHover: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFE",
		tableBorder: isDark ? "rgba(255,255,255,0.06)" : "#F0F3FA",
		filterBg: isDark ? "rgba(27,95,196,0.08)" : "linear-gradient(135deg, #F8FAFE 0%, #FFFFFF 100%)",
		readonlyBg: isDark ? "rgba(255,255,255,0.04)" : "#F5F7FC",
	};
}

const formatPrice = (v) =>
	v != null
		? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
		: "0₫";

const formatCompactPrice = (v) => {
	if (!v) return "0₫";
	if (v >= 1e9) return `${(v / 1e9).toFixed(1)} tỷ ₫`;
	if (v >= 1e6) return `${(v / 1e6).toFixed(1)} tr ₫`;
	return formatPrice(v);
};

// ─── HOOK ĐẾM SỐ ───────────────────────────────────────────────────────────
const useCountUp = (targetValue, duration = 750) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!targetValue) { setCount(0); return; }
		let startTime, raf;
		const start = count, change = targetValue - start;
		const ease = (t) => 1 - Math.pow(1 - t, 3);
		const update = (now) => {
			if (!startTime) startTime = now;
			const p = Math.min(1, (now - startTime) / duration);
			setCount(Math.floor(start + change * ease(p)));
			if (p < 1) raf = requestAnimationFrame(update);
		};
		raf = requestAnimationFrame(update);
		return () => cancelAnimationFrame(raf);
	}, [targetValue, duration]);
	return count;
};

// ─── FONT INJECTION ──────────────────────────────────────────────────────────
const injectFonts = () => {
	if (document.getElementById("inv-fonts")) return;
	const s = document.createElement("link");
	s.id = "inv-fonts";
	s.rel = "stylesheet";
	s.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap";
	document.head.appendChild(s);
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, iconBg, sub, mono }) => {
	const theme = useTheme();
	const T = getTokens(theme.palette.mode === "dark");
	const counted = useCountUp(value, 750);
	return (
		<div style={{
			background: T.card, border: `1px solid ${T.border}`, borderRadius: 18,
			padding: "20px 22px",
			transition: "box-shadow 0.25s, border-color 0.25s, transform 0.25s",
		}}
			onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.boxShadow = "0 8px 40px rgba(26,43,94,0.10)"; }}
			onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
					<div style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Sora', sans-serif", fontWeight: 800, color: T.textPri, fontSize: mono ? 22 : 28, lineHeight: 1.15, letterSpacing: "-0.8px" }}>
						{mono ? formatPrice(counted) : counted.toLocaleString("vi-VN")}
					</div>
					{sub && <div style={{ fontSize: 11, color: T.textDim, marginTop: 5, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
				</div>
				<div style={{ width: 44, height: 44, borderRadius: 13, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}>
					{icon}
				</div>
			</div>
		</div>
	);
};

// ─── LIVE CLOCK ─────────────────────────────────────────────────────────────
const LiveClock = ({ T }) => {
	const [t, setT] = useState(new Date());
	useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
	return (
		<div style={{ textAlign: "right" }}>
			<div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>THỜI GIAN THỰC</div>
			<div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: T.navy, letterSpacing: 1 }}>
				{t.toLocaleTimeString("vi-VN")}
			</div>
			<div style={{ fontSize: 11, color: T.textDim, fontWeight: 500, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
				{t.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
			</div>
		</div>
	);
};

// ─── PAYMENT CHIP ───────────────────────────────────────────────────────────
const PAYMENT_CONFIG = {
	CASH: { label: "Tiền mặt", icon: "💰" },
	CREDIT_CARD: { label: "Thẻ tín dụng", icon: "💳" },
	BANK_TRANSFER: { label: "Chuyển khoản", icon: "🏦" },
	TRANSFER: { label: "Chuyển khoản", icon: "🏦" },
	MOMO: { label: "MoMo", icon: "📱" },
	VNPAY: { label: "VNPay", icon: "💸" },
};

const PaymentChip = ({ method, T }) => {
	const cfg = PAYMENT_CONFIG[method] || { label: method || "Chưa xác định", icon: "💳" };
	const colorMap = {
		CASH: [T.greenBg, T.green, T.greenBorder],
		CREDIT_CARD: [T.blueBg, T.blue, T.blueBorder],
		BANK_TRANSFER: [T.purpleBg, T.purple, T.purpleBorder],
		TRANSFER: [T.purpleBg, T.purple, T.purpleBorder],
		MOMO: [T.redBg, T.red, T.redBorder],
		VNPAY: [T.orangeBg, T.orange, T.orangeBorder],
	};
	const [bg, color, border] = colorMap[method] || [T.card, T.textDim, T.border];
	return (
		<span style={{
			display: "inline-flex", alignItems: "center", gap: 5,
			padding: "3px 10px", borderRadius: 20,
			fontSize: 11, fontWeight: 600, border: `1px solid ${border}`,
			background: bg, color,
			fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
		}}>
			{cfg.icon} {cfg.label}
		</span>
	);
};

// ─── TAG helper ─────────────────────────────────────────────────────────────
function tag(bg, color, border) {
	return {
		display: "inline-flex", alignItems: "center", gap: 5,
		padding: "3px 10px", borderRadius: 20,
		fontSize: 11, fontWeight: 600, border: `1px solid ${border}`,
		background: bg, color,
		fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
	};
}

// ─── BTN style helper ───────────────────────────────────────────────────────
function btnStyle(T, variant = "default") {
	const base = {
		display: "inline-flex", alignItems: "center", gap: 6,
		padding: "8px 16px", borderRadius: 11,
		border: `1px solid ${T.border}`,
		background: T.surface, color: T.textSec,
		fontSize: 12.5, fontWeight: 600, cursor: "pointer",
		fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
		transition: "all 0.18s",
	};
	if (variant === "primary") return { ...base, background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyLight} 100%)`, color: "#fff", borderColor: T.navy };
	if (variant === "danger") return { ...base, color: T.red, borderColor: T.redBorder };
	return base;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const InvoiceManagement = () => {
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";
	const T = getTokens(isDark);

	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [viewLoading, setViewLoading] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [formData, setFormData] = useState({ created_date: "", total_cost: "", payment_method: "", discount_id: "", ticket_id: "" });
	const [formErrors, setFormErrors] = useState({});
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [orderBy, setOrderBy] = useState("created_date");
	const [order, setOrder] = useState("desc");
	const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
	const [dateRange, setDateRange] = useState({ start: null, end: null });
	const [showFilters, setShowFilters] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);

	useEffect(() => { injectFonts(); }, []);

	const fetchInvoices = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (searchTerm) params.search = searchTerm;
			if (filterPaymentMethod !== "all") params.payment_method = filterPaymentMethod;
			if (dateRange.start) params.start_date = dayjs(dateRange.start).format("YYYY-MM-DD");
			if (dateRange.end) params.end_date = dayjs(dateRange.end).format("YYYY-MM-DD");
			const res = await getAllInvoices(params);
			if (res?.success) setInvoices(res.data || []);
			else { setError(res?.message || "Không thể tải hóa đơn"); showSnackbar(res?.message || "Không thể tải hóa đơn", "error"); }
		} catch (e) {
			const msg = e.response?.data?.message || e.message || "Lỗi khi tải dữ liệu";
			setError(msg); showSnackbar(msg, "error");
		} finally { setLoading(false); }
	}, [searchTerm, filterPaymentMethod, dateRange]);

	useEffect(() => {
		const t = setTimeout(() => fetchInvoices(), 450);
		return () => clearTimeout(t);
	}, [fetchInvoices]);

	const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

	const stats = useMemo(() => {
		const totalRevenue = invoices.reduce((s, inv) => s + (parseFloat(inv.total_cost) || 0), 0);
		const cashPayments = invoices.filter(i => i.payment_method === "CASH").length;
		const digitalPayments = invoices.filter(i => ["CREDIT_CARD", "BANK_TRANSFER", "TRANSFER", "MOMO", "VNPAY"].includes(i.payment_method)).length;
		const discountApplied = invoices.filter(i => i.discount_id).length;
		const thisMonth = invoices.filter(i => dayjs(i.created_date).isSame(dayjs(), "month")).length;
		return { total: invoices.length, totalRevenue, cashPayments, digitalPayments, avgValue: invoices.length ? totalRevenue / invoices.length : 0, discountApplied, thisMonth };
	}, [invoices]);

	const handleOpenView = async (id) => {
		if (!id) return showSnackbar("ID hóa đơn không hợp lệ", "error");
		setViewLoading(true);
		try {
			const res = await getInvoiceById(id);
			if (res?.success) { setSelectedInvoice(res.data); setOpenViewDialog(true); }
			else showSnackbar(res?.message || "Không thể tải hóa đơn", "error");
		} catch { showSnackbar("Không thể tải hóa đơn", "error"); }
		finally { setViewLoading(false); }
	};

	const handleOpenEdit = async (id) => {
		try {
			const res = await getInvoiceById(id);
			if (res?.success) {
				setSelectedInvoice(res.data);
				setFormData({
					created_date: res.data.created_date ?? dayjs().format("YYYY-MM-DD"),
					total_cost: res.data.total_cost != null ? String(res.data.total_cost) : "",
					payment_method: res.data.payment_method ?? "",
					discount_id: res.data.discount_id ?? "",
					ticket_id: res.data.ticket_id ?? "",
				});
				setFormErrors({});
				setOpenDialog(true);
			} else showSnackbar(res?.message || "Không thể tải hóa đơn", "error");
		} catch { showSnackbar("Không thể tải hóa đơn", "error"); }
	};

	const handleSubmit = async () => {
		if (formData.total_cost !== "" && formData.total_cost !== null) {
			if (isNaN(formData.total_cost)) { showSnackbar("Tổng chi phí phải là số", "error"); return; }
			if (parseFloat(formData.total_cost) < 0) { showSnackbar("Tổng chi phí không thể âm", "error"); return; }
		}
		try {
			const updateData = {};
			if (formData.created_date?.trim()) updateData.created_date = formData.created_date;
			if (formData.total_cost !== "" && formData.total_cost !== null) {
				const cost = parseFloat(formData.total_cost);
				if (!isNaN(cost)) updateData.total_cost = cost;
			}
			if (formData.payment_method?.trim()) updateData.payment_method = formData.payment_method;
			if (!Object.keys(updateData).length) { showSnackbar("Không có dữ liệu để cập nhật", "warning"); setOpenDialog(false); return; }

			const res = await updateInvoice(selectedInvoice.id, updateData);
			if (res?.success) { showSnackbar("Cập nhật hóa đơn thành công"); setOpenDialog(false); fetchInvoices(); }
			else showSnackbar(res?.message || "Có lỗi xảy ra", "error");
		} catch (error) {
			let msg = "Lỗi khi lưu hóa đơn";
			if (error.response?.data?.errors?.length) msg = error.response.data.errors.map(e => e.msg || e.message || e).join(", ");
			else if (error.response?.data?.message) msg = error.response.data.message;
			showSnackbar(msg, "error");
		}
	};

	const getVoucherDisplay = (inv) => inv?.voucher?.code || inv?.discount_id || null;
	const getTicketDisplay = (inv) => inv?.ticket?.description || inv?.ticket_id || null;
	const getCustomerDisplay = (inv) => inv?.ticket?.appointment?.customer?.full_name || null;
	const getCustomerPhone = (inv) => inv?.ticket?.appointment?.customer?.phone_number || null;

	const sortedInvoices = useMemo(() => {
		let list = [...invoices];
		if (filterPaymentMethod !== "all") list = list.filter(i => i.payment_method === filterPaymentMethod);
		if (searchTerm) {
			const q = searchTerm.toLowerCase();
			list = list.filter(i => getCustomerDisplay(i)?.toLowerCase().includes(q));
		}
		if (dateRange.start) list = list.filter(i => dayjs(i.created_date).isSameOrAfter(dayjs(dateRange.start), "day"));
		if (dateRange.end) list = list.filter(i => dayjs(i.created_date).isSameOrBefore(dayjs(dateRange.end), "day"));
		list.sort((a, b) => {
			let av = a[orderBy], bv = b[orderBy];
			if (orderBy === "created_date") { av = new Date(av); bv = new Date(bv); }
			return order === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
		});
		return list;
	}, [invoices, filterPaymentMethod, searchTerm, orderBy, order, dateRange]);

	const paginatedInvoices = sortedInvoices.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
	const totalPages = Math.ceil(sortedInvoices.length / rowsPerPage) || 1;
	const handleSort = (prop) => { setOrder(orderBy === prop && order === "asc" ? "desc" : "asc"); setOrderBy(prop); };
	const toggleRow = (id) => setSelectedRows(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
	const toggleAll = () => setSelectedRows(selectedRows.length === paginatedInvoices.length ? [] : paginatedInvoices.map(i => i.id));
	const handleReset = () => { setSearchTerm(""); setFilterPaymentMethod("all"); setDateRange({ start: null, end: null }); setPage(0); };

	const exportToCSV = () => {
		const headers = ["ID", "Ngày tạo", "Tổng chi phí", "Phương thức", "Voucher Code", "Phiếu SC"];
		const rows = invoices.map(i => [i.id, i.created_date, i.total_cost, i.payment_method, i.voucher?.code || i.discount_id || "", i.ticket?.description || i.ticket_id || ""]);
		const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
		const a = document.createElement("a");
		a.href = url; a.download = `invoices_${dayjs().format("YYYY-MM-DD")}.csv`;
		document.body.appendChild(a); a.click();
		document.body.removeChild(a); URL.revokeObjectURL(url);
		showSnackbar("Xuất CSV thành công");
	};

	// Common inline styles
	const labelStyle = { fontSize: 10.5, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, fontFamily: "'DM Sans', sans-serif" };

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
			<div style={{ fontFamily: "'DM Sans', sans-serif", background: T.bg, minHeight: "100vh" }}>
				{/* TOP COLOR BAR */}
				<div style={{ height: 3, background: `linear-gradient(90deg, ${T.navy}, ${T.blue} 40%, ${T.gold} 70%, ${T.green})` }} />

				<div style={{ maxWidth: 1380, margin: "0 auto", padding: "26px 22px 44px" }}>

					{/* ── Header ── */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
						<div>
							<div style={{ ...labelStyle, marginBottom: 5 }}>Quản lý tài chính</div>
							<div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: T.textPri, fontSize: 34, lineHeight: 1, letterSpacing: "-0.5px" }}>HÓA ĐƠN</div>
							<div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
								<div style={{
									width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0,
									animation: "livepulse 2s infinite",
								}} />
								<style>{`@keyframes livepulse{0%{box-shadow:0 0 0 0 rgba(26,138,90,0.45)}70%{box-shadow:0 0 0 8px rgba(26,138,90,0)}100%{box-shadow:0 0 0 0 rgba(26,138,90,0)}}`}</style>
								<span style={{ fontSize: 11.5, color: T.textDim, fontWeight: 500 }}>Cập nhật theo thời gian thực</span>
							</div>
						</div>
						<LiveClock T={T} />
					</div>

					{/* ── Action bar ── */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							<button style={btnStyle(T)} onClick={() => setShowFilters(!showFilters)}>
								<FilterIcon sx={{ fontSize: 15 }} /> {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
							</button>
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<button style={btnStyle(T)} onClick={fetchInvoices}><RefreshIcon sx={{ fontSize: 15 }} /> Làm mới</button>
							<button style={btnStyle(T)} onClick={exportToCSV}><ExportIcon sx={{ fontSize: 15 }} /> Xuất CSV</button>
						</div>
					</div>

					{/* ── Stats ── */}
					<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 13, marginBottom: 24 }}>
						<StatCard title="Tổng hóa đơn" value={stats.total} icon={<ReceiptIcon sx={{ color: T.blue, fontSize: 20 }} />} iconBg={T.blueBg} sub={`+${stats.thisMonth} tháng này`} />
						<StatCard title="Doanh thu" value={stats.totalRevenue} icon={<MoneyIcon sx={{ color: T.green, fontSize: 20 }} />} iconBg={T.greenBg} sub={`TB ${formatCompactPrice(stats.avgValue)}/hóa đơn`} mono />
						<StatCard title="Lượt thanh toán" value={stats.cashPayments + stats.digitalPayments} icon={<PaymentIcon sx={{ color: T.purple, fontSize: 20 }} />} iconBg={T.purpleBg} sub={`${stats.cashPayments} TM • ${stats.digitalPayments} Điện tử`} />
						<StatCard title="Có khuyến mãi" value={stats.discountApplied} icon={<DiscountIcon sx={{ color: T.gold, fontSize: 20 }} />} iconBg={T.goldBg} sub={`${((stats.discountApplied / (stats.total || 1)) * 100).toFixed(1)}% tổng số`} />
					</div>

					{/* ── Filters ── */}
					{showFilters && (
						<div style={{
							background: isDark ? T.card : "linear-gradient(135deg, #F8FAFE 0%, #FFFFFF 100%)",
							border: `1.5px solid ${T.blueBorder}`,
							borderRadius: 18, padding: "20px 22px", marginBottom: 20,
						}}>
							<div style={{ ...labelStyle, marginBottom: 16, fontSize: 13 }}>🔍 Bộ lọc nâng cao</div>
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto", gap: 12, alignItems: "center" }}>
								<TextField
									size="small" label="Tìm khách hàng" value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
									InputProps={{ startAdornment: <InputAdornment position="start"><MoneyIcon sx={{ fontSize: 16, color: T.textDim }} /></InputAdornment> }}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
								/>
								<FormControl size="small">
									<InputLabel>Phương thức</InputLabel>
									<Select value={filterPaymentMethod} onChange={e => setFilterPaymentMethod(e.target.value)} label="Phương thức" sx={{ borderRadius: "10px" }}>
										<MenuItem value="all">Tất cả</MenuItem>
										<MenuItem value="CASH">💰 Tiền mặt</MenuItem>
										<MenuItem value="CREDIT_CARD">💳 Thẻ tín dụng</MenuItem>
										<MenuItem value="BANK_TRANSFER">🏦 Chuyển khoản (BANK_TRANSFER)</MenuItem>
										<MenuItem value="TRANSFER">🏦 Chuyển khoản (TRANSFER)</MenuItem>
										<MenuItem value="MOMO">📱 MoMo</MenuItem>
										<MenuItem value="VNPAY">💸 VNPay</MenuItem>
									</Select>
								</FormControl>
								<DatePicker label="Từ ngày" value={dateRange.start} onChange={d => setDateRange(r => ({ ...r, start: d }))}
									slotProps={{ textField: { size: "small", sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px" } } } }} />
								<DatePicker label="Đến ngày" value={dateRange.end} onChange={d => setDateRange(r => ({ ...r, end: d }))}
									slotProps={{ textField: { size: "small", sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px" } } } }} />
								<button style={btnStyle(T)} onClick={handleReset}><ClearIcon sx={{ fontSize: 15 }} /> Xóa lọc</button>
							</div>
						</div>
					)}

					{/* ── Error ── */}
					{error && (
						<div style={{ padding: "14px 18px", marginBottom: 20, background: T.redBg, borderColor: T.redBorder, border: `1px solid ${T.redBorder}`, borderRadius: 18 }}>
							<div style={{ display: "flex", alignItems: "center", gap: 8, color: T.red }}>
								<WarningIcon sx={{ fontSize: 18 }} />
								<span style={{ fontSize: 13, fontWeight: 500 }}>{error}</span>
								<button onClick={fetchInvoices} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.red, fontWeight: 600, fontSize: 12 }}>Thử lại</button>
							</div>
						</div>
					)}

					{/* ── Table ── */}
					<div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden" }}>
						<div style={{ overflowX: "auto" }}>
							<table style={{ width: "100%", borderCollapse: "collapse" }}>
								<thead>
									<tr>
										<th style={{ width: 36, background: T.tableTh, padding: "13px 16px", borderBottom: `1px solid ${T.border}` }}>
											<input type="checkbox"
												checked={selectedRows.length === paginatedInvoices.length && paginatedInvoices.length > 0}
												onChange={toggleAll} style={{ cursor: "pointer" }}
											/>
										</th>
										{[
											{ label: "Khách hàng" },
											{ label: "Ngày tạo", key: "created_date", sortable: true },
											{ label: "Tổng chi phí", key: "total_cost", sortable: true, align: "right" },
											{ label: "Phương thức" },
											{ label: "Voucher" },
											{ label: "Phiếu sửa chữa" },
											{ label: "Thao tác", align: "center" },
										].map(({ label, key, sortable, align }) => (
											<th key={label} onClick={sortable ? () => handleSort(key) : undefined}
												style={{
													background: T.tableTh, color: T.textDim,
													fontSize: 10.5, fontWeight: 700, letterSpacing: "1.2px",
													textTransform: "uppercase", padding: "13px 16px",
													borderBottom: `1px solid ${T.border}`,
													textAlign: align || "left", fontFamily: "'DM Sans', sans-serif",
													whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default",
												}}
											>
												{label} {sortable && orderBy === key ? (order === "asc" ? "↑" : "↓") : ""}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={8} style={{ textAlign: "center", padding: 40 }}>
											<CircularProgress size={30} sx={{ color: T.navy }} />
										</td></tr>
									) : paginatedInvoices.length === 0 ? (
										<tr><td colSpan={8} style={{ textAlign: "center", padding: "56px 20px" }}>
											<ReceiptIcon sx={{ fontSize: 44, color: T.textMuted, display: "block", margin: "0 auto 10px" }} />
											<div style={{ color: T.textDim, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>Không có hóa đơn nào</div>
										</td></tr>
									) : paginatedInvoices.map((inv, idx) => (
										<Grow in timeout={250} key={inv.id}>
											<tr
												onMouseEnter={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = T.tableTrHover)}
												onMouseLeave={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "transparent")}
											>
												<td style={{ padding: "13px 16px", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
													<input type="checkbox" checked={selectedRows.includes(inv.id)} onChange={() => toggleRow(inv.id)} onClick={e => e.stopPropagation()} style={{ cursor: "pointer" }} />
												</td>
												{[
													// Customer
													<td key="customer" style={{ padding: "13px 16px", fontSize: 13, color: T.textSec, borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", fontFamily: "'DM Sans', sans-serif", background: "transparent", transition: "background 0.15s" }}>
														{getCustomerDisplay(inv) ? (
															<div>
																<div style={{ fontWeight: 600, fontSize: 13, color: T.textPri }}>👤 {getCustomerDisplay(inv)}</div>
																{getCustomerPhone(inv) && <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>📞 {getCustomerPhone(inv)}</div>}
															</div>
														) : <span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Chưa xác định</span>}
													</td>,
													// Date
													<td key="date" style={{ padding: "13px 16px", fontSize: 13, color: T.textSec, borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", fontFamily: "'DM Sans', sans-serif", background: "transparent", transition: "background 0.15s" }}>
														<div style={{ fontWeight: 500 }}>{inv.created_date ? dayjs(inv.created_date).format("DD/MM/YYYY") : "—"}</div>
														<div style={{ fontSize: 10.5, color: T.textDim }}>{dayjs(inv.created_date).fromNow()}</div>
													</td>,
													// Total
													<td key="total" style={{ padding: "13px 16px", fontSize: 13, textAlign: "right", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
														<span style={{ color: T.green, fontWeight: 700, fontSize: 13.5 }}>{formatPrice(inv.total_cost)}</span>
													</td>,
													// Payment
													<td key="payment" style={{ padding: "13px 16px", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
														<PaymentChip method={inv.payment_method} T={T} />
													</td>,
													// Voucher
													<td key="voucher" style={{ padding: "13px 16px", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
														{getVoucherDisplay(inv)
															? <span style={tag(T.goldBg, T.gold, T.goldBorder)}>🎫 {getVoucherDisplay(inv)}</span>
															: <span style={{ color: T.textMuted }}>—</span>}
													</td>,
													// Ticket
													<td key="ticket" style={{ padding: "13px 16px", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
														{getTicketDisplay(inv)
															? <span style={{ fontSize: 12.5, color: T.textSec, maxWidth: 180, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={getTicketDisplay(inv)}>🔧 {getTicketDisplay(inv)}</span>
															: <span style={{ color: T.textMuted }}>—</span>}
													</td>,
													// Actions
													<td key="actions" style={{ padding: "13px 16px", borderBottom: idx < paginatedInvoices.length - 1 ? `1px solid ${T.tableBorder}` : "none", background: "transparent", transition: "background 0.15s" }}>
														<div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
															<button style={{ background: "none", border: `1px solid transparent`, cursor: "pointer", padding: 5, borderRadius: 8, display: "inline-flex", alignItems: "center", color: T.blue, transition: "all 0.15s" }}
																onClick={() => handleOpenView(inv.id)} title="Xem chi tiết"
																onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.background = T.blueBg; }}
																onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "none"; }}
															><ViewIcon sx={{ fontSize: 17 }} /></button>
															<button style={{ background: "none", border: `1px solid transparent`, cursor: "pointer", padding: 5, borderRadius: 8, display: "inline-flex", alignItems: "center", color: T.gold, transition: "all 0.15s" }}
																onClick={() => handleOpenEdit(inv.id)} title="Chỉnh sửa"
																onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = T.goldBg; }}
																onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "none"; }}
															><EditIcon sx={{ fontSize: 17 }} /></button>
														</div>
													</td>,
												]}
											</tr>
										</Grow>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
							<div style={{ ...labelStyle }}>{paginatedInvoices.length} / {sortedInvoices.length} hóa đơn</div>
							<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<button style={btnStyle(T)} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Trước</button>
								<span style={{ fontSize: 12.5, color: T.textSec, fontWeight: 500 }}>Trang {page + 1} / {totalPages}</span>
								<button style={btnStyle(T)} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Sau →</button>
							</div>
						</div>
					</div>
				</div>

				{/* ══════ VIEW DIALOG ══════ */}
				<Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth
					TransitionComponent={Grow} transitionDuration={400}
					PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(26,43,94,0.15)", bgcolor: "background.paper" } }}>
					<div style={{ height: 4, background: `linear-gradient(90deg, ${T.blue} 0%, ${T.navy} 50%, ${T.blue} 100%)` }} />
					<DialogTitle sx={{ background: isDark ? `rgba(27,95,196,0.12)` : `linear-gradient(135deg, ${T.blueBg} 0%, rgba(235,242,253,0.5) 100%)`, borderBottom: `2px solid ${T.blueBorder}`, py: 2.5, px: 3 }}>
						<Box display="flex" alignItems="center" justifyContent="space-between">
							<Box display="flex" alignItems="center" gap={1.5}>
								<Box sx={{ width: 36, height: 36, borderRadius: "12px", background: `linear-gradient(135deg, ${T.blue}, ${T.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
									<ReceiptIcon sx={{ color: "#fff", fontSize: 20 }} />
								</Box>
								<Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: T.navy, letterSpacing: "-0.3px" }}>Chi tiết hóa đơn</Typography>
							</Box>
							<IconButton onClick={() => setOpenViewDialog(false)} size="small" sx={{ color: T.textDim, "&:hover": { color: T.blue } }}><CloseIcon sx={{ fontSize: 22 }} /></IconButton>
						</Box>
					</DialogTitle>

					<DialogContent sx={{ p: 3, bgcolor: "background.paper" }}>
						{viewLoading ? (
							<Box display="flex" justifyContent="center" py={5}><CircularProgress sx={{ color: T.navy }} /></Box>
						) : selectedInvoice ? (
							<div>
								{/* ID banner */}
								<div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyLight} 100%)`, borderRadius: 16, padding: "20px 22px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<div>
										<div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Mã hóa đơn</div>
										<div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#fff", fontWeight: 600 }}>{selectedInvoice.id}</div>
									</div>
									{getCustomerDisplay(selectedInvoice) && (
										<div style={{ textAlign: "right" }}>
											<div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Khách hàng</div>
											<div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>👤 {getCustomerDisplay(selectedInvoice)}</div>
											{getCustomerPhone(selectedInvoice) && <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2 }}>📞 {getCustomerPhone(selectedInvoice)}</div>}
										</div>
									)}
								</div>

								{/* Info grid */}
								<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
									{[
										{ bg: T.blueBg, border: T.blueBorder, label: "📅 Ngày tạo", content: <><div style={{ fontSize: 15, fontWeight: 700, color: T.blue }}>{dayjs(selectedInvoice.created_date).format("DD/MM/YYYY")}</div><div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>{dayjs(selectedInvoice.created_date).fromNow()}</div></> },
										{ bg: T.greenBg, border: T.greenBorder, label: "💰 Tổng chi phí", content: <div style={{ fontSize: 20, fontWeight: 800, color: T.green, fontFamily: "'Sora',sans-serif" }}>{formatPrice(selectedInvoice.total_cost)}</div> },
										{ bg: T.purpleBg, border: T.purpleBorder, label: "💳 Phương thức thanh toán", content: <PaymentChip method={selectedInvoice.payment_method} T={T} /> },
										{ bg: T.greenBg, border: T.greenBorder, label: "✓ Trạng thái", content: <span style={tag(T.greenBg, T.green, T.greenBorder)}>✓ Đã thanh toán</span> },
									].map(({ bg, border, label, content }, i) => (
										<div key={i} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "16px 18px" }}>
											<div style={{ ...labelStyle, marginBottom: 8 }}>{label}</div>
											{content}
										</div>
									))}
								</div>

								{/* Readonly info */}
								<div style={{ background: T.goldBg, border: `1.5px solid ${T.goldBorder}`, borderRadius: 14, padding: 16 }}>
									<div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: `1px solid ${T.goldBorder}`, marginBottom: 12 }}>
										<LockIcon sx={{ fontSize: 18, color: T.gold }} />
										<span style={{ fontSize: 12.5, color: T.gold, fontWeight: 700 }}>Thông tin chỉ đọc</span>
									</div>
									<div style={{ marginBottom: 12 }}>
										<div style={{ ...labelStyle, color: T.gold, marginBottom: 8 }}>🎫 Mã voucher (chỉ đọc)</div>
										{getVoucherDisplay(selectedInvoice)
											? <span style={tag(T.goldBg, T.gold, T.goldBorder)}>🎫 {getVoucherDisplay(selectedInvoice)}</span>
											: <span style={{ color: T.textMuted, fontStyle: "italic" }}>Không áp dụng</span>}
									</div>
									<div>
										<div style={{ ...labelStyle, color: T.gold, marginBottom: 8 }}>🔧 Phiếu sửa chữa (chỉ đọc)</div>
										{getTicketDisplay(selectedInvoice)
											? <span style={{ color: T.textSec, fontWeight: 500 }}>🔧 {getTicketDisplay(selectedInvoice)}</span>
											: <span style={{ color: T.textMuted, fontStyle: "italic" }}>Không liên kết</span>}
									</div>
								</div>
							</div>
						) : <Alert severity="error">Không thể tải thông tin hóa đơn</Alert>}
					</DialogContent>

					<DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${T.border}`, bgcolor: "background.paper" }}>
						<button style={{ ...btnStyle(T), marginRight: "auto" }} onClick={() => setOpenViewDialog(false)}>✕ Đóng</button>
						<button style={btnStyle(T, "primary")} onClick={() => window.print()}>
							<PrintIcon sx={{ fontSize: 15 }} /> In hóa đơn
						</button>
					</DialogActions>
				</Dialog>

				{/* ══════ EDIT DIALOG ══════ */}
				<Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
					TransitionComponent={Grow} transitionDuration={400}
					PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(192,98,10,0.15)", bgcolor: "background.paper" } }}>
					<div style={{ height: 4, background: `linear-gradient(90deg, ${T.gold} 0%, ${T.orange} 50%, ${T.gold} 100%)` }} />
					<DialogTitle sx={{ background: isDark ? `rgba(184,134,11,0.1)` : `linear-gradient(135deg, ${T.goldBg} 0%, rgba(254,243,232,0.5) 100%)`, borderBottom: `2px solid ${T.goldBorder}`, py: 2.5, px: 3 }}>
						<Box display="flex" alignItems="center" gap={1.5} justifyContent="space-between">
							<Box display="flex" alignItems="center" gap={1.5}>
								<Box sx={{ width: 36, height: 36, borderRadius: "12px", background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
									<EditIcon sx={{ color: "#fff", fontSize: 20 }} />
								</Box>
								<Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: T.navy, letterSpacing: "-0.3px" }}>Chỉnh sửa hóa đơn</Typography>
							</Box>
							<IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: T.textDim, "&:hover": { color: T.gold } }}><CloseIcon sx={{ fontSize: 22 }} /></IconButton>
						</Box>
					</DialogTitle>
					<DialogContent sx={{ p: 3, bgcolor: "background.paper" }}>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 6, marginBottom: 18 }}>
							<div>
								<div style={{ ...labelStyle, marginBottom: 10 }}>📅 Ngày tạo</div>
								<DatePicker
									label="Chọn ngày"
									value={formData.created_date ? dayjs(formData.created_date) : null}
									onChange={d => setFormData(f => ({ ...f, created_date: d?.format("YYYY-MM-DD") || "" }))}
									slotProps={{ textField: { fullWidth: true, size: "small", sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px" } } } }}
								/>
							</div>
							<div>
								<div style={{ ...labelStyle, marginBottom: 10 }}>💰 Tổng chi phí</div>
								<TextField
									fullWidth size="small" label="Nhập số tiền" type="number"
									value={formData.total_cost}
									onChange={e => { setFormData(f => ({ ...f, total_cost: e.target.value })); setFormErrors(er => ({ ...er, total_cost: "" })); }}
									InputProps={{ startAdornment: <InputAdornment position="start">₫</InputAdornment> }}
									error={!!formErrors.total_cost} helperText={formErrors.total_cost}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
								/>
							</div>
							<div style={{ gridColumn: "1 / -1" }}>
								<div style={{ ...labelStyle, marginBottom: 10 }}>💳 Phương thức thanh toán</div>
								<FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
									<InputLabel>Chọn phương thức</InputLabel>
									<Select value={formData.payment_method} onChange={e => setFormData(f => ({ ...f, payment_method: e.target.value }))} label="Chọn phương thức">
										<MenuItem value="CASH">💰 Tiền mặt</MenuItem>
										<MenuItem value="CREDIT_CARD">💳 Thẻ tín dụng</MenuItem>
										<MenuItem value="BANK_TRANSFER">🏦 Chuyển khoản (BANK_TRANSFER)</MenuItem>
										<MenuItem value="TRANSFER">🏦 Chuyển khoản (TRANSFER)</MenuItem>
										<MenuItem value="MOMO">📱 MoMo</MenuItem>
										<MenuItem value="VNPAY">💸 VNPay</MenuItem>
									</Select>
								</FormControl>
							</div>
						</div>
						{selectedInvoice && (
							<div style={{ background: T.goldBg, border: `1.5px solid ${T.goldBorder}`, borderRadius: 14, padding: 14 }}>
								<div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: `1px solid ${T.goldBorder}`, marginBottom: 12 }}>
									<LockIcon sx={{ fontSize: 16, color: T.gold }} />
									<span style={{ fontSize: 12, color: T.gold, fontWeight: 700 }}>Thông tin chỉ đọc</span>
								</div>
								<div style={{ marginBottom: 10 }}>
									<div style={{ ...labelStyle, color: T.gold, marginBottom: 6 }}>🎫 Mã voucher</div>
									{getVoucherDisplay(selectedInvoice)
										? <span style={tag(T.goldBg, T.gold, T.goldBorder)}>🎫 {getVoucherDisplay(selectedInvoice)}</span>
										: <span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Không áp dụng</span>}
								</div>
								<div>
									<div style={{ ...labelStyle, color: T.gold, marginBottom: 6 }}>🔧 Phiếu sửa chữa</div>
									{getTicketDisplay(selectedInvoice)
										? <span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>🔧 {getTicketDisplay(selectedInvoice)}</span>
										: <span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Không liên kết</span>}
								</div>
							</div>
						)}
					</DialogContent>
					<DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${T.goldBorder}`, bgcolor: "background.paper" }}>
						<button style={{ ...btnStyle(T), marginRight: "auto" }} onClick={() => setOpenDialog(false)}>✕ Hủy</button>
						<button style={{ ...btnStyle(T, "primary"), background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, borderColor: T.gold }} onClick={handleSubmit}>
							<SaveIcon sx={{ fontSize: 15 }} /> Lưu thay đổi
						</button>
					</DialogActions>
				</Dialog>

				{/* Snackbar */}
				<Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} TransitionComponent={Slide}>
					<Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2, fontFamily: "'DM Sans', sans-serif" }}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</div>
		</LocalizationProvider>
	);
};

export default InvoiceManagement;