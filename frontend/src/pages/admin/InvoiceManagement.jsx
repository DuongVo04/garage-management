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

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
	bg: "#F0F2F8",
	surface: "#FFFFFF",
	card: "#FFFFFF",
	border: "#E2E8F4",
	borderHi: "#C8D4EE",

	navy: "#1A2B5E",
	navyLight: "#2D4080",
	gold: "#B8860B",
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
	v != null
		? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
		: "0₫";

const formatCompactPrice = (v) => {
	if (!v) return "0₫";
	if (v >= 1e9) return `${(v / 1e9).toFixed(1)} tỷ ₫`;
	if (v >= 1e6) return `${(v / 1e6).toFixed(1)} tr ₫`;
	return formatPrice(v);
};

// ─── STYLE INJECTION ─────────────────────────────────────────────────────────
const injectStyles = () => {
	if (document.getElementById("invoice-styles")) return;
	const s = document.createElement("style");
	s.id = "invoice-styles";
	s.textContent = `
		@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

		.inv-root * { box-sizing: border-box; }
		.inv-root { font-family: 'DM Sans', sans-serif; background: ${T.bg}; min-height: 100vh; }

		.inv-card {
			background: ${T.card};
			border: 1px solid ${T.border};
			border-radius: 18px;
			transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
		}
		.inv-card:hover { border-color: ${T.borderHi}; box-shadow: 0 8px 40px rgba(26,43,94,0.10); }

		.inv-heading {
			font-family: 'Sora', sans-serif;
			font-weight: 800;
			color: ${T.navy};
			letter-spacing: -0.5px;
		}
		.inv-label {
			font-size: 10.5px;
			font-weight: 700;
			letter-spacing: 1.5px;
			text-transform: uppercase;
			color: ${T.textDim};
			font-family: 'DM Sans', sans-serif;
		}
		.inv-mono {
			font-family: 'IBM Plex Mono', monospace;
			font-size: 12px;
		}

		.stat-num {
			font-family: 'Sora', sans-serif;
			font-weight: 800;
			color: ${T.textPri};
			font-size: 28px;
			line-height: 1.15;
			letter-spacing: -0.8px;
		}

		.tag {
			display: inline-flex; align-items: center; gap: 5px;
			padding: 3px 10px; border-radius: 20px;
			font-size: 11px; font-weight: 600; border: 1px solid;
			font-family: 'DM Sans', sans-serif;
			white-space: nowrap;
		}
		.tag-green  { background:${T.greenBg};  color:${T.green};  border-color:${T.greenBorder}; }
		.tag-red    { background:${T.redBg};    color:${T.red};    border-color:${T.redBorder}; }
		.tag-gold   { background:${T.goldBg};   color:${T.gold};   border-color:${T.goldBorder}; }
		.tag-blue   { background:${T.blueBg};   color:${T.blue};   border-color:${T.blueBorder}; }
		.tag-purple { background:${T.purpleBg}; color:${T.purple}; border-color:${T.purpleBorder}; }
		.tag-orange { background:${T.orangeBg}; color:${T.orange}; border-color:${T.orangeBorder}; }
		.tag-gray   { background:#F0F3FA; color:${T.textDim}; border-color:${T.border}; }

		.inv-btn {
			display: inline-flex; align-items: center; gap: 6px;
			padding: 8px 16px; border-radius: 11px;
			border: 1px solid ${T.border};
			background: ${T.surface};
			color: ${T.textSec};
			font-size: 12.5px; font-weight: 600;
			cursor: pointer; transition: all 0.18s;
			font-family: 'DM Sans', sans-serif;
			white-space: nowrap;
		}
		.inv-btn:hover:not(:disabled) {
			border-color: ${T.navy}; color: ${T.navy};
			box-shadow: 0 2px 10px rgba(26,43,94,0.13);
			transform: translateY(-1px);
		}
		.inv-btn:disabled { opacity: 0.45; cursor: not-allowed; }
		.inv-btn.primary {
			background: linear-gradient(135deg, ${T.navy} 0%, ${T.navyLight} 100%);
			color: #fff; border-color: ${T.navy};
		}
		.inv-btn.primary:hover:not(:disabled) { opacity: 0.92; }
		.inv-btn.danger { color: ${T.red}; border-color: ${T.redBorder}; }
		.inv-btn.danger:hover:not(:disabled) { background: ${T.redBg}; border-color: ${T.red}; color: ${T.red}; }

		.inv-table { width: 100%; border-collapse: collapse; }
		.inv-table th {
			background: #F5F7FC;
			color: ${T.textDim};
			font-size: 10.5px;
			font-weight: 700;
			letter-spacing: 1.2px;
			text-transform: uppercase;
			padding: 13px 16px;
			border-bottom: 1px solid ${T.border};
			text-align: left;
			font-family: 'DM Sans', sans-serif;
			white-space: nowrap;
		}
		.inv-table td {
			padding: 13px 16px;
			font-size: 13px;
			color: ${T.textSec};
			border-bottom: 1px solid #F0F3FA;
			font-family: 'DM Sans', sans-serif;
			vertical-align: middle;
		}
		.inv-table tr:last-child td { border-bottom: none; }
		.inv-table tbody tr { transition: background 0.15s; }
		.inv-table tbody tr:hover td { background: #F8FAFE; }

		.inv-action-btn {
			background: none; border: 1px solid transparent; cursor: pointer;
			padding: 5px; border-radius: 8px;
			display: inline-flex; align-items: center; justify-content: center;
			transition: all 0.15s;
		}
		.inv-action-btn:hover { border-color: currentColor; background: rgba(0,0,0,0.04); transform: scale(1.1); }

		.live-dot {
			width: 7px; height: 7px; border-radius: 50%;
			background: ${T.green};
			animation: livepulse 2s infinite;
			flex-shrink: 0;
		}
		@keyframes livepulse {
			0%   { box-shadow: 0 0 0 0 rgba(26,138,90,0.45); }
			70%  { box-shadow: 0 0 0 8px rgba(26,138,90,0); }
			100% { box-shadow: 0 0 0 0 rgba(26,138,90,0); }
		}

		.readonly-field {
			background: #F5F7FC !important;
			border-radius: 10px;
			padding: 12px 16px;
			border: 1px solid ${T.border};
		}
		.readonly-field-label {
			font-size: 10px; font-weight: 700; letter-spacing: 1.3px;
			text-transform: uppercase; color: ${T.textDim};
			display: flex; align-items: center; gap: 5px;
			margin-bottom: 6px;
			font-family: 'DM Sans', sans-serif;
		}
		.readonly-field-value {
			font-size: 13.5px; font-weight: 500; color: ${T.textPri};
			font-family: 'DM Sans', sans-serif;
		}

		.detail-grid {
			display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
		}

		.detail-section {
			background: #F8FAFE; border-radius: 14px; padding: 16px 18px;
			border: 1px solid ${T.border};
		}

		@keyframes fadeSlideIn {
			from { opacity:0; transform: translateY(6px); }
			to   { opacity:1; transform: translateY(0); }
		}
		.anim-in { animation: fadeSlideIn 0.35s ease; }

		@keyframes slideInTop {
			from { transform: translateY(-8px); opacity: 0; }
			to   { transform: translateY(0); opacity: 1; }
		}

		.top-bar {
			height: 3px;
			background: linear-gradient(90deg, ${T.navy}, ${T.blue} 40%, ${T.gold} 70%, ${T.green});
		}
	`;
	document.head.appendChild(s);
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

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, iconBg, iconColor, sub, mono }) => {
	const counted = useCountUp(value, 750);
	return (
		<div className="inv-card" style={{ padding: "20px 22px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
				<div style={{ flex: 1 }}>
					<div className="inv-label" style={{ marginBottom: 10 }}>{title}</div>
					<div className={`stat-num ${mono ? "inv-mono" : ""}`} style={{ fontSize: mono ? 22 : 28 }}>
						{mono ? formatPrice(counted) : counted.toLocaleString("vi-VN")}
					</div>
					{sub && <div style={{ fontSize: 11, color: T.textDim, marginTop: 5, fontWeight: 500 }}>{sub}</div>}
				</div>
				<div style={{ width: 44, height: 44, borderRadius: 13, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}>
					{icon}
				</div>
			</div>
		</div>
	);
};

// ─── LIVE CLOCK ─────────────────────────────────────────────────────────────
const LiveClock = () => {
	const [t, setT] = useState(new Date());
	useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
	return (
		<div style={{ textAlign: "right" }}>
			<div className="inv-label" style={{ fontSize: 9.5, marginBottom: 4 }}>THỜI GIAN THỰC</div>
			<div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: T.navy, letterSpacing: 1 }}>
				{t.toLocaleTimeString("vi-VN")}
			</div>
			<div style={{ fontSize: 11, color: T.textDim, fontWeight: 500, marginTop: 2 }}>
				{t.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
			</div>
		</div>
	);
};

// ─── PAYMENT CHIP ───────────────────────────────────────────────────────────
const PAYMENT_CONFIG = {
	CASH: { label: "Tiền mặt", cls: "tag-green", icon: "💰" },
	CREDIT_CARD: { label: "Thẻ tín dụng", cls: "tag-blue", icon: "💳" },
	BANK_TRANSFER: { label: "Chuyển khoản", cls: "tag-purple", icon: "🏦" },
	MOMO: { label: "MoMo", cls: "tag-red", icon: "📱" },
	VNPAY: { label: "VNPay", cls: "tag-orange", icon: "💸" },
};
const PaymentChip = ({ method }) => {
	const c = PAYMENT_CONFIG[method] || { label: method || "Chưa xác định", cls: "tag-gray", icon: "💳" };
	return <span className={`tag ${c.cls}`}>{c.icon} {c.label}</span>;
};

// ─── READ-ONLY FIELD ─────────────────────────────────────────────────────────
const ReadOnlyField = ({ label, children }) => (
	<div className="readonly-field">
		<div className="readonly-field-label">
			<LockIcon sx={{ fontSize: 10 }} /> {label}
		</div>
		<div className="readonly-field-value">{children}</div>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const InvoiceManagement = () => {
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [openDialog, setOpenDialog] = useState(false);
	const [openViewDialog, setOpenViewDialog] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [viewLoading, setViewLoading] = useState(false);

	const [formData, setFormData] = useState({
		created_date: dayjs().format("YYYY-MM-DD"),
		total_cost: "",
		payment_method: "",
		discount_id: "",
		ticket_id: "",
	});
	const [formErrors, setFormErrors] = useState({});

	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [orderBy, setOrderBy] = useState("created_date");
	const [order, setOrder] = useState("desc");
	const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
	const [dateRange, setDateRange] = useState({ start: null, end: null });
	const [showFilters, setShowFilters] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);

	useEffect(() => { injectStyles(); }, []);

	// ── Fetch ──────────────────────────────────────────────────────────────
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

	// ── Stats ──────────────────────────────────────────────────────────────
	const stats = useMemo(() => {
		const totalRevenue = invoices.reduce((s, inv) => s + (parseFloat(inv.total_cost) || 0), 0);
		const cashPayments = invoices.filter(i => i.payment_method === "CASH").length;
		const digitalPayments = invoices.filter(i => ["CREDIT_CARD", "BANK_TRANSFER", "MOMO", "VNPAY"].includes(i.payment_method)).length;
		const discountApplied = invoices.filter(i => i.discount_id).length;
		const thisMonth = invoices.filter(i => dayjs(i.created_date).isSame(dayjs(), "month")).length;
		return { total: invoices.length, totalRevenue, cashPayments, digitalPayments, avgValue: invoices.length ? totalRevenue / invoices.length : 0, discountApplied, thisMonth };
	}, [invoices]);

	// ── View (READ-ONLY) ───────────────────────────────────────────────────
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

	// ── Edit ───────────────────────────────────────────────────────────────
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

	// // ── Delete ─────────────────────────────────────────────────────────────
	// const handleDelete = async (id) => {
	// 	if (!window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;
	// 	try {
	// 		const res = await deleteInvoice(id);
	// 		if (res?.success) {
	// 			showSnackbar("Xóa hóa đơn thành công");
	// 			fetchInvoices();
	// 		}
	// 		else {
	// 			showSnackbar(res?.message || "Không thể xóa", "error");
	// 		}
	// 	} catch (error) {
	// 		console.error("Delete error:", error);
	// 		console.error("Error response:", error.response?.data);

	// 		// Extract detailed error message from backend
	// 		let errorMessage = "Không thể xóa hóa đơn";
	// 		if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
	// 			errorMessage = error.response.data.errors.map(e => e.msg || e.message || e).join(", ");
	// 		} else if (error.response?.data?.message) {
	// 			errorMessage = error.response.data.message;
	// 		} else if (error.response?.data?.error) {
	// 			errorMessage = error.response.data.error;
	// 		}

	// 		console.log("Final error message:", errorMessage);
	// 		showSnackbar(errorMessage, "error");
	// 	}
	// };

	// const handleBulkDelete = async () => {
	// 	if (!selectedRows.length) return;
	// 	if (!window.confirm(`Xóa ${selectedRows.length} hóa đơn đã chọn?`)) return;
	// 	try {
	// 		const results = await Promise.all(selectedRows.map(id => deleteInvoice(id)));

	// 		// Check if all deletes were successful
	// 		const allSuccessful = results.every(res => res?.success);
	// 		if (allSuccessful) {
	// 			showSnackbar(`Đã xóa ${selectedRows.length} hóa đơn`);
	// 			setSelectedRows([]);
	// 			fetchInvoices();
	// 		} else {
	// 			showSnackbar("Có lỗi khi xóa một số hóa đơn", "warning");
	// 			setSelectedRows([]);
	// 			fetchInvoices();
	// 		}
	// 	} catch (error) {
	// 		console.error("Bulk delete error:", error);
	// 		let errorMessage = "Có lỗi khi xóa";
	// 		if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
	// 			errorMessage = error.response.data.errors.map(e => e.msg || e.message || e).join(", ");
	// 		} else if (error.response?.data?.message) {
	// 			errorMessage = error.response.data.message;
	// 		} else if (error.response?.data?.error) {
	// 			errorMessage = error.response.data.error;
	// 		}
	// 		showSnackbar(errorMessage, "error");
	// 	}
	// };

	// ── Form submit (edit only) ────────────────────────────────────────────
	const validateForm = () => {
		const errors = {};
		if (formData.total_cost && isNaN(formData.total_cost)) errors.total_cost = "Phải là số";
		if (formData.total_cost && parseFloat(formData.total_cost) < 0) errors.total_cost = "Không thể âm";
		setFormErrors(errors);
		return !Object.keys(errors).length;
	};

	const handleSubmit = async () => {
		// Validate only if total_cost has a value
		if (formData.total_cost !== "" && formData.total_cost !== null && formData.total_cost !== undefined) {
			if (isNaN(formData.total_cost)) {
				showSnackbar("Tổng chi phí phải là số", "error");
				return;
			}
			if (parseFloat(formData.total_cost) < 0) {
				showSnackbar("Tổng chi phí không thể âm", "error");
				return;
			}
		}

		try {
			const updateData = {};

			// Only add fields that are actually editable and have changed values
			if (formData.created_date && formData.created_date.trim()) {
				updateData.created_date = formData.created_date;
			}

			// Only add total_cost if it's a valid number (not empty string)
			if (formData.total_cost !== "" && formData.total_cost !== null && formData.total_cost !== undefined) {
				const cost = parseFloat(formData.total_cost);
				if (!isNaN(cost)) {
					updateData.total_cost = cost;
				}
			}

			// Only add payment_method if it has a value
			if (formData.payment_method && formData.payment_method.trim()) {
				updateData.payment_method = formData.payment_method;
			}

			// NOTE: discount_id and ticket_id are read-only fields and should not be modified in the update

			// If no fields to update, show message
			if (Object.keys(updateData).length === 0) {
				showSnackbar("Không có dữ liệu để cập nhật", "warning");
				setOpenDialog(false);
				return;
			}

			console.log("Updating with data:", updateData); // Debug log

			const res = await updateInvoice(selectedInvoice.id, updateData);
			if (res?.success) {
				showSnackbar("Cập nhật hóa đơn thành công");
				setOpenDialog(false);
				fetchInvoices();
			} else {
				showSnackbar(res?.message || "Có lỗi xảy ra", "error");
			}
		} catch (error) {
			console.error("Update error:", error);
			console.error("Error response:", error.response?.data);

			// Extract detailed error message from backend
			let errorMessage = "Lỗi khi lưu hóa đơn";
			if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
				errorMessage = error.response.data.errors.map(e => e.msg || e.message || e).join(", ");
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.response?.data?.error) {
				errorMessage = error.response.data.error;
			}

			console.log("Final error message:", errorMessage);
			showSnackbar(errorMessage, "error");
		}
	};

	// ─── HELPER: lấy voucher code hoặc fallback về discount_id ─────────────
	const getVoucherDisplay = (inv) => {
		if (!inv) return null;
		return inv.voucher?.code || inv.discount_id || null;
	};

	// ─── HELPER: lấy ticket description hoặc fallback về ticket_id ──────────
	const getTicketDisplay = (inv) => {
		if (!inv) return null;
		return inv.ticket?.description || inv.ticket_id || null;
	};

	// ─── HELPER: lấy tên khách hàng qua chain ticket → appointment → customer ──
	const getCustomerDisplay = (inv) => {
		if (!inv) return null;
		return inv.ticket?.appointment?.customer?.full_name || null;
	};

	const getCustomerPhone = (inv) => {
		if (!inv) return null;
		return inv.ticket?.appointment?.customer?.phone_number || null;
	};

	// ── Sorting / Filtering / Pagination ──────────────────────────────────
	const sortedInvoices = useMemo(() => {
		let list = [...invoices];
		if (filterPaymentMethod !== "all") list = list.filter(i => i.payment_method === filterPaymentMethod);

		// Lọc theo customer name
		if (searchTerm) {
			const q = searchTerm.toLowerCase();
			list = list.filter(i => {
				const customerName = getCustomerDisplay(i)?.toLowerCase() || "";
				return customerName.includes(q);
			});
		}

		// Lọc theo date range
		if (dateRange.start) {
			list = list.filter(i => dayjs(i.created_date).isSameOrAfter(dayjs(dateRange.start), 'day'));
		}
		if (dateRange.end) {
			list = list.filter(i => dayjs(i.created_date).isSameOrBefore(dayjs(dateRange.end), 'day'));
		}

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

	// ══════════════════════════════════════════════════════════════════════
	// RENDER
	// ══════════════════════════════════════════════════════════════════════
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
			<div className="inv-root">
				<div className="top-bar" />
				<div style={{ maxWidth: 1380, margin: "0 auto", padding: "26px 22px 44px" }}>

					{/* ── Header ── */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
						<div>
							<div className="inv-label" style={{ marginBottom: 5 }}>Quản lý tài chính</div>
							<div className="inv-heading" style={{ fontSize: 34, lineHeight: 1 }}>HÓA ĐƠN</div>
							<div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
								<div className="live-dot" />
								<span style={{ fontSize: 11.5, color: T.textDim, fontWeight: 500 }}>Cập nhật theo thời gian thực</span>
							</div>
						</div>
						<LiveClock />
					</div>

					{/* ── Action bar ── */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
						<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
							<button className="inv-btn" onClick={() => setShowFilters(!showFilters)}>
								<FilterIcon sx={{ fontSize: 15 }} /> {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
							</button>
							{/* {selectedRows.length > 0 && (
								<button className="inv-btn danger" onClick={handleBulkDelete}>
									<DeleteIcon sx={{ fontSize: 15 }} /> Xóa {selectedRows.length} mục
								</button>
							)} */}
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<button className="inv-btn" onClick={fetchInvoices}>
								<RefreshIcon sx={{ fontSize: 15 }} /> Làm mới
							</button>
							<button className="inv-btn" onClick={exportToCSV}>
								<ExportIcon sx={{ fontSize: 15 }} /> Xuất CSV
							</button>
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
						<div className="inv-card anim-in" style={{ padding: "20px 22px", marginBottom: 20, background: "linear-gradient(135deg, #F8FAFE 0%, #FFFFFF 100%)", border: `1.5px solid ${T.blueBorder}` }}>
							<div className="inv-label" style={{ marginBottom: 16, fontSize: 13 }}>🔍 Bộ lọc nâng cao</div>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
								<div>
									<div className="inv-label" style={{ marginBottom: 8, fontSize: 10 }}>👤 Tên khách hàng</div>
									<input
										type="text" placeholder="Nhập tên khách hàng..."
										value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
										style={{ padding: "10px 14px", borderRadius: 11, border: `1px solid ${T.border}`, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none", background: T.surface, width: "100%", transition: "all 0.2s", boxSizing: "border-box" }}
										onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = `0 0 0 3px ${T.blueBg}`; }}
										onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
									/>
								</div>
								<div>
									<div className="inv-label" style={{ marginBottom: 8, fontSize: 10 }}>💳 Phương thức thanh toán</div>
									<select
										value={filterPaymentMethod} onChange={e => setFilterPaymentMethod(e.target.value)}
										style={{ padding: "10px 14px", borderRadius: 11, border: `1px solid ${T.border}`, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none", background: T.surface, width: "100%", transition: "all 0.2s", boxSizing: "border-box" }}
									>
										<option value="all">Tất cả phương thức</option>
										<option value="CASH">💰 Tiền mặt</option>
										<option value="CREDIT_CARD">💳 Thẻ tín dụng</option>
										<option value="BANK_TRANSFER">🏦 Chuyển khoản</option>
										<option value="MOMO">📱 MoMo</option>
										<option value="VNPAY">💸 VNPay</option>
									</select>
								</div>
								<div>
									<div className="inv-label" style={{ marginBottom: 8, fontSize: 10 }}>📅 Từ ngày</div>
									<DatePicker
										label="Chọn ngày"
										value={dateRange.start}
										onChange={(date) => setDateRange(r => ({ ...r, start: date }))}
										slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 } } } }}
									/>
								</div>
								<div>
									<div className="inv-label" style={{ marginBottom: 8, fontSize: 10 }}>📅 Đến ngày</div>
									<DatePicker
										label="Chọn ngày"
										value={dateRange.end}
										onChange={(date) => setDateRange(r => ({ ...r, end: date }))}
										slotProps={{ textField: { size: "small", fullWidth: true, sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13 } } } }}
									/>
								</div>
								<div style={{ display: "flex", alignItems: "flex-end" }}>
									<button className="inv-btn" onClick={handleReset} style={{ width: "100%", justifyContent: "center", background: T.redBg, color: T.red, borderColor: T.redBorder }}>
										<ClearIcon sx={{ fontSize: 15 }} /> Xóa tất cả bộ lọc
									</button>
								</div>
							</div>
						</div>
					)}

					{/* ── Error ── */}
					{error && (
						<div className="inv-card" style={{ padding: "14px 18px", marginBottom: 20, background: T.redBg, borderColor: T.redBorder }}>
							<div style={{ display: "flex", alignItems: "center", gap: 8, color: T.red }}>
								<WarningIcon sx={{ fontSize: 18 }} />
								<span style={{ fontSize: 13, fontWeight: 500 }}>{error}</span>
								<button onClick={fetchInvoices} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.red, fontWeight: 600, fontSize: 12 }}>Thử lại</button>
							</div>
						</div>
					)}

					{/* ── Table ── */}
					<div className="inv-card" style={{ overflow: "hidden" }}>
						<div style={{ overflowX: "auto" }}>
							<table className="inv-table">
								<thead>
									<tr>
										<th style={{ width: 36 }}>
											<input type="checkbox"
												checked={selectedRows.length === paginatedInvoices.length && paginatedInvoices.length > 0}
												onChange={toggleAll} style={{ cursor: "pointer" }}
											/>
										</th>
										<th>Khách hàng</th>
										<th style={{ cursor: "pointer" }} onClick={() => handleSort("created_date")}>
											Ngày tạo {orderBy === "created_date" ? (order === "asc" ? "↑" : "↓") : ""}
										</th>
										<th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleSort("total_cost")}>
											Tổng chi phí {orderBy === "total_cost" ? (order === "asc" ? "↑" : "↓") : ""}
										</th>
										<th>Phương thức</th>
										<th>Voucher</th>
										<th>Phiếu sửa chữa</th>
										<th style={{ textAlign: "center" }}>Thao tác</th>
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
											<div style={{ color: T.textDim, fontSize: 13.5 }}>Không có hóa đơn nào</div>
										</td></tr>
									) : paginatedInvoices.map(inv => (
										<Grow in timeout={250} key={inv.id}>
											<tr>
												<td>
													<input type="checkbox" checked={selectedRows.includes(inv.id)} onChange={() => toggleRow(inv.id)} onClick={e => e.stopPropagation()} style={{ cursor: "pointer" }} />
												</td>
												<td>
													{getCustomerDisplay(inv) ? (
														<div>
															<div style={{ fontWeight: 600, fontSize: 13, color: T.textPri }}>👤 {getCustomerDisplay(inv)}</div>
															{getCustomerPhone(inv) && (
																<div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>📞 {getCustomerPhone(inv)}</div>
															)}
														</div>
													) : (
														<span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Chưa xác định</span>
													)}
												</td>
												<td>
													<div style={{ fontWeight: 500 }}>{inv.created_date ? dayjs(inv.created_date).format("DD/MM/YYYY") : "—"}</div>
													<div style={{ fontSize: 10.5, color: T.textDim }}>{dayjs(inv.created_date).fromNow()}</div>
												</td>
												<td style={{ textAlign: "right" }}>
													<span style={{ color: T.green, fontWeight: 700, fontSize: 13.5 }}>{formatPrice(inv.total_cost)}</span>
												</td>
												<td><PaymentChip method={inv.payment_method} /></td>
												<td>
													{getVoucherDisplay(inv)
														? <span className="tag tag-gold">🎫 {getVoucherDisplay(inv)}</span>
														: <span style={{ color: T.textMuted }}>—</span>}
												</td>
												<td>
													{getTicketDisplay(inv) ? (
														<span style={{ fontSize: 12.5, color: T.textSec, maxWidth: 180, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
															title={getTicketDisplay(inv)}>
															🔧 {getTicketDisplay(inv)}
														</span>
													) : <span style={{ color: T.textMuted }}>—</span>}
												</td>
												<td>
													<div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
														<button className="inv-action-btn" style={{ color: T.blue }} onClick={() => handleOpenView(inv.id)} title="Xem chi tiết">
															<ViewIcon sx={{ fontSize: 17 }} />
														</button>
														<button className="inv-action-btn" style={{ color: T.gold }} onClick={() => handleOpenEdit(inv.id)} title="Chỉnh sửa">
															<EditIcon sx={{ fontSize: 17 }} />
														</button>
														{/* <button className="inv-action-btn" style={{ color: T.red }} onClick={() => handleDelete(inv.id)} title="Xóa">
															<DeleteIcon sx={{ fontSize: 17 }} />
														</button> */}
													</div>
												</td>
											</tr>
										</Grow>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
							<div className="inv-label">
								{paginatedInvoices.length} / {sortedInvoices.length} hóa đơn
							</div>
							<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<button className="inv-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Trước</button>
								<span style={{ fontSize: 12.5, color: T.textSec, fontWeight: 500 }}>Trang {page + 1} / {totalPages}</span>
								<button className="inv-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Sau →</button>
							</div>
						</div>
					</div>
				</div>

				{/* ══════ VIEW DIALOG (read-only) ══════ */}
				<Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth
					TransitionComponent={Grow} transitionDuration={400}
					PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(26,43,94,0.15)" } }}>
					<div style={{ height: 4, background: `linear-gradient(90deg, ${T.blue} 0%, ${T.navy} 50%, ${T.blue} 100%)`, animation: "slideInTop 0.5s ease" }} />
					<DialogTitle sx={{ background: `linear-gradient(135deg, ${T.blueBg} 0%, rgba(235, 242, 253, 0.5) 100%)`, borderBottom: `2px solid ${T.blueBorder}`, py: 2.5, px: 3 }}>
						<Box display="flex" alignItems="center" justifyContent="space-between">
							<Box display="flex" alignItems="center" gap={1.5}>
								<Box sx={{ width: 36, height: 36, borderRadius: "12px", background: `linear-gradient(135deg, ${T.blue}, ${T.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
									<ReceiptIcon sx={{ color: "#fff", fontSize: 20 }} />
								</Box>
								<Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: T.navy, letterSpacing: "-0.3px" }}>Chi tiết hóa đơn</Typography>
							</Box>
							<IconButton onClick={() => setOpenViewDialog(false)} size="small" sx={{ color: T.textDim, transition: "all 0.2s", "&:hover": { color: T.blue, transform: "scale(1.1)" } }}><CloseIcon sx={{ fontSize: 22 }} /></IconButton>
						</Box>
					</DialogTitle>

					<DialogContent sx={{ p: 3, background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFE 100%)" }}>
						{viewLoading ? (
							<Box display="flex" justifyContent="center" py={5}><CircularProgress sx={{ color: T.navy }} /></Box>
						) : selectedInvoice ? (
							<div className="anim-in">
								{/* ID banner */}
								<div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyLight} 100%)`, borderRadius: 16, padding: "20px 22px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 24px rgba(26,43,94,0.12)" }}>
									<div>
										<div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Mã hóa đơn</div>
										<div className="inv-mono" style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{selectedInvoice.id}</div>
									</div>
									{getCustomerDisplay(selectedInvoice) && (
										<div style={{ textAlign: "right" }}>
											<div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 4 }}>Khách hàng</div>
											<div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>👤 {getCustomerDisplay(selectedInvoice)}</div>
											{getCustomerPhone(selectedInvoice) && (
												<div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2 }}>📞 {getCustomerPhone(selectedInvoice)}</div>
											)}
										</div>
									)}
								</div>

								{/* Grid info */}
								<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
									<div className="detail-section" style={{ background: "#EBF2FD", border: `1.5px solid ${T.blueBorder}`, boxShadow: "0 4px 12px rgba(27, 95, 196, 0.08)" }}>
										<div className="inv-label" style={{ marginBottom: 8 }}>📅 Ngày tạo</div>
										<div style={{ fontSize: 15, fontWeight: 700, color: T.blue }}>{dayjs(selectedInvoice.created_date).format("DD/MM/YYYY")}</div>
										<div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>{dayjs(selectedInvoice.created_date).fromNow()}</div>
									</div>
									<div className="detail-section" style={{ background: "#EBF7F2", border: `1.5px solid ${T.greenBorder}`, boxShadow: "0 4px 12px rgba(26, 138, 90, 0.08)" }}>
										<div className="inv-label" style={{ marginBottom: 8 }}>💰 Tổng chi phí</div>
										<div style={{ fontSize: 20, fontWeight: 800, color: T.green, fontFamily: "'Sora',sans-serif" }}>{formatPrice(selectedInvoice.total_cost)}</div>
									</div>
									<div className="detail-section" style={{ background: "#F3EEFB", border: `1.5px solid ${T.purpleBorder}`, boxShadow: "0 4px 12px rgba(107, 63, 160, 0.08)" }}>
										<div className="inv-label" style={{ marginBottom: 8 }}>💳 Phương thức thanh toán</div>
										<PaymentChip method={selectedInvoice.payment_method} />
									</div>
									<div className="detail-section" style={{ background: "#EBF7F2", border: `1.5px solid ${T.greenBorder}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
										<div className="inv-label" style={{ marginBottom: 8 }}>✓ Trạng thái</div>
										<span className="tag tag-green" style={{ width: "fit-content", fontSize: 12, fontWeight: 700 }}>✓ Đã thanh toán</span>
									</div>
								</div>

								{/* Locked fields */}
								<div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18, padding: "16px", background: T.goldBg, borderRadius: 14, border: `1.5px solid ${T.goldBorder}`, boxShadow: "0 4px 12px rgba(184, 134, 11, 0.08)" }}>
									<div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: `1px solid ${T.goldBorder}` }}>
										<LockIcon sx={{ fontSize: 18, color: T.gold }} />
										<span style={{ fontSize: 12.5, color: T.gold, fontWeight: 700 }}>Thông tin chỉ đọc</span>
									</div>
									<div>
										<div className="inv-label" style={{ marginBottom: 8, color: T.gold }}>🎫 Mã voucher (chỉ đọc)</div>
										<div style={{ fontSize: 13 }}>
											{getVoucherDisplay(selectedInvoice)
												? <span className="tag tag-gold" style={{ fontSize: 12, fontWeight: 600 }}>🎫 {getVoucherDisplay(selectedInvoice)}</span>
												: <span style={{ color: T.textMuted, fontSize: 13 }}><em>Không áp dụng</em></span>}
										</div>
									</div>
									<div>
										<div className="inv-label" style={{ marginBottom: 8, color: T.gold }}>🔧 Phiếu sửa chữa (chỉ đọc)</div>
										<div style={{ fontSize: 13 }}>
											{getTicketDisplay(selectedInvoice)
												? <span style={{ color: T.textSec, fontWeight: 500 }}>🔧 {getTicketDisplay(selectedInvoice)}</span>
												: <span style={{ color: T.textMuted, fontSize: 13 }}><em>Không liên kết</em></span>}
										</div>
									</div>
								</div>
							</div>
						) : (
							<Alert severity="error">Không thể tải thông tin hóa đơn</Alert>
						)}
					</DialogContent>

					<DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${T.border}`, background: "linear-gradient(90deg, transparent, rgba(26,43,94,0.02))" }}>
						<button className="inv-btn" onClick={() => setOpenViewDialog(false)} style={{ marginRight: "auto" }}>✕ Đóng</button>
						<button className="inv-btn primary" onClick={() => window.print()} style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.navyLight})`, borderColor: T.navy }}>
							<PrintIcon sx={{ fontSize: 15 }} /> In hóa đơn
						</button>

					</DialogActions>
				</Dialog>

				{/* ══════ EDIT DIALOG ══════ */}
				<Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth
					TransitionComponent={Grow} transitionDuration={400}
					PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(192, 98, 10, 0.15)" } }}>
					<div style={{ height: 4, background: `linear-gradient(90deg, ${T.gold} 0%, ${T.orange} 50%, ${T.gold} 100%)`, animation: "slideInTop 0.5s ease" }} />
					<DialogTitle sx={{ background: `linear-gradient(135deg, ${T.goldBg} 0%, rgba(254, 243, 232, 0.5) 100%)`, borderBottom: `2px solid ${T.goldBorder}`, py: 2.5, px: 3 }}>
						<Box display="flex" alignItems="center" gap={1.5} justifyContent="space-between">
							<Box display="flex" alignItems="center" gap={1.5}>
								<Box sx={{ width: 36, height: 36, borderRadius: "12px", background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
									<EditIcon sx={{ color: "#fff", fontSize: 20 }} />
								</Box>
								<Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: T.navy, letterSpacing: "-0.3px" }}>Chỉnh sửa hóa đơn</Typography>
							</Box>
							<IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: T.textDim, transition: "all 0.2s", "&:hover": { color: T.gold, transform: "scale(1.1)" } }}><CloseIcon sx={{ fontSize: 22 }} /></IconButton>
						</Box>
					</DialogTitle>
					<DialogContent sx={{ p: 3, background: "linear-gradient(180deg, #FFFFFF 0%, #FEF8EC 100%)" }}>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 6, marginBottom: 18 }}>
							<div>
								<div className="inv-label" style={{ marginBottom: 10, fontSize: 11.5 }}>📅 Ngày tạo</div>
								<DatePicker
									label="Chọn ngày"
									value={formData.created_date ? dayjs(formData.created_date) : null}
									onChange={d => setFormData(f => ({ ...f, created_date: d?.format("YYYY-MM-DD") || "" }))}
									slotProps={{ textField: { fullWidth: true, size: "small", sx: { "& .MuiOutlinedInput-root": { borderRadius: "10px", transition: "all 0.2s" } } } }}
								/>
							</div>
							<div>
								<div className="inv-label" style={{ marginBottom: 10, fontSize: 11.5 }}>💰 Tổng chi phí</div>
								<TextField
									fullWidth size="small"
									label="Nhập số tiền"
									type="number"
									value={formData.total_cost}
									onChange={e => { setFormData(f => ({ ...f, total_cost: e.target.value })); setFormErrors(er => ({ ...er, total_cost: "" })); }}
									InputProps={{ startAdornment: <InputAdornment position="start">₫</InputAdornment> }}
									error={!!formErrors.total_cost}
									helperText={formErrors.total_cost}
									sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", transition: "all 0.2s" } }}
								/>
							</div>
							<div style={{ gridColumn: "1 / -1" }}>
								<div className="inv-label" style={{ marginBottom: 10, fontSize: 11.5 }}>💳 Phương thức thanh toán</div>
								<FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", transition: "all 0.2s" } }}>
									<InputLabel>Chọn phương thức</InputLabel>
									<Select value={formData.payment_method} onChange={e => setFormData(f => ({ ...f, payment_method: e.target.value }))} label="Chọn phương thức">
										<MenuItem value="CASH">💰 Tiền mặt</MenuItem>
										<MenuItem value="CREDIT_CARD">💳 Thẻ tín dụng</MenuItem>
										<MenuItem value="BANK_TRANSFER">🏦 Chuyển khoản</MenuItem>
										<MenuItem value="MOMO">📱 MoMo</MenuItem>
										<MenuItem value="VNPAY">💸 VNPay</MenuItem>
									</Select>
								</FormControl>
							</div>
						</div>

						{/* Locked fields in edit dialog — chỉ render khi đã có data */}
						{selectedInvoice && (
							<div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "14px", background: T.goldBg, borderRadius: 14, border: `1.5px solid ${T.goldBorder}`, boxShadow: "0 4px 12px rgba(184, 134, 11, 0.08)" }}>
								<div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: `1px solid ${T.goldBorder}` }}>
									<LockIcon sx={{ fontSize: 16, color: T.gold }} />
									<span style={{ fontSize: 12, color: T.gold, fontWeight: 700 }}>Thông tin chỉ đọc</span>
								</div>
								<div>
									<div className="inv-label" style={{ marginBottom: 6, color: T.gold }}>🎫 Mã voucher</div>
									<div>
										{getVoucherDisplay(selectedInvoice)
											? <span className="tag tag-gold" style={{ fontSize: 12, fontWeight: 600 }}>🎫 {getVoucherDisplay(selectedInvoice)}</span>
											: <span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Không áp dụng</span>}
									</div>
								</div>
								<div>
									<div className="inv-label" style={{ marginBottom: 6, color: T.gold }}>🔧 Phiếu sửa chữa</div>
									<div>
										{getTicketDisplay(selectedInvoice)
											? <span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>🔧 {getTicketDisplay(selectedInvoice)}</span>
											: <span style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic" }}>Không liên kết</span>}
									</div>
								</div>
							</div>
						)}
					</DialogContent>
					<DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${T.goldBorder}`, background: "linear-gradient(90deg, transparent, rgba(192, 98, 10, 0.02))" }}>
						<button className="inv-btn" onClick={() => setOpenDialog(false)} style={{ marginRight: "auto" }}>✕ Hủy</button>
						<button className="inv-btn primary" onClick={handleSubmit} style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.orange})`, borderColor: T.gold }}>
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