import { useState, useEffect, useRef } from "react";
import {
	Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
	TableHead, TableRow, Paper, IconButton, Chip, Avatar, Dialog,
	DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
	Grid, Tabs, Tab, Badge, Tooltip, CircularProgress, Snackbar,
	Alert, Divider, Stack, InputAdornment, FormControlLabel, Switch,
	Card, CardMedia, ImageList, ImageListItem, ImageListItemBar,
	Skeleton, Fade, Zoom, alpha, useTheme
} from "@mui/material";
import {
	Add, Edit, Delete, Search, Close, CloudUpload, DirectionsCar,
	LocalGasStation, Settings, SquareFoot, AirlineSeatReclineNormal,
	Image as ImageIcon, Visibility, FilterList, Refresh, AccessTime,
	Build, Business, Save, Info as InfoIcon,
	Settings as SettingsIcon,
	Speed as SpeedIcon,
	Straighten as StraightenIcon,
	Layers as LayersIcon,
	Chair as ChairIcon,
	DirectionsCar as SteeringIcon,
	LocalGasStation as LocalGasStationIcon,
	Business as BusinessIcon,
	Flag as FlagIcon,
	Public as PublicIcon,
	LocalOffer as LocalOfferIcon,
	DateRange as DateRangeIcon,
	Percent as PercentIcon,
	Event as EventIcon,
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
	Schedule as ScheduleIcon,
} from "@mui/icons-material";
import {
	getAllShowroomVehicles, getShowroomVehicleById, createShowroomVehicle,
	updateShowroomVehicle, deleteShowroomVehicle, uploadVehicleImages,
	deleteVehicleImage, createEngineSpec, updateEngineSpec, createFuelSpec,
	updateFuelSpec, createSteeringSpec, updateSteeringSpec, createSizeSpec,
	updateSizeSpec, createInteriorSpec, updateInteriorSpec
} from "../../services/showroom.service";
import {
	getAllBrands,
	createBrand,
	updateBrand,
	deleteBrand
} from "../../services/brand.service";

import {
	getAllServices,
	createService,
	updateService,
	deleteService
} from "../../services/service.service";

import {
	getAllVouchers,
	createVoucher,
	updateVoucher,
	deleteVoucher
} from "../../services/voucher.service";

// ─── Theme tokens (dark/light aware) ──────────────────────────────────────────
function getShowroomColors(isDark) {
	return {
		primary: isDark ? "#8ca8ff" : "#1A237E",
		accent: isDark ? "#9fa8da" : "#5C6BC0",
		surface: isDark ? "#1a1f2e" : "#F8F9FE",
		cardBg: isDark ? "#1a1f2e" : "#FFFFFF",
		border: isDark ? "rgba(255,255,255,0.1)" : "#E8EAF6",
		text: isDark ? "#e2e8f0" : "#1A1A2E",
		muted: isDark ? "#94a3b8" : "#7986CB",
		danger: isDark ? "#f87171" : "#EF5350",
		success: isDark ? "#4ade80" : "#26A69A",
		warning: isDark ? "#fb923c" : "#FFA726",
	};
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (v) =>
	v ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v) : "—";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const imgSrc = (path) => {
	if (!path) return null;
	if (path.startsWith('http')) return path;
	if (path.startsWith('/')) return `${API_BASE}${path}`;
	if (path.startsWith('uploads/')) return `${API_BASE}/${path}`;
	return `${API_BASE}/uploads/${path}`;
};

// Component xử lý ảnh với fallback
const VehicleImage = ({ src, alt, sxProps = {} }) => {
	const [error, setError] = useState(false);

	if (!src || error) {
		return (
			<Box sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: alpha(COLORS.primary, 0.08),
				...sxProps
			}}>
				<DirectionsCar sx={{ color: COLORS.muted, fontSize: 28 }} />
			</Box>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			style={{ width: '100%', height: '100%', objectFit: 'cover' }}
			onError={() => setError(true)}
		/>
	);
};

// Utility Components (defined outside component)
const InfoRow = ({ label, value, bold, color, lineThrough }) => value ? (
	<Stack direction="row" justifyContent="space-between" alignItems="center">
		<Typography variant="caption" color="text.secondary">{label}</Typography>
		<Typography variant="body2" fontWeight={bold ? 700 : 400} color={color || "text.primary"} sx={{ textDecoration: lineThrough ? "line-through" : "none" }}>{value}</Typography>
	</Stack>
) : null;

const SpecGrid = ({ data }) => (
	<Grid container spacing={1.5}>
		{data.filter(d => d.value != null).map(d => (
			<Grid item xs={6} key={d.label}>
				<Box sx={{ p: 1.5, bgcolor: "background.paper", borderRadius: 2, border: `1px solid ${COLORS.border}` }}>
					<Typography variant="caption" color="text.secondary" fontWeight={600}>{d.label.toUpperCase()}</Typography>
					<Typography fontWeight={700} fontSize={14} mt={0.3}>{d.value || "—"}</Typography>
				</Box>
			</Grid>
		))}
	</Grid>
);

const EmptySpec = ({ label }) => (
	<Box sx={{ textAlign: "center", py: 4 }}><Typography color="text.secondary" fontSize={14}>{label}</Typography></Box>
);

const fieldSx = {
	"& .MuiInputBase-root": { fontFamily: "'DM Sans', sans-serif", borderRadius: 2 },
	"& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif" },
};

