import React, { useState, useEffect, useCallback } from 'react';
import {
	Container,
	Paper,
	Box,
	Typography,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Grid,
	Card,
	CardContent,
	Alert,
	Snackbar,
	CircularProgress,
	Tooltip,
	Divider,
	InputAdornment
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
	Visibility as ViewIcon,
	ShoppingCart as CartIcon,
	Paid as PaidIcon,
	Build as BuildIcon,
	CheckCircle as CheckIcon
} from '@mui/icons-material';

import { getAllAppointments, getAppointmentById, updateAppointmentStatus } from '../../services/appointment.service';
import {
	getAllRepairTickets,
	createRepairTicket,
	updateRepairTicket,
	deleteRepairTicket,
	completeRepairTicket,
	getRepairTicketById
} from '../../services/repair-ticket.service';
import {
	getRepairDetailByTicketId,
	createRepairDetail,
	updateRepairDetail,
	deleteRepairDetail
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
	createSparePartsWarranty,
	getSparePartsWarrantyByUsageId
} from '../../services/spare-parts-warranty.service';
import {
	createInvoice,
	getInvoiceById
} from '../../services/invoice.service';
import { getAllServices } from '../../services/service.service';
import { getEmployees } from '../../services/employee.service';

import {
	getAllRepairAppointments,
	updateRepairAppointmentStatus
} from '../../services/repair-appointment.service';

// Tab Panel component
const TabPanel = ({ children, value, index, ...other }) => (
	<div role="tabpanel" hidden={value !== index} {...other}>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</div>
);

