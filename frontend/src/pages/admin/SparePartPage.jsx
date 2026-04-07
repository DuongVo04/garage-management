import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  TablePagination,
  InputAdornment,
  TextField as SearchField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  ImageList,
  ImageListItem,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import sparepartService from '../../services/sparepartService';

const SparePartPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity_in_stock: '',
    unit_price: '',
    unit_of_measure: '',
    image_file: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Đơn vị tính options
  const unitOptions = [
    'Cái',
    'Bộ',
    'Chiếc',
    'Bộ 2 cái',
    'Bộ 4 cái',
    'Bộ 6 cái',
    'Hộp',
    'Lốc',
  ];

  useEffect(() => {
    fetchSpareParts();
  }, []);

  useEffect(() => {
    // Lọc dữ liệu theo search term
    const filtered = spareParts.filter(part =>
      part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.unit_of_measure?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParts(filtered);
    setPage(0);
  }, [searchTerm, spareParts]);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const response = await sparepartService.getAllSpareParts();
      if (response.success) {
        setSpareParts(response.data);
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      showSnackbar('Không thể tải danh sách phụ tùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (part = null) => {
    if (part) {
      setEditingPart(part);
      setFormData({
        name: part.name || '',
        quantity_in_stock: part.quantity_in_stock || '',
        unit_price: part.unit_price || '',
        unit_of_measure: part.unit_of_measure || '',
        image_file: null,
      });
    } else {
      setEditingPart(null);
      setFormData({
        name: '',
        quantity_in_stock: '',
        unit_price: '',
        unit_of_measure: '',
        image_file: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPart(null);
    setFormData({
      name: '',
      quantity_in_stock: '',
      unit_price: '',
      unit_of_measure: '',
      image_file: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image_file: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.name || !formData.unit_price || !formData.unit_of_measure) {
        showSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
        return;
      }

      let response;
      if (editingPart) {
        response = await sparepartService.updateSparePart(editingPart.id, formData);
      } else {
        response = await sparepartService.createSparePart(formData);
      }

      if (response.success) {
        showSnackbar(
          editingPart ? 'Cập nhật phụ tùng thành công' : 'Thêm phụ tùng thành công',
          'success'
        );
        handleCloseDialog();
        fetchSpareParts();
      }
    } catch (error) {
      console.error('Error saving spare part:', error);
      showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Lấy URL hình ảnh
  const getImageUrl = (imagePath) => {
      
      if (!imagePath) return '/placeholder-image.png';
      const API = import.meta.env.VITE_API_BASE_URL;
      const BASE_URL = API.replace("/api/v1", "");
    return `${BASE_URL}/${imagePath}`;
  };

  const paginatedParts = filteredParts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Quản lý phụ tùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          }}
        >
          Thêm phụ tùng
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên phụ tùng hoặc đơn vị tính..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hình ảnh</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên phụ tùng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tồn kho</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá (VNĐ)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đơn vị tính</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedParts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="textSecondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedParts.map((part, index) => (
                <TableRow key={part.id} hover>
                  <TableCell align="center">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={getImageUrl(part.image_path)}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    >
                      {part.name?.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {part.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={part.quantity_in_stock || 0}
                      color={part.quantity_in_stock > 10 ? 'success' : part.quantity_in_stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatPrice(part.unit_price)} ₫
                    </Typography>
                  </TableCell>
                  <TableCell>{part.unit_of_measure}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(part)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredParts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPart ? 'Chỉnh sửa phụ tùng' : 'Thêm phụ tùng mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tên phụ tùng"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Số lượng tồn kho"
                name="quantity_in_stock"
                type="number"
                value={formData.quantity_in_stock}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Đơn giá"
                name="unit_price"
                type="number"
                value={formData.unit_price}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                }}
              />
            </Box>
            <FormControl fullWidth required>
              <InputLabel>Đơn vị tính</InputLabel>
              <Select
                name="unit_of_measure"
                value={formData.unit_of_measure}
                onChange={handleInputChange}
                label="Đơn vị tính"
              >
                {unitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* File upload */}
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1 }}
            >
              {formData.image_file ? formData.image_file.name : 'Chọn hình ảnh'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            
            {editingPart?.image_path && !formData.image_file && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Hình ảnh hiện tại:
                </Typography>
                <img
                  src={getImageUrl(editingPart.image_path)}
                  alt={editingPart.name}
                  style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 5 }}
                />
              </Box>
            )}
            
            {formData.image_file && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Hình ảnh mới:
                </Typography>
                <img
                  src={URL.createObjectURL(formData.image_file)}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 5 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            {editingPart ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SparePartPage;