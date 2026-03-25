import { useState, useContext } from "react";
import { loginApi } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Button,
	Typography,
	Paper,
	TextField,
	InputAdornment,
	IconButton,
	Alert
} from "@mui/material";

import { Visibility, VisibilityOff, DirectionsCar } from "@mui/icons-material";
import { decodeToken } from "../utils/jwt";

const Login = () => {
	const [form, setForm] = useState({
		username: "",
		password: ""
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const res = await loginApi(form);

			if (res.success) {
				login(res.data);

				const decoded = decodeToken(res.data);

				if (decoded.role_id === "role_admin") {
					navigate("/admin");
				} else {
					navigate("/user");
				}
			} else {
				setError(res.message);
			}
		} catch (err) {
			console.log(err.response?.data);

			setError(
				err.response?.data?.message ||
				err.response?.data?.errors?.map(e => e.msg).join(", ") ||
				"Login failed"
			);
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>

			{/* LEFT IMAGE */}
			<Box
				sx={{
					flex: 1,
					backgroundImage:
						"url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					position: "relative"
				}}
			>
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						background: "rgba(0,0,0,0.6)"
					}}
				/>

				<Box
					sx={{
						position: "absolute",
						bottom: 50,
						left: 50,
						color: "white"
					}}
				>
					<Typography variant="h3" fontWeight="bold">
						Garage System
					</Typography>
					<Typography variant="h6">
						Quản lý showroom & dịch vụ xe
					</Typography>
				</Box>
			</Box>

			{/* RIGHT FORM */}
			<Box
				sx={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					background: "#0f172a"
				}}
			>
				<Paper
					elevation={10}
					sx={{
						p: 5,
						width: 400,
						borderRadius: 4,
						background: "#1e293b",
						color: "white"
					}}
				>
					<Box textAlign="center" mb={3}>
						<DirectionsCar sx={{ fontSize: 40, color: "#38bdf8" }} />
						<Typography variant="h5" fontWeight="bold">
							Welcome Back
						</Typography>
						<Typography variant="body2" color="gray">
							Login to your system
						</Typography>
					</Box>

					{error && <Alert severity="error">{error}</Alert>}

					<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Username"
							name="username"
							value={form.username}
							onChange={handleChange}
							margin="normal"
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{ style: { color: "white" } }}
						/>

						<TextField
							fullWidth
							label="Password"
							type={showPassword ? "text" : "password"}
							name="password"
							value={form.password}
							onChange={handleChange}
							margin="normal"
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{
								style: { color: "white" },
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setShowPassword(!showPassword)
											}
										>
											{showPassword ? (
												<VisibilityOff sx={{ color: "#aaa" }} />
											) : (
												<Visibility sx={{ color: "#aaa" }} />
											)}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{
								mt: 3,
								py: 1.5,
								fontWeight: "bold",
								background: "linear-gradient(90deg,#38bdf8,#6366f1)"
							}}
						>
							Login
						</Button>
					</form>

					{/* 🔥 LINK REGISTER */}
					<Typography mt={3} textAlign="center" color="gray">
						Don’t have an account?{" "}
						<span
							style={{
								color: "#38bdf8",
								cursor: "pointer",
								fontWeight: "bold"
							}}
							onClick={() => navigate("/register")}
						>
							Sign Up
						</span>
					</Typography>

				</Paper>
			</Box>
		</Box>
	);
};

export default Login;