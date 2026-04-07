import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Tooltip,
    Badge,
    Menu,
    MenuItem,
    Popover,
    ListItem,
    alpha,
    useMediaQuery,
    useTheme as useMuiTheme,
    Chip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BadgeIcon from "@mui/icons-material/Badge";
import BuildIcon from "@mui/icons-material/Build";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CircleIcon from "@mui/icons-material/Circle";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeContext";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const MENU = [
    { label: "Dashboard",      path: "/admin/dashboard",         icon: <DashboardIcon /> },
    { label: "Khách hàng",     path: "/admin/customers",         icon: <PeopleIcon /> },
    { label: "Lịch xem xe",    path: "/admin/appointments",      icon: <EventIcon /> },
    { label: "Xe & Showroom",  path: "/admin/carandshowroom",    icon: <DirectionsCarIcon /> },
    { label: "Quản lí Garage", path: "/admin/garagemanagement",  icon: <BuildIcon /> },
    { label: "Kho phụ tùng",   path: "/admin/spare-parts",       icon: <InventoryIcon /> },
    { label: "Hóa đơn",        path: "/admin/invoicemanagement", icon: <ReceiptIcon /> },
    { label: "Nhân viên",      path: "/admin/employees",         icon: <BadgeIcon /> },
];

const NOTIFICATIONS = [
    { id: 1, title: "Đơn hàng mới",     message: "Khách hàng Nguyễn Văn A vừa đặt xe", time: "5 phút trước",  read: false },
    { id: 2, title: "Cảnh báo tồn kho", message: "Phụ tùng 'Lọc dầu' sắp hết",         time: "1 giờ trước",   read: false },
    { id: 3, title: "Lịch hẹn",         message: "Lịch bảo dưỡng lúc 14:30 hôm nay",   time: "2 giờ trước",   read: true  },
];

