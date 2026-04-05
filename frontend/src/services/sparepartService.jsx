import apiClient from './apiClient';

const sparepartService = {
  // Lấy tất cả phụ tùng
  getAllSpareParts: async () => {
    const response = await apiClient.get('/spare-parts');
    return response.data;
  },

  // Lấy phụ tùng theo ID
  getSparePartById: async (id) => {
    const response = await apiClient.get(`/spare-parts/${id}`);
    return response.data;
  },

  // Tạo mới phụ tùng
  createSparePart: async (data) => {
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào formData
    Object.keys(data).forEach(key => {
      if (key === 'image_file' && data[key]) {
        formData.append('image_path', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await apiClient.post('/spare-parts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cập nhật phụ tùng
  updateSparePart: async (id, data) => {
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào formData
    Object.keys(data).forEach(key => {
      if (key === 'image_file' && data[key]) {
        formData.append('image_path', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await apiClient.put(`/spare-parts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default sparepartService;