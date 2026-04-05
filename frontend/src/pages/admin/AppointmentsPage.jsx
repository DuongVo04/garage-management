import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid, CircularProgress, Snackbar, Alert, Divider, Stack, InputAdornment,
  alpha, Card, Avatar, Tooltip
} from "@mui/material";
import {
  Search, Delete, Refresh, CheckCircle, Cancel,
  Event as EventIcon, Phone as PhoneIcon, Person as PersonIcon,
  DirectionsCar as CarIcon, AccessTime as TimeIcon, ThumbUp, ThumbDown
} from "@mui/icons-material";
import {
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../../services/appointment.service.jsx";

const COLORS = {
  primary: "#1A237E",
  accent: "#5C6BC0",
  surface: "#F8F9FE",
  cardBg: "#FFFFFF",
  border: "#E8EAF6",
  text: "#1A1A2E",
  muted: "#7986CB",
  danger: "#EF5350",
  success: "#26A69A",
  warning: "#FFA726",
  info: "#0288d1"
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
};

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", color: "default" },
  { value: "pending", label: "Chờ xác nhận", color: "warning" },
  { value: "confirmed", label: "Đã xác nhận", color: "info" },
  { value: "rejected", label: "Đã từ chối", color: "error" },
  { value: "done", label: "Hoàn thành", color: "success" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || "http://localhost:3000";

const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  if (path.startsWith('uploads/')) return `${API_BASE}/${path}`;
  return `${API_BASE}/uploads/${path}`;
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await getAllAppointments(params);
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showSnackbar("Không thể tải danh sách lịch hẹn", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateAppointmentStatus(id, newStatus);
      if (response.success) {
        showSnackbar(`Đã cập nhật trạng thái thành ${newStatus}`);
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Lỗi khi cập nhật trạng thái", "error");
    }
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteAppointment(selectedAppointment.id);
      if (response.success) {
        showSnackbar("Xóa lịch hẹn thành công");
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showSnackbar("Lỗi khi xóa lịch hẹn", "error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'pending': return <Chip label="Chờ xác nhận" color="warning" size="small" variant="outlined" sx={{ fontWeight: 700 }} />;
      case 'confirmed': return <Chip label="Đã xác nhận" color="info" size="small" variant="outlined" sx={{ fontWeight: 700 }} />;
      case 'rejected': return <Chip label="Đã từ chối" color="error" size="small" variant="filled" sx={{ fontWeight: 700 }} />;
      case 'done': return <Chip label="Hoàn thành" color="success" size="small" variant="filled" sx={{ fontWeight: 700 }} />;
      default: return <Chip label={status} size="small" />;
    }
  }

  const filteredAppointments = appointments.filter(app => 
    (app?.viewer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (app?.phone_number || "").includes(searchTerm) ||
    (app?.showroom_vehicle?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: COLORS.surface, minHeight: "100%" }}>
      {/* Header section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color={COLORS.primary} sx={{ mb: 1 }}>
            Quản lý lịch xem xe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xác nhận hoặc từ chối các yêu cầu xem xe từ khách hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchAppointments}
          sx={{
            bgcolor: COLORS.primary,
            borderRadius: 2,
            px: 3,
            '&:hover': { bgcolor: COLORS.accent }
          }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Filters card */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: `1px solid ${COLORS.border}` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm theo tên khách, SĐT hoặc tên xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.muted }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: alpha(COLORS.primary, 0.02),
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
               <Typography variant="body2" fontWeight="600" color={COLORS.muted}>
                 Tổng cộng: {filteredAppointments.length} lịch hẹn
               </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Main Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress size={40} thickness={4} />
            <Typography sx={{ mt: 2, color: COLORS.muted }}>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: alpha(COLORS.primary, 0.03) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", color: COLORS.primary }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: "700", color: COLORS.primary }}>Xe yêu cầu</TableCell>
                <TableCell sx={{ fontWeight: "700", color: COLORS.primary }}>Thời gian hẹn</TableCell>
                <TableCell sx={{ fontWeight: "700", color: COLORS.primary }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: COLORS.primary }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">Không tìm thấy lịch hẹn nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((app) => (
                  <TableRow key={app.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 18, color: COLORS.accent }} />
                          <Typography fontWeight="700">{app.viewer_name || "N/A"}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: COLORS.muted }} />
                          <Typography variant="body2" color="text.secondary">{app.phone_number || "N/A"}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                         <Avatar 
                           variant="rounded" 
                           src={imgSrc(app.showroom_vehicle?.thumbnail)} 
                           sx={{ width: 45, height: 45, bgcolor: alpha(COLORS.primary, 0.1) }}
                         >
                           <CarIcon />
                         </Avatar>
                         <Typography variant="body2" fontWeight="600">{app.showroom_vehicle?.name || "N/A"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                       <Stack spacing={0.5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EventIcon sx={{ fontSize: 16, color: COLORS.muted }} />
                          <Typography variant="body2">{app.view_at ? formatDate(app.view_at) : "N/A"}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TimeIcon sx={{ fontSize: 16, color: COLORS.muted }} />
                          <Typography variant="body2">{app.view_at ? formatTime(app.view_at) : "N/A"}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(app.status)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {app.status === "pending" && (
                          <>
                            <Tooltip title="Chấp nhận">
                              <IconButton 
                                onClick={() => handleStatusChange(app.id, "confirmed")}
                                sx={{ color: COLORS.info, bgcolor: alpha(COLORS.info, 0.1), '&:hover': { bgcolor: alpha(COLORS.info, 0.2) } }}
                              >
                                <ThumbUp fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                              <IconButton 
                                onClick={() => handleStatusChange(app.id, "rejected")}
                                sx={{ color: COLORS.danger, bgcolor: alpha(COLORS.danger, 0.1), '&:hover': { bgcolor: alpha(COLORS.danger, 0.2) } }}
                              >
                                <ThumbDown fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        {app.status === "confirmed" && (
                          <Tooltip title="Đánh dấu hoàn thành">
                            <IconButton 
                              onClick={() => handleStatusChange(app.id, "done")}
                              sx={{ color: COLORS.success, bgcolor: alpha(COLORS.success, 0.1), '&:hover': { bgcolor: alpha(COLORS.success, 0.2) } }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Xóa">
                          <IconButton 
                            onClick={() => handleDeleteClick(app)}
                            sx={{ color: COLORS.danger, bgcolor: alpha(COLORS.danger, 0.1), '&:hover': { bgcolor: alpha(COLORS.danger, 0.2) } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: "800" }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa lịch hẹn của <strong>{selectedAppointment?.viewer_name}</strong> không? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ fontWeight: "700" }}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontWeight: "700", borderRadius: 2 }}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentsPage;