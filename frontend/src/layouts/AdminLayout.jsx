import { useState } from "react";
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
} from "@mui/material";

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

import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH = 72;

const MENU = [
	{ label: "Dashboard", path: "dashboard", icon: <DashboardIcon /> },
	{ label: "Khách hàng", path: "customers", icon: <PeopleIcon /> },
	{ label: "Xe & Showroom", path: "carandshowroom", icon: <DirectionsCarIcon /> },
	{ label: "Lịch dịch vụ", path: "services", icon: <EventIcon /> },
	{ label: "Lịch xem xe", path: "appointments", icon: <EventIcon /> },
	{ label: "Kho phụ tùng", path: "spare-parts", icon: <InventoryIcon /> },
	{ label: "Hóa đơn", path: "invoices", icon: <ReceiptIcon /> },
	{ label: "Nhân viên", path: "employees", icon: <BadgeIcon /> },
];

export default function AdminLayout({ toggleTheme, mode }) {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

	return (
		<Box sx={{ display: "flex", bgcolor: "background.default" }}>

			{/* ───── SIDEBAR ───── */}
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						transition: "0.3s",
						bgcolor: mode === "dark" ? "#1e1e2d" : "#fff",
						borderRight: "1px solid #eee",
					},
				}}
			>
				{/* Logo */}
				<Toolbar>
					<Typography fontWeight="bold">
						{collapsed ? "A" : "🚗 AutoPro"}
					</Typography>
				</Toolbar>

				<Divider />

				{/* Menu */}
				<List>
					{MENU.map((item) => {
						const active = location.pathname === item.path;

						return (
							<Tooltip title={collapsed ? item.label : ""} placement="right" key={item.path}>
								<ListItemButton
									onClick={() => navigate(item.path)}
									sx={{
										mx: 1,
										my: 0.5,
										borderRadius: 2,
										bgcolor: active ? "primary.main" : "transparent",
										color: active ? "#fff" : "text.primary",
										"&:hover": {
											bgcolor: active ? "primary.dark" : "action.hover",
										},
										justifyContent: collapsed ? "center" : "flex-start",
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: collapsed ? 0 : 2,
											color: active ? "#fff" : "inherit",
										}}
									>
										{item.icon}
									</ListItemIcon>

									{!collapsed && <ListItemText primary={item.label} />}
								</ListItemButton>
							</Tooltip>
						);
					})}
				</List>

				<Box sx={{ flexGrow: 1 }} />

				{/* Logout */}
				<List>
					<ListItemButton
						onClick={logout}
						sx={{
							mx: 1,
							mb: 1,
							borderRadius: 2,
							"&:hover": { bgcolor: "error.light" },
						}}
					>
						<ListItemIcon>
							<LogoutIcon color="error" />
						</ListItemIcon>
						{!collapsed && <ListItemText primary="Đăng xuất" />}
					</ListItemButton>
				</List>
			</Drawer>

			{/* ───── TOPBAR ───── */}
			<AppBar
				position="fixed"
				elevation={0}
				sx={{
					ml: `${drawerWidth}px`,
					width: `calc(100% - ${drawerWidth}px)`,
					bgcolor: "background.paper",
					color: "text.primary",
					borderBottom: "1px solid #eee",
					transition: "0.3s",
				}}
			>
				<Toolbar>
					{/* Toggle */}
					<IconButton onClick={() => setCollapsed(!collapsed)}>
						<MenuIcon />
					</IconButton>

					{/* Title */}
					<Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
						{MENU.find((m) => m.path === location.pathname)?.label || "Dashboard"}
					</Typography>

					{/* Notification */}
					<IconButton>
						<Badge badgeContent={3} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton>

					{/* Theme */}
					<IconButton onClick={toggleTheme}>
						{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
					</IconButton>

					{/* User */}
					<Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
						<Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
						{!collapsed && (
							<Typography sx={{ ml: 1, fontSize: 14 }}>
								Admin
							</Typography>
						)}
					</Box>
				</Toolbar>
			</AppBar>

			{/* ───── CONTENT ───── */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					mt: "64px",
					bgcolor: "background.default",
					minHeight: "100vh",
				}}
			>
				<Outlet context={{ mode }} />
			</Box>
		</Box>
	);
}