const GarageManagement = () => {
	// State cho tabs
	const [activeTab, setActiveTab] = useState(0);
	const [selectedTicketId, setSelectedTicketId] = useState(null);

	// State cho appointments
	const [appointments, setAppointments] = useState([]);
	const [loadingAppointments, setLoadingAppointments] = useState(false);

	// State cho repair tickets
	const [repairTickets, setRepairTickets] = useState([]);
	const [loadingTickets, setLoadingTickets] = useState(false);

	// State cho repair detail
	const [repairDetail, setRepairDetail] = useState(null);
	const [loadingDetail, setLoadingDetail] = useState(false);

	// State cho spare parts
	const [spareParts, setSpareParts] = useState([]);
	const [sparePartsUsages, setSparePartsUsages] = useState([]);

	// State cho services và employees
	const [services, setServices] = useState([]);
	const [employees, setEmployees] = useState([]);

	// Dialog states
	const [createTicketDialog, setCreateTicketDialog] = useState(false);
	const [viewDetailDialog, setViewDetailDialog] = useState(false);
	const [sparePartsDialog, setSparePartsDialog] = useState(false);
	const [createInvoiceDialog, setCreateInvoiceDialog] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [selectedQuantity, setSelectedQuantity] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	// Form states
	const [ticketForm, setTicketForm] = useState({
		appointment_id: '',
		customer_vehicle_id: '',
		service_id: '',
		created_date: dayjs()
	});
	const [repairDetailForm, setRepairDetailForm] = useState({
		employee_id: '',
		note: '',
		repair_date: null
	});
	const [invoiceForm, setInvoiceForm] = useState({
		payment_method: 'CASH',
		created_date: dayjs()
	});

	const showMessage = (message, severity = 'success') => {
		setSnackbar({ open: true, message, severity });
	};

	// Load danh sách repair appointments
	const loadAppointments = useCallback(async () => {
		setLoadingAppointments(true);
		try {
			const res = await getAllRepairAppointments();  // Đổi tên hàm
			console.log("🔧 Repair Appointments response:", res);
			if (res.success) {
				if (res.data && res.data.length > 0) {
					console.log("🔧 First repair appointment:", res.data[0]);
					// Kiểm tra cấu trúc dữ liệu
					console.log("🔧 Appointment customer:", res.data[0].customer);
				}
				setAppointments(res.data || []);
			} else {
				setAppointments([]);
			}
		} catch (error) {
			console.error('Error loading repair appointments:', error);
			showMessage('Không thể tải danh sách lịch hẹn sửa xe', 'error');
			setAppointments([]);
		} finally {
			setLoadingAppointments(false);
		}
	}, []);

	// Load danh sách repair tickets
	// Trong GarageManagement.jsx, tìm hàm loadRepairTickets
	const loadRepairTickets = useCallback(async () => {
		setLoadingTickets(true);
		console.log("🔹 [Frontend] Loading repair tickets...");
		try {
			console.log("🔹 [Frontend] Calling getAllRepairTickets()");
			const res = await getAllRepairTickets();
			console.log("✅ [Frontend] getAllRepairTickets response:", res);
			if (res.success) {
				console.log(`✅ [Frontend] Success! Got ${res.data?.length || 0} repair tickets`);

				// ✅ THÊM LOG NÀY - in chi tiết ticket đầu tiên
				if (res.data && res.data.length > 0) {
					console.log("📦 Chi tiết ticket đầu tiên:", JSON.stringify(res.data[0], null, 2));
					console.log("📦 Service object:", res.data[0].service);
					console.log("📦 Vehicle object:", res.data[0].vehicle);
				}

				setRepairTickets(res.data || []);
			} else {
				console.error("❌ [Frontend] API returned success=false:", res.message);
				setRepairTickets([]);
			}
		} catch (error) {
			console.error("❌ [Frontend] Error loading repair tickets:", error);
			showMessage('Không thể tải danh sách phiếu sửa xe', 'error');
			setRepairTickets([]);
		} finally {
			setLoadingTickets(false);
		}
	}, []);

	// Load spare parts
	const loadSpareParts = useCallback(async () => {
		try {
			const res = await getAllSpareParts();
			if (res.success) {
				setSpareParts(res.data || []);
			}
		} catch (error) {
			console.error('Error loading spare parts:', error);
		}
	}, []);

	// Load services và employees
	const loadServicesAndEmployees = useCallback(async () => {
		try {
			const [servicesRes, employeesRes] = await Promise.all([
				getAllServices(),
				getEmployees()
			]);
			if (servicesRes.success) setServices(servicesRes.data || []);
			if (employeesRes.success) setEmployees(employeesRes.data || []);
		} catch (error) {
			console.error('Error loading services/employees:', error);
		}
	}, []);

	// Load repair detail theo ticket
	// Load repair detail theo ticket
	const loadRepairDetail = useCallback(async (ticketId) => {
		if (!ticketId) return;
		console.log("🔹 [Frontend] Loading repair detail for ticket:", ticketId);
		setLoadingDetail(true);
		try {
			const res = await getRepairDetailByTicketId(ticketId);
			console.log("✅ [Frontend] getRepairDetailByTicketId response:", res);
			if (res.success && res.data) {
				console.log("✅ [Frontend] Got repair detail, ID:", res.data.id);
				setRepairDetail(res.data);
				if (res.data.id) {
					// Lấy DANH SÁCH phiếu sử dụng (trả về mảng)
					console.log("🔹 [Frontend] Loading spare parts usages for detail:", res.data.id);
					const usageRes = await getSparePartsUsagesByRepairDetailId(res.data.id);
					console.log(`✅ [Frontend] Got ${usageRes.data?.length || 0} spare parts usages`);
					if (usageRes.success && usageRes.data) {
						setSparePartsUsages(usageRes.data);
					} else {
						setSparePartsUsages([]);
					}
				}
				setRepairDetailForm({
					employee_id: res.data.employee_id || '',
					note: res.data.note || '',
					repair_date: res.data.repair_date ? dayjs(res.data.repair_date) : null
				});
			} else {
				console.warn("⚠️  [Frontend] No repair detail found for ticket:", ticketId);
				setRepairDetail(null);
				setSparePartsUsages([]);
				setRepairDetailForm({ employee_id: '', note: '', repair_date: null });
			}
		} catch (error) {
			console.error('❌ [Frontend] Error loading repair detail:', error);
			setRepairDetail(null);
		} finally {
			setLoadingDetail(false);
		}
	}, []);


	const handleCreateTicketFromAppointment = (appointment, vehicleId) => {
		setSelectedAppointment(appointment);
		setTicketForm({
			appointment_id: appointment.id,
			customer_vehicle_id: vehicleId,
			service_id: '',
			created_date: dayjs()
		});
		setCreateTicketDialog(true);
	};

	// Submit tạo repair ticket
	const handleSubmitTicket = async () => {
		try {
			const data = {
				...ticketForm,
				created_date: ticketForm.created_date.toISOString()
			};
			const res = await createRepairTicket(data);
			if (res.success) {
				showMessage('Tạo phiếu sửa xe thành công');
				setCreateTicketDialog(false);
				setTicketForm({
					appointment_id: '',
					customer_vehicle_id: '',
					service_id: '',
					created_date: dayjs()
				});
				await loadRepairTickets();
				setActiveTab(1);
				if (selectedAppointment) {
					await updateRepairAppointmentStatus(selectedAppointment.id, 'IN_PROGRESS');  // Đổi tên hàm
					await loadAppointments();
				}
			} else {
				showMessage(res.message || 'Tạo phiếu thất bại', 'error');
			}
		} catch (error) {
			console.error('Error creating repair ticket:', error);
			showMessage('Có lỗi xảy ra khi tạo phiếu sửa xe', 'error');
		}
	};

	// Cập nhật repair detail
	const handleUpdateRepairDetail = async () => {
		if (!selectedTicketId) return;
		try {
			const data = {
				...repairDetailForm,
				repair_date: repairDetailForm.repair_date ? repairDetailForm.repair_date.toISOString() : null
			};
			let res;
			if (repairDetail) {
				res = await updateRepairDetail(selectedTicketId, data);
			} else {
				res = await createRepairDetail(selectedTicketId, data);
			}
			if (res.success) {
				showMessage('Cập nhật chi tiết sửa xe thành công');
				await loadRepairDetail(selectedTicketId);
			} else {
				showMessage(res.message || 'Cập nhật thất bại', 'error');
			}
		} catch (error) {
			console.error('Error updating repair detail:', error);
			showMessage('Có lỗi xảy ra khi cập nhật', 'error');
		}
	};

	// Mở dialog chọn phụ tùng
	const handleOpenSparePartsDialog = async (ticketId) => {
		console.log("🔹 [Frontend] Opening spare parts dialog for ticket:", ticketId);
		setSelectedTicketId(ticketId);
		await loadRepairDetail(ticketId);
		await loadSpareParts();
		setSelectedQuantity({});
		setSparePartsDialog(true);
		console.log("✅ [Frontend] Spare parts dialog opened");
	};

	// Thêm phụ tùng vào phiếu sử dụng
	// Thêm phụ tùng vào phiếu sử dụng (mỗi lần thêm tạo 1 phiếu mới)
	const handleAddSparePart = async (sparePartId, quantity) => {
		if (!repairDetail) {
			showMessage('Vui lòng tạo chi tiết sửa xe trước', 'warning');
			return;
		}

		const sparePart = spareParts.find(sp => sp.id === sparePartId);
		if (!sparePart) return;

		if (sparePart.quantity_in_stock < quantity) {
			showMessage(`Số lượng tồn kho không đủ. Còn ${sparePart.quantity_in_stock} ${sparePart.unit_of_measure || ''}`, 'error');
			return;
		}

		try {
			// Tạo phiếu sử dụng mới cho phụ tùng này
			const createRes = await createSparePartsUsage({
				repair_detail_id: repairDetail.id,
				spare_parts_id: sparePartId,
				quantity: quantity,
				usage_date: new Date().toISOString()
			});

			if (createRes.success) {
				// Cập nhật tồn kho
				await updateSparePart(sparePartId, {
					quantity_in_stock: sparePart.quantity_in_stock - quantity
				});
				showMessage('Thêm phụ tùng thành công');

				// Reload danh sách
				const usageRes = await getSparePartsUsagesByRepairDetailId(repairDetail.id);
				if (usageRes.success && usageRes.data) {
					setSparePartsUsages(usageRes.data);
				}
				await loadSpareParts();
				setSelectedQuantity({});
			} else {
				showMessage(createRes.message || 'Thêm phụ tùng thất bại', 'error');
			}
		} catch (error) {
			console.error('Error adding spare part:', error);
			showMessage('Có lỗi xảy ra', 'error');
		}
	};

	// Xóa phụ tùng khỏi phiếu sử dụng
	// Xóa phụ tùng khỏi phiếu sử dụng
	const handleRemoveSparePart = async (usageId, sparePartUsage) => {
		try {
			// Cập nhật lại tồn kho trước khi xóa
			await updateSparePart(sparePartUsage.spare_parts_id, {
				quantity_in_stock: sparePartUsage.spare_part.quantity_in_stock + sparePartUsage.quantity
			});

			// Xóa phiếu sử dụng
			const res = await deleteSparePartsUsage(usageId);
			if (res.success) {
				showMessage('Xóa phụ tùng thành công');
				// Reload danh sách
				const usageRes = await getSparePartsUsagesByRepairDetailId(repairDetail.id);
				if (usageRes.success && usageRes.data) {
					setSparePartsUsages(usageRes.data);
				}
				await loadSpareParts();
			} else {
				showMessage(res.message || 'Xóa thất bại', 'error');
			}
		} catch (error) {
			console.error('Error removing spare part:', error);
			showMessage('Có lỗi xảy ra', 'error');
		}
	};

	// Hoàn thành sửa xe và tạo hóa đơn
	const handleCompleteAndInvoice = (ticketId) => {
		setSelectedTicketId(ticketId);
		setInvoiceForm({
			payment_method: 'CASH',
			created_date: dayjs()
		});
		setCreateInvoiceDialog(true);
	};

	// Tạo hóa đơn và bảo hành
	// Tạo hóa đơn và bảo hành
	const handleCreateInvoice = async () => {
		try {
			const ticket = repairTickets.find(t => t.id === selectedTicketId);
			let totalCost = 0;

			if (ticket?.service?.price) {
				totalCost += parseFloat(ticket.service.price);
			}

			// Tính tổng từ danh sách sparePartsUsages
			if (sparePartsUsages && sparePartsUsages.length > 0) {
				sparePartsUsages.forEach(usage => {
					totalCost += usage.quantity * parseFloat(usage.spare_part?.price || 0);
				});
			}

			const invoiceData = {
				ticket_id: selectedTicketId,
				total_cost: totalCost,
				payment_method: invoiceForm.payment_method,
				created_date: invoiceForm.created_date.toISOString()
			};

			const invoiceRes = await createInvoice(invoiceData);
			if (!invoiceRes.success) {
				showMessage(invoiceRes.message || 'Tạo hóa đơn thất bại', 'error');
				return;
			}

			// Tạo phiếu bảo hành cho từng phụ tùng
			if (sparePartsUsages && sparePartsUsages.length > 0) {
				for (const usage of sparePartsUsages) {
					const warrantyData = {
						usage_id: usage.id,
						warranty_period_months: 12,
						warranty_expiry_date: dayjs().add(12, 'months').toISOString()
					};
					await createSparePartsWarranty(warrantyData);
				}
				showMessage('Đã tạo phiếu bảo hành cho các phụ tùng');
			}

			await completeRepairTicket(selectedTicketId);

			showMessage('Tạo hóa đơn thành công');
			setCreateInvoiceDialog(false);
			await loadRepairTickets();
			await loadAppointments();
			setActiveTab(0);
		} catch (error) {
			console.error('Error creating invoice:', error);
			showMessage('Có lỗi xảy ra khi tạo hóa đơn', 'error');
		}
	};

	// Xem chi tiết repair ticket
	const handleViewDetail = async (ticketId) => {
		console.log("🔹 [Frontend] Viewing detail for ticket:", ticketId);
		setSelectedTicketId(ticketId);
		await loadRepairDetail(ticketId);
		setViewDetailDialog(true);
		console.log("✅ [Frontend] View detail dialog opened");
	};

	useEffect(() => {
		console.log("🔹 [Frontend] GarageManagement mounted, loading initial data...");
		loadAppointments();
		loadRepairTickets();
		loadServicesAndEmployees();
		loadSpareParts();
	}, [loadAppointments, loadRepairTickets, loadServicesAndEmployees, loadSpareParts]);

	// Status chip component
	const StatusChip = ({ status }) => {
		const statusConfig = {
			'PENDING': { label: 'Chờ xác nhận', color: 'warning' },
			'CONFIRMED': { label: 'Đã xác nhận', color: 'info' },
			'IN_PROGRESS': { label: 'Đang sửa', color: 'warning' },
			'COMPLETED': { label: 'Hoàn thành', color: 'success' },
			'CANCELLED': { label: 'Đã hủy', color: 'error' }
		};
		const config = statusConfig[status] || { label: status, color: 'default' };
		return <Chip label={config.label} color={config.color} size="small" />;
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Paper elevation={3}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
						<Typography variant="h4" gutterBottom>
							Quản lý Garage
						</Typography>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Lịch hẹn sửa xe" />
							<Tab label="Phiếu sửa xe" />
						</Tabs>
					</Box>

					{/* Tab 1: Appointments */}
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
									{loadingAppointments ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress />
											</TableCell>
										</TableRow>
									) : appointments.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												Không có dữ liệu
											</TableCell>
										</TableRow>
									) : (
										appointments.map((app) => {
											const vehicle = app.vehicles?.[0] || null;
											const relatedTicket = repairTickets.find(t => t.appointment_id === app.id);
											return (
												<TableRow key={app.id}>
													<TableCell>{app.customer?.full_name || '—'}</TableCell>
													<TableCell>
														{dayjs(app.appointment_date).format('DD/MM/YYYY HH:mm')}
													</TableCell>
													<TableCell>{relatedTicket?.service?.name || '—'}</TableCell>
													<TableCell>{vehicle?.name || '—'}</TableCell>
													<TableCell>{vehicle?.plate_number || '—'}</TableCell>
													<TableCell>
														<StatusChip status={app.status} />
													</TableCell>
													<TableCell>
														{app.status === 'CONFIRMED' && vehicle ? (
															<Button
																variant="contained"
																size="small"
																startIcon={<BuildIcon />}
																onClick={() => handleCreateTicketFromAppointment(app, vehicle.id)}
																sx={{ mr: 1 }}
															>
																Tạo phiếu sửa
															</Button>
														) : null}
														<IconButton size="small">
															<ViewIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											);
										})
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</TabPanel>

					{/* Tab 2: Repair Tickets */}
					<TabPanel value={activeTab} index={1}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Mã phiếu</TableCell>
										<TableCell>Ngày tạo</TableCell>
										<TableCell>Dịch vụ</TableCell>
										<TableCell>Xe</TableCell>
										<TableCell>Biển số</TableCell>
										<TableCell>Trạng thái</TableCell>
										<TableCell>Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{loadingTickets ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress />
											</TableCell>
										</TableRow>
									) : repairTickets.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												Không có dữ liệu
											</TableCell>
										</TableRow>
									) : (
										repairTickets.map((ticket) => (
											<TableRow key={ticket.id}>
												<TableCell>{ticket.id}</TableCell>
												<TableCell>
													{dayjs(ticket.created_date).format('DD/MM/YYYY HH:mm')}
												</TableCell>
												<TableCell>{ticket.service?.name}</TableCell>
												<TableCell>{ticket.vehicle?.name}</TableCell>
												<TableCell>{ticket.vehicle?.plate_number}</TableCell>
												<TableCell>
													{ticket?.completed_date ? (
														<Chip label="Hoàn thành" color="success" size="small" />
													) : (
														<Chip label="Đang sửa" color="warning" size="small" />
													)}
												</TableCell>
												<TableCell>
													<Tooltip title="Chi tiết">
														<IconButton
															size="small"
															onClick={() => handleViewDetail(ticket.id)}
														>
															<ViewIcon />
														</IconButton>
													</Tooltip>
													{!ticket?.completed_date && (
														<>
															<Tooltip title="Phụ tùng">
																<IconButton
																	size="small"
																	color="primary"
																	onClick={() => handleOpenSparePartsDialog(ticket.id)}
																>
																	<CartIcon />
																</IconButton>
															</Tooltip>
															<Tooltip title="Tạo hóa đơn">
																<IconButton
																	size="small"
																	color="success"
																	onClick={() => handleCompleteAndInvoice(ticket.id)}
																>
																	<PaidIcon />
																</IconButton>
															</Tooltip>
															<Tooltip title="Xóa">
																<IconButton
																	size="small"
																	color="error"
																	onClick={async () => {
																		await deleteRepairTicket(ticket.id);
																		await loadRepairTickets();
																		showMessage('Xóa thành công');
																	}}
																>
																	<DeleteIcon />
																</IconButton>
															</Tooltip>
														</>
													)}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</TabPanel>
				</Paper>

				{/* Dialog tạo phiếu sửa xe */}
				<Dialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)} maxWidth="sm" fullWidth>
					<DialogTitle>Tạo phiếu sửa xe</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<TextField
								label="Xe"
								value={selectedAppointment?.vehicle?.name || ''}
								disabled
								fullWidth
							/>
							<FormControl fullWidth>
								<InputLabel>Dịch vụ</InputLabel>
								<Select
									value={ticketForm.service_id}
									label="Dịch vụ"
									onChange={(e) => setTicketForm({ ...ticketForm, service_id: e.target.value })}
								>
									{services.map(s => (
										<MenuItem key={s.id} value={s.id}>
											{s.name} - {s.price?.toLocaleString()}đ
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<DatePicker
								label="Ngày tạo"
								value={ticketForm.created_date}
								onChange={(date) => setTicketForm({ ...ticketForm, created_date: date })}
								slotProps={{ textField: { fullWidth: true } }}
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setCreateTicketDialog(false)}>Hủy</Button>
						<Button variant="contained" onClick={handleSubmitTicket}>Tạo phiếu</Button>
					</DialogActions>
				</Dialog>

				{/* Dialog chi tiết sửa xe */}
				<Dialog open={viewDetailDialog} onClose={() => setViewDetailDialog(false)} maxWidth="md" fullWidth>
					<DialogTitle>Chi tiết sửa xe</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} md={6}>
									<FormControl fullWidth>
										<InputLabel>Nhân viên sửa chữa</InputLabel>
										<Select
											value={repairDetailForm.employee_id}
											label="Nhân viên sửa chữa"
											onChange={(e) => setRepairDetailForm({ ...repairDetailForm, employee_id: e.target.value })}
										>
											<MenuItem value="">Chọn nhân viên</MenuItem>
											{employees.map(emp => (
												<MenuItem key={emp.id} value={emp.id}>{emp.employee_name}</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={6}>
									<DatePicker
										label="Ngày sửa"
										value={repairDetailForm.repair_date}
										onChange={(date) => setRepairDetailForm({ ...repairDetailForm, repair_date: date })}
										slotProps={{ textField: { fullWidth: true } }}
									/>
								</Grid>
							</Grid>
							<TextField
								label="Ghi chú"
								value={repairDetailForm.note}
								onChange={(e) => setRepairDetailForm({ ...repairDetailForm, note: e.target.value })}
								multiline
								rows={3}
								fullWidth
							/>
							<Button variant="contained" onClick={handleUpdateRepairDetail}>
								Lưu chi tiết
							</Button>

							<Divider>Phụ tùng đã sử dụng</Divider>

							<TableContainer component={Paper} variant="outlined">
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
										{sparePartsUsages.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} align="center">
													Chưa có phụ tùng nào
												</TableCell>
											</TableRow>
										) : (
											sparePartsUsages.map((usage) => (
												<TableRow key={usage.id}>
													<TableCell>{usage.spare_part?.name}</TableCell>
													<TableCell align="right">{usage.quantity}</TableCell>
													<TableCell align="right">
														{usage.spare_part?.price?.toLocaleString()}đ
													</TableCell>
													<TableCell align="right">
														{(usage.quantity * parseFloat(usage.spare_part?.price || 0)).toLocaleString()}đ
													</TableCell>
													<TableCell align="center">
														<IconButton
															size="small"
															color="error"
															onClick={() => handleRemoveSparePart(usage.id, usage)}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setViewDetailDialog(false)}>Đóng</Button>
					</DialogActions>
				</Dialog>

				{/* Dialog chọn phụ tùng */}
				<Dialog open={sparePartsDialog} onClose={() => setSparePartsDialog(false)} maxWidth="lg" fullWidth>
					<DialogTitle>Chọn phụ tùng sửa chữa</DialogTitle>
					<DialogContent>
						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Mã</TableCell>
										<TableCell>Tên phụ tùng</TableCell>
										<TableCell align="right">Tồn kho</TableCell>
										<TableCell>Đơn vị</TableCell>
										<TableCell align="right">Giá</TableCell>
										<TableCell align="center">Thao tác</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{spareParts.map((part) => (
										<TableRow key={part.id}>
											<TableCell>{part.id}</TableCell>
											<TableCell>{part.name}</TableCell>
											<TableCell align="right">{part.quantity_in_stock}</TableCell>
											<TableCell>{part.unit_of_measure}</TableCell>
											<TableCell align="right">{part.price?.toLocaleString()}đ</TableCell>
											<TableCell align="center">
												<Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
													<TextField
														type="number"
														size="small"
														defaultValue={1}
														inputProps={{ min: 1, max: part.quantity_in_stock, style: { width: 70 } }}
														onChange={(e) => setSelectedQuantity({ ...selectedQuantity, [part.id]: parseInt(e.target.value) || 1 })}
													/>
													<Button
														size="small"
														variant="contained"
														onClick={() => handleAddSparePart(part.id, selectedQuantity[part.id] || 1)}
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
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setSparePartsDialog(false)}>Đóng</Button>
					</DialogActions>
				</Dialog>

				{/* Dialog tạo hóa đơn */}
				<Dialog open={createInvoiceDialog} onClose={() => setCreateInvoiceDialog(false)} maxWidth="sm" fullWidth>
					<DialogTitle>Tạo hóa đơn</DialogTitle>
					<DialogContent>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
							<DatePicker
								label="Ngày tạo hóa đơn"
								value={invoiceForm.created_date}
								onChange={(date) => setInvoiceForm({ ...invoiceForm, created_date: date })}
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

							<Typography variant="subtitle1" fontWeight="bold">
								Tổng tiền: {
									(() => {
										const ticket = repairTickets.find(t => t.id === selectedTicketId);
										let total = ticket?.service?.price ? parseFloat(ticket.service.price) : 0;
										if (sparePartsUsages && sparePartsUsages.length > 0) {
											sparePartsUsages.forEach(usage => {
												total += usage.quantity * parseFloat(usage.spare_part?.price || 0);
											});
										}
										return total.toLocaleString();
									})()
								}đ
							</Typography>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setCreateInvoiceDialog(false)}>Hủy</Button>
						<Button variant="contained" color="success" onClick={handleCreateInvoice}>
							Xác nhận tạo hóa đơn
						</Button>
					</DialogActions>
				</Dialog>

				{/* Snackbar thông báo */}
				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</Container>
		</LocalizationProvider>
	);
};

export default GarageManagement;