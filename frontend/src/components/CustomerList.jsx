import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Typography,
  Button
} from "@mui/material";
import {
  Search,
  PersonOutline,
  Edit,
  Add,
  Refresh
} from "@mui/icons-material";
import customerService from "../services/customerService";

const CustomerList = ({ onCustomerClick, onEditCustomer, onRefresh }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách khách hàng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Refresh danh sách khi có thay đổi
  useEffect(() => {
    if (onRefresh) {
      fetchCustomers();
    }
  }, [onRefresh]);

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number?.includes(searchTerm) ||
    customer.account?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (e, customerId) => {
    e.stopPropagation();
    onEditCustomer && onEditCustomer(customerId);
  };

  const handleViewDetail = (customerId) => {
    onCustomerClick && onCustomerClick(customerId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ m: 2 }}
        action={
          <Button color="inherit" size="small" onClick={fetchCustomers}>
            Thử lại
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" component="h2">
          Quản lý khách hàng
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchCustomers}
            size="small"
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => onEditCustomer(null)}
            size="small"
          >
            Thêm khách hàng
          </Button>
        </Box>
      </Box>

      <TextField
        placeholder="Tìm kiếm khách hàng..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, width: "100%" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Họ tên</strong></TableCell>
              <TableCell><strong>Số điện thoại</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Địa chỉ</strong></TableCell>
              <TableCell><strong>Tài khoản</strong></TableCell>
              <TableCell align="center"><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow 
                key={customer.id}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell onClick={() => handleViewDetail(customer.id)}>
                  {customer.full_name}
                </TableCell>
                <TableCell onClick={() => handleViewDetail(customer.id)}>
                  {customer.phone_number}
                </TableCell>
                <TableCell onClick={() => handleViewDetail(customer.id)}>
                  {customer.email}
                </TableCell>
                <TableCell onClick={() => handleViewDetail(customer.id)}>
                  {customer.address}
                </TableCell>
                <TableCell onClick={() => handleViewDetail(customer.id)}>
                  <Chip 
                    label={customer.account?.username || "N/A"}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={(e) => handleEdit(e, customer.id)}
                    size="small"
                    title="Chỉnh sửa"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => handleViewDetail(customer.id)}
                    size="small"
                    title="Xem chi tiết"
                  >
                    <PersonOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCustomers.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="textSecondary">
            Không tìm thấy khách hàng nào
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default CustomerList;