export default function AdminLayout() {
    const [collapsed, setCollapsed]         = useState(false);
    const [anchorElUser, setAnchorElUser]   = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [refreshKey, setRefreshKey]       = useState(0);
    const [refreshing, setRefreshing]       = useState(false);

    const navigate   = useNavigate();
    const location   = useLocation();
    const { logout, user } = useAuth();
    const { mode, toggleTheme } = useThemeMode();
    const muiTheme   = useMuiTheme();
    const isMobile   = useMediaQuery(muiTheme.breakpoints.down("md"));

    useEffect(() => {
        if (isMobile) setCollapsed(true);
    }, [isMobile]);

    const drawerWidth  = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
    const currentMenu  = MENU.find((m) => location.pathname.startsWith(m.path)) || MENU[0];
    const unreadCount  = notifications.filter((n) => !n.read).length;

    /* ── handlers ── */
    const handleOpenUserMenu  = useCallback((e) => setAnchorElUser(e.currentTarget), []);
    const handleCloseUserMenu = useCallback(() => setAnchorElUser(null), []);
    const handleOpenNotif     = useCallback((e) => setAnchorElNotif(e.currentTarget), []);
    const handleCloseNotif    = useCallback(() => setAnchorElNotif(null), []);

    const handleMarkAsRead = useCallback((id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }, []);

    const handleMarkAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const handleLogout = useCallback(() => {
        handleCloseUserMenu();
        logout();
    }, [handleCloseUserMenu, logout]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey((k) => k + 1);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    const handleNavigate = useCallback(
        (path) => {
            navigate(path);
            if (isMobile) setCollapsed(true);
        },
        [navigate, isMobile]
    );

    /* ── sidebar item ── */
    const SidebarItem = ({ item }) => {
        const active = location.pathname.startsWith(item.path);
        return (
            <Tooltip title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        px: collapsed ? 1.5 : 2,
                        py: 1.2,
                        justifyContent: collapsed ? "center" : "flex-start",
                        bgcolor: active ? "primary.main" : "transparent",
                        color: active ? "primary.contrastText" : "text.primary",
                        transition: "background-color 0.2s",
                        "&:hover": {
                            bgcolor: active
                                ? "primary.dark"
                                : alpha(muiTheme.palette.primary.main, 0.1),
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: collapsed ? 0 : 2,
                            color: active ? "inherit" : "primary.main",
                            justifyContent: "center",
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                        <ListItemText
                            primary={item.label}
                            slotProps={{
                                primary: {
                                    fontSize: "0.875rem",
                                    fontWeight: active ? 600 : 400,
                                    noWrap: true,
                                },
                            }}
                        />
                    )}
                </ListItemButton>
            </Tooltip>
        );
    };

    return (
        <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>

            {/* ── SIDEBAR ── */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={!isMobile || !collapsed}
                onClose={() => isMobile && setCollapsed(true)}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        transition: muiTheme.transitions.create("width", {
                            easing: muiTheme.transitions.easing.sharp,
                            duration: muiTheme.transitions.duration.standard,
                        }),
                        bgcolor: "background.paper",
                        borderRight: "1px solid",
                        borderColor: "divider",
                        overflowX: "hidden",
                    },
                }}
            >
                {/* Logo */}
                <Toolbar sx={{ justifyContent: collapsed ? "center" : "flex-start", minHeight: 64 }}>
                    {collapsed ? (
                        <Typography fontSize={24}>🚗</Typography>
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                whiteSpace: "nowrap",
                            }}
                        >
                            AutoPro Manager
                        </Typography>
                    )}
                </Toolbar>

                <Divider />

                <List sx={{ px: 1, pt: 1 }}>
                    {MENU.map((item) => (
                        <SidebarItem key={item.path} item={item} />
                    ))}
                </List>

                <Box sx={{ flexGrow: 1 }} />

                {/* Sidebar footer */}
                {!collapsed && (
                    <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 14 }}>
                                {user?.username?.charAt(0)?.toUpperCase() || "A"}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                    {user?.username || "Admin"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Quản trị viên
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Drawer>

            {/* ── MAIN ── */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

                {/* TOPBAR */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: "background.paper",
                        color: "text.primary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        zIndex: muiTheme.zIndex.drawer - 1,
                    }}
                >
                    <Toolbar sx={{ justifyContent: "space-between", gap: 1, minHeight: 64 }}>

                        {/* Left: toggle + breadcrumb */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tooltip title={collapsed ? "Mở rộng" : "Thu gọn"}>
                                <IconButton onClick={() => setCollapsed((c) => !c)} edge="start">
                                    <MenuIcon />
                                </IconButton>
                            </Tooltip>
                            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    Trang chủ
                                </Typography>
                                <ChevronRightIcon sx={{ fontSize: 16, mx: 0.5, color: "text.disabled" }} />
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {currentMenu?.label || "Dashboard"}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right: actions */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

                            {/* Refresh */}
                            <Tooltip title="Làm mới trang">
                                <IconButton
                                    onClick={handleRefresh}
                                    sx={{
                                        "& svg": {
                                            transition: "transform 0.6s ease",
                                            transform: refreshing ? "rotate(360deg)" : "none",
                                        },
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>

                            {/* Dark / Light */}
                            <Tooltip title={mode === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
                                <IconButton onClick={toggleTheme}>
                                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Tooltip>

                            {/* Notifications */}
                            <Tooltip title="Thông báo">
                                <IconButton onClick={handleOpenNotif}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            {/* Avatar */}
                            <Tooltip title="Tài khoản">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                                    <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: 14 }}>
                                        {user?.username?.charAt(0)?.toUpperCase() || "A"}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* User menu */}
                <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                            {user?.username || "Admin"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Quản trị viên
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/profile"); }}>
                        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                        Hồ sơ
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                        <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </Menu>

                {/* Notification popover */}
                <Popover
                    anchorEl={anchorElNotif}
                    open={Boolean(anchorElNotif)}
                    onClose={handleCloseNotif}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{ paper: { sx: { width: 340, maxHeight: 460, display: "flex", flexDirection: "column" } } }}
                >
                    <Box
                        sx={{
                            px: 2, py: 1.5,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography fontWeight={700}>Thông báo</Typography>
                            {unreadCount > 0 && (
                                <Chip label={unreadCount} size="small" color="error" sx={{ height: 20, fontSize: 11 }} />
                            )}
                        </Box>
                        {unreadCount > 0 && (
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ cursor: "pointer", fontWeight: 600 }}
                                onClick={handleMarkAllRead}
                            >
                                Đọc tất cả
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                        {notifications.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography color="text.secondary" variant="body2">
                                    Không có thông báo
                                </Typography>
                            </Box>
                        ) : (
                            notifications.map((n) => (
                                <ListItem
                                    key={n.id}
                                    onClick={() => handleMarkAsRead(n.id)}
                                    sx={{
                                        alignItems: "flex-start",
                                        cursor: "pointer",
                                        bgcolor: n.read
                                            ? "transparent"
                                            : alpha(muiTheme.palette.primary.main, 0.06),
                                        "&:hover": { bgcolor: "action.hover" },
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                        py: 1.5,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                        <CircleIcon
                                            sx={{
                                                fontSize: 8,
                                                color: n.read ? "transparent" : "primary.main",
                                            }}
                                        />
                                    </ListItemIcon>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight={n.read ? 400 : 600} noWrap>
                                            {n.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            {n.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                                            {n.time}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))
                        )}
                    </Box>
                </Popover>

                {/* PAGE CONTENT */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        bgcolor: "background.default",
                        minHeight: 0,
                        overflow: "auto",
                    }}
                >
                    <Outlet context={{ mode, refreshKey }} />
                </Box>
            </Box>
        </Box>
    );
}