const FField = ({ label, value, onChange, type = "text", multiline = false, rows = 1, placeholder = "" }) => (
	<TextField
		size="small"
		fullWidth
		label={label}
		type={type}
		value={value}
		onChange={e => onChange(e.target.value)}
		multiline={multiline}
		rows={rows}
		placeholder={placeholder}
		sx={fieldSx}
	/>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ShowroomPage() {
	const muiTheme = useTheme();
	const COLORS = getShowroomColors(muiTheme.palette.mode === "dark");

	// Tab chính
	const [mainTab, setMainTab] = useState(0); // 0: Xe, 1: Dịch vụ

	// State cho xe
	const [vehicles, setVehicles] = useState([]);
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [editTarget, setEditTarget] = useState(null);
	const [activeSpecTab, setActiveSpecTab] = useState("info");
	const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
	const [submitting, setSubmitting] = useState(false);

	const [services, setServices] = useState([]);
	const [servicesLoading, setServicesLoading] = useState(false);
	const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [serviceForm, setServiceForm] = useState({ name: "", price: "", duration: "", status: true, description: "" });
	const [serviceSubmitting, setServiceSubmitting] = useState(false);
	const [serviceFilter, setServiceFilter] = useState("all");

	// State cho nhiều ảnh
	const [multipleImages, setMultipleImages] = useState([]);
	const [multipleImagesPreview, setMultipleImagesPreview] = useState([]);

	const [vouchers, setVouchers] = useState([]);
	const [vouchersLoading, setVouchersLoading] = useState(false);
	const [voucherFilter, setVoucherFilter] = useState("all"); // all, active, disable
	const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
	const [editingVoucher, setEditingVoucher] = useState(null);
	const [voucherForm, setVoucherForm] = useState({
		code: "",
		from: "",
		to: "",
		percent: "",
		event: "",
		is_available: true
	});
	const [voucherSubmitting, setVoucherSubmitting] = useState(false);
	const [voucherDeleteOpen, setVoucherDeleteOpen] = useState(false);
	const [voucherToDelete, setVoucherToDelete] = useState(null);

	// Form state cho xe
	const emptyForm = {
		name: "",
		year: "",
		old_price: "",
		new_price: "",
		status: "1",
		color: "",
		latest_odo: "",
		description: "",
		brand_id: "",
		thumbnail: null,
	};
	const [form, setForm] = useState(emptyForm);
	const [thumbnailPreview, setThumbnailPreview] = useState(null);
	const [brandsData, setBrandsData] = useState([]);
	const [brandsLoading, setBrandsLoading] = useState(false);
	const [brandDialogOpen, setBrandDialogOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState(null);
	const [brandForm, setBrandForm] = useState({
		name: "",
		country: "",
		logo_url: null
	});
	const [brandLogoPreview, setBrandLogoPreview] = useState(null);
	const [brandSubmitting, setBrandSubmitting] = useState(false);
	const [brandDeleteOpen, setBrandDeleteOpen] = useState(false);
	const [brandToDelete, setBrandToDelete] = useState(null);

	// Spec forms
	const emptyEngine = { displacement: "", cylinders: "", power: "", torque: "", transmission: "" };
	const emptyFuel = { type: "", tank_capacity: "", consumption: "" };
	const emptySteering = { type: "", turning_radius: "" };
	const emptySize = { length: "", width: "", height: "", wheelbase: "", weight: "" };
	const emptyInterior = { seats: "", screen_size: "", air_conditioner: "" };
	const [engineForm, setEngineForm] = useState(emptyEngine);
	const [fuelForm, setFuelForm] = useState(emptyFuel);
	const [steeringForm, setSteeringForm] = useState(emptySteering);
	const [sizeForm, setSizeForm] = useState(emptySize);
	const [interiorForm, setInteriorForm] = useState(emptyInterior);

	// ── Fetch ──────────────────────────────────────────────────────────────────
	const fetchAll = async () => {
		setLoading(true);
		try {
			const res = await getAllShowroomVehicles();
			setVehicles(res.data || []);
		} catch {
			showSnack("Không thể tải danh sách xe", "error");
		} finally {
			setLoading(false);
		}
	};

	const fetchServices = async () => {
		setServicesLoading(true);
		try {
			let isDeletedParam = "all";
			if (serviceFilter === "active") {
				isDeletedParam = "false";
			} else if (serviceFilter === "inactive") {
				isDeletedParam = "true";
			}

			const res = await getAllServices(isDeletedParam);
			const servicesData = res.data || [];

			const formattedServices = servicesData.map(service => ({
				id: service.id,
				name: service.name,
				price: service.price,
				duration: service.duration || "60 phút",
				status: !service.is_deleted,
				description: service.description || "",
				is_deleted: service.is_deleted
			}));
			setServices(formattedServices);
		} catch (error) {
			console.error("Lỗi tải dịch vụ:", error);
			showSnack("Không thể tải danh sách dịch vụ", "error");
		} finally {
			setServicesLoading(false);
		}
	};

	const fetchBrands = async () => {
		setBrandsLoading(true);
		try {
			const res = await getAllBrands();
			setBrandsData(res.data || []);
		} catch (error) {
			console.error("Lỗi tải hãng xe:", error);
			showSnack("Không thể tải danh sách hãng xe", "error");
		} finally {
			setBrandsLoading(false);
		}
	};

	const fetchVouchers = async () => {
		setVouchersLoading(true);
		try {
			const res = await getAllVouchers(voucherFilter);
			setVouchers(res.data || []);
		} catch (error) {
			console.error("Lỗi tải voucher:", error);
			showSnack("Không thể tải danh sách voucher", "error");
		} finally {
			setVouchersLoading(false);
		}
	};

	useEffect(() => {
		fetchAll();
		fetchBrands();
	}, []);

	useEffect(() => {
		if (mainTab === 1) {
			fetchBrands();
		}
	}, [mainTab]);

	useEffect(() => {
		if (mainTab === 2) {
			fetchServices();
		}
	}, [mainTab, serviceFilter]);

	useEffect(() => {
		if (mainTab === 3) {
			fetchVouchers();
		}
	}, [mainTab, voucherFilter]);

	const openDetail = async (id) => {
		try {
			const res = await getShowroomVehicleById(id);
			setSelected(res.data);
			setDetailOpen(true);
		} catch {
			showSnack("Không tải được chi tiết xe", "error");
		}
	};

	const showSnack = (msg, severity = "success") =>
		setSnack({ open: true, msg, severity });

	const openCreate = () => {
		setEditTarget(null);
		setForm(emptyForm);
		setThumbnailPreview(null);
		setMultipleImages([]);
		setMultipleImagesPreview([]);
		setEngineForm(emptyEngine);
		setFuelForm(emptyFuel);
		setSteeringForm(emptySteering);
		setSizeForm(emptySize);
		setInteriorForm(emptyInterior);
		setActiveSpecTab("info");
		setFormOpen(true);
	};

	const openEdit = async (id) => {
		try {
			const res = await getShowroomVehicleById(id);
			const v = res.data;
			setEditTarget(v);
			setForm({
				name: v.name || "",
				year: v.year || "",
				old_price: v.old_price || "",
				new_price: v.new_price || "",
				status: String(v.status ?? "1"),
				color: v.color || "",
				latest_odo: v.latest_odo || "",
				description: v.description || "",
				brand_id: v.brand_id || "",
				thumbnail: null,
			});
			setThumbnailPreview(imgSrc(v.thumbnail));
			setMultipleImages([]);
			setMultipleImagesPreview([]);
			setEngineForm(v.engine_spec ? { ...v.engine_spec } : emptyEngine);
			setFuelForm(v.fuel ? { ...v.fuel } : emptyFuel);
			setSteeringForm(v.steering_system ? { ...v.steering_system } : emptySteering);
			setSizeForm(v.size ? { ...v.size } : emptySize);
			setInteriorForm(v.interior ? { ...v.interior } : emptyInterior);
			setActiveSpecTab("info");
			setFormOpen(true);
		} catch {
			showSnack("Lỗi khi tải thông tin xe", "error");
		}
	};

	// ── Submit main form ───────────────────────────────────────────────────────
	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			if (!form.brand_id) {
				showSnack("Vui lòng chọn thương hiệu", "error");
				setSubmitting(false);
				return;
			}

			const fd = new FormData();
			Object.entries(form).forEach(([k, v]) => {
				if (k === "thumbnail" && v) {
					fd.append(k, v);
				} else if (k !== "thumbnail" && v !== "" && v !== null && v !== undefined) {
					fd.append(k, v);
				}
			});

			let vehicleId;
			if (editTarget) {
				await updateShowroomVehicle(editTarget.id, fd);
				vehicleId = editTarget.id;
				showSnack("Cập nhật xe thành công!");
			} else {
				const res = await createShowroomVehicle(fd);
				vehicleId = res.data?.id;
				showSnack("Thêm xe thành công!");
			}

			if (vehicleId && multipleImages.length > 0) {
				try {
					await uploadVehicleImages(vehicleId, multipleImages);
					showSnack("Tải ảnh lên thành công!", "success");
				} catch (err) {
					console.error("Lỗi upload ảnh:", err);
				}
			}

			if (vehicleId) {
				const specOps = [
					[engineForm, createEngineSpec, updateEngineSpec, editTarget?.engine_spec],
					[fuelForm, createFuelSpec, updateFuelSpec, editTarget?.fuel],
					[steeringForm, createSteeringSpec, updateSteeringSpec, editTarget?.steering_system],
					[sizeForm, createSizeSpec, updateSizeSpec, editTarget?.size],
					[interiorForm, createInteriorSpec, updateInteriorSpec, editTarget?.interior],
				];
				for (const [data, create, update, existing] of specOps) {
					const hasData = Object.values(data).some(v => v !== "" && v != null);
					if (hasData) {
						try {
							if (existing) await update(vehicleId, data);
							else await create(vehicleId, data);
						} catch { /* skip spec errors */ }
					}
				}
			}

			setFormOpen(false);
			fetchAll();
		} catch (e) {
			console.error("❌ Lỗi submit:", e.response?.data);
			const errorMessage = e.response?.data?.errors?.[0]?.msg ||
				e.response?.data?.message ||
				"Có lỗi xảy ra";
			showSnack(errorMessage, "error");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteShowroomVehicle(deleteOpen.id);
			showSnack("Đã xóa xe thành công");
			setDeleteOpen(false);
			fetchAll();
		} catch {
			showSnack("Xóa thất bại", "error");
		}
	};

	const handleImageUpload = async (files) => {
		if (!selected) return;
		try {
			await uploadVehicleImages(selected.id, Array.from(files));
			showSnack("Upload ảnh thành công!");
			const res = await getShowroomVehicleById(selected.id);
			setSelected(res.data);
		} catch {
			showSnack("Upload ảnh thất bại", "error");
		}
	};

	const handleDeleteImage = async (imageId) => {
		try {
			await deleteVehicleImage(selected.id, imageId);
			showSnack("Đã xóa ảnh");
			const res = await getShowroomVehicleById(selected.id);
			setSelected(res.data);
		} catch {
			showSnack("Xóa ảnh thất bại", "error");
		}
	};

	const handleMultipleImagesChange = (e) => {
		const files = Array.from(e.target.files);
		setMultipleImages(files);
		const previews = files.map(file => URL.createObjectURL(file));
		setMultipleImagesPreview(previews);
	};

	const removeImageFromPreview = (index) => {
		const newImages = [...multipleImages];
		const newPreviews = [...multipleImagesPreview];
		URL.revokeObjectURL(multipleImagesPreview[index]);
		newImages.splice(index, 1);
		newPreviews.splice(index, 1);
		setMultipleImages(newImages);
		setMultipleImagesPreview(newPreviews);
	};

	const handleSaveBrand = async () => {
		if (!brandForm.name || !brandForm.country) {
			showSnack("Vui lòng nhập đầy đủ tên hãng và quốc gia", "error");
			return;
		}

		setBrandSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("name", brandForm.name);
			formData.append("country", brandForm.country);
			if (brandForm.logo_url) {
				formData.append("logo_url", brandForm.logo_url);
			}

			if (editingBrand) {
				await updateBrand(editingBrand.id, formData);
				showSnack("Cập nhật hãng xe thành công!");
			} else {
				await createBrand(formData);
				showSnack("Thêm hãng xe thành công!");
			}

			setBrandDialogOpen(false);
			setEditingBrand(null);
			setBrandForm({ name: "", country: "", logo_url: null });
			setBrandLogoPreview(null);
			await fetchBrands();
		} catch (error) {
			console.error("Lỗi lưu hãng xe:", error);
			showSnack(error?.response?.data?.message || "Có lỗi xảy ra", "error");
		} finally {
			setBrandSubmitting(false);
		}
	};

	const handleDeleteBrand = async () => {
		if (!brandToDelete) return;

		try {
			await deleteBrand(brandToDelete.id);
			showSnack("Đã xóa hãng xe thành công");
			setBrandDeleteOpen(false);
			setBrandToDelete(null);
			await fetchBrands();
		} catch (error) {
			console.error("Lỗi xóa hãng:", error);
			showSnack(error?.response?.data?.message || "Xóa hãng xe thất bại", "error");
		}
	};

	const handleBrandLogoChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setBrandForm((prev) => ({ ...prev, logo_url: file }));
			setBrandLogoPreview(URL.createObjectURL(file));
		}
	};

	const handleSaveVoucher = async () => {
		if (!voucherForm.code || !voucherForm.from || !voucherForm.to || !voucherForm.percent) {
			showSnack("Vui lòng nhập đầy đủ thông tin bắt buộc", "error");
			return;
		}

		if (new Date(voucherForm.to) <= new Date(voucherForm.from)) {
			showSnack("Ngày kết thúc phải lớn hơn ngày bắt đầu", "error");
			return;
		}

		const percent = parseInt(voucherForm.percent);
		if (isNaN(percent) || percent < 0 || percent > 100) {
			showSnack("Phần trăm giảm giá phải từ 0 đến 100", "error");
			return;
		}

		setVoucherSubmitting(true);
		try {
			const payload = {
				code: voucherForm.code.toUpperCase(),
				from: voucherForm.from,
				to: voucherForm.to,
				percent: percent,
				event: voucherForm.event || "",
				is_available: voucherForm.is_available ? 1 : 0
			};

			if (editingVoucher) {
				await updateVoucher(editingVoucher.id, payload);
				showSnack("Cập nhật voucher thành công!");
			} else {
				await createVoucher(payload);
				showSnack("Thêm voucher thành công!");
			}

			setVoucherDialogOpen(false);
			setEditingVoucher(null);
			setVoucherForm({
				code: "",
				from: "",
				to: "",
				percent: "",
				event: "",
				is_available: true
			});
			await fetchVouchers();
		} catch (error) {
			console.error("Lỗi lưu voucher:", error);
			const errorMessage = error?.response?.data?.message ||
				error?.response?.data?.errors?.[0]?.msg ||
				"Có lỗi xảy ra";
			showSnack(errorMessage, "error");
		} finally {
			setVoucherSubmitting(false);
		}
	};

	const handleDeleteVoucher = async () => {
		if (!voucherToDelete) return;

		try {
			await deleteVoucher(voucherToDelete.id);
			showSnack("Đã xóa voucher thành công");
			setVoucherDeleteOpen(false);
			setVoucherToDelete(null);
			await fetchVouchers();
		} catch (error) {
			console.error("Lỗi xóa voucher:", error);
			showSnack(error?.response?.data?.message || "Xóa voucher thất bại", "error");
		}
	};

	const getVoucherStatus = (voucher) => {
		const now = new Date();
		const fromDate = new Date(voucher.from);
		const toDate = new Date(voucher.to);

		if (voucher.is_available !== 1 && voucher.is_available !== true) {
			return { label: "Đã tắt", color: COLORS.warning, icon: <CancelIcon /> };
		}
		if (now < fromDate) {
			return { label: "Sắp diễn ra", color: COLORS.accent, icon: <ScheduleIcon /> };
		}
		if (now > toDate) {
			return { label: "Đã hết hạn", color: COLORS.danger, icon: <CancelIcon /> };
		}
		return { label: "Đang hoạt động", color: COLORS.success, icon: <CheckCircleIcon /> };
	};

	const handleSaveService = async () => {
		setServiceSubmitting(true);
		try {
			if (!serviceForm.name || !serviceForm.price) {
				showSnack("Vui lòng nhập đầy đủ tên dịch vụ và giá", "error");
				return;
			}

			const price = parseFloat(serviceForm.price);
			if (isNaN(price) || price <= 0) {
				showSnack("Giá dịch vụ phải lớn hơn 0", "error");
				return;
			}

			const payload = {
				name: serviceForm.name.trim(),
				price: price,
				description: serviceForm.description?.trim() || "",
				is_deleted: !serviceForm.status ? 1 : 0
			};

			if (editingService) {
				await updateService(editingService.id, payload);
				showSnack("Cập nhật dịch vụ thành công!");
			} else {
				await createService(payload);
				showSnack("Thêm dịch vụ thành công!");
			}

			setServiceDialogOpen(false);
			setEditingService(null);
			setServiceForm({ name: "", price: "", duration: "60", status: true, description: "" });
			await fetchServices();
		} catch (error) {
			console.error("Lỗi lưu dịch vụ:", error);
			const errorMessage = error?.response?.data?.message ||
				error?.response?.data?.errors?.[0]?.msg ||
				"Có lỗi xảy ra";
			showSnack(errorMessage, "error");
		} finally {
			setServiceSubmitting(false);
		}
	};

	const handleDeleteService = async (id) => {
		try {
			await deleteService(id);
			showSnack("Đã xóa dịch vụ");
			await fetchServices();
		} catch (error) {
			console.error("Lỗi xóa dịch vụ:", error);
			showSnack("Xóa dịch vụ thất bại", "error");
		}
	};

	const openServiceDialog = (service = null) => {
		if (service) {
			setEditingService(service);
			setServiceForm({
				name: service.name || "",
				price: service.price || "",
				duration: service.duration || "60",
				status: !service.is_deleted,
				description: service.description || ""
			});
		} else {
			setEditingService(null);
			setServiceForm({ name: "", price: "", duration: "60", status: true, description: "" });
		}
		setServiceDialogOpen(true);
	};

	const openBrandDialog = (brand = null) => {
		if (brand) {
			setEditingBrand(brand);
			setBrandForm({
				name: brand.name || "",
				country: brand.country || "",
				logo_url: null,
			});
			setBrandLogoPreview(imgSrc(brand.logo_url));
		} else {
			setEditingBrand(null);
			setBrandForm({ name: "", country: "", logo_url: null });
			setBrandLogoPreview(null);
		}
		setBrandDialogOpen(true);
	};

	const openVoucherDialog = (voucher = null) => {
		if (voucher) {
			setEditingVoucher(voucher);
			setVoucherForm({
				code: voucher.code || "",
				from: voucher.from || "",
				to: voucher.to || "",
				percent: voucher.percent || "",
				event: voucher.event || "",
				is_available: voucher.is_available === 1 || voucher.is_available === true
			});
		} else {
			setEditingVoucher(null);
			setVoucherForm({
				code: "",
				from: "",
				to: "",
				percent: "",
				event: "",
				is_available: true
			});
		}
		setVoucherDialogOpen(true);
	};

	const filtered = vehicles.filter(v =>
		v.name?.toLowerCase().includes(search.toLowerCase()) ||
		v.brand?.name?.toLowerCase().includes(search.toLowerCase())
	);

	// ─────────────────────────────────────────────────────────────────────────
	return (
		<Box sx={{ minHeight: "100vh", bgcolor: "background.default", fontFamily: "'DM Sans', sans-serif" }}>
			{/* Header */}
			<Box sx={{
				px: 4, py: 3,
				background: muiTheme.palette.mode === "dark"
					? `linear-gradient(135deg, #1e2a5e 0%, #2d3f8c 100%)`
					: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
				color: "#fff",
				boxShadow: "0 4px 20px rgba(26,35,126,0.3)"
			}}>
				<Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
					<Stack direction="row" spacing={2} alignItems="center">
						<DirectionsCar sx={{ fontSize: 32 }} />
						<Box>
							<Typography variant="h5" fontWeight={800} fontFamily="'DM Sans', sans-serif">
								Quản lý Showroom
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.8 }}>
								Quản lý xe & dịch vụ
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</Box>

			{/* Main Tabs */}
			<Box sx={{ px: 4, borderBottom: 1, borderColor: COLORS.border, bgcolor: "background.paper" }}>
				<Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: COLORS.primary } }}>
					<Tab label="Quản lý xe" icon={<DirectionsCar />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600 }} />
					<Tab label="Quản lý hãng xe" icon={<Build />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600 }} />
					<Tab label="Quản lý dịch vụ" icon={<BusinessIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600 }} />
					<Tab label="Quản lý voucher" icon={<LocalOfferIcon />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600 }} />
				</Tabs>
			</Box>

			{/* Tab: Quản lý xe */}
			{mainTab === 0 && (
				<Box>
					<Box sx={{ px: 4, py: 3, display: "flex", gap: 2.5, flexWrap: "wrap" }}>
						{[
							{ label: "Tổng xe", value: vehicles.length, color: COLORS.primary },
							{ label: "Đang trưng bày", value: vehicles.filter(v => v.status == 1).length, color: COLORS.success },
							{ label: "Ngừng trưng bày", value: vehicles.filter(v => v.status == 0).length, color: COLORS.warning },
						].map(stat => (
							<Paper key={stat.label} sx={{
								px: 3, py: 2, borderRadius: 3, display: "flex",
								alignItems: "center", gap: 2, border: `1px solid ${alpha(stat.color, 0.2)}`,
								boxShadow: `0 4px 12px ${alpha(stat.color, 0.08)}`,
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								cursor: "pointer",
								background: `linear-gradient(135deg, ${alpha(stat.color, 0.02)} 0%, ${alpha(stat.color, 0.01)} 100%)`,
								"&:hover": {
									boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`,
									transform: "translateY(-4px)",
									borderColor: stat.color
								}
							}}>
								<Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: stat.color }} />
								<Typography variant="body2" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
								<Box sx={{ flex: 1 }} />
								<Typography fontWeight={800} fontSize={18} sx={{ color: stat.color }}>
									{stat.value}
								</Typography>
							</Paper>
						))}
					</Box>

					<Box sx={{ px: 4, pb: 4 }}>
						<Paper sx={{
							borderRadius: 4,
							border: `1px solid ${COLORS.border}`,
							overflow: "hidden",
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
						}}>
							<Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: `1px solid ${COLORS.border}` }}>
								<TextField
									size="small"
									placeholder="Tìm kiếm theo tên xe, thương hiệu..."
									value={search}
									onChange={e => setSearch(e.target.value)}
									InputProps={{
										startAdornment: <InputAdornment position="start"><Search sx={{ color: COLORS.muted }} /></InputAdornment>,
										sx: { borderRadius: 3, bgcolor: "background.paper" }
									}}
									sx={{ width: 340 }}
								/>
								<Box flex={1} />
								<Tooltip title="Thêm xe mới">
									<Button variant="contained" startIcon={<Add />} onClick={openCreate}
										sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary }}>
										Thêm xe
									</Button>
								</Tooltip>
								<Tooltip title="Làm mới">
									<IconButton onClick={fetchAll} sx={{ color: COLORS.muted }}>
										<Refresh />
									</IconButton>
								</Tooltip>
							</Box>
						</Paper>

						<Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}>
							<TableContainer sx={{ maxHeight: "calc(100vh - 320px)" }}>
								<Table stickyHeader>
									<TableHead>
										<TableRow sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}>
											{["Xe", "Thương hiệu", "Năm", "Giá bán", "Màu", "ODO", "Trạng thái", ""].map(h => (
												<TableCell key={h} sx={{ fontWeight: 700, color: COLORS.primary, fontSize: 13, borderBottom: `2px solid ${COLORS.border}` }}>
													{h}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{loading ? Array(5).fill(0).map((_, i) => (
											<TableRow key={i}>{Array(8).fill(0).map((_, j) => (<TableCell key={j}><Skeleton height={40} /></TableCell>))}</TableRow>
										)) : filtered.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} align="center" sx={{ py: 6 }}>
													<DirectionsCar sx={{ fontSize: 56, color: COLORS.border, mb: 2, display: "block", mx: "auto", opacity: 0.5 }} />
													<Typography color="text.secondary" fontWeight={500} sx={{ mb: 3 }}>
														Không tìm thấy xe nào
													</Typography>
													<Button
														variant="contained"
														startIcon={<Add />}
														onClick={openCreate}
														sx={{
															borderRadius: 2,
															textTransform: "none",
															bgcolor: COLORS.primary,
															fontWeight: 600,
															px: 3
														}}
													>
														Thêm xe ngay
													</Button>
												</TableCell>
											</TableRow>
										) : filtered.map((v, idx) => (
											<Fade in key={v.id} timeout={200 + idx * 50}>
												<TableRow sx={{ "&:hover": { bgcolor: alpha(COLORS.accent, 0.04) } }}>
													<TableCell>
														<Stack direction="row" spacing={1.5} alignItems="center">
															<Box sx={{ width: 70, height: 52, borderRadius: 2, overflow: "hidden", bgcolor: COLORS.border, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
																<VehicleImage src={imgSrc(v.thumbnail)} alt={v.name} />
															</Box>
															<Typography fontWeight={600} fontSize={14}>{v.name}</Typography>
														</Stack>
													</TableCell>
													<TableCell>
														<Stack direction="row" spacing={1} alignItems="center">
															{v.brand?.logo_url && <Avatar src={imgSrc(v.brand.logo_url)} sx={{ width: 20, height: 20 }} />}
															<Typography fontSize={13}>{v.brand?.name || v.brand_id || "—"}</Typography>
														</Stack>
													</TableCell>
													<TableCell>{v.year ?? "—"}</TableCell>
													<TableCell>
														<Typography fontSize={13} fontWeight={600} color={COLORS.primary}>{formatPrice(v.new_price)}</Typography>
														{v.old_price && Number(v.old_price) !== Number(v.new_price) && (
															<Typography fontSize={11} color="text.secondary" sx={{ textDecoration: "line-through" }}>{formatPrice(v.old_price)}</Typography>
														)}
													</TableCell>
													<TableCell>
														{v.color ? (<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
															<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: v.color, border: "1px solid #ccc" }} />
															<Typography fontSize={13}>{v.color}</Typography>
														</Box>) : "—"}
													</TableCell>
													<TableCell>{v.latest_odo != null ? `${Number(v.latest_odo).toLocaleString("vi-VN")} km` : "—"}</TableCell>
													<TableCell>
														<Chip label={v.status == 1 ? "Đang trưng bày" : "Ngừng trưng bày"} size="small"
															sx={{ bgcolor: v.status == 1 ? alpha(COLORS.success, 0.12) : alpha(COLORS.warning, 0.12), color: v.status == 1 ? COLORS.success : COLORS.warning, fontWeight: 700, fontSize: 11 }} />
													</TableCell>
													<TableCell align="right">
														<Stack direction="row" spacing={0.5} justifyContent="flex-end">
															<Tooltip title="Xem chi tiết"><IconButton size="small" onClick={() => openDetail(v.id)} sx={{ color: COLORS.accent }}><Visibility fontSize="small" /></IconButton></Tooltip>
															<Tooltip title="Chỉnh sửa"><IconButton size="small" onClick={() => openEdit(v.id)} sx={{ color: COLORS.primary }}><Edit fontSize="small" /></IconButton></Tooltip>
															<Tooltip title="Xóa"><IconButton size="small" onClick={() => setDeleteOpen(v)} sx={{ color: COLORS.danger }}><Delete fontSize="small" /></IconButton></Tooltip>
														</Stack>
													</TableCell>
												</TableRow>
											</Fade>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Box>
				</Box>
			)}

			{/* Tab: Quản lý hãng xe */}
			{mainTab === 1 && (
				<Box sx={{ p: 4 }}>
					<Paper sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
						<Box sx={{
							px: 3,
							py: 2,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderBottom: `1px solid ${COLORS.border}`,
							bgcolor: "background.paper"
						}}>
							<Typography fontWeight={700} fontSize={18}>Danh sách hãng xe</Typography>
							<Button variant="contained" startIcon={<Add />} onClick={() => openBrandDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary }}>
								Thêm hãng xe
							</Button>
						</Box>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}>
										<TableCell sx={{ fontWeight: 700 }}>Logo</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Tên hãng</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Quốc gia</TableCell>
										<TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{brandsLoading ? (
										<TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
									) : brandsData.length === 0 ? (
										<TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}>
											<BusinessIcon sx={{ fontSize: 56, color: COLORS.border, mb: 2, opacity: 0.5 }} />
											<Typography color="text.secondary" fontWeight={500} sx={{ mb: 3 }}>Chưa có hãng xe nào</Typography>
											<Button variant="contained" startIcon={<Add />} onClick={() => openBrandDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary, fontWeight: 600, px: 3 }}>Thêm hãng xe</Button>
										</TableCell></TableRow>
									) : brandsData.map(brand => (
										<TableRow key={brand.id} sx={{ "&:hover": { bgcolor: alpha(COLORS.accent, 0.04) } }}>
											<TableCell>
												<Box sx={{ width: 50, height: 50, borderRadius: 2, overflow: "hidden", bgcolor: COLORS.border }}>
													{brand.logo_url ? <img src={imgSrc(brand.logo_url)} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = 'none'} /> : <BusinessIcon sx={{ color: COLORS.muted, p: 1, width: "100%", height: "100%" }} />}
												</Box>
											</TableCell>
											<TableCell><Typography fontWeight={600}>{brand.name}</Typography></TableCell>
											<TableCell><Stack direction="row" spacing={1} alignItems="center"><PublicIcon sx={{ fontSize: 16, color: COLORS.muted }} /><Typography>{brand.country}</Typography></Stack></TableCell>
											<TableCell align="right">
												<Stack direction="row" spacing={0.5} justifyContent="flex-end">
													<Tooltip title="Chỉnh sửa"><IconButton size="small" onClick={() => openBrandDialog(brand)} sx={{ color: COLORS.primary }}><Edit fontSize="small" /></IconButton></Tooltip>
													<Tooltip title="Xóa"><IconButton size="small" onClick={() => { setBrandToDelete(brand); setBrandDeleteOpen(true); }} sx={{ color: COLORS.danger }}><Delete fontSize="small" /></IconButton></Tooltip>
												</Stack>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Box>
			)}

			{/* Tab: Quản lý dịch vụ */}
			{mainTab === 2 && (
				<Box sx={{ p: 4 }}>
					<Paper sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
						<Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, bgcolor: "background.paper" }}>
							<Typography fontWeight={700} fontSize={18}>Danh sách dịch vụ</Typography>
							<Button variant="contained" startIcon={<Add />} onClick={() => openServiceDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary }}>Thêm dịch vụ</Button>
						</Box>
						<Box sx={{ px: 3, pt: 2, borderBottom: `1px solid ${COLORS.border}` }}>
							<Tabs value={serviceFilter} onChange={(_, v) => setServiceFilter(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: COLORS.primary } }}>
								<Tab value="all" label="Tất cả" /><Tab value="active" label="Đang cung cấp" /><Tab value="inactive" label="Ngưng cung cấp" />
							</Tabs>
						</Box>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}>
										<TableCell sx={{ fontWeight: 700 }}>Tên dịch vụ</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Giá (VNĐ)</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
										<TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{servicesLoading ? (
										<TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
									) : services.length === 0 ? (
										<TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>
											<Build sx={{ fontSize: 56, color: COLORS.border, mb: 2, opacity: 0.5 }} />
											<Typography color="text.secondary" fontWeight={500} sx={{ mb: 3 }}>Không có dịch vụ nào</Typography>
											<Button variant="contained" startIcon={<Add />} onClick={() => openServiceDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary, fontWeight: 600, px: 3 }}>Thêm dịch vụ</Button>
										</TableCell></TableRow>
									) : services.map(service => (
										<TableRow key={service.id}>
											<TableCell><Typography fontWeight={500}>{service.name}</Typography></TableCell>
											<TableCell><Typography variant="body2" color="text.secondary">{service.description || "—"}</Typography></TableCell>
											<TableCell>{formatPrice(service.price)}</TableCell>
											<TableCell>{service.duration}</TableCell>
											<TableCell><Chip label={service.is_deleted ? "Ngưng cung cấp" : "Đang cung cấp"} size="small" sx={{ bgcolor: !service.is_deleted ? alpha(COLORS.success, 0.12) : alpha(COLORS.warning, 0.12), color: !service.is_deleted ? COLORS.success : COLORS.warning }} /></TableCell>
											<TableCell align="right">
												<IconButton size="small" onClick={() => openServiceDialog(service)} sx={{ color: COLORS.primary }}><Edit fontSize="small" /></IconButton>
												<IconButton size="small" onClick={() => handleDeleteService(service.id)} sx={{ color: COLORS.danger }}><Delete fontSize="small" /></IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Box>
			)}

			{/* Tab: Quản lý voucher */}
			{mainTab === 3 && (
				<Box sx={{ p: 4 }}>
					<Paper sx={{ borderRadius: 4, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
						<Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, bgcolor: "background.paper" }}>
							<Typography fontWeight={700} fontSize={18}>Danh sách mã giảm giá</Typography>
							<Button variant="contained" startIcon={<Add />} onClick={() => openVoucherDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary }}>Thêm voucher</Button>
						</Box>
						<Box sx={{ px: 3, pt: 2, borderBottom: `1px solid ${COLORS.border}` }}>
							<Tabs value={voucherFilter} onChange={(_, v) => setVoucherFilter(v)} sx={{ "& .MuiTabs-indicator": { bgcolor: COLORS.primary } }}>
								<Tab value="all" label="Tất cả" /><Tab value="active" label="Đang hoạt động" /><Tab value="disable" label="Không hoạt động" />
							</Tabs>
						</Box>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}>
										<TableCell sx={{ fontWeight: 700 }}>Mã code</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Sự kiện</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Giảm giá</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Thời gian áp dụng</TableCell>
										<TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
										<TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{vouchersLoading ? (
										<TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
									) : vouchers.length === 0 ? (
										<TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>
											<LocalOfferIcon sx={{ fontSize: 56, color: COLORS.border, mb: 2, opacity: 0.5 }} />
											<Typography color="text.secondary" fontWeight={500} sx={{ mb: 3 }}>Chưa có voucher nào</Typography>
											<Button variant="contained" startIcon={<Add />} onClick={() => openVoucherDialog()} sx={{ borderRadius: 2, textTransform: "none", bgcolor: COLORS.primary, fontWeight: 600, px: 3 }}>Thêm voucher</Button>
										</TableCell></TableRow>
									) : vouchers.map(voucher => {
										const status = getVoucherStatus(voucher);
										return (
											<TableRow key={voucher.id} sx={{ "&:hover": { bgcolor: alpha(COLORS.accent, 0.04) } }}>
												<TableCell><Chip label={voucher.code} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, bgcolor: alpha(COLORS.primary, 0.1), color: COLORS.primary, letterSpacing: 0.5 }} /></TableCell>
												<TableCell>{voucher.event ? <Stack direction="row" spacing={1} alignItems="center"><EventIcon sx={{ fontSize: 16, color: COLORS.muted }} /><Typography variant="body2">{voucher.event}</Typography></Stack> : "—"}</TableCell>
												<TableCell><Chip icon={<PercentIcon sx={{ fontSize: 14 }} />} label={`${voucher.percent}%`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(COLORS.success, 0.1), color: COLORS.success }} /></TableCell>
												<TableCell><Stack spacing={0.5}><Stack direction="row" spacing={1} alignItems="center"><DateRangeIcon sx={{ fontSize: 14, color: COLORS.muted }} /><Typography variant="caption">{new Date(voucher.from).toLocaleDateString("vi-VN")}</Typography><Typography variant="caption">→</Typography><Typography variant="caption">{new Date(voucher.to).toLocaleDateString("vi-VN")}</Typography></Stack></Stack></TableCell>
												<TableCell><Chip icon={status.icon} label={status.label} size="small" sx={{ bgcolor: alpha(status.color, 0.12), color: status.color, fontWeight: 700, fontSize: 11 }} /></TableCell>
												<TableCell align="right">
													<Stack direction="row" spacing={0.5} justifyContent="flex-end">
														<Tooltip title="Chỉnh sửa"><IconButton size="small" onClick={() => openVoucherDialog(voucher)} sx={{ color: COLORS.primary }}><Edit fontSize="small" /></IconButton></Tooltip>
														<Tooltip title="Xóa"><IconButton size="small" onClick={() => { setVoucherToDelete(voucher); setVoucherDeleteOpen(true); }} sx={{ color: COLORS.danger }}><Delete fontSize="small" /></IconButton></Tooltip>
													</Stack>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Box>
			)}

			{/* DETAIL DIALOG */}
			<Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
				{selected && (
					<>
						<DialogTitle sx={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, color: "#fff", fontWeight: 800, display: "flex", justifyContent: "space-between" }}>
							<Stack direction="row" spacing={1.5} alignItems="center">
								<DirectionsCar /><span>{selected.name}</span>
								<Chip label={selected.brand?.name || selected.brand_id} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }} />
							</Stack>
							<IconButton onClick={() => setDetailOpen(false)} sx={{ color: "#fff" }}><Close /></IconButton>
						</DialogTitle>
						<DialogContent sx={{ p: 3 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={5}>
									<Box sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
										<VehicleImage src={imgSrc(selected.thumbnail)} alt={selected.name} sxProps={{ height: 240 }} />
									</Box>
									<Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
										<Stack spacing={1}>
											<InfoRow label="Năm SX" value={selected.year} />
											<InfoRow label="Giá mới" value={formatPrice(selected.new_price)} bold color={COLORS.primary} />
											<InfoRow label="Giá cũ" value={formatPrice(selected.old_price)} lineThrough />
											<InfoRow label="Màu sắc" value={selected.color} />
											<InfoRow label="ODO" value={selected.latest_odo != null ? `${Number(selected.latest_odo).toLocaleString("vi-VN")} km` : null} />
											<InfoRow label="Thương hiệu" value={selected.brand?.name || selected.brand_id} />
										</Stack>
									</Box>
								</Grid>
								<Grid item xs={12} md={7}>
									<Tabs value={activeSpecTab} onChange={(_, v) => setActiveSpecTab(v)} variant="scrollable" sx={{ mb: 2 }}>
										<Tab value="engine" label="Động cơ" icon={<Settings fontSize="small" />} iconPosition="start" />
										<Tab value="fuel" label="Nhiên liệu" icon={<LocalGasStation fontSize="small" />} iconPosition="start" />
										<Tab value="size" label="Kích thước" icon={<SquareFoot fontSize="small" />} iconPosition="start" />
										<Tab value="interior" label="Nội thất" icon={<AirlineSeatReclineNormal fontSize="small" />} iconPosition="start" />
										<Tab value="images" label="Thư viện ảnh" icon={<ImageIcon fontSize="small" />} iconPosition="start" />
									</Tabs>
									<Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, minHeight: 180 }}>
										{activeSpecTab === "engine" && (selected.engine_spec ? <SpecGrid data={[
											{ label: "Dung tích", value: selected.engine_spec.displacement },
											{ label: "Số xi-lanh", value: selected.engine_spec.cylinders },
											{ label: "Công suất", value: selected.engine_spec.power },
											{ label: "Mô-men xoắn", value: selected.engine_spec.torque },
											{ label: "Hộp số", value: selected.engine_spec.transmission },
										]} /> : <EmptySpec label="Chưa có thông số động cơ" />)}
										{activeSpecTab === "fuel" && (selected.fuel ? <SpecGrid data={[
											{ label: "Loại nhiên liệu", value: selected.fuel.type },
											{ label: "Dung tích bình", value: selected.fuel.tank_capacity },
											{ label: "Mức tiêu thụ", value: selected.fuel.consumption },
										]} /> : <EmptySpec label="Chưa có thông số nhiên liệu" />)}
										{activeSpecTab === "size" && (selected.size ? <SpecGrid data={[
											{ label: "Dài", value: selected.size.length },
											{ label: "Rộng", value: selected.size.width },
											{ label: "Cao", value: selected.size.height },
											{ label: "Chiều dài cơ sở", value: selected.size.wheelbase },
											{ label: "Trọng lượng", value: selected.size.weight },
										]} /> : <EmptySpec label="Chưa có thông số kích thước" />)}
										{activeSpecTab === "interior" && (selected.interior ? <SpecGrid data={[
											{ label: "Số chỗ ngồi", value: selected.interior.seats },
											{ label: "Màn hình", value: selected.interior.screen_size },
											{ label: "Điều hòa", value: selected.interior.air_conditioner },
										]} /> : <EmptySpec label="Chưa có thông số nội thất" />)}
										{activeSpecTab === "images" && (
											<Box>
												<Button size="small" startIcon={<CloudUpload />} variant="outlined" component="label" sx={{ mb: 2 }}>
													Upload ảnh
													<input type="file" hidden multiple accept="image/*" onChange={e => handleImageUpload(e.target.files)} />
												</Button>
												{selected.images?.length > 0 ? (
													<ImageList cols={3} gap={8} sx={{ maxHeight: 240 }}>
														{selected.images.map(img => (
															<ImageListItem key={img.id}>
																<img src={imgSrc(img.image_path)} alt={img.id} style={{ height: 80, objectFit: "cover", borderRadius: 8 }} onError={(e) => { e.target.style.display = 'none'; }} />
																<ImageListItemBar actionIcon={<IconButton size="small" sx={{ color: "#fff" }} onClick={() => handleDeleteImage(img.id)}><Delete fontSize="small" /></IconButton>} />
															</ImageListItem>
														))}
													</ImageList>
												) : <EmptySpec label="Chưa có ảnh nào" />}
											</Box>
										)}
									</Box>
									{selected.description && (
										<Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 2 }}>
											<Typography variant="caption" color="text.secondary" fontWeight={700}>MÔ TẢ</Typography>
											<Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>{selected.description}</Typography>
										</Box>
									)}
								</Grid>
							</Grid>
						</DialogContent>
					</>
				)}
			</Dialog>

			{/* FORM DIALOG */}
			<Dialog
				open={formOpen}
				onClose={() => setFormOpen(false)}
				maxWidth="lg"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 5,
						overflow: 'hidden',
						boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
					}
				}}
			>
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					px: 4,
					py: 2.5,
					borderBottom: `1px solid ${COLORS.border}`,
					bgcolor: "background.paper"
				}}>
					<Box>
						<Typography variant="h6" fontWeight={800} sx={{ color: COLORS.primary }}>
							{editTarget ? "✏️ Chỉnh sửa xe" : "🚗 Thêm xe mới"}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{editTarget ? "Cập nhật thông tin chi tiết" : "Nhập đầy đủ thông tin để thêm xe"}
						</Typography>
					</Box>
					<IconButton
						onClick={() => setFormOpen(false)}
						sx={{
							bgcolor: COLORS.border,
							'&:hover': { bgcolor: COLORS.border, opacity: 0.8 },
							width: 32,
							height: 32
						}}
					>
						<Close sx={{ fontSize: 18 }} />
					</IconButton>
				</Box>

				<DialogContent sx={{ p: 0 }}>
					<Box sx={{
						px: 4,
						pt: 3,
						pb: 2,
						borderBottom: `1px solid ${COLORS.border}`,
						bgcolor: "background.paper"
					}}>
						<Stack direction="row" spacing={1} flexWrap="wrap">
							{["info", "engine", "fuel", "steering", "size", "interior"].map(t => (
								<Chip
									key={t}
									label={
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
											{t === "info" && <InfoIcon sx={{ fontSize: 16 }} />}
											{t === "engine" && <SettingsIcon sx={{ fontSize: 16 }} />}
											{t === "fuel" && <LocalGasStationIcon sx={{ fontSize: 16 }} />}
											{t === "steering" && <SteeringIcon sx={{ fontSize: 16 }} />}
											{t === "size" && <StraightenIcon sx={{ fontSize: 16 }} />}
											{t === "interior" && <ChairIcon sx={{ fontSize: 16 }} />}
											<span>{t === "info" ? "Thông tin xe" : t === "engine" ? "Động cơ" : t === "fuel" ? "Nhiên liệu" : t === "steering" ? "Tay lái" : t === "size" ? "Kích thước" : "Nội thất"}</span>
										</Box>
									}
									onClick={() => setActiveSpecTab(t)}
									variant={activeSpecTab === t ? "filled" : "outlined"}
									sx={{
										borderRadius: 3,
										fontWeight: 600,
										fontSize: '0.875rem',
										...(activeSpecTab === t && {
											bgcolor: COLORS.primary,
											color: '#fff',
											'&:hover': { bgcolor: COLORS.primary, opacity: 0.9 }
										}),
										...(activeSpecTab !== t && {
											borderColor: COLORS.border,
											color: 'text.secondary',
											'&:hover': { borderColor: COLORS.primary, color: COLORS.primary }
										})
									}}
								/>
							))}
						</Stack>
					</Box>

					<Box sx={{ p: 4, maxHeight: '60vh', overflow: 'auto' }}>
						{activeSpecTab === "info" && (
							<Grid container spacing={4}>
								<Grid item xs={12} md={5}>
									<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
										<ImageIcon sx={{ fontSize: 20, color: COLORS.primary }} />
										HÌNH ẢNH XE
									</Typography>

									<Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 4 }}>
										<Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Ảnh đại diện</Typography>
										<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
											<Box sx={{ width: '100%', height: 180, borderRadius: 3, overflow: "hidden", border: `2px dashed ${thumbnailPreview ? COLORS.primary : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper" }}>
												{thumbnailPreview ? (
													<img src={thumbnailPreview} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
												) : (
													<Box sx={{ textAlign: 'center' }}>
														<DirectionsCar sx={{ color: COLORS.border, fontSize: 48, mb: 1 }} />
														<Typography variant="caption" color="text.secondary">Chưa có ảnh</Typography>
													</Box>
												)}
											</Box>
											<Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ borderRadius: 3, textTransform: "none", width: '100%' }}>
												Chọn ảnh đại diện
												<input type="file" hidden accept="image/*" onChange={(e) => {
													const f = e.target.files?.[0];
													if (f) {
														setForm((p) => ({ ...p, thumbnail: f }));
														setThumbnailPreview(URL.createObjectURL(f));
													}
												}} />
											</Button>
											{thumbnailPreview && (
												<Button variant="text" color="error" size="small" startIcon={<Delete />} onClick={() => {
													setForm((p) => ({ ...p, thumbnail: null }));
													setThumbnailPreview(null);
												}}>
													Xóa ảnh đại diện
												</Button>
											)}
										</Box>
									</Paper>

									<Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
										<Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Thư viện ảnh</Typography>
										<Button variant="outlined" component="label" startIcon={<CloudUpload />} sx={{ borderRadius: 3, textTransform: "none", mb: 2, width: '100%' }}>
											Chọn nhiều ảnh
											<input type="file" hidden multiple accept="image/*" onChange={handleMultipleImagesChange} />
										</Button>
										{multipleImagesPreview.length > 0 && (
											<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 1.5 }}>
												{multipleImagesPreview.map((preview, index) => (
													<Box key={index} sx={{ position: "relative", paddingTop: "100%", borderRadius: 2, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
														<img src={preview} alt={`preview-${index}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
														<IconButton size="small" onClick={() => removeImageFromPreview(index)} sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", width: 24, height: 24 }}>
															<Close sx={{ fontSize: 12 }} />
														</IconButton>
													</Box>
												))}
											</Box>
										)}
									</Paper>
								</Grid>

								<Grid item xs={12} md={7}>
									<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
										<InfoIcon sx={{ fontSize: 20, color: COLORS.primary }} />
										THÔNG TIN CHI TIẾT
									</Typography>

									<Grid container spacing={2}>
										<Grid item xs={12}>
											<FField label="Tên xe *" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
										</Grid>

										<Grid item xs={12}>
											<TextField
												select
												size="small"
												fullWidth
												label="Thương hiệu *"
												value={form.brand_id || ""}
												onChange={e => setForm(p => ({ ...p, brand_id: e.target.value }))}
												InputProps={{ sx: { borderRadius: 2, bgcolor: "background.paper" } }}
											>
												<MenuItem value="" disabled>-- Chọn thương hiệu --</MenuItem>
												{brandsData.map(brand => (
													<MenuItem key={brand.id} value={String(brand.id)}>
														<Stack direction="row" spacing={1.5} alignItems="center">
															<Avatar src={imgSrc(brand.logo_url)} sx={{ width: 28, height: 28 }} />
															<Typography fontWeight={600}>{brand.name}</Typography>
														</Stack>
													</MenuItem>
												))}
											</TextField>
										</Grid>

										<Grid item xs={12} sm={6}>
											<FField label="Năm sản xuất *" type="number" value={form.year} onChange={(v) => setForm((p) => ({ ...p, year: v }))} />
										</Grid>

										<Grid item xs={12} sm={6}>
											<FField label="Màu sắc" value={form.color} onChange={(v) => setForm((p) => ({ ...p, color: v }))} placeholder="VD: Đen, Trắng" />
										</Grid>

										<Grid item xs={12} sm={6}>
											<TextField select size="small" fullWidth label="Trạng thái" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
												<MenuItem value="1">✅ Đang trưng bày</MenuItem>
												<MenuItem value="0">⏸️ Ngừng trưng bày</MenuItem>
											</TextField>
										</Grid>

										<Grid item xs={12} sm={6}>
											<FField label="Số km đã đi (ODO)" type="number" value={form.latest_odo} onChange={(v) => setForm((p) => ({ ...p, latest_odo: v }))} />
										</Grid>

										<Grid item xs={12} sm={6}>
											<FField label="Giá cũ (VNĐ)" type="number" value={form.old_price} onChange={(v) => setForm((p) => ({ ...p, old_price: v }))} />
										</Grid>

										<Grid item xs={12} sm={6}>
											<FField label="Giá mới (VNĐ) *" type="number" value={form.new_price} onChange={(v) => setForm((p) => ({ ...p, new_price: v }))} />
										</Grid>

										<Grid item xs={12}>
											<TextField
												size="small"
												fullWidth
												multiline
												rows={4}
												label="Mô tả chi tiết"
												value={form.description}
												onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
												placeholder="Nhập thông tin chi tiết về tình trạng xe, option, lịch sử bảo dưỡng..."
												InputProps={{ sx: { borderRadius: 2, bgcolor: "background.paper" } }}
											/>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						)}

						{activeSpecTab !== "info" && (
							<Box>
								<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
									{activeSpecTab === "engine" && <SettingsIcon sx={{ color: COLORS.primary }} />}
									{activeSpecTab === "fuel" && <LocalGasStationIcon sx={{ color: COLORS.primary }} />}
									{activeSpecTab === "steering" && <SteeringIcon sx={{ color: COLORS.primary }} />}
									{activeSpecTab === "size" && <StraightenIcon sx={{ color: COLORS.primary }} />}
									{activeSpecTab === "interior" && <ChairIcon sx={{ color: COLORS.primary }} />}
									THÔNG SỐ {activeSpecTab === "engine" ? "ĐỘNG CƠ" : activeSpecTab === "fuel" ? "NHIÊN LIỆU" : activeSpecTab === "steering" ? "TAY LÁI" : activeSpecTab === "size" ? "KÍCH THƯỚC" : "NỘI THẤT"}
								</Typography>

								<Grid container spacing={2.5}>
									{activeSpecTab === "engine" && (
										<>
											<Grid item xs={12} sm={6}><FField label="Dung tích (cc)" value={engineForm.displacement} onChange={v => setEngineForm(p => ({ ...p, displacement: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Số xi-lanh" type="number" value={engineForm.cylinders} onChange={v => setEngineForm(p => ({ ...p, cylinders: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Công suất (HP)" value={engineForm.power} onChange={v => setEngineForm(p => ({ ...p, power: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Mô-men xoắn (Nm)" value={engineForm.torque} onChange={v => setEngineForm(p => ({ ...p, torque: v }))} /></Grid>
											<Grid item xs={12}><FField label="Hộp số" value={engineForm.transmission} onChange={v => setEngineForm(p => ({ ...p, transmission: v }))} /></Grid>
										</>
									)}

									{activeSpecTab === "fuel" && (
										<>
											<Grid item xs={12} sm={6}><FField label="Loại nhiên liệu" value={fuelForm.type} onChange={v => setFuelForm(p => ({ ...p, type: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Dung tích bình (L)" type="number" value={fuelForm.tank_capacity} onChange={v => setFuelForm(p => ({ ...p, tank_capacity: v }))} /></Grid>
											<Grid item xs={12}><FField label="Mức tiêu thụ (L/100km)" value={fuelForm.consumption} onChange={v => setFuelForm(p => ({ ...p, consumption: v }))} /></Grid>
										</>
									)}

									{activeSpecTab === "steering" && (
										<>
											<Grid item xs={12} sm={6}><FField label="Loại tay lái" value={steeringForm.type} onChange={v => setSteeringForm(p => ({ ...p, type: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Bán kính quay vòng (m)" value={steeringForm.turning_radius} onChange={v => setSteeringForm(p => ({ ...p, turning_radius: v }))} /></Grid>
										</>
									)}

									{activeSpecTab === "size" && (
										<>
											<Grid item xs={12} sm={4}><FField label="Dài (mm)" type="number" value={sizeForm.length} onChange={v => setSizeForm(p => ({ ...p, length: v }))} /></Grid>
											<Grid item xs={12} sm={4}><FField label="Rộng (mm)" type="number" value={sizeForm.width} onChange={v => setSizeForm(p => ({ ...p, width: v }))} /></Grid>
											<Grid item xs={12} sm={4}><FField label="Cao (mm)" type="number" value={sizeForm.height} onChange={v => setSizeForm(p => ({ ...p, height: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Chiều dài cơ sở (mm)" type="number" value={sizeForm.wheelbase} onChange={v => setSizeForm(p => ({ ...p, wheelbase: v }))} /></Grid>
											<Grid item xs={12} sm={6}><FField label="Trọng lượng (kg)" type="number" value={sizeForm.weight} onChange={v => setSizeForm(p => ({ ...p, weight: v }))} /></Grid>
										</>
									)}

									{activeSpecTab === "interior" && (
										<>
											<Grid item xs={12} sm={4}><FField label="Số chỗ ngồi" type="number" value={interiorForm.seats} onChange={v => setInteriorForm(p => ({ ...p, seats: v }))} /></Grid>
											<Grid item xs={12} sm={4}><FField label="Màn hình (inch)" value={interiorForm.screen_size} onChange={v => setInteriorForm(p => ({ ...p, screen_size: v }))} /></Grid>
											<Grid item xs={12} sm={4}><FField label="Điều hòa" value={interiorForm.air_conditioner} onChange={v => setInteriorForm(p => ({ ...p, air_conditioner: v }))} /></Grid>
										</>
									)}
								</Grid>
							</Box>
						)}
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 4, py: 2.5, borderTop: `1px solid ${COLORS.border}`, gap: 2 }}>
					<Button onClick={() => setFormOpen(false)} variant="outlined" sx={{ borderRadius: 3, fontWeight: 600, px: 3, textTransform: 'none' }}>
						Hủy
					</Button>
					<Button
						onClick={handleSubmit}
						variant="contained"
						disabled={submitting}
						startIcon={submitting ? <CircularProgress size={18} /> : null}
						sx={{
							borderRadius: 3,
							fontWeight: 700,
							px: 4,
							textTransform: 'none',
							background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
							'&:hover': { background: `linear-gradient(135deg, ${COLORS.primary}CC, ${COLORS.accent}CC)` }
						}}
					>
						{submitting ? (editTarget ? "Đang cập nhật..." : "Đang thêm...") : (editTarget ? "Cập nhật xe" : "Thêm xe")}
					</Button>
				</DialogActions>
			</Dialog>

			{/* SERVICE DIALOG */}
			<Dialog
				open={serviceDialogOpen}
				onClose={() => setServiceDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 4,
						boxShadow: "0 20px 60px rgba(26, 35, 126, 0.15)",
						border: `1px solid ${alpha(COLORS.primary, 0.1)}`
					}
				}}
			>
				<DialogTitle sx={{
					background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
					color: "#fff",
					fontWeight: 800,
					display: "flex",
					alignItems: "center",
					gap: 1.5
				}}>
					<Build sx={{ fontSize: 24 }} />
					{editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
				</DialogTitle>
				<DialogContent sx={{ p: 3.5 }}>
					<Stack spacing={2.5}>
						<FField label="Tên dịch vụ *" value={serviceForm.name} onChange={v => setServiceForm(p => ({ ...p, name: v }))} />
						<FField label="Mô tả" value={serviceForm.description} onChange={v => setServiceForm(p => ({ ...p, description: v }))} multiline rows={2} />
						<FField label="Giá (VNĐ) *" type="number" value={serviceForm.price} onChange={v => setServiceForm(p => ({ ...p, price: v }))} />
						<FField label="Thời gian (phút)" value={serviceForm.duration} onChange={v => setServiceForm(p => ({ ...p, duration: v }))} placeholder="VD: 60" />
						<FormControlLabel
							control={<Switch
								checked={serviceForm.status}
								onChange={e => setServiceForm(p => ({ ...p, status: e.target.checked }))}
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: COLORS.success,
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: COLORS.success,
									},
								}}
							/>}
							label={<Typography fontWeight={500}>Đang cung cấp</Typography>}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ p: 3.5, gap: 2 }}>
					<Button
						onClick={() => setServiceDialogOpen(false)}
						variant="outlined"
						sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
					>
						Hủy
					</Button>
					<Button
						onClick={handleSaveService}
						variant="contained"
						disabled={serviceSubmitting}
						startIcon={serviceSubmitting ? <CircularProgress size={16} /> : <Save />}
						sx={{
							borderRadius: 2,
							textTransform: "none",
							fontWeight: 600,
							bgcolor: COLORS.primary,
							boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.3)}`,
							'&:hover': {
								boxShadow: `0 8px 20px ${alpha(COLORS.primary, 0.4)}`
							}
						}}
					>
						{editingService ? "Cập nhật" : "Thêm mới"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* DELETE CONFIRM */}
			<Dialog open={!!deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
				<DialogTitle sx={{ fontWeight: 800 }}>Xác nhận xóa xe</DialogTitle>
				<DialogContent><Typography>Bạn có chắc muốn xóa xe <b>{deleteOpen?.name}</b>? Hành động này không thể hoàn tác.</Typography></DialogContent>
				<DialogActions sx={{ p: 2, gap: 1 }}>
					<Button onClick={() => setDeleteOpen(false)} variant="outlined">Hủy</Button>
					<Button onClick={handleDelete} variant="contained" color="error">Xóa</Button>
				</DialogActions>
			</Dialog>

			{/* BRAND DIALOG */}
			<Dialog
				open={brandDialogOpen}
				onClose={() => setBrandDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 4,
						boxShadow: "0 20px 60px rgba(26, 35, 126, 0.15)",
						border: `1px solid ${alpha(COLORS.primary, 0.1)}`
					}
				}}
			>
				<DialogTitle sx={{
					background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
					color: "#fff",
					fontWeight: 800,
					display: "flex",
					alignItems: "center",
					gap: 1.5
				}}>
					<BusinessIcon sx={{ fontSize: 24 }} />
					<span>{editingBrand ? "Chỉnh sửa hãng xe" : "Thêm hãng xe mới"}</span>
				</DialogTitle>

				<DialogContent sx={{ p: 3.5 }}>
					<Stack spacing={3}>
						<Box>
							<Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Logo hãng xe</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
								<Box sx={{
									width: 120,
									height: 120,
									borderRadius: 3,
									overflow: "hidden",
									border: `2px dashed ${brandLogoPreview ? COLORS.primary : COLORS.border}`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									bgcolor: "background.paper"
								}}>
									{brandLogoPreview ? (
										<img
											src={brandLogoPreview}
											alt="logo preview"
											style={{ width: "100%", height: "100%", objectFit: "cover" }}
										/>
									) : (
										<Box sx={{ textAlign: 'center' }}>
											<BusinessIcon sx={{ color: COLORS.border, fontSize: 48, mb: 1 }} />
											<Typography variant="caption" color="text.secondary">Chưa có logo</Typography>
										</Box>
									)}
								</Box>
								<Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ borderRadius: 2, textTransform: "none" }}>
									{brandLogoPreview ? "Đổi logo" : "Chọn logo"}
									<input type="file" hidden accept="image/*" onChange={handleBrandLogoChange} />
								</Button>
							</Box>
						</Box>
						<TextField size="small" fullWidth label="Tên hãng xe *" value={brandForm.name} onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))} placeholder="VD: Toyota, Honda, BMW..." InputProps={{ sx: { borderRadius: 2, bgcolor: "background.paper" } }} />
						<TextField size="small" fullWidth label="Quốc gia *" value={brandForm.country} onChange={(e) => setBrandForm(prev => ({ ...prev, country: e.target.value }))} placeholder="VD: Nhật Bản, Đức, Mỹ..." InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon sx={{ color: COLORS.muted, fontSize: 20 }} /></InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper" } }} />
					</Stack>
				</DialogContent>

				<DialogActions sx={{ p: 3.5, gap: 2 }}>
					<Button onClick={() => setBrandDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Hủy</Button>
					<Button onClick={handleSaveBrand} variant="contained" disabled={brandSubmitting} startIcon={brandSubmitting ? <CircularProgress size={18} /> : <Save />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: COLORS.primary, boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.3)}`, '&:hover': { boxShadow: `0 8px 20px ${alpha(COLORS.primary, 0.4)}` } }}>
						{brandSubmitting ? "Đang xử lý..." : (editingBrand ? "Cập nhật" : "Thêm mới")}
					</Button>
				</DialogActions>
			</Dialog>

			{/* BRAND DELETE CONFIRM */}
			<Dialog open={brandDeleteOpen} onClose={() => setBrandDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
				<DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
					<Delete sx={{ color: COLORS.danger }} /> Xác nhận xóa hãng xe
				</DialogTitle>
				<DialogContent><Typography>Bạn có chắc muốn xóa hãng xe <b>{brandToDelete?.name}</b>? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các xe đang thuộc hãng này.</Typography></DialogContent>
				<DialogActions sx={{ p: 2, gap: 1 }}>
					<Button onClick={() => setBrandDeleteOpen(false)} variant="outlined">Hủy</Button>
					<Button onClick={handleDeleteBrand} variant="contained" color="error">Xóa</Button>
				</DialogActions>
			</Dialog>

			{/* VOUCHER DIALOG */}
			<Dialog open={voucherDialogOpen} onClose={() => setVoucherDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, boxShadow: "0 20px 60px rgba(26, 35, 126, 0.15)", border: `1px solid ${alpha(COLORS.primary, 0.1)}` } }}>
				<DialogTitle sx={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", gap: 1.5 }}>
					<LocalOfferIcon sx={{ fontSize: 24 }} />
					<span>{editingVoucher ? "Chỉnh sửa voucher" : "Thêm voucher mới"}</span>
				</DialogTitle>
				<DialogContent sx={{ p: 3.5 }}>
					<Stack spacing={2.5}>
						<TextField size="small" fullWidth label="Mã voucher *" value={voucherForm.code} onChange={(e) => setVoucherForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="VD: SUMMER2024" helperText="Mã code sẽ tự động chuyển thành chữ in hoa" InputProps={{ startAdornment: <InputAdornment position="start"><LocalOfferIcon sx={{ color: COLORS.muted, fontSize: 20 }} /></InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper", fontFamily: "monospace", fontWeight: 600 } }} />
						<TextField size="small" fullWidth label="Sự kiện (không bắt buộc)" value={voucherForm.event} onChange={(e) => setVoucherForm(prev => ({ ...prev, event: e.target.value }))} placeholder="VD: Khuyến mãi mùa hè, Black Friday..." InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon sx={{ color: COLORS.muted, fontSize: 20 }} /></InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper" } }} />
						<TextField size="small" fullWidth type="number" label="Phần trăm giảm giá *" value={voucherForm.percent} onChange={(e) => setVoucherForm(prev => ({ ...prev, percent: e.target.value }))} placeholder="VD: 10, 20, 50" helperText="Giá trị từ 0 đến 100" InputProps={{ startAdornment: <InputAdornment position="start"><PercentIcon sx={{ color: COLORS.muted, fontSize: 20 }} /></InputAdornment>, endAdornment: <InputAdornment position="end">%</InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper" } }} />
						<Grid container spacing={2}>
							<Grid item xs={6}><TextField size="small" fullWidth type="date" label="Từ ngày *" value={voucherForm.from} onChange={(e) => setVoucherForm(prev => ({ ...prev, from: e.target.value }))} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><DateRangeIcon sx={{ color: COLORS.muted, fontSize: 18 }} /></InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper" } }} /></Grid>
							<Grid item xs={6}><TextField size="small" fullWidth type="date" label="Đến ngày *" value={voucherForm.to} onChange={(e) => setVoucherForm(prev => ({ ...prev, to: e.target.value }))} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><DateRangeIcon sx={{ color: COLORS.muted, fontSize: 18 }} /></InputAdornment>, sx: { borderRadius: 2, bgcolor: "background.paper" } }} /></Grid>
						</Grid>
						<FormControlLabel control={<Switch checked={voucherForm.is_available} onChange={(e) => setVoucherForm(prev => ({ ...prev, is_available: e.target.checked }))} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.success }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.success } }} />} label={<Stack direction="row" spacing={1} alignItems="center">{voucherForm.is_available ? <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 20 }} /> : <CancelIcon sx={{ color: COLORS.warning, fontSize: 20 }} />}<Typography>{voucherForm.is_available ? "Kích hoạt voucher" : "Tạm dừng voucher"}</Typography></Stack>} />
					</Stack>
				</DialogContent>
				<DialogActions sx={{ p: 3.5, gap: 2 }}>
					<Button onClick={() => setVoucherDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Hủy</Button>
					<Button onClick={handleSaveVoucher} variant="contained" disabled={voucherSubmitting} startIcon={voucherSubmitting ? <CircularProgress size={18} /> : <Save />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, bgcolor: COLORS.primary, boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.3)}`, '&:hover': { boxShadow: `0 8px 20px ${alpha(COLORS.primary, 0.4)}` } }}>
						{voucherSubmitting ? "Đang xử lý..." : (editingVoucher ? "Cập nhật" : "Thêm mới")}
					</Button>
				</DialogActions>
			</Dialog>

			{/* VOUCHER DELETE CONFIRM */}
			<Dialog open={voucherDeleteOpen} onClose={() => setVoucherDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
				<DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}><Delete sx={{ color: COLORS.danger }} /> Xác nhận xóa voucher</DialogTitle>
				<DialogContent>
					<Typography>Bạn có chắc muốn xóa voucher <b>{voucherToDelete?.code}</b>? Hành động này không thể hoàn tác.</Typography>
					{voucherToDelete?.event && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Sự kiện: {voucherToDelete.event}</Typography>}
				</DialogContent>
				<DialogActions sx={{ p: 2, gap: 1 }}>
					<Button onClick={() => setVoucherDeleteOpen(false)} variant="outlined">Hủy</Button>
					<Button onClick={handleDeleteVoucher} variant="contained" color="error">Xóa</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert severity={snack.severity} sx={{ borderRadius: 0 }}>{snack.msg}</Alert>
			</Snackbar>
		</Box>
	);
}