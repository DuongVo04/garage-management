import { Box, Typography, Paper } from "@mui/material";

const AdminPage = () => {
	return (
		<Box sx={{ minHeight: "100vh", p: 4, background: "#0f172a", color: "white" }}>
			<Typography variant="h4" fontWeight="bold" mb={3}>
				🚀 Admin Dashboard
			</Typography>

			<Paper sx={{ p: 3, background: "#1e293b", color: "white", borderRadius: 3 }}>
				<Typography>
					Welcome Admin! Bạn có toàn quyền quản lý hệ thống.
				</Typography>
			</Paper>
		</Box>
	);
};

export default AdminPage;