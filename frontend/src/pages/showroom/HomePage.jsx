import { Box, Typography, Paper } from "@mui/material";

const HomePage = () => {
	return (
		<Box sx={{ minHeight: "100vh", p: 4, background: "#0f172a", color: "white" }}>
			<Typography variant="h4" fontWeight="bold" mb={3}>
                Home Page
			</Typography>

			<Paper sx={{ p: 3, background: "#1e293b", color: "white", borderRadius: 3 }}>
				<Typography>
					Home Page
				</Typography>
			</Paper>
		</Box>
	);
};

export default HomePage;