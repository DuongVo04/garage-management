import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	CircularProgress,
	Alert,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Tooltip,
	Chip,
	FormControlLabel,
	Switch,
	MenuItem,
	InputAdornment,
	TablePagination,
	Snackbar,
	Tab,
	Tabs,
	Fade,
	Zoom,
	Slide,
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Refresh as RefreshIcon,
	Search as SearchIcon,
	Work as WorkIcon,
	WorkOff as WorkOffIcon,
	Category as CategoryIcon,
	SettingsBackupRestore as SettingsBackupRestoreIcon 
} from '@mui/icons-material';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../services/employee.service";
import {
	getEmployeeTypes,
	createEmployeeType,
	updateEmployeeType,
	deleteEmployeeType,
} from "../../services/employee-type.service";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Cấu hình dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const TabPanel = ({ children, value, index }) => {
	return (
		<div role="tabpanel" hidden={value !== index} style={{ height: '100%' }}>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
};

// Component cho bảng nhân viên với animation
const EmployeeTable = ({ employees, loading, searchTerm, onEdit, onDelete, employeeSubTab }) => {
	const [displayData, setDisplayData] = useState([]);
	const [fadeIn, setFadeIn] = useState(true);

	useEffect(() => {
		setFadeIn(false);
		const timer = setTimeout(() => {
			setDisplayData(employees);
			setFadeIn(true);
		}, 150);
		return () => clearTimeout(timer);
	}, [employees]);

	const filteredData = displayData.filter(employee =>
		employee.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		employee.phone_number?.includes(searchTerm)
	);

	// Hàm format date hiển thị
	const formatDisplayDate = (dateValue) => {
		if (!dateValue) return 'N/A';
		try {
			return dayjs(dateValue).format('DD/MM/YYYY');
		} catch (error) {
			return 'N/A';
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Fade in={fadeIn} timeout={300}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>Tên nhân viên</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Lương</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Ngày bắt đầu</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Loại nhân viên</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} align="center">
									<Zoom in={true}>
										<Box sx={{ py: 4 }}>
											{employeeSubTab === 0 ? (
												<>
													<WorkIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1, opacity: 0.5 }} />
													<Typography variant="body1" color="text.secondary">
														Không có nhân viên đang làm việc
													</Typography>
												</>
											) : (
												<>
													<WorkOffIcon sx={{ fontSize: 48, color: '#f44336', mb: 1, opacity: 0.5 }} />
													<Typography variant="body1" color="text.secondary">
														Không có nhân viên đã nghỉ việc
													</Typography>
												</>
											)}
										</Box>
									</Zoom>
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((employee, index) => (
								<Slide
									key={employee.id}
									direction="up"
									in={true}
									timeout={200 + index * 50}
									mountOnEnter
									unmountOnExit
								>
									<TableRow hover>
										<TableCell>{employee.employee_name}</TableCell>
										<TableCell>{employee.phone_number}</TableCell>
										<TableCell>{employee.email}</TableCell>
										<TableCell>{employee.address}</TableCell>
										<TableCell>
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(employee.salary)}
										</TableCell>
										<TableCell>{formatDisplayDate(employee.work_start_date)}</TableCell>
										<TableCell>
											<Chip
												label={employee.is_working ? 'Đang làm việc' : 'Đã nghỉ'}
												color={employee.is_working ? 'success' : 'error'}
												size="small"
												icon={employee.is_working ? <WorkIcon /> : <WorkOffIcon />}
											/>
										</TableCell>
										<TableCell>
											<Chip
												label={employee.employee_type?.name || 'N/A'}
												size="small"
												sx={{
													fontWeight: "bold",
													bgcolor: "#1976d2",
													color: "#fff",
													borderRadius: "8px",
													px: 1
												}}
											/>
										</TableCell>
										<TableCell>
											<Tooltip title="Sửa">
												<IconButton size="small" onClick={() => onEdit(employee)} color="primary">
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Xóa">
												<IconButton size="small" onClick={() => onDelete(employee.id, employee.employee_name)} color="error">
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								</Slide>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Fade>
	);
};

