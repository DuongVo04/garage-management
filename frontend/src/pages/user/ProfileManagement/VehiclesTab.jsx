import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllBrands } from '../../../services/brand.service';
import customerVehicleService from '../../../services/customerVehicle.service';

const VehiclesTab = ({ vehicles, customerId, setSnackbar, onRefresh }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State cho preview ảnh
  const [formData, setFormData] = useState({
    name: '',
    plate_number: '',
    color: '',
    type: '',
    year: new Date().getFullYear(),
    latest_odo: 0,
    brand_id: '',
  });

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Motorcycle', 'Other'];

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await getAllBrands();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hãng xe:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách hãng xe',
        severity: 'error',
      });
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleOpenDialog = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        name: vehicle.name || '',
        plate_number: vehicle.plate_number || '',
        color: vehicle.color || '',
        type: vehicle.type || '',
        year: vehicle.year || new Date().getFullYear(),
        latest_odo: vehicle.latest_odo || 0,
        brand_id: vehicle.brand?.id || '',
      });
      // Hiển thị preview ảnh cũ nếu có
      if (vehicle.image_path) {
        setImagePreview(`http://localhost:3000/${vehicle.image_path}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setSelectedVehicle(null);
      setFormData({
        name: '',
        plate_number: '',
        color: '',
        type: '',
        year: new Date().getFullYear(),
        latest_odo: 0,
        brand_id: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      plate_number: '',
      color: '',
      type: '',
      year: new Date().getFullYear(),
      latest_odo: 0,
      brand_id: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý chọn file ảnh và tạo preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Tạo URL preview cho ảnh mới chọn
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Nếu đang edit và có ảnh cũ, không tự động xóa ảnh cũ trên server
    // Chỉ xóa trong form, khi submit sẽ không gửi ảnh mới
  };

  const handleSubmit = async () => {
  if (!formData.name || !formData.plate_number || !formData.brand_id) {
    setSnackbar({
      open: true,
      message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Tên xe, Biển số, Hãng xe)',
      severity: 'warning',
    });
    return;
  }

  setLoading(true);
  try {
    const vehicleData = {
      ...formData,
      customer_id: customerId,
    };

    let response;
    if (selectedVehicle) {
      response = await customerVehicleService.update(
        selectedVehicle.id,
        vehicleData,
        imageFile
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật xe thành công!',
        severity: 'success',
      });
    } else {
      response = await customerVehicleService.create(vehicleData, imageFile);
      setSnackbar({
        open: true,
        message: 'Thêm xe thành công!',
        severity: 'success',
      });
    }
    
    handleCloseDialog();
    
    // Đảm bảo onRefresh được gọi sau khi thành công
    if (onRefresh && typeof onRefresh === 'function') {
      await onRefresh(); // Gọi refresh và đợi nó hoàn thành
    }
  } catch (error) {
    console.error('Lỗi khi lưu xe:', error);
    setSnackbar({
      open: true,
      message: error.message || 'Có lỗi xảy ra khi lưu thông tin xe',
      severity: 'error',
    });
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
      setLoading(true);
      try {
        await customerVehicleService.delete(vehicleId);
        
        setSnackbar({
          open: true,
          message: 'Xóa xe thành công!',
          severity: 'success',
        });
        
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Lỗi khi xóa xe:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Có lỗi xảy ra khi xóa xe',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Dialog cho form thêm/sửa
  const renderVehicleDialog = () => (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedVehicle ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          
          {/* Phần preview ảnh */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              {imagePreview ? (
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={imagePreview}
                    variant="rounded"
                    sx={{ 
                      width: 200, 
                      height: 150, 
                      objectFit: 'cover',
                      border: '2px solid #e0e0e0',
                      borderRadius: 2
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'white',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      boxShadow: 1
                    }}
                  >
                    <CancelIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: 200,
                    height: 150,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fafafa',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 40, color: '#999' }} />
                  <Typography variant="caption" color="text.secondary">
                    Chưa có ảnh
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Button upload ảnh */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            {imagePreview ? 'Đổi ảnh xe' : (selectedVehicle?.image_path ? 'Thay đổi ảnh xe' : 'Thêm ảnh xe')}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          
          {imageFile && (
            <Typography variant="caption" color="success.main" align="center">
              Đã chọn: {imageFile.name}
            </Typography>
          )}
          
          {!imageFile && selectedVehicle?.image_path && !imagePreview && (
            <Typography variant="caption" color="text.secondary" align="center">
              Đã có ảnh hiện tại, chọn ảnh mới để thay đổi
            </Typography>
          )}

          <TextField
            label="Tên xe"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Biển số xe"
            name="plate_number"
            value={formData.plate_number}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Màu xe"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            fullWidth
            placeholder="VD: Trắng, Đen, Đỏ, Xanh..."
          />
          <TextField
            label="Hãng xe"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleInputChange}
            select
            fullWidth
            disabled={loadingBrands}
            required
          >
            {loadingBrands ? (
              <MenuItem disabled>Đang tải...</MenuItem>
            ) : (
              brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Loại xe"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            select
            fullWidth
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Năm sản xuất"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Số km hiện tại"
            name="latest_odo"
            type="number"
            value={formData.latest_odo}
            onChange={handleInputChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (selectedVehicle ? 'Cập nhật' : 'Thêm')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (vehicles.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Bạn chưa có xe nào
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hãy thêm thông tin xe của bạn để dễ dàng đặt lịch sửa chữa
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm xe mới
        </Button>

        {renderVehicleDialog()}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm xe mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} md={6} key={vehicle.id}>
            <Card sx={{ position: 'relative' }}>
              {vehicle.image_path && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3000/${vehicle.image_path}`}
                  alt={vehicle.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {vehicle.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(vehicle)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(vehicle.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Chip 
                  label={vehicle.brand?.name || 'Không có thương hiệu'} 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConfirmationNumberIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Biển số: {vehicle.plate_number}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ColorLensIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Màu: {vehicle.color}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Năm: {vehicle.year}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Loại: {vehicle.type}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {renderVehicleDialog()}
    </Box>
  );
};

export default VehiclesTab;