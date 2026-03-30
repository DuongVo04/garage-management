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

const DRAWER_WIDTH = 248;
const COLLAPSED_WIDTH = 64;

const MENU = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Khách hàng", path: "/customers", icon: <PeopleIcon /> },
  { label: "Xe & Showroom", path: "/home/showroom", icon: <DirectionsCarIcon /> },
  { label: "Lịch dịch vụ", path: "/services", icon: <EventIcon /> },
  { label: "Kho phụ tùng", path: "/inventory", icon: <InventoryIcon /> },
  { label: "Hóa đơn", path: "/invoices", icon: <ReceiptIcon /> },
  { label: "Nhân viên", path: "/employees", icon: <BadgeIcon /> },
];

export default function AdminLayout({ toggleTheme, mode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleLogout = () => {
    logout();
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* ───── SIDEBAR ───── */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            transition: "width 0.25s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Logo */}
        <Toolbar>
          <Typography variant="h6" noWrap>
            {collapsed ? "A" : "AutoPro"}
          </Typography>
        </Toolbar>

        <Divider />

        {/* Menu */}
        <List>
          {MENU.map((item) => {
            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText primary={item.label} />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout */}
        <List>
          <ListItemButton onClick={handleLogout}>
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
        sx={{
          ml: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: "all 0.25s",
        }}
      >
        <Toolbar>
          {/* Toggle */}
          <IconButton
            color="inherit"
            onClick={() => setCollapsed(!collapsed)}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography sx={{ flexGrow: 1 }}>
            {
              MENU.find((m) => m.path === location.pathname)?.label ||
              "Dashboard"
            }
          </Typography>

          {/* Actions */}
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Avatar sx={{ ml: 2 }}>A</Avatar>
        </Toolbar>
      </AppBar>

      {/* ───── CONTENT ───── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
        }}
      >
        <Outlet context={{ mode }} />
      </Box>
    </Box>
  );
}