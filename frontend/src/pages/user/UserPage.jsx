import { Box, Typography, Paper } from "@mui/material";

const UserPage = () => {
	return (
		<Box sx={{ minHeight: "100vh", p: 4, background: "#f1f5f9" }}>
			<Typography variant="h4" fontWeight="bold" mb={3}>
				👤 User Dashboard
			</Typography>

			<Paper sx={{ p: 3, borderRadius: 3 }}>
				<Typography>
					Welcome User! Đây là khu vực dành cho khách hàng.
				</Typography>
			</Paper>
		</Box>
	);
};

export default UserPage;