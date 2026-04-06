import React, { useState, useEffect, useCallback } from 'react';
import {
	Container, Paper, Box, Typography, Tabs, Tab,
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
	TextField, MenuItem, Select, FormControl, InputLabel, Grid,
	Alert, Snackbar, CircularProgress, Tooltip, Divider
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
	Delete as DeleteIcon,
	Visibility as ViewIcon,
	ShoppingCart as CartIcon,
	Paid as PaidIcon,
	Build as BuildIcon,
	Add as AddIcon
} from '@mui/icons-material';

import {
	getAllRepairAppointments,
	updateRepairAppointmentStatus
} from '../../services/repair-appointment.service';
import {
	getAllRepairTickets,
	createRepairTicket,
	deleteRepairTicket,
	completeRepairTicket
} from '../../services/repair-ticket.service';
import {
	getRepairDetailsByTicketId,
	createRepairDetail,
	updateRepairDetail
} from '../../services/repair-detail.service';
import {
	getAllSpareParts,
	updateSparePart
} from '../../services/spare-parts.service';
import {
	createSparePartsUsage,
	getSparePartsUsagesByRepairDetailId,
	deleteSparePartsUsage
} from '../../services/spare-parts-usage.service';
import {
	createSparePartsWarranty
} from '../../services/spare-parts-warranty.service';
import { createInvoice } from '../../services/invoice.service';
import { getAllServices } from '../../services/service.service';
import { getEmployees } from '../../services/employee.service';