// Component cho bảng loại nhân viên với animation
const TypeTable = memo(({ types, loading, searchTerm, onEdit, onDelete, typeSubTab, employeeCountMap }) => {
	const [displayData, setDisplayData] = useState([]);
	const [fadeIn, setFadeIn] = useState(true);

	useEffect(() => {
		setFadeIn(false);
		const timer = setTimeout(() => {
			setDisplayData(types);
			setFadeIn(true);
		}, 150);
		return () => clearTimeout(timer);
	}, [types]);

	const filteredData = displayData.filter(type =>
		type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		type.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Fade in={fadeIn} timeout={300}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Tên loại</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Số lượng nhân viên</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredData.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Zoom in={true}>
										<Box sx={{ py: 4 }}>
											{typeSubTab === 0 ? (
												<>
													<CategoryIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1, opacity: 0.5 }} />
													<Typography variant="body1" color="text.secondary">
														Không có loại nhân viên đang hoạt động
													</Typography>
												</>
											) : (
												<>
													<DeleteIcon sx={{ fontSize: 48, color: '#f44336', mb: 1, opacity: 0.5 }} />
													<Typography variant="body1" color="text.secondary">
														Không có loại nhân viên đã xóa
													</Typography>
												</>
											)}
										</Box>
									</Zoom>
								</TableCell>
							</TableRow>
						) : (
							filteredData.map((type, index) => {
								const employeeCount = employeeCountMap[type.id] || 0;
								return (
									<Slide
										key={type.id}
										direction="up"
										in={true}
										timeout={200 + index * 50}
										mountOnEnter
										unmountOnExit
									>
										<TableRow hover>
											<TableCell>{type.id}</TableCell>
											<TableCell>
												<Chip
													label={type.name}
													color="primary"
													size="small"
													sx={{
														fontWeight: "bold",
														bgcolor: typeSubTab === 0 ? "#1976d2" : "#9e9e9e",
													}}
												/>
											</TableCell>
											<TableCell>{type.description || '—'}</TableCell>
											<TableCell>
												<Chip
													label={employeeCount}
													size="small"
													variant="outlined"
													color={employeeCount > 0 ? "primary" : "default"}
												/>
											</TableCell>
											<TableCell>
												{typeSubTab === 0 ? (
													<>
														<Tooltip title="Sửa">
															<IconButton size="small" onClick={() => onEdit(type)} color="primary">
																<EditIcon />
															</IconButton>
														</Tooltip>
														<Tooltip title="Xóa">
															<IconButton size="small" onClick={() => onDelete(type.id, type.name)} color="error">
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													</>
												) : (
													<Tooltip title="Restore">
														<IconButton size="small" onClick color="primary">
															<SettingsBackupRestoreIcon />
														</IconButton>
													</Tooltip>
												)}
											</TableCell>
										</TableRow>
									</Slide>
								);
							})
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Fade>
	);
});

