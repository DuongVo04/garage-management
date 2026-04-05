import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress,
  Alert, Stack, Avatar, Button, Divider, useTheme, IconButton, Container
} from "@mui/material";
import {
  Event as EventIcon,
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  ArrowForwardIos,
  SentimentDissatisfied,
  LocationOn
} from "@mui/icons-material";
import { getMyAppointments } from "../../services/appointment.service.jsx";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || "http://localhost:3000";

const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  if (path.startsWith('uploads/')) return `${API_BASE}/${path}`;
  return `${API_BASE}/uploads/${path}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
};

const getStatusConfig = (status) => {
  switch(status) {
    case 'pending': 
      return { label: "Chờ duyệt", color: "warning", msg: "Đang chờ Admin xác nhận" };
    case 'confirmed': 
      return { label: "Đã xác nhận", color: "success", msg: "Lịch hẹn đã được chấp nhận" };
    case 'rejected': 
      return { label: "Từ chối", color: "error", msg: "Lịch hẹn bị từ chối" };
    case 'done': 
      return { label: "Hoàn thành", color: "primary", msg: "Đã xem xe thành công" };
    default: 
      return { label: status, color: "default", msg: "" };
  }
}

const UserAppointmentsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setLoading(true);
        const response = await getMyAppointments();
        if (response.success) {
          setAppointments(response.data);
        }
      } catch (err) {
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
      <CircularProgress size={30} />
    </Box>
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="text.primary">
            Lịch hẹn xem xe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn có {appointments.length} yêu cầu đặt lịch
          </Typography>
        </Box>
        <Button 
          startIcon={<HistoryIcon />} 
          size="small" 
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Làm mới
        </Button>
      </Stack>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'transparent', border: '2px dashed', borderColor: 'divider' }} elevation={0}>
          <SentimentDissatisfied sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>Trống rỗng...</Typography>
          <Button onClick={() => navigate('/')} variant="text" sx={{ fontWeight: 700 }}>Khám phá Showroom ngay</Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {appointments.map((app) => {
            const config = getStatusConfig(app.status);
            return (
              <Paper 
                key={app.id}
                elevation={0}
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  '&:hover': { bgcolor: '#fcfcfe', borderColor: 'primary.light' }
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  {/* Thumbnail gọn gàng */}
                  <Box sx={{ width: { xs: '100%', sm: 140 }, height: 90, flexShrink: 0 }}>
                    <img 
                      src={imgSrc(app.showroom_vehicle?.thumbnail)} 
                      alt="car"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                    />
                  </Box>

                  {/* Info */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 0.5 }}>
                      {app.showroom_vehicle?.name}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                        <EventIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="600">{formatDate(app.view_at)}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
                        <TimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="600">{formatTime(app.view_at)}</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} color="primary.main">
                       <InfoIcon sx={{ fontSize: 14 }} />
                       <Typography variant="caption" fontWeight="500">{config.msg}</Typography>
                    </Stack>
                  </Box>

                  {/* Status & Action */}
                  <Stack direction="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1} sx={{ minWidth: 120 }}>
                    <Chip 
                      label={config.label} 
                      color={config.color} 
                      size="small" 
                      sx={{ fontWeight: 800, borderRadius: 1.5, px: 1 }} 
                    />
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIos sx={{ fontSize: 10 }} />}
                      onClick={() => navigate(`/vehicle/${app.showroom_vehicle_id}`)}
                      sx={{ fontSize: '0.75rem', fontWeight: 700, p: 0 }}
                    >
                      Chi tiết xe
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default UserAppointmentsPage;