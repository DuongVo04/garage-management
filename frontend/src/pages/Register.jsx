import { useState } from "react";
import { registerApi } from "../services/auth.service";
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

import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";

const Register = () => {
	const [form, setForm] = useState({
		username: "",
		password: "",
		confirmPassword: ""
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

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
		setSuccess("");

		if (form.password !== form.confirmPassword) {
			return setError("Passwords do not match");
		}

		try {
			const res = await registerApi({
				username: form.username,
				password: form.password
			});

			if (res.success) {
				setSuccess("🎉 Account created successfully!");
				setTimeout(() => navigate("/login"), 1500);
			} else {
				setError(res.message);
			}
		} catch (err) {
			console.log(err.response?.data);

			setError(
				err.response?.data?.message ||
				err.response?.data?.errors?.map(e => e.msg).join(", ") ||
				"Register failed"
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
						"url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					position: "relative"
				}}
			>
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						background: "rgba(0,0,0,0.65)"
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
						Join Garage System
					</Typography>
					<Typography variant="h6">
						Quản lý showroom & dịch vụ xe chuyên nghiệp
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
						background: "rgba(30,41,59,0.95)",
						backdropFilter: "blur(10px)",
						color: "white"
					}}
				>
					<Box textAlign="center" mb={3}>
						<PersonAdd sx={{ fontSize: 40, color: "#38bdf8" }} />
						<Typography variant="h5" fontWeight="bold">
							Create Account
						</Typography>
						<Typography variant="body2" color="gray">
							Start your journey with us 🚗
						</Typography>
					</Box>

					{error && <Alert severity="error">{error}</Alert>}
					{success && <Alert severity="success">{success}</Alert>}

					<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Username"
							name="username"
							margin="normal"
							onChange={handleChange}
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{ style: { color: "white" } }}
						/>

						<TextField
							fullWidth
							label="Password"
							type={showPassword ? "text" : "password"}
							name="password"
							margin="normal"
							onChange={handleChange}
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

						<TextField
							fullWidth
							label="Confirm Password"
							type="password"
							name="confirmPassword"
							margin="normal"
							onChange={handleChange}
							InputLabelProps={{ style: { color: "#aaa" } }}
							InputProps={{ style: { color: "white" } }}
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
							Sign Up
						</Button>
					</form>

					{/* LINK LOGIN */}
					<Typography mt={3} textAlign="center" color="gray">
						Already have an account?{" "}
						<span
							style={{
								color: "#38bdf8",
								cursor: "pointer",
								fontWeight: "bold"
							}}
							onClick={() => navigate("/login")}
						>
							Login
						</span>
					</Typography>
				</Paper>
			</Box>
		</Box>
	);
};

export default Register;