const EmployeePage = () => {
	const [tabValue, setTabValue] = useState(0);

	// Employee sub-tabs state
	const [employeeSubTab, setEmployeeSubTab] = useState(0); // 0: Đang làm việc, 1: Đã nghỉ
	const [isSwitchingTab, setIsSwitchingTab] = useState(false);

	// Employee state
	const [employees, setEmployees] = useState([]);
	const [loadingEmployees, setLoadingEmployees] = useState(true);
	const [employeeError, setEmployeeError] = useState(null);
	const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [employeePage, setEmployeePage] = useState(0);
	const [employeeRowsPerPage, setEmployeeRowsPerPage] = useState(10);

	// Employee Type state
	const [employeeTypes, setEmployeeTypes] = useState([]); // Active types
	const [deletedEmployeeTypes, setDeletedEmployeeTypes] = useState([]); // Deleted types
	const [loadingTypes, setLoadingTypes] = useState(true);
	const [typeError, setTypeError] = useState(null);
	const [openTypeDialog, setOpenTypeDialog] = useState(false);
	const [editingType, setEditingType] = useState(null);
	const [typeSearchTerm, setTypeSearchTerm] = useState('');
	const [typeSubTab, setTypeSubTab] = useState(0); // 0: Đang hoạt động, 1: Đã xóa
	const [isSwitchingTypeTab, setIsSwitchingTypeTab] = useState(false);
	const [typePage, setTypePage] = useState(0);
	const [typeRowsPerPage, setTypeRowsPerPage] = useState(10);
	const [employeeCountMap, setEmployeeCountMap] = useState({});

	// Common state
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

	// Employee form data
	const [employeeFormData, setEmployeeFormData] = useState({
		employee_name: '',
		phone_number: '',
		email: '',
		address: '',
		salary: '',
		work_start_date: '',
		is_working: true,
		employee_type_id: '',
	});

	// Employee Type form data
	const [typeFormData, setTypeFormData] = useState({
		name: '',
		description: '',
	});

	// Helper function để format date cho API
	const formatDateForAPI = (dateString) => {
		if (!dateString) return null;
		return dayjs(dateString).startOf('day').utc().format();
	};

	// Helper function để format date cho form input
	const formatDateForInput = (dateValue) => {
		if (!dateValue) return '';
		return dayjs(dateValue).format('YYYY-MM-DD');
	};

	// Validate employee form
	const validateEmployeeForm = (data) => {
		const errors = {};

		if (!data.employee_name || data.employee_name.trim() === '') {
			errors.employee_name = 'Tên nhân viên không được để trống';
		} else if (data.employee_name.length < 2) {
			errors.employee_name = 'Tên nhân viên phải có ít nhất 2 ký tự';
		}

		const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
		if (!data.phone_number || data.phone_number.trim() === '') {
			errors.phone_number = 'Số điện thoại không được để trống';
		} else if (!phoneRegex.test(data.phone_number)) {
			errors.phone_number = 'Số điện thoại không hợp lệ (VD: 0912345678)';
		}

		const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
		if (!data.email || data.email.trim() === '') {
			errors.email = 'Email không được để trống';
		} else if (!emailRegex.test(data.email)) {
			errors.email = 'Email không hợp lệ (VD: example@domain.com)';
		}

		if (!data.address || data.address.trim() === '') {
			errors.address = 'Địa chỉ không được để trống';
		}

		if (!data.salary || data.salary === '') {
			errors.salary = 'Lương không được để trống';
		} else if (isNaN(data.salary) || parseFloat(data.salary) <= 0) {
			errors.salary = 'Lương phải là số dương';
		} else if (parseFloat(data.salary) < 1000000) {
			errors.salary = 'Lương phải lớn hơn 1,000,000 VNĐ';
		}

		if (!data.work_start_date) {
			errors.work_start_date = 'Ngày bắt đầu không được để trống';
		} else {
			const startDate = dayjs(data.work_start_date);
			const today = dayjs().startOf('day');

			if (!startDate.isValid()) {
				errors.work_start_date = 'Ngày bắt đầu không hợp lệ';
			} else if (startDate.isAfter(today)) {
				errors.work_start_date = 'Ngày bắt đầu không thể lớn hơn ngày hiện tại';
			}
		}

		if (!data.employee_type_id) {
			errors.employee_type_id = 'Vui lòng chọn loại nhân viên';
		}

		return errors;
	};

	// Fetch data
	useEffect(() => {
		fetchEmployees();
	}, [employeeSubTab, employeePage, employeeRowsPerPage]);

	useEffect(() => {
		fetchEmployeeTypes();
	}, []);

	// Calculate employee count for each type
	useEffect(() => {
		const countMap = {};
		employees.forEach(emp => {
			const typeId = emp.employee_type_id || emp.employee_type?.id;
			if (typeId) {
				countMap[typeId] = (countMap[typeId] || 0) + 1;
			}
		});
		setEmployeeCountMap(countMap);
	}, [employees]);

	// Employee functions
	const fetchEmployees = async () => {
		setLoadingEmployees(true);
		try {
			if (isSwitchingTab) {
				await new Promise(resolve => setTimeout(resolve, 300));
			}

			const isWorking = employeeSubTab === 0 ? true : false;
			const res = await getEmployees({
				page: employeePage + 1,
				limit: employeeRowsPerPage,
				is_working: isWorking
			});
			setEmployees(res.data);
			setEmployeeError(null);
		} catch (err) {
			console.error(err);
			setEmployeeError('Không thể tải danh sách nhân viên');
		} finally {
			setLoadingEmployees(false);
			setIsSwitchingTab(false);
		}
	};

	const handleOpenEmployeeDialog = (employee = null) => {
		if (employee) {
			setEditingEmployee(employee);
			setEmployeeFormData({
				employee_name: employee.employee_name,
				phone_number: employee.phone_number,
				email: employee.email,
				address: employee.address,
				salary: employee.salary,
				work_start_date: formatDateForInput(employee.work_start_date),
				is_working: employee.is_working,
				employee_type_id: employee.employee_type_id || employee.employee_type?.id,
			});
		} else {
			setEditingEmployee(null);
			setEmployeeFormData({
				employee_name: '',
				phone_number: '',
				email: '',
				address: '',
				salary: '',
				work_start_date: '',
				is_working: employeeSubTab === 0 ? true : false,
				employee_type_id: '',
			});
		}
		setOpenEmployeeDialog(true);
	};

	const handleCloseEmployeeDialog = () => {
		setOpenEmployeeDialog(false);
		setEditingEmployee(null);
	};

	const handleEmployeeInputChange = (e) => {
		const { name, value, checked } = e.target;
		setEmployeeFormData(prev => ({
			...prev,
			[name]: name === 'is_working' ? checked : value
		}));
	};

	const handleEmployeeSubmit = async () => {
		const validationErrors = validateEmployeeForm(employeeFormData);

		if (Object.keys(validationErrors).length > 0) {
			const errorMessages = Object.values(validationErrors).join(', ');
			setSnackbar({
				open: true,
				message: `Vui lòng kiểm tra: ${errorMessages}`,
				severity: 'error'
			});
			return;
		}

		try {
			const submitData = {
				employee_name: employeeFormData.employee_name.trim(),
				phone_number: employeeFormData.phone_number.trim(),
				email: employeeFormData.email.trim(),
				address: employeeFormData.address.trim(),
				salary: parseFloat(employeeFormData.salary),
				work_start_date: formatDateForAPI(employeeFormData.work_start_date),
				is_working: employeeFormData.is_working,
				employee_type_id: employeeFormData.employee_type_id,
			};

			if (editingEmployee) {
				await updateEmployee(editingEmployee.id, submitData);
				setSnackbar({ open: true, message: 'Cập nhật nhân viên thành công!', severity: 'success' });
			} else {
				await createEmployee(submitData);
				setSnackbar({ open: true, message: 'Thêm nhân viên thành công!', severity: 'success' });
			}
			handleCloseEmployeeDialog();
			fetchEmployees();
		} catch (err) {
			console.error('Error details:', err.response?.data);
			const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra!';
			setSnackbar({ open: true, message: errorMessage, severity: 'error' });
		}
	};

	const handleDeleteEmployee = async (id, name) => {
		if (window.confirm(`Bạn có chắc muốn xóa nhân viên "${name}"?`)) {
			try {
				await deleteEmployee(id);
				setSnackbar({ open: true, message: 'Xóa nhân viên thành công!', severity: 'success' });
				fetchEmployees();
			} catch (err) {
				console.error(err);
				setSnackbar({ open: true, message: 'Không thể xóa nhân viên!', severity: 'error' });
			}
		}
	};

	const handleEmployeePageChange = (event, newPage) => {
		setEmployeePage(newPage);
	};

	const handleEmployeeRowsPerPageChange = (event) => {
		setEmployeeRowsPerPage(parseInt(event.target.value, 10));
		setEmployeePage(0);
	};

	const handleEmployeeSubTabChange = async (event, newValue) => {
		if (newValue === employeeSubTab) return;

		setIsSwitchingTab(true);
		setEmployeeSubTab(newValue);
		setEmployeePage(0);
		setSearchTerm('');
	};

	// Employee Type functions
	const fetchEmployeeTypes = async () => {
		setLoadingTypes(true);
		try {
			// Fetch active types (is_deleted = false)
			const activeRes = await getEmployeeTypes({ is_deleted: false });
			setEmployeeTypes(activeRes.data || activeRes);

			// Fetch deleted types (is_deleted = true)
			const deletedRes = await getEmployeeTypes({ is_deleted: true });
			setDeletedEmployeeTypes(deletedRes.data || deletedRes);

			setTypeError(null);
		} catch (err) {
			console.error(err);
			setTypeError('Không thể tải danh sách loại nhân viên');
		} finally {
			setLoadingTypes(false);
			setIsSwitchingTypeTab(false);
		}
	};

	const handleOpenTypeDialog = useCallback((type = null) => {
		if (type) {
			setEditingType(type);
			setTypeFormData({
				name: type.name,
				description: type.description || '',
			});
		} else {
			setEditingType(null);
			setTypeFormData({
				name: '',
				description: '',
			});
		}
		setOpenTypeDialog(true);
	}, []);

	const handleCloseTypeDialog = () => {
		setOpenTypeDialog(false);
		setEditingType(null);
	};

	const handleTypeInputChange = (e) => {
		const { name, value } = e.target;
		setTypeFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleTypeSubmit = async () => {
		try {
			if (editingType) {
				await updateEmployeeType(editingType.id, typeFormData);
				setSnackbar({ open: true, message: 'Cập nhật loại nhân viên thành công!', severity: 'success' });
			} else {
				await createEmployeeType(typeFormData);
				setSnackbar({ open: true, message: 'Thêm loại nhân viên thành công!', severity: 'success' });
			}
			handleCloseTypeDialog();
			fetchEmployeeTypes();
		} catch (err) {
			console.error(err);
			setSnackbar({ open: true, message: 'Có lỗi xảy ra!', severity: 'error' });
		}
	};

	const handleDeleteType = useCallback(async (id, name) => {
		if (window.confirm(`Bạn có chắc muốn xóa loại nhân viên "${name}"?`)) {
			try {
				await deleteEmployeeType(id);
				setSnackbar({ open: true, message: 'Xóa loại nhân viên thành công!', severity: 'success' });
				fetchEmployeeTypes();
				fetchEmployees();
			} catch (err) {
				console.error(err);
				setSnackbar({ open: true, message: 'Không thể xóa loại nhân viên!', severity: 'error' });
			}
		}
	}, []);

	const handleTypeSubTabChange = async (event, newValue) => {
		if (newValue === typeSubTab) return;

		setIsSwitchingTypeTab(true);
		setTypeSubTab(newValue);
		setTypePage(0);
		setTypeSearchTerm('');
	};

	const handleTypePageChange = (event, newPage) => {
		setTypePage(newPage);
	};

	const handleTypeRowsPerPageChange = (event) => {
		setTypeRowsPerPage(parseInt(event.target.value, 10));
		setTypePage(0);
	};

	const currentTypes = typeSubTab === 0 ? employeeTypes : deletedEmployeeTypes;
	const filteredTypes = useMemo(() =>
		currentTypes.filter(type =>
			type.name?.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
			type.description?.toLowerCase().includes(typeSearchTerm.toLowerCase())
		),
		[currentTypes, typeSearchTerm]
	);

	const paginatedTypes = useMemo(() =>
		filteredTypes.slice(
			typePage * typeRowsPerPage,
			typePage * typeRowsPerPage + typeRowsPerPage
		),
		[filteredTypes, typePage, typeRowsPerPage]
	);

	return (
		<Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'background.default' }}>
			<Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: '#1a237e' }}>
				Quản lý nhân viên
			</Typography>

			<Paper sx={{ borderRadius: 2, overflow: 'hidden', p: 2 }}>
				<Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
					<Tab label="Nhân viên" />
					<Tab label="Loại nhân viên" />
				</Tabs>

				{/* Tab 1: Employee Management */}
				<TabPanel value={tabValue} index={0}>
					{employeeError ? (
						<Alert
							severity="error"
							action={
								<Button color="inherit" size="small" onClick={fetchEmployees}>
									Thử lại
								</Button>
							}
							sx={{ mb: 2 }}
						>
							{employeeError}
						</Alert>
					) : (
						<>
							{/* Employee Sub-tabs with animation */}
							<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, position: 'relative' }}>
								<Tabs
									value={employeeSubTab}
									onChange={handleEmployeeSubTabChange}
									indicatorColor="primary"
									textColor="primary"
									variant="fullWidth"
									sx={{
										'& .MuiTab-root': {
											transition: 'all 0.3s ease',
											'&:hover': {
												transform: 'translateY(-2px)',
											},
										},
									}}
								>
									<Tab
										icon={<WorkIcon />}
										iconPosition="start"
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span>Đang làm việc</span>
												<Chip
													label="Đang hoạt động"
													size="small"
													color="success"
													sx={{
														ml: 1,
														animation: employeeSubTab === 0 ? 'pulse 1s ease-in-out' : 'none',
														'@keyframes pulse': {
															'0%': { transform: 'scale(1)' },
															'50%': { transform: 'scale(1.05)' },
															'100%': { transform: 'scale(1)' },
														},
													}}
												/>
											</Box>
										}
									/>
									<Tab
										icon={<WorkOffIcon />}
										iconPosition="start"
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span>Đã nghỉ việc</span>
												<Chip
													label="Ngưng hoạt động"
													size="small"
													color="error"
													sx={{
														ml: 1,
														animation: employeeSubTab === 1 ? 'pulse 1s ease-in-out' : 'none',
														'@keyframes pulse': {
															'0%': { transform: 'scale(1)' },
															'50%': { transform: 'scale(1.05)' },
															'100%': { transform: 'scale(1)' },
														},
													}}
												/>
											</Box>
										}
									/>
								</Tabs>

								{/* Animated underline for sub-tabs */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										height: 2,
										width: '50%',
										bgcolor: 'primary.main',
										transition: 'transform 0.3s ease-in-out',
										transform: `translateX(${employeeSubTab * 100}%)`,
										borderRadius: 1,
									}}
								/>
							</Box>

							{/* Header Actions */}
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3, position: 'relative', zIndex: 0 }}>
								<Box sx={{ display: 'flex', gap: 2, flex: 1, maxWidth: 400 }}>
									<TextField
										size="small"
										placeholder="Tìm kiếm nhân viên..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<SearchIcon />
												</InputAdornment>
											),
										}}
										fullWidth
									/>
									<Button variant="outlined" onClick={() => setSearchTerm('')} size="small">
										Xóa
									</Button>
								</Box>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Tooltip title="Làm mới">
										<IconButton onClick={fetchEmployees} color="primary">
											<RefreshIcon />
										</IconButton>
									</Tooltip>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={() => handleOpenEmployeeDialog()}
										sx={{ textTransform: 'none' }}
									>
										Thêm nhân viên
									</Button>
								</Box>
							</Box>

							{/* Employee Table with animations */}
							<EmployeeTable
								employees={employees}
								loading={loadingEmployees}
								searchTerm={searchTerm}
								onEdit={handleOpenEmployeeDialog}
								onDelete={handleDeleteEmployee}
								employeeSubTab={employeeSubTab}
							/>

							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								component="div"
								count={employees.filter(employee =>
									employee.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
									employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
									employee.phone_number?.includes(searchTerm)
								).length}
								rowsPerPage={employeeRowsPerPage}
								page={employeePage}
								onPageChange={handleEmployeePageChange}
								onRowsPerPageChange={handleEmployeeRowsPerPageChange}
								labelRowsPerPage="Số hàng mỗi trang"
								labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
							/>
						</>
					)}
				</TabPanel>

				{/* Tab 2: Employee Type Management */}
				<TabPanel value={tabValue} index={1}>
					{typeError ? (
						<Alert
							severity="error"
							action={
								<Button color="inherit" size="small" onClick={fetchEmployeeTypes}>
									Thử lại
								</Button>
							}
						>
							{typeError}
						</Alert>
					) : (
						<>
							{/* Type Sub-tabs with animation */}
							<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, position: 'relative' }}>
								<Tabs
									value={typeSubTab}
									onChange={handleTypeSubTabChange}
									indicatorColor="primary"
									textColor="primary"
									variant="fullWidth"
									sx={{
										'& .MuiTab-root': {
											transition: 'all 0.3s ease',
											'&:hover': {
												transform: 'translateY(-2px)',
											},
										},
									}}
								>
									<Tab
										icon={<CategoryIcon />}
										iconPosition="start"
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span>Đang hoạt động</span>
												<Chip
													label={employeeTypes.length}
													size="small"
													color="success"
													sx={{
														ml: 1,
														animation: typeSubTab === 0 ? 'pulse 1s ease-in-out' : 'none',
														'@keyframes pulse': {
															'0%': { transform: 'scale(1)' },
															'50%': { transform: 'scale(1.05)' },
															'100%': { transform: 'scale(1)' },
														},
													}}
												/>
											</Box>
										}
									/>
									<Tab
										icon={<DeleteIcon />}
										iconPosition="start"
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span>Đã xóa</span>
												<Chip
													label={deletedEmployeeTypes.length}
													size="small"
													color="error"
													sx={{
														ml: 1,
														animation: typeSubTab === 1 ? 'pulse 1s ease-in-out' : 'none',
														'@keyframes pulse': {
															'0%': { transform: 'scale(1)' },
															'50%': { transform: 'scale(1.05)' },
															'100%': { transform: 'scale(1)' },
														},
													}}
												/>
											</Box>
										}
									/>
								</Tabs>

								{/* Animated underline for sub-tabs */}
								<Box
									sx={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										height: 2,
										width: '50%',
										bgcolor: 'primary.main',
										transition: 'transform 0.3s ease-in-out',
										transform: `translateX(${typeSubTab * 100}%)`,
										borderRadius: 1,
									}}
								/>
							</Box>

							{/* Header Actions */}
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3, position: 'relative', zIndex: 0 }}>
								<Box sx={{ display: 'flex', gap: 2, flex: 1, maxWidth: 400 }}>
									<TextField
										size="small"
										placeholder="Tìm kiếm loại nhân viên..."
										value={typeSearchTerm}
										onChange={(e) => setTypeSearchTerm(e.target.value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<SearchIcon />
												</InputAdornment>
											),
										}}
										fullWidth
									/>
									<Button variant="outlined" onClick={() => setTypeSearchTerm('')} size="small">
										Xóa
									</Button>
								</Box>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Tooltip title="Làm mới">
										<IconButton onClick={fetchEmployeeTypes} color="primary">
											<RefreshIcon />
										</IconButton>
									</Tooltip>
									{typeSubTab === 0 && (
										<Button
											variant="contained"
											startIcon={<AddIcon />}
											onClick={() => handleOpenTypeDialog()}
											sx={{ textTransform: 'none' }}
										>
											Thêm loại nhân viên
										</Button>
									)}
								</Box>
							</Box>

							{/* Employee Type Table with animations */}
							<TypeTable
								types={paginatedTypes}
								loading={loadingTypes}
								searchTerm={typeSearchTerm}
								onEdit={handleOpenTypeDialog}
								onDelete={handleDeleteType}
								typeSubTab={typeSubTab}
								employeeCountMap={employeeCountMap}
							/>

							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								component="div"
								count={filteredTypes.length}
								rowsPerPage={typeRowsPerPage}
								page={typePage}
								onPageChange={handleTypePageChange}
								onRowsPerPageChange={handleTypeRowsPerPageChange}
								labelRowsPerPage="Số hàng mỗi trang"
								labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
							/>
						</>
					)}
				</TabPanel>
			</Paper>

			{/* Employee Add/Edit Dialog */}
			<Dialog open={openEmployeeDialog} onClose={handleCloseEmployeeDialog} maxWidth="md" fullWidth>
				<DialogTitle>
					{editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
						<TextField
							label="Tên nhân viên"
							name="employee_name"
							value={employeeFormData.employee_name}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
						/>
						<TextField
							label="Số điện thoại"
							name="phone_number"
							value={employeeFormData.phone_number}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
							placeholder="0912345678"
						/>
						<TextField
							label="Email"
							name="email"
							type="email"
							value={employeeFormData.email}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
							placeholder="example@company.com"
						/>
						<TextField
							label="Địa chỉ"
							name="address"
							value={employeeFormData.address}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
						/>
						<TextField
							label="Lương"
							name="salary"
							type="number"
							value={employeeFormData.salary}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
							InputProps={{
								startAdornment: <InputAdornment position="start">₫</InputAdornment>,
							}}
						/>
						<TextField
							label="Ngày bắt đầu"
							name="work_start_date"
							type="date"
							value={employeeFormData.work_start_date}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="Loại nhân viên"
							name="employee_type_id"
							select
							value={employeeFormData.employee_type_id}
							onChange={handleEmployeeInputChange}
							required
							fullWidth
						>
							<MenuItem value="">-- Chọn loại nhân viên --</MenuItem>
							{employeeTypes.map((type) => (
								<MenuItem key={type.id} value={type.id}>
									{type.name}
								</MenuItem>
							))}
						</TextField>
						<FormControlLabel
							control={
								<Switch
									name="is_working"
									checked={employeeFormData.is_working}
									onChange={handleEmployeeInputChange}
								/>
							}
							label="Đang làm việc"
							sx={{ mt: 1 }}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEmployeeDialog}>Hủy</Button>
					<Button onClick={handleEmployeeSubmit} variant="contained" color="primary">
						{editingEmployee ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Employee Type Add/Edit Dialog */}
			<Dialog open={openTypeDialog} onClose={handleCloseTypeDialog} maxWidth="sm" fullWidth>
				<DialogTitle>
					{editingType ? 'Chỉnh sửa loại nhân viên' : 'Thêm loại nhân viên mới'}
				</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
						<TextField
							label="Tên loại nhân viên"
							name="name"
							value={typeFormData.name}
							onChange={handleTypeInputChange}
							required
							fullWidth
							placeholder="VD: Full-time, Part-time, Contractor"
						/>
						<TextField
							label="Mô tả"
							name="description"
							value={typeFormData.description}
							onChange={handleTypeInputChange}
							fullWidth
							multiline
							rows={3}
							placeholder="Mô tả chi tiết về loại nhân viên này..."
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseTypeDialog}>Hủy</Button>
					<Button onClick={handleTypeSubmit} variant="contained" color="primary">
						{editingType ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default EmployeePage;