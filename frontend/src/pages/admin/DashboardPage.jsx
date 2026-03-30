import { Box, Typography, Paper } from "@mui/material";

const DashboardPage = () => {
	return (
		<Box sx={{ minHeight: "100vh", p: 4 }}>
			<Typography variant="h4" fontWeight="bold" mb={3}>
				🚀 Admin Dashboard
			</Typography>

			<Paper sx={{ p: 3, borderRadius: 3 }}>
				<Typography>
					Welcome Admin! Bạn có toàn quyền quản lý hệ thống.
				</Typography>
			</Paper>
		</Box>
	);
};

export default DashboardPage;