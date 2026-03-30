// src/components/NotFound.jsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h1" fontWeight="bold" color="primary">
        404
      </Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Trang bạn tìm không tồn tại
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
        Có thể URL sai hoặc trang đã bị xóa.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </Button>
    </Box>
  );
};

export default NotFound;