// ─── Tab Panel ────────────────────────────────────────────────────────────────
const TabPanel = ({ children, value, index }) => (
	<div role="tabpanel" hidden={value !== index}>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</div>
);

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
	const map = {
		PENDING: { label: 'Chờ xác nhận', color: 'warning' },
		CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
		IN_PROGRESS: { label: 'Đang sửa', color: 'warning' },
		COMPLETED: { label: 'Hoàn thành', color: 'success' },
		CANCELLED: { label: 'Đã hủy', color: 'error' },
		booked: { label: 'Đã đặt', color: 'info' },
	};
	const cfg = map[status] || { label: status, color: 'default' };
	return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const GarageManagement = () => {
	const [activeTab, setActiveTab] = useState(0);

	// ── Data states ───────────────────────────────────────────────────────────
	const [appointments, setAppointments] = useState([]);
	const [repairTickets, setRepairTickets] = useState([]);
	const [spareParts, setSpareParts] = useState([]);
	const [services, setServices] = useState([]);
	const [employees, setEmployees] = useState([]);

	// ── Loading ───────────────────────────────────────────────────────────────
	const [loadingAppts, setLoadingAppts] = useState(false);
	const [loadingTickets, setLoadingTickets] = useState(false);

	// ── Selected ticket context ───────────────────────────────────────────────
	const [selectedTicket, setSelectedTicket] = useState(null);

	// repair_details của ticket đang xem (mảng)
	const [repairDetails, setRepairDetails] = useState([]);
	const [loadingDetails, setLoadingDetails] = useState(false);

	// Dialog flags
	const [dlgCreateTicket, setDlgCreateTicket] = useState(false);
	const [dlgViewDetails, setDlgViewDetails] = useState(false);
	const [dlgViewAppointment, setDlgViewAppointment] = useState(false);
	const [dlgAddDetail, setDlgAddDetail] = useState(false); // thêm chi tiết sửa
	const [dlgSpareParts, setDlgSpareParts] = useState(false); // chọn phụ tùng cho 1 detail
	const [dlgInvoice, setDlgInvoice] = useState(false);

	// context: detail đang thao tác phụ tùng
	const [selectedDetail, setSelectedDetail] = useState(null);
	const [detailUsages, setDetailUsages] = useState([]); // usages của selectedDetail

	// context: appointment để tạo ticket
	const [selectedAppointment, setSelectedAppointment] = useState(null);

	// ── Forms ─────────────────────────────────────────────────────────────────
	const [ticketForm, setTicketForm] = useState({
		service_id: '', created_date: dayjs(), description: ''
	});
	const [detailForm, setDetailForm] = useState({
		employee_id: '', note: '', repair_date: null
	});
	const [invoiceForm, setInvoiceForm] = useState({
		payment_method: 'CASH', created_date: dayjs()
	});
	const [qty, setQty] = useState({}); // qty[part.id] = number

	// ── Snackbar ──────────────────────────────────────────────────────────────
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	const toast = (message, severity = 'success') =>
		setSnackbar({ open: true, message, severity });

	// ─── Loaders ──────────────────────────────────────────────────────────────
	const loadAppointments = useCallback(async () => {
		setLoadingAppts(true);
		try {
			const res = await getAllRepairAppointments();
			setAppointments(res.success ? (res.data || []) : []);
		} catch { toast('Không thể tải lịch hẹn', 'error'); }
		finally { setLoadingAppts(false); }
	}, []);

	const loadRepairTickets = useCallback(async () => {
		setLoadingTickets(true);
		try {
			const res = await getAllRepairTickets();
			setRepairTickets(res.success ? (res.data || []) : []);
		} catch { toast('Không thể tải phiếu sửa xe', 'error'); }
		finally { setLoadingTickets(false); }
	}, []);

	const loadSpareParts = useCallback(async () => {
		try {
			const res = await getAllSpareParts();
			if (res.success) setSpareParts(res.data || []);
		} catch { }
	}, []);

	const loadMeta = useCallback(async () => {
		try {
			const [sRes, eRes] = await Promise.all([getAllServices(), getEmployees()]);
			if (sRes.success) setServices(sRes.data || []);
			if (eRes.success) setEmployees(eRes.data || []);
		} catch { }
	}, []);

	/**
	 * Load tất cả repair_details của 1 ticket.
	 * Vì API hiện tại chỉ hỗ trợ getOne (1 detail / ticket),
	 * ta vẫn gọi getRepairDetailByTicketId rồi bọc kết quả vào mảng.
	 * Khi backend hỗ trợ nhiều detail / ticket thì chỉ cần đổi API call.
	 */
	const loadRepairDetails = useCallback(async (ticketId) => {
		if (!ticketId) return;
		setLoadingDetails(true);
		try {
			// Gọi API mới trả về MẢNG
			const res = await getRepairDetailsByTicketId(ticketId);
			console.log('Loaded repair details:', res);

			if (res.success && Array.isArray(res.data)) {
				// Load usages cho mỗi detail
				const detailsWithUsages = await Promise.all(
					res.data.map(async (detail) => {
						try {
							const usageRes = await getSparePartsUsagesByRepairDetailId(detail.id);
							return {
								...detail,
								usages: usageRes.success ? (usageRes.data || []) : []
							};
						} catch (err) {
							return { ...detail, usages: [] };
						}
					})
				);
				setRepairDetails(detailsWithUsages);
			} else {
				setRepairDetails([]);
			}
		} catch (error) {
			console.error('Error loading details:', error);
			setRepairDetails([]);
		} finally {
			setLoadingDetails(false);
		}
	}, []);

	useEffect(() => {
		loadAppointments();
		loadRepairTickets();
		loadMeta();
		loadSpareParts();
	}, [loadAppointments, loadRepairTickets, loadMeta, loadSpareParts]);

	// ─── Tạo phiếu sửa từ lịch hẹn ──────────────────────────────────────────
	const openCreateTicket = (appointment) => {
		setSelectedAppointment(appointment);
		setTicketForm({ service_id: '', created_date: dayjs() });
		setDlgCreateTicket(true);
	};

	const handleCreateTicket = async () => {
		const vehicle = selectedAppointment?.vehicles?.[0];
		if (!vehicle) { toast('Lịch hẹn không có xe', 'error'); return; }
		if (!ticketForm.service_id) { toast('Vui lòng chọn dịch vụ', 'warning'); return; }
		try {
			const res = await createRepairTicket({
				appointment_id: selectedAppointment.id,
				customer_vehicle_id: vehicle.id,
				service_id: ticketForm.service_id,
				created_date: ticketForm.created_date.toISOString(),
				description: ticketForm.description  // ← THÊM DÒNG NÀY
			});
			if (res.success) {
				toast('Tạo phiếu sửa xe thành công');
				setDlgCreateTicket(false);
				await updateRepairAppointmentStatus(selectedAppointment.id, 'confirmed');
				await Promise.all([loadRepairTickets(), loadAppointments()]);
				setActiveTab(1);
			} else {
				toast(res.message || 'Tạo phiếu thất bại', 'error');
			}
		} catch { toast('Có lỗi xảy ra', 'error'); }
	};

	// ─── Xem chi tiết lịch hẹn ──────────────────────────────────────────────
	const openViewAppointment = (appointment) => {
		setSelectedAppointment(appointment);
		setDlgViewAppointment(true);
	};

	// ─── Xem / quản lý chi tiết sửa xe ───────────────────────────────────────
	const openViewDetails = async (ticket) => {
		setSelectedTicket(ticket);
		await loadRepairDetails(ticket.id);
		setDlgViewDetails(true);
	};

	// ─── Thêm 1 repair_detail vào ticket ─────────────────────────────────────
	const openAddDetail = () => {
		setDetailForm({ employee_id: '', note: '', repair_date: null });
		setDlgAddDetail(true);
	};

	const handleSaveDetail = async () => {
		if (!selectedTicket) return;
		try {
			const data = {
				employee_id: detailForm.employee_id,
				note: detailForm.note,
				repair_date: detailForm.repair_date ? detailForm.repair_date.toISOString() : null,
				ticket_id: selectedTicket.id  // Thêm ticket_id
			};

			let res;
			if (repairDetails.length === 0) {
				// Tạo mới
				res = await createRepairDetail(selectedTicket.id, data);
			} else {
				// Cập nhật detail đầu tiên - cần detail_id
				const firstDetail = repairDetails[0];
				res = await updateRepairDetail(firstDetail.id, data);
			}

			if (res.success) {
				toast('Lưu chi tiết sửa xe thành công');
				setDlgAddDetail(false);
				await loadRepairDetails(selectedTicket.id);
			} else {
				toast(res.message || 'Lưu thất bại', 'error');
			}
		} catch (error) {
			console.error('Save detail error:', error);
			toast('Có lỗi xảy ra', 'error');
		}
	};

	// ─── Mở dialog chọn phụ tùng cho 1 repair_detail ────────────────────────
	const openSparePartsForDetail = async (detail) => {
		setSelectedDetail(detail);
		await loadSpareParts();
		// Reload usages mới nhất
		const usageRes = await getSparePartsUsagesByRepairDetailId(detail.id);
		setDetailUsages(usageRes.success ? (usageRes.data || []) : []);
		setQty({});
		setDlgSpareParts(true);
	};

	const handleAddSparePart = async (partId) => {
		const quantity = qty[partId] || 1;
		const part = spareParts.find(p => p.id === partId);
		if (!part) return;
		if (part.quantity_in_stock < quantity) {
			toast(`Tồn kho không đủ (còn ${part.quantity_in_stock})`, 'error');
			return;
		}
		try {
			const res = await createSparePartsUsage({
				repair_detail_id: selectedDetail.id,
				spare_parts_id: partId,
				quantity,
				usage_date: new Date().toISOString()
			});
			if (res.success) {
				await updateSparePart(partId, {
					quantity_in_stock: part.quantity_in_stock - quantity
				});
				toast('Thêm phụ tùng thành công');
				const usageRes = await getSparePartsUsagesByRepairDetailId(selectedDetail.id);
				setDetailUsages(usageRes.success ? (usageRes.data || []) : []);
				await loadSpareParts();
				setQty({});
			} else {
				toast(res.message || 'Thêm thất bại', 'error');
			}
		} catch { toast('Có lỗi xảy ra', 'error'); }
	};

	const handleRemoveSparePart = async (usage) => {
		try {
			const part = spareParts.find(p => p.id === usage.spare_parts_id);
			if (part) {
				await updateSparePart(part.id, {
					quantity_in_stock: part.quantity_in_stock + usage.quantity
				});
			}
			const res = await deleteSparePartsUsage(usage.id);
			if (res.success) {
				toast('Đã xóa phụ tùng');
				const usageRes = await getSparePartsUsagesByRepairDetailId(selectedDetail.id);
				setDetailUsages(usageRes.success ? (usageRes.data || []) : []);
				await loadSpareParts();
			}
		} catch { toast('Có lỗi xảy ra', 'error'); }
	};

	// ─── Tạo hóa đơn ─────────────────────────────────────────────────────────
	const openInvoice = async (ticket) => {
		setSelectedTicket(ticket);
		await loadRepairDetails(ticket.id);
		setInvoiceForm({ payment_method: 'CASH', created_date: dayjs() });
		setDlgInvoice(true);
	};

	// Tính tổng tiền: giá dịch vụ + tất cả phụ tùng trong tất cả detail
	const calcTotal = () => {
		let total = selectedTicket?.service?.price
			? parseFloat(selectedTicket.service.price) : 0;
		repairDetails.forEach(detail => {
			(detail.usages || []).forEach(u => {
				total += u.quantity * parseFloat(u.spare_part?.price || 0);
			});
		});
		return total;
	};

	const handleCreateInvoice = async () => {
		try {
			const invoiceRes = await createInvoice({
				ticket_id: selectedTicket.id,
				total_cost: calcTotal(),
				payment_method: invoiceForm.payment_method,
				created_date: invoiceForm.created_date.toISOString()
			});
			if (!invoiceRes.success) {
				toast(invoiceRes.message || 'Tạo hóa đơn thất bại', 'error');
				return;
			}
			// Tạo bảo hành cho tất cả phụ tùng trong mọi detail
			for (const detail of repairDetails) {
				for (const usage of (detail.usages || [])) {
					await createSparePartsWarranty({
						usage_id: usage.id,
						warranty_period_months: 12,
						warranty_expiry_date: dayjs().add(12, 'months').toISOString()
					});
				}
			}
			await completeRepairTicket(selectedTicket.id);
			toast('Tạo hóa đơn thành công');
			setDlgInvoice(false);
			await Promise.all([loadRepairTickets(), loadAppointments()]);
			setActiveTab(0);
		} catch { toast('Có lỗi xảy ra khi tạo hóa đơn', 'error'); }
	};

	// ─── Render ───────────────────────────────────────────────────────────────
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={3}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
						<Typography variant="h4" gutterBottom>Quản lý Garage</Typography>
						<Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
							<Tab label="Lịch hẹn sửa xe" />
							<Tab label="Phiếu sửa xe" />
						</Tabs>
					</Box>

					{/* ── TAB 0: Lịch hẹn ────────────────────────────────────────────────── */}
					<TabPanel value={activeTab} index={0}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Khách hàng</TableCell>
										<TableCell>Ngày hẹn</TableCell>
										<TableCell>Dịch vụ</TableCell>
										<TableCell>Xe</TableCell>
										<TableCell>Biển số</TableCell>
										<TableCell>Trạng thái</TableCell>
										<TableCell>Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{loadingAppts ? (
										<TableRow>
											<TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
										</TableRow>
									) : appointments.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
										</TableRow>
									) : appointments.map((app) => {
										const vehicle = app.vehicles?.[0] || null;
										const relatedTicket = repairTickets.find(t => t.appointment_id === app.id);
										return (
											<TableRow key={app.id}>
												<TableCell>{app.customer?.full_name || '—'}</TableCell>
												<TableCell>{dayjs(app.appointment_date).format('DD/MM/YYYY HH:mm')}</TableCell>
												<TableCell>{relatedTicket?.service?.name || '—'}</TableCell>
												<TableCell>{vehicle?.name || '—'}</TableCell>
												<TableCell>{vehicle?.plate_number || '—'}</TableCell>
												<TableCell><StatusChip status={app.status} /></TableCell>
												<TableCell>
													{(app.status === 'CONFIRMED' || app.status === 'booked') ? (
														<Button
															variant="contained" size="small"
															startIcon={<BuildIcon />}
															onClick={() => openCreateTicket(app)}
															sx={{ mr: 1 }}
														>
															Tạo phiếu sửa
														</Button>
													) : null}
													<IconButton size="small" onClick={() => openViewAppointment(app)} title="Xem chi tiết">
														<ViewIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</TabPanel>

					{/* ── TAB 1: Phiếu sửa xe ────────────────────────────────────────────── */}
					<TabPanel value={activeTab} index={1}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Ngày tạo</TableCell>
										<TableCell>Dịch vụ</TableCell>
										<TableCell>Xe</TableCell>
										<TableCell>Biển số</TableCell>
										<TableCell>Mô tả</TableCell>
										<TableCell>Trạng thái</TableCell>
										<TableCell>Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{loadingTickets ? (
										<TableRow>
											<TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
										</TableRow>
									) : repairTickets.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
										</TableRow>
									) : repairTickets.map((ticket) => (
										<TableRow key={ticket.id}>
											<TableCell>{dayjs(ticket.created_date).format('DD/MM/YYYY HH:mm')}</TableCell>
											<TableCell>{ticket.service?.name || '—'}</TableCell>
											<TableCell>{ticket.vehicle?.name || '—'}</TableCell>
											<TableCell>{ticket.vehicle?.plate_number || '—'}</TableCell>
											<TableCell>
												<Tooltip title={ticket.description || 'Không có mô tả'}>
													<Typography variant="body2" sx={{
														maxWidth: 200,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap'
													}}>
														{ticket.description || '—'}
													</Typography>
												</Tooltip>
											</TableCell>
											<TableCell>
												{ticket.completed_date
													? <Chip label="Hoàn thành" color="success" size="small" />
													: <Chip label="Đang sửa" color="warning" size="small" />
												}
											</TableCell>
											<TableCell>
												<Tooltip title="Xem chi tiết sửa xe">
													<IconButton size="small" onClick={() => openViewDetails(ticket)}>
														<ViewIcon />
													</IconButton>
												</Tooltip>
												{!ticket.completed_date ? (
													<>
														<Tooltip title="Tạo hóa đơn">
															<IconButton size="small" color="success"
																onClick={() => openInvoice(ticket)}>
																<PaidIcon />
															</IconButton>
														</Tooltip>
														<Tooltip title="Xóa phiếu">
															<IconButton size="small" color="error"
																onClick={async () => {
																	await deleteRepairTicket(ticket.id);
																	await loadRepairTickets();
																	toast('Xóa thành công');
																}}>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													</>
												) : null}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</TabPanel>
				</Paper>

				{selectedAppointment && (
					<>
						{/* ── DIALOG: Xem chi tiết lịch hẹn ──────────────────────────────────── */}
						<Dialog open={dlgViewAppointment} onClose={() => setDlgViewAppointment(false)}
							maxWidth="sm" fullWidth>
							<DialogTitle>Chi tiết lịch hẹn</DialogTitle>
							<DialogContent>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
									<TextField
										label="Khách hàng"
										value={selectedAppointment?.customer?.full_name || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Số điện thoại"
										value={selectedAppointment?.customer?.phone_number || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Email"
										value={selectedAppointment?.customer?.email || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Ngày hẹn"
										value={dayjs(selectedAppointment?.appointment_date).format('DD/MM/YYYY HH:mm') || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Xe"
										value={selectedAppointment?.vehicles?.[0]?.name || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Biển số"
										value={selectedAppointment?.vehicles?.[0]?.plate_number || '—'}
										disabled fullWidth
									/>
									<TextField
										label="Trạng thái"
										value={selectedAppointment?.status || '—'}
										disabled fullWidth
									/>
								</Box>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgViewAppointment(false)}>Đóng</Button>
							</DialogActions>
						</Dialog>

						{/* ── DIALOG: Tạo phiếu sửa xe ─────────────────────────────────────────── */}
						<Dialog open={dlgCreateTicket} onClose={() => setDlgCreateTicket(false)}
							maxWidth="sm" fullWidth>
							<DialogTitle>Tạo phiếu sửa xe</DialogTitle>
							<DialogContent>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
									<TextField
										label="Khách hàng"
										value={selectedAppointment?.customer?.full_name || ''}
										disabled fullWidth
									/>
									<TextField
										label="Xe"
										value={selectedAppointment?.vehicles?.[0]?.name || ''}
										disabled fullWidth
									/>
									<FormControl fullWidth>
										<InputLabel>Dịch vụ *</InputLabel>
										<Select
											value={ticketForm.service_id}
											label="Dịch vụ *"
											onChange={(e) => setTicketForm({ ...ticketForm, service_id: e.target.value })}
										>
											{services.map(s => (
												<MenuItem key={s.id} value={s.id}>
													{s.name} — {parseFloat(s.price).toLocaleString()}đ
												</MenuItem>
											))}
										</Select>
									</FormControl>

									{/* ← THÊM TRƯỜNG DESCRIPTION VÀO ĐÂY */}
									<TextField
										label="Mô tả công việc"
										multiline
										rows={3}
										fullWidth
										placeholder="Nhập mô tả chi tiết công việc cần sửa chữa..."
										value={ticketForm.description}
										onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
									/>

									<DatePicker
										label="Ngày tạo"
										value={ticketForm.created_date}
										onChange={(d) => setTicketForm({ ...ticketForm, created_date: d })}
										slotProps={{ textField: { fullWidth: true } }}
									/>
								</Box>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgCreateTicket(false)}>Hủy</Button>
								<Button variant="contained" onClick={handleCreateTicket}>Tạo phiếu</Button>
							</DialogActions>
						</Dialog>

						{/* ── DIALOG: Xem chi tiết sửa xe (danh sách repair_detail) ───────────── */}
						<Dialog open={dlgViewDetails} onClose={() => setDlgViewDetails(false)}
							maxWidth="md" fullWidth>
							<DialogTitle>
								Chi tiết sửa xe — {selectedTicket?.service?.name}
								{selectedTicket && (
									<Typography variant="body2" color="text.secondary">
										Xe: {selectedTicket.vehicle?.name} | {selectedTicket.vehicle?.plate_number}
									</Typography>
								)}
							</DialogTitle>
							<DialogContent>
								{loadingDetails ? (
									<Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
								) : (
									<Box>
										<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
											{!selectedTicket?.completed_date && (
												<Button variant="outlined" startIcon={<AddIcon />}
													onClick={openAddDetail}>
													{repairDetails.length === 0 ? 'Tạo chi tiết sửa' : 'Cập nhật chi tiết'}
												</Button>
											)}
										</Box>

										{repairDetails.length === 0 ? (
											<Alert severity="info">Chưa có chi tiết sửa xe nào</Alert>
										) : repairDetails.map((detail, idx) => (
											<Paper key={detail.id} variant="outlined"
												sx={{ p: 2, mb: 2, borderRadius: 2 }}>
												<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
													<Box>
														<Typography fontWeight={700}>
															Chi tiết #{idx + 1}
														</Typography>
														<Typography variant="body2" color="text.secondary">
															Nhân viên: {detail.employee?.employee_name || detail.employee_id || '—'}
														</Typography>
														<Typography variant="body2" color="text.secondary">
															Ngày sửa: {detail.repair_date
																? dayjs(detail.repair_date).format('DD/MM/YYYY') : '—'}
														</Typography>
														{detail.note && (
															<Typography variant="body2" color="text.secondary">
																Ghi chú: {detail.note}
															</Typography>
														)}
													</Box>
													{!selectedTicket?.completed_date && (
														<Button size="small" variant="contained"
															startIcon={<CartIcon />}
															onClick={() => openSparePartsForDetail(detail)}>
															Quản lý phụ tùng
														</Button>
													)}
												</Box>

												<Divider sx={{ my: 1 }}>Phụ tùng đã dùng</Divider>

												{(detail.usages || []).length === 0 ? (
													<Typography variant="body2" color="text.secondary"
														sx={{ textAlign: 'center', py: 1 }}>
														Chưa có phụ tùng
													</Typography>
												) : (
													<Table size="small">
														<TableHead>
															<TableRow>
																<TableCell>Tên phụ tùng</TableCell>
																<TableCell align="right">SL</TableCell>
																<TableCell align="right">Đơn giá</TableCell>
																<TableCell align="right">Thành tiền</TableCell>
															</TableRow>
														</TableHead>
														<TableBody>
															{detail.usages.map(u => (
																<TableRow key={u.id}>
																	<TableCell>{u.spare_part?.name || '—'}</TableCell>
																	<TableCell align="right">{u.quantity}</TableCell>
																	<TableCell align="right">
																		{parseFloat(u.spare_part?.price || 0).toLocaleString()}đ
																	</TableCell>
																	<TableCell align="right">
																		{(u.quantity * parseFloat(u.spare_part?.price || 0)).toLocaleString()}đ
																	</TableCell>
																</TableRow>
															))}
														</TableBody>
													</Table>
												)}
											</Paper>
										))}
									</Box>
								)}
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgViewDetails(false)}>Đóng</Button>
							</DialogActions>
						</Dialog>

						{/* ── DIALOG: Thêm / cập nhật repair_detail ────────────────────────────── */}
						<Dialog open={dlgAddDetail} onClose={() => setDlgAddDetail(false)}
							maxWidth="sm" fullWidth>
							<DialogTitle>
								{repairDetails.length === 0 ? 'Tạo chi tiết sửa xe' : 'Cập nhật chi tiết sửa xe'}
							</DialogTitle>
							<DialogContent>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
									<FormControl fullWidth>
										<InputLabel>Nhân viên sửa chữa</InputLabel>
										<Select
											value={detailForm.employee_id}
											label="Nhân viên sửa chữa"
											onChange={(e) => setDetailForm({ ...detailForm, employee_id: e.target.value })}
										>
											<MenuItem value="">— Chọn nhân viên —</MenuItem>
											{employees.map(emp => (
												<MenuItem key={emp.id} value={emp.id}>
													{emp.employee_name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<DatePicker
										label="Ngày sửa"
										value={detailForm.repair_date}
										onChange={(d) => setDetailForm({ ...detailForm, repair_date: d })}
										slotProps={{ textField: { fullWidth: true } }}
									/>
									<TextField
										label="Ghi chú" multiline rows={3} fullWidth
										value={detailForm.note}
										onChange={(e) => setDetailForm({ ...detailForm, note: e.target.value })}
									/>
								</Box>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgAddDetail(false)}>Hủy</Button>
								<Button variant="contained" onClick={handleSaveDetail}>Lưu</Button>
							</DialogActions>
						</Dialog>

						{/* ── DIALOG: Chọn phụ tùng cho 1 repair_detail ───────────────────────── */}
						<Dialog open={dlgSpareParts} onClose={() => setDlgSpareParts(false)}
							maxWidth="lg" fullWidth>
							<DialogTitle>Phụ tùng — Chi tiết sửa</DialogTitle>
							<DialogContent>
								<Grid container spacing={2}>
									{/* Bảng phụ tùng đã dùng */}
									<Grid item xs={12} md={5}>
										<Typography fontWeight={700} gutterBottom>Đã sử dụng</Typography>
										<TableContainer component={Paper} variant="outlined">
											<Table size="small">
												<TableHead>
													<TableRow>
														<TableCell>Tên</TableCell>
														<TableCell align="right">SL</TableCell>
														<TableCell align="right">Tiền</TableCell>
														<TableCell />
													</TableRow>
												</TableHead>
												<TableBody>
													{detailUsages.length === 0 ? (
														<TableRow>
															<TableCell colSpan={4} align="center">Chưa có</TableCell>
														</TableRow>
													) : detailUsages.map(u => (
														<TableRow key={u.id}>
															<TableCell>{u.spare_part?.name}</TableCell>
															<TableCell align="right">{u.quantity}</TableCell>
															<TableCell align="right">
																{(u.quantity * parseFloat(u.spare_part?.price || 0)).toLocaleString()}đ
															</TableCell>
															<TableCell align="center">
																<IconButton size="small" color="error"
																	onClick={() => handleRemoveSparePart(u)}>
																	<DeleteIcon fontSize="small" />
																</IconButton>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>

									{/* Bảng kho phụ tùng */}
									<Grid item xs={12} md={7}>
										<Typography fontWeight={700} gutterBottom>Kho phụ tùng</Typography>
										<TableContainer component={Paper} variant="outlined"
											sx={{ maxHeight: 400, overflow: 'auto' }}>
											<Table size="small" stickyHeader>
												<TableHead>
													<TableRow>
														<TableCell>Tên</TableCell>
														<TableCell align="right">Tồn</TableCell>
														<TableCell align="right">Giá</TableCell>
														<TableCell align="center">Thêm</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{spareParts.map(part => (
														<TableRow key={part.id}>
															<TableCell>{part.name}</TableCell>
															<TableCell align="right">{part.quantity_in_stock}</TableCell>
															<TableCell align="right">
																{parseFloat(part.price || 0).toLocaleString()}đ
															</TableCell>
															<TableCell align="center">
																<Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
																	<TextField
																		type="number" size="small"
																		defaultValue={1}
																		inputProps={{
																			min: 1, max: part.quantity_in_stock,
																			style: { width: 55 }
																		}}
																		onChange={(e) => setQty({
																			...qty,
																			[part.id]: parseInt(e.target.value) || 1
																		})}
																	/>
																	<Button size="small" variant="contained"
																		disabled={part.quantity_in_stock === 0}
																		onClick={() => handleAddSparePart(part.id)}>
																		Thêm
																	</Button>
																</Box>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgSpareParts(false)}>Đóng</Button>
							</DialogActions>
						</Dialog>

						{/* ── DIALOG: Tạo hóa đơn ──────────────────────────────────────────────── */}
						<Dialog open={dlgInvoice} onClose={() => setDlgInvoice(false)}
							maxWidth="sm" fullWidth>
							<DialogTitle>Tạo hóa đơn</DialogTitle>
							<DialogContent>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
									<DatePicker
										label="Ngày tạo hóa đơn"
										value={invoiceForm.created_date}
										onChange={(d) => setInvoiceForm({ ...invoiceForm, created_date: d })}
										slotProps={{ textField: { fullWidth: true } }}
									/>
									<FormControl fullWidth>
										<InputLabel>Phương thức thanh toán</InputLabel>
										<Select
											value={invoiceForm.payment_method}
											label="Phương thức thanh toán"
											onChange={(e) => setInvoiceForm({ ...invoiceForm, payment_method: e.target.value })}
										>
											<MenuItem value="CASH">Tiền mặt</MenuItem>
											<MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
											<MenuItem value="CREDIT_CARD">Thẻ tín dụng</MenuItem>
										</Select>
									</FormControl>

									<Divider />

									{/* Tóm tắt chi phí */}
									<Box>
										<Typography variant="subtitle2" fontWeight={700} gutterBottom>
											Chi tiết thanh toán
										</Typography>
										{selectedTicket?.service && (
											<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
												<Typography variant="body2">
													Dịch vụ: {selectedTicket.service.name}
												</Typography>
												<Typography variant="body2">
													{parseFloat(selectedTicket.service.price).toLocaleString()}đ
												</Typography>
											</Box>
										)}
										{repairDetails.map((detail, idx) =>
											(detail.usages || []).map(u => (
												<Box key={u.id}
													sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
													<Typography variant="body2" color="text.secondary">
														#{idx + 1} {u.spare_part?.name} × {u.quantity}
													</Typography>
													<Typography variant="body2">
														{(u.quantity * parseFloat(u.spare_part?.price || 0)).toLocaleString()}đ
													</Typography>
												</Box>
											))
										)}
										<Divider sx={{ my: 1 }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
											<Typography fontWeight={700}>Tổng cộng</Typography>
											<Typography fontWeight={700} color="primary">
												{calcTotal().toLocaleString()}đ
											</Typography>
										</Box>
									</Box>
								</Box>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setDlgInvoice(false)}>Hủy</Button>
								<Button variant="contained" color="success" onClick={handleCreateInvoice}>
									Xác nhận tạo hóa đơn
								</Button>
							</DialogActions>
						</Dialog>
					</>
				)}

				{/* ── Snackbar ──────────────────────────────────────────────────────────── */}
				<Snackbar
					open={snackbar.open} autoHideDuration={3000}
					onClose={() => setSnackbar(s => ({ ...s, open: false }))}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert severity={snackbar.severity}
						onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</Container>
		</LocalizationProvider>
	);
};

export default GarageManagement;