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
  Grid
} from "@mui/material";
import { Close } from "@mui/icons-material";
import customerService from "../services/customerService";

const CustomerForm = ({ open, customerId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const isEditMode = !!customerId;

  useEffect(() => {
    if (open && isEditMode) {
      fetchCustomerDetail();
    } else if (open && !isEditMode) {
      // Reset form khi thêm mới
      resetForm();
    }
  }, [open, customerId, isEditMode]);

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomerById(customerId);
      const customerData = response.data;
      setFormData({
        full_name: customerData.full_name || "",
        phone_number: customerData.phone_number || "",
        email: customerData.email || "",
        address: customerData.address || ""
      });
      setError(null);
    } catch (err) {
      setError("Không thể tải thông tin khách hàng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone_number: "",
      email: "",
      address: ""
    });
    setValidationErrors({});
    setError(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Họ tên không được để trống";
    } else if (formData.full_name.length < 2) {
      errors.full_name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
      errors.phone_number = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
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
    // Xóa lỗi validation khi người dùng nhập
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      if (isEditMode) {
        await customerService.updateCustomer(customerId, formData);
      } else {
        await customerService.createCustomer(formData);
      }

      onSuccess && onSuccess();
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (isEditMode ? "Cập nhật khách hàng thất bại" : "Thêm khách hàng thất bại");
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Box component="form" noValidate>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Họ tên"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  error={!!validationErrors.full_name}
                  helperText={validationErrors.full_name}
                  placeholder="Nhập họ tên khách hàng"
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Số điện thoại"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  error={!!validationErrors.phone_number}
                  helperText={validationErrors.phone_number}
                  placeholder="Nhập số điện thoại"
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  placeholder="example@email.com"
                />
              </Grid>

              <Grid sx={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  multiline
                  rows={2}
                />
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

export default CustomerForm;