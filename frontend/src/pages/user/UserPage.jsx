import React from "react";
import { Box, Container, Grid, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { History, Person, Logout } from "@mui/icons-material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    // { label: "Thông tin cá nhân", path: "/user", icon: <Person /> },
    { label: "Lịch hẹn của tôi", path: "/user/appointments", icon: <History /> },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "calc(100vh - 64px)", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ borderRadius: 3, overflow: "hidden", elevation: 1 }}>
              <Box sx={{ p: 3, textAlign: "center", bgcolor: "primary.main", color: "white" }}>
                <Typography variant="h6" fontWeight="700">
                  {user?.username}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Khách hàng thân thiết
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {menuItems.map((item) => (
                  <ListItemButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      py: 1.5,
                      "&.Mui-selected": {
                        bgcolor: "primary.lighter",
                        borderLeft: "4px solid",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: location.pathname === item.path ? "primary.main" : "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500 }}
                    />
                  </ListItemButton>
                ))}
                <ListItemButton onClick={() => { logout(); navigate("/"); }} sx={{ py: 1.5, color: "error.main" }}>
                  <ListItemIcon sx={{ color: "error.main" }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3, borderRadius: 3, minHeight: 400 }}>
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserPage;