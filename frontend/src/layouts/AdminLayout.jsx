import { useState, useEffect } from "react";
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
	InputBase,
	Popover,
	ListItem,
	alpha,
	useMediaQuery,
	useTheme as useMuiTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";

import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

// Styled search input
const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

const MENU = [
	{ label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
	{ label: "Khách hàng", path: "/admin/customers", icon: <PeopleIcon /> },
	{ label: "Xe & Showroom", path: "/admin/carandshowroom", icon: <DirectionsCarIcon /> },
	{ label: "Quản lí Garage", path: "/admin/garagemanagement", icon: <EventIcon /> },
	{ label: "Kho phụ tùng", path: "/admin/spare-parts", icon: <InventoryIcon /> },
	{ label: "Hóa đơn", path: "/admin/invoicemanagement", icon: <ReceiptIcon /> },
	{ label: "Nhân viên", path: "/admin/employees", icon: <BadgeIcon /> },
];

// Mock notifications
const NOTIFICATIONS = [
	{ id: 1, title: "Đơn hàng mới", message: "Khách hàng Nguyễn Văn A vừa đặt xe", time: "5 phút trước", read: false },
	{ id: 2, title: "Cảnh báo tồn kho", message: "Phụ tùng 'Lọc dầu' sắp hết", time: "1 giờ trước", read: false },
	{ id: 3, title: "Lịch hẹn", message: "Lịch bảo dưỡng lúc 14:30 hôm nay", time: "2 giờ trước", read: true },
];

export default function AdminLayout({ toggleTheme, mode }) {
	const [collapsed, setCollapsed] = useState(false);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const [anchorElNotif, setAnchorElNotif] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [notifications, setNotifications] = useState(NOTIFICATIONS);

	const navigate = useNavigate();
	const location = useLocation();
	const { logout, user } = useAuth();
	const muiTheme = useMuiTheme();
	const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

	// Auto close sidebar on mobile
	useEffect(() => {
		if (isMobile) setCollapsed(true);
	}, [isMobile]);

	const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
	const currentMenu = MENU.find((m) => location.pathname.includes(m.path)) || MENU[0];

	const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
	const handleCloseUserMenu = () => setAnchorElUser(null);

	const handleOpenNotifMenu = (event) => setAnchorElNotif(event.currentTarget);
	const handleCloseNotifMenu = () => setAnchorElNotif(null);

	const handleMarkAsRead = (id) => {
		setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
	};

	const handleMarkAllRead = () => {
		setNotifications(prev => prev.map(n => ({ ...n, read: true })));
	};

	const unreadCount = notifications.filter(n => !n.read).length;

	const handleLogout = () => {
		handleCloseUserMenu();
		logout();
	};

	return (
		<Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>

			{/* SIDEBAR */}
			<Drawer
				variant={isMobile ? "temporary" : "permanent"}
				open={!isMobile || !collapsed}
				onClose={() => isMobile && setCollapsed(true)}
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						transition: (theme) => theme.transitions.create("width", {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
						bgcolor: "background.paper",
						borderRight: "1px solid",
						borderColor: "divider",
						overflowX: "hidden",
					},
				}}
			>
				{/* Logo Area */}
				<Toolbar sx={{ justifyContent: collapsed ? "center" : "flex-start" }}>
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
						{collapsed ? "🚗" : "AutoPro Manager"}
					</Typography>
				</Toolbar>

				<Divider />

				{/* Menu List */}
				<List sx={{ px: 1 }}>
					{MENU.map((item) => {
						const active = location.pathname === `/${item.path}` ||
							(location.pathname === "/" && item.path === "dashboard") ||
							location.pathname.startsWith(`/${item.path}/`);

						return (
							<Tooltip title={collapsed ? item.label : ""} placement="right" key={item.path}>
								<ListItemButton
									onClick={() => {
										navigate(item.path === "dashboard" ? "/" : `/${item.path}`);
										if (isMobile) setCollapsed(true);
									}}
									sx={{
										borderRadius: 2,
										mb: 0.5,
										backgroundColor: active ? "primary.main" : "transparent",
										color: active ? "primary.contrastText" : "text.primary",
										"&:hover": {
											backgroundColor: active ? "primary.dark" : alpha(muiTheme.palette.primary.main, 0.08),
										},
										justifyContent: collapsed ? "center" : "flex-start",
										px: collapsed ? 1 : 2,
										py: 1.2,
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
											primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: active ? 600 : 400 }}
										/>
									)}
								</ListItemButton>
							</Tooltip>
						);
					})}
				</List>

				<Box sx={{ flexGrow: 1 }} />

				{/* Sidebar Footer - User Info when collapsed */}
				{!collapsed && (
					<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
								{user?.name?.charAt(0) || "A"}
							</Avatar>
							<Box>
								<Typography variant="body2" fontWeight={600}>{user?.name || "Admin User"}</Typography>
								<Typography variant="caption" color="text.secondary">Quản trị viên</Typography>
							</Box>
						</Box>
					</Box>
				)}
			</Drawer>

			{/* MAIN CONTENT */}
			<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

				{/* TOPBAR */}
				<AppBar
					position="sticky"
					elevation={0}
					sx={{
						bgcolor: "background.paper",
						color: "text.primary",
						borderBottom: 1,
						borderColor: "divider",
					}}
				>
					<Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<IconButton onClick={() => setCollapsed(!collapsed)} edge="start">
								<MenuIcon />
							</IconButton>

							{/* Breadcrumb */}
							<Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: 1 }}>
								<Typography variant="body2" color="text.secondary">Trang chủ</Typography>
								<ChevronRightIcon sx={{ fontSize: 16, mx: 0.5, color: "text.secondary" }} />
								<Typography variant="body2" fontWeight={500}>{currentMenu?.label || "Dashboard"}</Typography>
							</Box>
						</Box>

						{/* Search Bar */}
						<Search sx={{ display: { xs: "none", md: "flex" } }}>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Tìm kiếm..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</Search>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							{/* Theme Toggle */}
							<Tooltip title={mode === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
								<IconButton onClick={toggleTheme}>
									{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
								</IconButton>
							</Tooltip>

							{/* Notifications */}
							<Tooltip title="Thông báo">
								<IconButton onClick={handleOpenNotifMenu}>
									<Badge badgeContent={unreadCount} color="error">
										<NotificationsIcon />
									</Badge>
								</IconButton>
							</Tooltip>

							{/* User Avatar */}
							<Tooltip title="Tài khoản">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
										{user?.name?.charAt(0) || "A"}
									</Avatar>
								</IconButton>
							</Tooltip>
						</Box>
					</Toolbar>
				</AppBar>

				{/* User Menu Dropdown */}
				<Menu
					anchorEl={anchorElUser}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
				>
					<MenuItem onClick={() => { handleCloseUserMenu(); navigate("/profile"); }}>
						<ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
						<Typography>Hồ sơ</Typography>
					</MenuItem>
					<MenuItem onClick={() => { handleCloseUserMenu(); navigate("/settings"); }}>
						<ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
						<Typography>Cài đặt</Typography>
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
						<ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
						<Typography>Đăng xuất</Typography>
					</MenuItem>
				</Menu>

				{/* Notification Panel */}
				<Popover
					anchorEl={anchorElNotif}
					open={Boolean(anchorElNotif)}
					onClose={handleCloseNotifMenu}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "right" }}
					PaperProps={{ sx: { width: 360, maxHeight: 480, overflow: "hidden" } }}
				>
					<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography fontWeight={600}>Thông báo</Typography>
						{unreadCount > 0 && (
							<Typography variant="caption" color="primary" sx={{ cursor: "pointer" }} onClick={handleMarkAllRead}>
								Đánh dấu đã đọc
							</Typography>
						)}
					</Box>
					<Box sx={{ maxHeight: 400, overflowY: "auto" }}>
						{notifications.length === 0 ? (
							<Box sx={{ p: 4, textAlign: "center" }}>
								<Typography color="text.secondary">Không có thông báo</Typography>
							</Box>
						) : (
							notifications.map((notif) => (
								<ListItem
									key={notif.id}
									sx={{
										backgroundColor: notif.read ? "transparent" : alpha(muiTheme.palette.primary.main, 0.05),
										cursor: "pointer",
										"&:hover": { backgroundColor: "action.hover" },
									}}
									onClick={() => handleMarkAsRead(notif.id)}
								>
									<ListItemIcon sx={{ minWidth: 36 }}>
										<CircleIcon sx={{ fontSize: 10, color: notif.read ? "text.disabled" : "primary.main" }} />
									</ListItemIcon>
									<Box sx={{ flex: 1 }}>
										<Typography variant="body2" fontWeight={notif.read ? 400 : 600}>{notif.title}</Typography>
										<Typography variant="caption" color="text.secondary">{notif.message}</Typography>
										<Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
											{notif.time}
										</Typography>
									</Box>
								</ListItem>
							))
						)}
					</Box>
				</Popover>

				{/* Page Content */}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: { xs: 2, sm: 3 },
						bgcolor: "background.default",
					}}
				>
					<Outlet context={{ mode }} />
				</Box>
			</Box>
		</Box>
	);
}