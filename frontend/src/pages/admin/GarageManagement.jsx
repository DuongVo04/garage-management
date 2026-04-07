import React, { useState, useEffect, useCallback } from 'react';
import {
	Container, Paper, Box, Typography, Tabs, Tab,
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	TablePagination,
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
	updateRepairAppointmentStatus,
	cancelOverdueAppointments
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
import { getAllVouchers } from '../../services/voucher.service';

// ─── Tab Panel ────────────────────────────────────────────────────────────────
const TabPanel = ({ children, value, index }) => (
	<div role="tabpanel" hidden={value !== index}>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</div>
);

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
	const map = {
		booked: { label: 'Đã đặt', color: 'info' },
		confirmed: { label: 'Đã xác nhận', color: 'success' },
		completed: { label: 'Hoàn thành', color: 'success' },
		cancelled: { label: 'Đã hủy', color: 'error' },
		PENDING: { label: 'Chờ xác nhận', color: 'warning' },
		CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
		IN_PROGRESS: { label: 'Đang sửa', color: 'warning' },
		COMPLETED: { label: 'Hoàn thành', color: 'success' },
		CANCELLED: { label: 'Đã hủy', color: 'error' },
	};
	const cfg = map[status] || { label: status, color: 'default' };
	return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

const ROWS_PER_PAGE = 10;

// ─── Main Component ───────────────────────────────────────────────────────────
const GarageManagement = () => {
	const [activeTab, setActiveTab] = useState(0);

	// ── Pagination state ──────────────────────────────────────────────────────
	const [apptPage, setApptPage] = useState(0);
	const [ticketPage, setTicketPage] = useState(0);

	const [appointments, setAppointments] = useState([]);
	const [repairTickets, setRepairTickets] = useState([]);
	const [spareParts, setSpareParts] = useState([]);
	const [services, setServices] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [vouchers, setVouchers] = useState([]);

	const [loadingAppts, setLoadingAppts] = useState(false);
	const [loadingTickets, setLoadingTickets] = useState(false);

	const [selectedTicket, setSelectedTicket] = useState(null);
	const [repairDetails, setRepairDetails] = useState([]);
	const [loadingDetails, setLoadingDetails] = useState(false);

	const [dlgCreateTicket, setDlgCreateTicket] = useState(false);
	const [dlgViewDetails, setDlgViewDetails] = useState(false);
	const [dlgViewAppointment, setDlgViewAppointment] = useState(false);
	const [dlgAddDetail, setDlgAddDetail] = useState(false);
	const [dlgSpareParts, setDlgSpareParts] = useState(false);
	const [dlgInvoice, setDlgInvoice] = useState(false);
	const [dlgViewRepairDetail, setDlgViewRepairDetail] = useState(false);

	const [selectedDetail, setSelectedDetail] = useState(null);
	const [editingDetail, setEditingDetail] = useState(null);
	const [detailUsages, setDetailUsages] = useState([]);
	const [tempUsages, setTempUsages] = useState([]);
	const [selectedAppointment, setSelectedAppointment] = useState(null);

	const [ticketForm, setTicketForm] = useState({
		service_id: '', created_date: dayjs(), description: ''
	});
	const [detailForm, setDetailForm] = useState({
		employee_id: '', note: '', repair_date: null
	});
	const [invoiceForm, setInvoiceForm] = useState({
		payment_method: 'CASH', created_date: dayjs(), voucherCode: '', discount_id: null
	});
	const [qty, setQty] = useState({});

	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	const toast = (message, severity = 'success') =>
		setSnackbar({ open: true, message, severity });

	const loadAppointments = useCallback(async () => {
		setLoadingAppts(true);
		try {
			await cancelOverdueAppointments();
			const res = await getAllRepairAppointments();
			setAppointments(res.success ? (res.data || []) : []);
			setApptPage(0); // reset về trang 1 mỗi khi reload
		} catch { toast('Không thể tải lịch hẹn', 'error'); }
		finally { setLoadingAppts(false); }
	}, []);

	const loadRepairTickets = useCallback(async () => {
		setLoadingTickets(true);
		try {
			const res = await getAllRepairTickets();
			setRepairTickets(res.success ? (res.data || []) : []);
			setTicketPage(0); // reset về trang 1 mỗi khi reload
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
			const [sRes, eRes, vRes] = await Promise.all([getAllServices(), getEmployees(), getAllVouchers('active')]);
			if (sRes.success) setServices(sRes.data || []);
			if (eRes.success) setEmployees(eRes.data || []);
			if (vRes.success) setVouchers(vRes.data || []);
		} catch { }
	}, []);

	const loadRepairDetails = useCallback(async (ticketId) => {
		if (!ticketId) return;
		setLoadingDetails(true);
		try {
			const res = await getRepairDetailsByTicketId(ticketId);
			if (res.success) {
				const detailsRaw = Array.isArray(res.data)
					? res.data
					: res.data ? [res.data] : [];

				const detailsWithUsages = await Promise.all(
					detailsRaw.map(async (detail) => {
						try {
							const usageRes = await getSparePartsUsagesByRepairDetailId(detail.id);
							return { ...detail, usages: usageRes.success ? (usageRes.data || []) : [] };
						} catch {
							return { ...detail, usages: [] };
						}
					})
				);
				setRepairDetails(detailsWithUsages);
			} else {
				setRepairDetails([]);
				toast(res.message || 'Không tìm thấy chi tiết sửa chữa', 'warning');
			}
		} catch (error) {
			if (error.response?.status === 404) {
				setRepairDetails([]);
				toast('Phiếu này chưa có chi tiết sửa chữa nào', 'info');
			} else {
				toast('Lỗi khi tải chi tiết sửa chữa', 'error');
			}
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

	// ── Paginated slices ───────────────────────────────────────────────────────
	const paginatedAppointments = appointments.slice(
		apptPage * ROWS_PER_PAGE,
		apptPage * ROWS_PER_PAGE + ROWS_PER_PAGE
	);

	const paginatedTickets = repairTickets.slice(
		ticketPage * ROWS_PER_PAGE,
		ticketPage * ROWS_PER_PAGE + ROWS_PER_PAGE
	);

	// ── Handlers ───────────────────────────────────────────────────────────────
	const openCreateTicket = (appointment) => {
		setSelectedAppointment(appointment);
		setTicketForm({ service_id: '', created_date: dayjs(), description: '' });
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
				description: ticketForm.description
			});
			if (res.success) {
				toast('Tạo phiếu sửa xe thành công');
				setDlgCreateTicket(false);
				await Promise.all([loadRepairTickets(), loadAppointments()]);
				setActiveTab(1);
			} else {
				toast(res.message || 'Tạo phiếu thất bại', 'error');
			}
		} catch { toast('Có lỗi xảy ra', 'error'); }
	};

	const openViewAppointment = (appointment) => {
		setSelectedAppointment(appointment);
		setDlgViewAppointment(true);
	};

	const openViewDetails = async (ticket) => {
		setSelectedTicket(ticket);
		await loadRepairDetails(ticket.id);
		setDlgViewDetails(true);
	};

	const openViewRepairDetail = (detail) => {
		setSelectedDetail(detail);
		setDlgViewRepairDetail(true);
	};

	const openAddDetail = async () => {
		setEditingDetail(null);
		setDetailForm({ employee_id: '', note: '', repair_date: null });
		setTempUsages([]);
		setQty({});
		await loadSpareParts();
		setDlgAddDetail(true);
	};

	const openEditDetail = async (detail) => {
		setEditingDetail(detail);
		setDetailForm({
			employee_id: detail.employee_id || '',
			note: detail.note || '',
			repair_date: detail.repair_date ? dayjs(detail.repair_date) : null,
		});
		setTempUsages([]);
		setQty({});
		await loadSpareParts();
		setDlgAddDetail(true);
	};

	const handleAddSparePartTemp = (partId) => {
		const quantity = qty[partId] || 1;
		const part = spareParts.find(p => p.id === partId);
		if (!part) return;
		if (part.quantity_in_stock < quantity) {
			toast(`Tồn kho không đủ (còn ${part.quantity_in_stock})`, 'error');
			return;
		}
		if (tempUsages.some(u => u.spare_parts_id === partId)) {
			toast('Phụ tùng này đã được thêm', 'warning');
			return;
		}
		setTempUsages([...tempUsages, {
			id: `temp_${Date.now()}_${partId}`,
			spare_parts_id: partId,
			quantity,
			spare_part: part,
			isTemp: true
		}]);
		setQty({});
		toast('Đã thêm phụ tùng vào danh sách', 'success');
	};

	const handleRemoveSparePartTemp = (usageId) => {
		setTempUsages(tempUsages.filter(u => u.id !== usageId));
		toast('Đã xóa phụ tùng khỏi danh sách', 'success');
	};

	const handleSaveDetail = async () => {
		if (!selectedTicket) return;
		if (!detailForm.employee_id) {
			toast('Vui lòng chọn nhân viên sửa chữa', 'warning');
			return;
		}
		try {
			const data = {
				employee_id: detailForm.employee_id,
				note: detailForm.note || null,
				repair_date: detailForm.repair_date ? detailForm.repair_date.toISOString() : null,
			};

			let detailRes, detailId;
			if (editingDetail) {
				detailId = editingDetail.id;
				detailRes = await updateRepairDetail(detailId, data);
			} else {
				detailRes = await createRepairDetail(selectedTicket.id, data);
				if (detailRes.success && detailRes.data) {
					detailId = detailRes.data.id;
					if (repairDetails.length === 0 && selectedTicket.appointment_id) {
						await updateRepairAppointmentStatus(selectedTicket.appointment_id, 'confirmed');
					}
				}
			}

			if (!detailRes?.success) {
				toast(detailRes?.message || 'Lưu chi tiết thất bại', 'error');
				return;
			}

			let stockUpdateErrors = [];
			if (detailId && tempUsages.length > 0) {
				for (const tempUsage of tempUsages) {
					const usageRes = await createSparePartsUsage({
						repair_detail_id: detailId,
						spare_parts_id: tempUsage.spare_parts_id,
						quantity: tempUsage.quantity,
						usage_date: new Date().toISOString().split('T')[0]
					});
					if (usageRes.success) {
						try {
							await updateSparePart(tempUsage.spare_parts_id, {
								quantity_in_stock: tempUsage.spare_part.quantity_in_stock - tempUsage.quantity
							});
						} catch (e) {
							stockUpdateErrors.push({ partName: tempUsage.spare_part?.name, error: e.message });
						}
					}
				}
			}

			toast(stockUpdateErrors.length > 0
				? `Lưu thành công nhưng có ${stockUpdateErrors.length} lỗi cập nhật tồn kho`
				: 'Lưu chi tiết sửa xe thành công',
				stockUpdateErrors.length > 0 ? 'warning' : 'success'
			);
			setDlgAddDetail(false);
			setTempUsages([]);
			setEditingDetail(null);
			await loadRepairDetails(selectedTicket.id);
			await loadSpareParts();
		} catch (error) {
			toast(error.response?.data?.message || 'Có lỗi xảy ra khi lưu chi tiết', 'error');
		}
	};

	const openSparePartsForDetail = async (detail) => {
		setSelectedDetail(detail);
		await loadSpareParts();
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
				await updateSparePart(partId, { quantity_in_stock: part.quantity_in_stock - quantity });
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
			if (part) await updateSparePart(part.id, { quantity_in_stock: part.quantity_in_stock + usage.quantity });
			const res = await deleteSparePartsUsage(usage.id);
			if (res.success) {
				toast('Đã xóa phụ tùng');
				const usageRes = await getSparePartsUsagesByRepairDetailId(selectedDetail.id);
				setDetailUsages(usageRes.success ? (usageRes.data || []) : []);
				await loadSpareParts();
			}
		} catch { toast('Có lỗi xảy ra', 'error'); }
	};

	const openInvoice = async (ticket) => {
		setSelectedTicket(ticket);
		await loadRepairDetails(ticket.id);
		setInvoiceForm({ payment_method: 'CASH', created_date: dayjs(), voucherCode: '', discount_id: null });
		setDlgInvoice(true);
	};

	const calcRawTotal = () => {
		let total = selectedTicket?.service?.price ? parseFloat(selectedTicket.service.price) : 0;
		repairDetails.forEach(detail => {
			(detail.usages || []).forEach(u => {
				total += u.quantity * parseFloat(u.spare_part?.unit_price || 0);
			});
		});
		return total;
	};

	const selectedVoucher = vouchers.find(v => v.code === invoiceForm.voucherCode?.trim());

	const calcTotal = () => {
		const raw = calcRawTotal();
		if (!selectedVoucher) return raw;
		return raw * (1 - (selectedVoucher.percent || 0) / 100);
	};

	const handleCreateInvoice = async () => {
		try {
			const invoiceRes = await createInvoice({
				ticket_id: selectedTicket.id,
				total_cost: Math.round(calcTotal()),
				payment_method: invoiceForm.payment_method,
				created_date: invoiceForm.created_date.format('YYYY-MM-DD'),
				...(selectedVoucher ? { discount_id: selectedVoucher.id } : {})
			});
			if (!invoiceRes.success) {
				toast(invoiceRes.message || 'Tạo hóa đơn thất bại', 'error');
				return;
			}
			for (const detail of repairDetails) {
				for (const usage of (detail.usages || [])) {
					try {
						await createSparePartsWarranty({
							usage_id: usage.id,
							start_date: Math.floor(Date.now() / 1000),
							duration: 365
						});
					} catch (e) {
						console.warn('Warranty skipped for usage:', usage.id, e.message);
					}
				}
			}
			await completeRepairTicket(selectedTicket.id);
			if (selectedTicket.appointment_id) {
				await updateRepairAppointmentStatus(selectedTicket.appointment_id, 'completed');
			}
			toast('Tạo hóa đơn thành công');
			setDlgInvoice(false);
			await Promise.all([loadRepairTickets(), loadAppointments()]);
			setActiveTab(0);
		} catch { toast('Có lỗi xảy ra khi tạo hóa đơn', 'error'); }
	};

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

					{/* ── TAB 0: Lịch hẹn ── */}
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
									) : paginatedAppointments.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
										</TableRow>
									) : paginatedAppointments.map((app) => {
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
													{(app.status === 'confirmed' || app.status === 'booked') && (
														<Button
															variant="contained" size="small" startIcon={<BuildIcon />}
															onClick={() => openCreateTicket(app)} sx={{ mr: 1 }}
														>
															Tạo phiếu sửa
														</Button>
													)}
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

						<TablePagination
							component="div"
							count={appointments.length}
							page={apptPage}
							onPageChange={(_, newPage) => setApptPage(newPage)}
							rowsPerPage={ROWS_PER_PAGE}
							rowsPerPageOptions={[ROWS_PER_PAGE]}
							labelDisplayedRows={({ from, to, count }) =>
								`${from}–${to} / ${count} lịch hẹn`
							}
						/>
					</TabPanel>

					{/* ── TAB 1: Phiếu sửa xe ── */}
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
									) : paginatedTickets.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
										</TableRow>
									) : paginatedTickets.map((ticket) => (
										<TableRow key={ticket.id}>
											<TableCell>{dayjs(ticket.created_date).format('DD/MM/YYYY HH:mm')}</TableCell>
											<TableCell>{ticket.service?.name || '—'}</TableCell>
											<TableCell>{ticket.vehicle?.name || '—'}</TableCell>
											<TableCell>{ticket.vehicle?.plate_number || '—'}</TableCell>
											<TableCell>
												<Tooltip title={ticket.description || 'Không có mô tả'}>
													<Typography variant="body2" sx={{
														maxWidth: 200, overflow: 'hidden',
														textOverflow: 'ellipsis', whiteSpace: 'nowrap'
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
													<IconButton size="small" onClick={() => openViewDetails(ticket)}><ViewIcon /></IconButton>
												</Tooltip>
												{!ticket.completed_date && (
													<>
														<Tooltip title="Tạo hóa đơn">
															<IconButton size="small" color="success" onClick={() => openInvoice(ticket)}><PaidIcon /></IconButton>
														</Tooltip>
														<Tooltip title="Xóa phiếu">
															<IconButton size="small" color="error" onClick={async () => {
																await deleteRepairTicket(ticket.id);
																await loadRepairTickets();
																toast('Xóa thành công');
															}}>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													</>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							component="div"
							count={repairTickets.length}
							page={ticketPage}
							onPageChange={(_, newPage) => setTicketPage(newPage)}
							rowsPerPage={ROWS_PER_PAGE}
							rowsPerPageOptions={[ROWS_PER_PAGE]}
							labelDisplayedRows={({ from, to, count }) =>
								`${from}–${to} / ${count} phiếu sửa`
							}
						/>
					</TabPanel>
				</Paper>

				{/* DIALOG: Xem chi tiết lịch hẹn */}
				<Dialog open={dlgViewAppointment} onClose={() => setDlgViewAppointment(false)} maxWidth="sm" fullWidth>
					<DialogTitle>Chi tiết lịch hẹn</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<TextField label="Khách hàng" value={selectedAppointment?.customer?.full_name || '—'} disabled fullWidth />
							<TextField label="Số điện thoại" value={selectedAppointment?.customer?.phone_number || '—'} disabled fullWidth />
							<TextField label="Email" value={selectedAppointment?.customer?.email || '—'} disabled fullWidth />
							<TextField label="Ngày hẹn" value={selectedAppointment?.appointment_date ? dayjs(selectedAppointment.appointment_date).format('DD/MM/YYYY HH:mm') : '—'} disabled fullWidth />
							<TextField label="Xe" value={selectedAppointment?.vehicles?.[0]?.name || '—'} disabled fullWidth />
							<TextField label="Biển số" value={selectedAppointment?.vehicles?.[0]?.plate_number || '—'} disabled fullWidth />
							<TextField label="Trạng thái" value={selectedAppointment?.status || '—'} disabled fullWidth />
						</Box>
					</DialogContent>
					<DialogActions><Button onClick={() => setDlgViewAppointment(false)}>Đóng</Button></DialogActions>
				</Dialog>

				{/* DIALOG: Tạo phiếu sửa xe */}
				<Dialog open={dlgCreateTicket} onClose={() => setDlgCreateTicket(false)} maxWidth="sm" fullWidth>
					<DialogTitle>Tạo phiếu sửa xe</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<TextField label="Khách hàng" value={selectedAppointment?.customer?.full_name || ''} disabled fullWidth />
							<TextField label="Xe" value={selectedAppointment?.vehicles?.[0]?.name || ''} disabled fullWidth />
							<FormControl fullWidth>
								<InputLabel>Dịch vụ *</InputLabel>
								<Select value={ticketForm.service_id} label="Dịch vụ *" onChange={(e) => setTicketForm({ ...ticketForm, service_id: e.target.value })}>
									{services.map(s => (<MenuItem key={s.id} value={s.id}>{s.name} — {parseFloat(s.price).toLocaleString()}đ</MenuItem>))}
								</Select>
							</FormControl>
							<TextField label="Mô tả công việc" multiline rows={3} fullWidth placeholder="Nhập mô tả chi tiết công việc cần sửa chữa..." value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} />
							<DatePicker label="Ngày tạo" value={ticketForm.created_date} onChange={(d) => setTicketForm({ ...ticketForm, created_date: d })} slotProps={{ textField: { fullWidth: true } }} />
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDlgCreateTicket(false)}>Hủy</Button>
						<Button variant="contained" onClick={handleCreateTicket}>Tạo phiếu</Button>
					</DialogActions>
				</Dialog>

				{/* DIALOG: Xem chi tiết sửa xe (danh sách) */}
				<Dialog open={dlgViewDetails} onClose={() => setDlgViewDetails(false)} maxWidth="md" fullWidth>
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
										<Button variant="outlined" startIcon={<AddIcon />} onClick={openAddDetail}>
											Thêm chi tiết sửa
										</Button>
									)}
								</Box>
								{repairDetails.length === 0 ? (
									<Alert severity="info">Chưa có chi tiết sửa xe nào</Alert>
								) : repairDetails.map((detail, idx) => (
									<Paper key={detail.id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
											<Box sx={{ flex: 1 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
													<Typography fontWeight={700}>Chi tiết #{idx + 1}</Typography>
													<Tooltip title="Xem chi tiết đầy đủ">
														<IconButton size="small" color="info" onClick={() => openViewRepairDetail(detail)}>
															<ViewIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</Box>
												<Typography variant="body2" color="text.secondary">
													Nhân viên: {detail.employee?.employee_name || detail.employee_id || '—'}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Ngày sửa: {detail.repair_date ? dayjs(detail.repair_date).format('DD/MM/YYYY') : '—'}
												</Typography>
												{detail.note && (
													<Typography variant="body2" color="text.secondary" sx={{
														overflow: 'hidden', textOverflow: 'ellipsis',
														display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
													}}>
														Ghi chú: {detail.note}
													</Typography>
												)}
											</Box>
											{!selectedTicket?.completed_date && (
												<Box sx={{ display: 'flex', gap: 1 }}>
													<Button size="small" variant="outlined" onClick={() => openEditDetail(detail)}>Chỉnh sửa</Button>
													<Button size="small" variant="contained" startIcon={<CartIcon />} onClick={() => openSparePartsForDetail(detail)}>Quản lý phụ tùng</Button>
												</Box>
											)}
										</Box>
										<Divider sx={{ my: 1 }}>Phụ tùng đã dùng</Divider>
										{(detail.usages || []).length === 0 ? (
											<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>Chưa có phụ tùng</Typography>
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
															<TableCell align="right">{parseFloat(u.spare_part?.unit_price || 0).toLocaleString()}đ</TableCell>
															<TableCell align="right">{(u.quantity * parseFloat(u.spare_part?.unit_price || 0)).toLocaleString()}đ</TableCell>
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
					<DialogActions><Button onClick={() => setDlgViewDetails(false)}>Đóng</Button></DialogActions>
				</Dialog>

				{/* DIALOG: Xem 1 repair detail */}
				<Dialog open={dlgViewRepairDetail} onClose={() => setDlgViewRepairDetail(false)} maxWidth="md" fullWidth>
					<DialogTitle>
						Chi tiết sửa chữa
						{selectedDetail && (
							<Typography variant="body2" color="text.secondary">Mã chi tiết: {selectedDetail.id}</Typography>
						)}
					</DialogTitle>
					<DialogContent>
						{selectedDetail ? (
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
								<Paper variant="outlined" sx={{ p: 2 }}>
									<Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary">Thông tin chung</Typography>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Nhân viên sửa chữa</Typography>
											<Typography variant="body1" fontWeight={500}>{selectedDetail.employee?.employee_name || selectedDetail.employee_id || '—'}</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Ngày sửa chữa</Typography>
											<Typography variant="body1" fontWeight={500}>{selectedDetail.repair_date ? dayjs(selectedDetail.repair_date).format('DD/MM/YYYY') : '—'}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="caption" color="text.secondary">Ghi chú</Typography>
											<Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedDetail.note || '—'}</Typography>
										</Grid>
									</Grid>
								</Paper>
								<Paper variant="outlined" sx={{ p: 2 }}>
									<Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary">Thông tin xe & dịch vụ</Typography>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Xe</Typography>
											<Typography variant="body2">{selectedTicket?.vehicle?.name || '—'}</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Biển số</Typography>
											<Typography variant="body2">{selectedTicket?.vehicle?.plate_number || '—'}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="caption" color="text.secondary">Dịch vụ</Typography>
											<Typography variant="body2">{selectedTicket?.service?.name || '—'} - {parseFloat(selectedTicket?.service?.price || 0).toLocaleString()}đ</Typography>
										</Grid>
										{selectedTicket?.description && (
											<Grid item xs={12}>
												<Typography variant="caption" color="text.secondary">Mô tả công việc</Typography>
												<Typography variant="body2" color="text.secondary">{selectedTicket.description}</Typography>
											</Grid>
										)}
									</Grid>
								</Paper>
								<Paper variant="outlined" sx={{ p: 2 }}>
									<Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary">Phụ tùng đã sử dụng</Typography>
									{(selectedDetail.usages || []).length === 0 ? (
										<Alert severity="info" sx={{ mt: 1 }}>Chưa có phụ tùng nào được sử dụng</Alert>
									) : (
										<TableContainer>
											<Table size="small">
												<TableHead>
													<TableRow>
														<TableCell>Tên phụ tùng</TableCell>
														<TableCell align="right">Số lượng</TableCell>
														<TableCell align="right">Đơn giá</TableCell>
														<TableCell align="right">Thành tiền</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{selectedDetail.usages.map(u => (
														<TableRow key={u.id}>
															<TableCell>{u.spare_part?.name || '—'}</TableCell>
															<TableCell align="right">{u.quantity}</TableCell>
															<TableCell align="right">{parseFloat(u.spare_part?.unit_price || 0).toLocaleString()}đ</TableCell>
															<TableCell align="right">{(u.quantity * parseFloat(u.spare_part?.unit_price || 0)).toLocaleString()}đ</TableCell>
														</TableRow>
													))}
												</TableBody>
												<TableHead>
													<TableRow>
														<TableCell colSpan={3} align="right"><Typography fontWeight={700}>Tổng tiền phụ tùng:</Typography></TableCell>
														<TableCell align="right">
															<Typography fontWeight={700} color="primary">
																{selectedDetail.usages.reduce((sum, u) => sum + (u.quantity * parseFloat(u.spare_part?.unit_price || 0)), 0).toLocaleString()}đ
															</Typography>
														</TableCell>
													</TableRow>
												</TableHead>
											</Table>
										</TableContainer>
									)}
								</Paper>
							</Box>
						) : (
							<Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDlgViewRepairDetail(false)}>Đóng</Button>
						{!selectedTicket?.completed_date && selectedDetail && (
							<Button variant="contained" startIcon={<CartIcon />} onClick={() => {
								setDlgViewRepairDetail(false);
								openSparePartsForDetail(selectedDetail);
							}}>
								Quản lý phụ tùng
							</Button>
						)}
					</DialogActions>
				</Dialog>

				{/* DIALOG: Thêm / cập nhật repair_detail */}
				<Dialog open={dlgAddDetail} onClose={() => { setDlgAddDetail(false); setTempUsages([]); setEditingDetail(null); }} maxWidth="lg" fullWidth>
					<DialogTitle>{editingDetail ? 'Cập nhật chi tiết sửa xe' : 'Thêm chi tiết sửa xe mới'}</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary">
									Thông tin chung <span style={{ color: 'red' }}>*</span>
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} md={6}>
										<FormControl fullWidth required>
											<InputLabel>Nhân viên sửa chữa *</InputLabel>
											<Select value={detailForm.employee_id} label="Nhân viên sửa chữa *" onChange={(e) => setDetailForm({ ...detailForm, employee_id: e.target.value })}>
												<MenuItem value="">— Chọn nhân viên —</MenuItem>
												{employees.map(emp => (<MenuItem key={emp.id} value={emp.id}>{emp.employee_name}</MenuItem>))}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} md={6}>
										<DatePicker label="Ngày sửa" value={detailForm.repair_date} onChange={(d) => setDetailForm({ ...detailForm, repair_date: d })} slotProps={{ textField: { fullWidth: true } }} />
									</Grid>
									<Grid item xs={12}>
										<TextField label="Ghi chú" multiline rows={2} fullWidth placeholder="Nhập ghi chú về công việc sửa chữa..." value={detailForm.note} onChange={(e) => setDetailForm({ ...detailForm, note: e.target.value })} />
									</Grid>
								</Grid>
							</Paper>
							<Paper variant="outlined" sx={{ p: 2 }}>
								<Typography variant="subtitle1" fontWeight={700} gutterBottom color="primary">Phụ tùng sử dụng</Typography>
								<Typography variant="caption" color="text.secondary" gutterBottom display="block">Danh sách phụ tùng đã thêm</Typography>
								<TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>Tên phụ tùng</TableCell>
												<TableCell align="right">Số lượng</TableCell>
												<TableCell align="right">Đơn giá</TableCell>
												<TableCell align="right">Thành tiền</TableCell>
												<TableCell align="center">Thao tác</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{tempUsages.length === 0 ? (
												<TableRow>
													<TableCell colSpan={5} align="center">
														<Typography variant="body2" color="text.secondary">Chưa có phụ tùng nào được thêm</Typography>
													</TableCell>
												</TableRow>
											) : tempUsages.map((usage) => (
												<TableRow key={usage.id}>
													<TableCell>{usage.spare_part?.name || '—'}</TableCell>
													<TableCell align="right">{usage.quantity}</TableCell>
													<TableCell align="right">{parseFloat(usage.spare_part?.unit_price || 0).toLocaleString()}đ</TableCell>
													<TableCell align="right">{(usage.quantity * parseFloat(usage.spare_part?.unit_price || 0)).toLocaleString()}đ</TableCell>
													<TableCell align="center">
														<IconButton size="small" color="error" onClick={() => handleRemoveSparePartTemp(usage.id)}>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
										{tempUsages.length > 0 && (
											<TableHead>
												<TableRow>
													<TableCell colSpan={3} align="right"><Typography fontWeight={700}>Tổng tiền phụ tùng:</Typography></TableCell>
													<TableCell align="right">
														<Typography fontWeight={700} color="primary">
															{tempUsages.reduce((sum, u) => sum + (u.quantity * parseFloat(u.spare_part?.unit_price || 0)), 0).toLocaleString()}đ
														</Typography>
													</TableCell>
													<TableCell />
												</TableRow>
											</TableHead>
										)}
									</Table>
								</TableContainer>
								<Typography variant="caption" color="text.secondary" gutterBottom display="block">Thêm phụ tùng từ kho</Typography>
								<TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
									<Table size="small" stickyHeader>
										<TableHead>
											<TableRow>
												<TableCell>Tên phụ tùng</TableCell>
												<TableCell align="right">Tồn kho</TableCell>
												<TableCell align="right">Đơn giá</TableCell>
												<TableCell align="center">Số lượng</TableCell>
												<TableCell align="center">Thao tác</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{spareParts.map(part => {
												const isAdded = tempUsages.some(u => u.spare_parts_id === part.id);
												return (
													<TableRow key={part.id} sx={{ opacity: isAdded ? 0.6 : 1 }}>
														<TableCell>{part.name}</TableCell>
														<TableCell align="right">{part.quantity_in_stock}</TableCell>
														<TableCell align="right">{parseFloat(part.unit_price || 0).toLocaleString()}đ</TableCell>
														<TableCell align="center">
															<TextField type="number" size="small" defaultValue={1} disabled={isAdded}
																inputProps={{ min: 1, max: part.quantity_in_stock, style: { width: 70 } }}
																onChange={(e) => setQty({ ...qty, [part.id]: parseInt(e.target.value) || 1 })}
															/>
														</TableCell>
														<TableCell align="center">
															<Button size="small" variant="outlined"
																disabled={isAdded || part.quantity_in_stock === 0}
																onClick={() => handleAddSparePartTemp(part.id)}
																startIcon={<AddIcon />}
															>
																{isAdded ? 'Đã thêm' : 'Thêm'}
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => { setDlgAddDetail(false); setTempUsages([]); }}>Hủy</Button>
						<Button variant="contained" onClick={handleSaveDetail}>Lưu chi tiết</Button>
					</DialogActions>
				</Dialog>

				{/* DIALOG: Chọn phụ tùng cho repair_detail */}
				<Dialog open={dlgSpareParts} onClose={() => setDlgSpareParts(false)} maxWidth="lg" fullWidth>
					<DialogTitle>Phụ tùng — Chi tiết sửa</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
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
												<TableRow><TableCell colSpan={4} align="center">Chưa có</TableCell></TableRow>
											) : detailUsages.map(u => (
												<TableRow key={u.id}>
													<TableCell>{u.spare_part?.name}</TableCell>
													<TableCell align="right">{u.quantity}</TableCell>
													<TableCell align="right">{(u.quantity * parseFloat(u.spare_part?.unit_price || 0)).toLocaleString()}đ</TableCell>
													<TableCell align="center">
														<IconButton size="small" color="error" onClick={() => handleRemoveSparePart(u)}>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
							<Grid item xs={12} md={7}>
								<Typography fontWeight={700} gutterBottom>Kho phụ tùng</Typography>
								<TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
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
													<TableCell align="right">{parseFloat(part.unit_price || 0).toLocaleString()}đ</TableCell>
													<TableCell align="center">
														<Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
															<TextField type="number" size="small" defaultValue={1}
																inputProps={{ min: 1, max: part.quantity_in_stock, style: { width: 55 } }}
																onChange={(e) => setQty({ ...qty, [part.id]: parseInt(e.target.value) || 1 })}
															/>
															<Button size="small" variant="contained"
																disabled={part.quantity_in_stock === 0}
																onClick={() => handleAddSparePart(part.id)}
															>
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
					<DialogActions><Button onClick={() => setDlgSpareParts(false)}>Đóng</Button></DialogActions>
				</Dialog>

				{/* DIALOG: Tạo hóa đơn */}
				<Dialog open={dlgInvoice} onClose={() => setDlgInvoice(false)} maxWidth="md" fullWidth>
					<DialogTitle>
						Tạo hóa đơn
						{selectedTicket && (
							<Typography variant="body2" color="text.secondary">
								Phiếu sửa xe ngày: {dayjs(selectedTicket.created_date).format('DD/MM/YYYY HH:mm')}
							</Typography>
						)}
					</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Typography variant="caption" color="text.secondary">Xe</Typography>
										<Typography variant="body2" fontWeight={500}>{selectedTicket?.vehicle?.name || '—'}</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography variant="caption" color="text.secondary">Biển số</Typography>
										<Typography variant="body2" fontWeight={500}>{selectedTicket?.vehicle?.plate_number || '—'}</Typography>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="caption" color="text.secondary">Dịch vụ</Typography>
										<Typography variant="body2" fontWeight={500}>{selectedTicket?.service?.name || '—'} - {parseFloat(selectedTicket?.service?.price || 0).toLocaleString()}đ</Typography>
									</Grid>
									{selectedTicket?.description && (
										<Grid item xs={12}>
											<Typography variant="caption" color="text.secondary">Mô tả công việc</Typography>
											<Typography variant="body2">{selectedTicket.description}</Typography>
										</Grid>
									)}
								</Grid>
							</Paper>
							<Divider>Chi tiết sửa chữa</Divider>
							{repairDetails.length === 0 ? (
								<Alert severity="info">Chưa có chi tiết sửa xe</Alert>
							) : repairDetails.map((detail, idx) => (
								<Paper key={detail.id} variant="outlined" sx={{ p: 2 }}>
									<Typography variant="subtitle2" fontWeight={700} gutterBottom>Lần sửa #{idx + 1}</Typography>
									<Grid container spacing={2} sx={{ mb: 2 }}>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Nhân viên</Typography>
											<Typography variant="body2">{detail.employee?.employee_name || detail.employee_id || '—'}</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="caption" color="text.secondary">Ngày sửa</Typography>
											<Typography variant="body2">{detail.repair_date ? dayjs(detail.repair_date).format('DD/MM/YYYY') : '—'}</Typography>
										</Grid>
										{detail.note && (
											<Grid item xs={12}>
												<Typography variant="caption" color="text.secondary">Ghi chú</Typography>
												<Typography variant="body2" color="text.secondary">{detail.note}</Typography>
											</Grid>
										)}
									</Grid>
									{(detail.usages || []).length > 0 && (
										<>
											<Typography variant="caption" color="text.secondary">Phụ tùng đã sử dụng</Typography>
											<Table size="small" sx={{ mt: 1 }}>
												<TableHead>
													<TableRow>
														<TableCell>Tên phụ tùng</TableCell>
														<TableCell align="right">Số lượng</TableCell>
														<TableCell align="right">Đơn giá</TableCell>
														<TableCell align="right">Thành tiền</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{detail.usages.map(u => (
														<TableRow key={u.id}>
															<TableCell>{u.spare_part?.name || '—'}</TableCell>
															<TableCell align="right">{u.quantity}</TableCell>
															<TableCell align="right">{parseFloat(u.spare_part?.unit_price || 0).toLocaleString()}đ</TableCell>
															<TableCell align="right">{(u.quantity * parseFloat(u.spare_part?.unit_price || 0)).toLocaleString()}đ</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</>
									)}
								</Paper>
							))}
							<Divider />
							<Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: selectedVoucher ? 1 : 0 }}>
									<Typography fontWeight={600} color="text.secondary">Tạm tính</Typography>
									<Typography fontWeight={600}>{calcRawTotal().toLocaleString()}đ</Typography>
								</Box>
								{selectedVoucher && (
									<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
										<Typography color="success.main" fontWeight={600}>
											Giảm giá ({selectedVoucher.code} -{selectedVoucher.percent}%)
										</Typography>
										<Typography color="success.main" fontWeight={600}>
											-{(calcRawTotal() * selectedVoucher.percent / 100).toLocaleString()}đ
										</Typography>
									</Box>
								)}
								<Box sx={{
									display: 'flex', justifyContent: 'space-between', alignItems: 'center',
									pt: selectedVoucher ? 1 : 0,
									borderTop: selectedVoucher ? '1px solid' : 'none',
									borderColor: 'divider'
								}}>
									<Typography variant="h6" fontWeight={700}>Tổng cộng</Typography>
									<Typography variant="h6" fontWeight={700} color="primary">{Math.round(calcTotal()).toLocaleString()}đ</Typography>
								</Box>
							</Paper>
							<Divider />
							<Typography variant="subtitle2" fontWeight={700} gutterBottom>Thông tin thanh toán</Typography>
							<Box>
								<TextField
									label="Mã giảm giá (tuỳ chọn)" placeholder="Nhập mã voucher..."
									value={invoiceForm.voucherCode}
									onChange={(e) => setInvoiceForm({ ...invoiceForm, voucherCode: e.target.value.toUpperCase() })}
									fullWidth size="small"
									slotProps={{
										input: {
											endAdornment: invoiceForm.voucherCode && (
												<Chip size="small"
													label={selectedVoucher ? `✓ -${selectedVoucher.percent}%` : '✗ Không hợp lệ'}
													color={selectedVoucher ? 'success' : 'error'}
													sx={{ mr: 0.5 }}
												/>
											)
										}
									}}
								/>
								{selectedVoucher && (
									<Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
										{selectedVoucher.event || 'Voucher hợp lệ'} — Giảm {selectedVoucher.percent}%
									</Typography>
								)}
								{invoiceForm.voucherCode && !selectedVoucher && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
										Mã voucher không tồn tại hoặc đã hết hạn
									</Typography>
								)}
							</Box>
							<DatePicker label="Ngày tạo hóa đơn" value={invoiceForm.created_date} onChange={(d) => setInvoiceForm({ ...invoiceForm, created_date: d })} slotProps={{ textField: { fullWidth: true } }} />
							<FormControl fullWidth>
								<InputLabel>Phương thức thanh toán</InputLabel>
								<Select value={invoiceForm.payment_method} label="Phương thức thanh toán" onChange={(e) => setInvoiceForm({ ...invoiceForm, payment_method: e.target.value })}>
									<MenuItem value="CASH">💰 Tiền mặt</MenuItem>
									<MenuItem value="TRANSFER">🏦 Chuyển khoản</MenuItem>
									<MenuItem value="CREDIT_CARD">💳 Thẻ tín dụng</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDlgInvoice(false)}>Hủy</Button>
						<Button variant="contained" color="success" onClick={handleCreateInvoice} startIcon={<PaidIcon />}>
							Xác nhận tạo hóa đơn
						</Button>
					</DialogActions>
				</Dialog>

				<Snackbar
					open={snackbar.open} autoHideDuration={3000}
					onClose={() => setSnackbar(s => ({ ...s, open: false }))}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</Container>
		</LocalizationProvider>
	);
};

export default GarageManagement;