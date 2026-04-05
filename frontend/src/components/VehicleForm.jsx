import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar
} from "@mui/material";
import { Close, CloudUpload, Delete } from "@mui/icons-material";
import customerVehicleService from "../services/customerVehicleService";
import { getAllBrands } from "../services/brand.service";

const VehicleForm = ({ open, vehicle, customerId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    type: "",
    plate_number: "",
    latest_odo: "",
    year: "",
    brand_id: "",
    customer_id: customerId || ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const isEditMode = !!vehicle;
  
  // Danh sách loại xe
  const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Pickup", "Van", "Coupe", "Convertible", "Electric", "Truck", "Bus"];

  useEffect(() => {
    if (open) {
      fetchBrands();
    }
  }, [open]);

  // Effect riêng để xử lý khi có brands data và đang ở chế độ thêm mới
  useEffect(() => {
    if (open && brands.length > 0 && !isEditMode) {
      // Set giá trị mặc định cho thương hiệu đầu tiên
      setFormData(prev => ({
        ...prev,
        brand_id: brands[0]?.id || "",
        // Set giá trị mặc định cho loại xe nếu muốn
        type: vehicleTypes[0] || ""
      }));
    }
  }, [open, brands, isEditMode]);

  // Effect để load dữ liệu khi ở chế độ edit
  useEffect(() => {
    if (open && isEditMode && vehicle) {
      loadVehicleData();
    } else if (open && !isEditMode) {
      resetForm();
    }
  }, [open, vehicle, isEditMode]);

  const fetchBrands = async () => {
    try {
      const response = await getAllBrands();
      setBrands(response.data || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const loadVehicleData = () => {
    setFormData({
      name: vehicle.name || "",
      color: vehicle.color || "",
      type: vehicle.type || "",
      plate_number: vehicle.plate_number || "",
      latest_odo: vehicle.latest_odo || "",
      year: vehicle.year || "",
      brand_id: vehicle.brand?.id || "",
      customer_id: customerId || vehicle.customer_id || ""
    });

    if (vehicle.image_path) {
      setImagePreview(`http://localhost:3000/${vehicle.image_path}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: "",
      type: "",
      plate_number: "",
      latest_odo: "",
      year: "",
      brand_id: brands[0]?.id || "", // Set brand mặc định là phần tử đầu tiên
      customer_id: customerId || ""
    });
    setImageFile(null);
    setImagePreview(null);
    setValidationErrors({});
    setError(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Tên xe không được để trống";
    }

    if (!formData.plate_number.trim()) {
      errors.plate_number = "Biển số xe không được để trống";
    }

    if (formData.latest_odo && isNaN(formData.latest_odo)) {
      errors.latest_odo = "Số km phải là số";
    }

    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear())) {
      errors.year = "Năm sản xuất không hợp lệ";
    }

    if (!formData.brand_id) {
      errors.brand_id = "Vui lòng chọn thương hiệu xe";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      // Tạo FormData để gửi lên server
      const submitFormData = new FormData();

      // Thêm các trường text
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
          submitFormData.append(key, formData[key]);
        }
      });

      // Thêm file ảnh nếu có
      if (imageFile) {
        submitFormData.append("image", imageFile);
      }

      if (isEditMode) {
        await customerVehicleService.updateVehicle(vehicle.id, submitFormData);
      } else {
        await customerVehicleService.createVehicle(submitFormData);
      }

      onSuccess && onSuccess();
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        (isEditMode ? "Cập nhật xe thất bại" : "Thêm xe thất bại");
      setError(errorMessage);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? "Cập nhật thông tin xe" : "Thêm xe mới"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Box component="form" noValidate>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Tên xe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                  placeholder="VD: Camry 2.5Q"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Biển số xe"
                  name="plate_number"
                  value={formData.plate_number}
                  onChange={handleChange}
                  error={!!validationErrors.plate_number}
                  helperText={validationErrors.plate_number}
                  placeholder="VD: 51A-123.45"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Màu sắc"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="VD: Đen, Trắng, Đỏ..."
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại xe</InputLabel>
                  <Select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    label="Loại xe"
                  >
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Năm sản xuất"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  error={!!validationErrors.year}
                  helperText={validationErrors.year}
                  placeholder="VD: 2022"
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số km gần nhất"
                  name="latest_odo"
                  type="number"
                  value={formData.latest_odo}
                  onChange={handleChange}
                  error={!!validationErrors.latest_odo}
                  helperText={validationErrors.latest_odo}
                  placeholder="VD: 15000"
                  InputProps={{
                    endAdornment: <Typography variant="body2">km</Typography>
                  }}
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <FormControl fullWidth required error={!!validationErrors.brand_id}>
                  <InputLabel>Thương hiệu</InputLabel>
                  <Select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    label="Thương hiệu"
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {brand.logo_url && (
                            <Avatar
                              src={`http://localhost:3000/${brand.logo_url}`}
                              sx={{ width: 24, height: 24 }}
                            />
                          )}
                          <span>{brand.name} ({brand.country})</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.brand_id && (
                    <Typography variant="caption" color="error">
                      {validationErrors.brand_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Hình ảnh xe {isEditMode && "(Để trống nếu không muốn thay đổi)"}
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover"
                    }
                  }}
                  onClick={() => document.getElementById("image-upload").click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  {imagePreview ? (
                    <Box position="relative">
                      <img
                        src={imagePreview}
                        alt="Vehicle preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 200,
                          objectFit: "contain",
                          borderRadius: 8
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.5)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" }
                        }}
                      >
                        <Delete sx={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: "action.active", mb: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        Nhấp để tải ảnh lên {isEditMode ? "(để trống nếu không đổi ảnh)" : "(tối đa 5MB)"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitLoading || loading}
          startIcon={submitLoading && <CircularProgress size={20} />}
        >
          {submitLoading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;