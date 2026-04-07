import React, { useState, useCallback } from "react";
import { Container, Paper, Box, Snackbar, Alert } from "@mui/material";
import CustomerList from "../../components/CustomerList";
import CustomerDetail from "../../components/CustomerDetail";
import CustomerForm from "../../components/CustomerForm";

const CustomerPage = () => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleViewDetail = (customerId) => {
    setSelectedCustomerId(customerId);
    setDetailOpen(true);
  };

  const handleEditCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setFormOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCustomerId(null);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedCustomerId(null);
  };

  const handleFormSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    setSnackbar({
      open: true,
      message: selectedCustomerId 
        ? "Cập nhật khách hàng thành công!" 
        : "Thêm khách hàng mới thành công!",
      severity: "success"
    });
  }, [selectedCustomerId]);

  const handleCustomerDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <CustomerList 
          onCustomerClick={handleViewDetail}
          onEditCustomer={handleEditCustomer}
          onRefresh={refreshTrigger}
        />
      </Paper>

      <CustomerDetail
        open={detailOpen}
        customerId={selectedCustomerId}
        onClose={handleCloseDetail}
        onRefresh={handleCustomerDataChange}
      />

      {/* CustomerForm chỉ mở khi edit (customerId có giá trị) — không cho tạo mới từ admin */}
      {selectedCustomerId && (
        <CustomerForm
          open={formOpen}
          customerId={selectedCustomerId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerPage;