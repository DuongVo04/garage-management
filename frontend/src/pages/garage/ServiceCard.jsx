import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardActions, Typography, Box,
  Button, Chip, Tooltip, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';

// ─── Design Tokens (sync với GaragePage & BookingPage) ───────────────────────
const TOKEN = {
  coal: '#6a6ae1', ink: '#27272a', slate: '#3f3f46',
  muted: '#71717a', border: '#e4e4e7', borderLight: '#f4f4f5',
  surface: '#fafafa', white: '#ffffff',
  gold: '#b45309', goldLight: '#fef3c7', goldMid: '#d97706',
  green: '#15803d', greenLight: '#f0fdf4',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

/**
 * ServiceCard — dùng trên GaragePage
 *
 * Props:
 *   service    — object dịch vụ từ API
 *   isSelected — boolean: card này có đang được chọn không
 *   onToggle   — (id: number) => void: toggle chọn/bỏ dịch vụ
 *
 * Khi isSelected/onToggle KHÔNG được truyền (backward compat),
 * card vẫn hiển thị bình thường với nút "Đặt lịch ngay" đơn lẻ.
 */
const ServiceCard = ({ service, isSelected = false, onToggle }) => {
  const navigate = useNavigate();
  const multiSelectMode = typeof onToggle === 'function';

  // Đặt lịch đơn (khi không dùng multi-select)
  const handleBookSingle = (e) => {
    e.stopPropagation();
    navigate('/booking', {
      state: { selectedIds: [service.id] }
    });
  };

  // Toggle chọn trong multi-select mode
  const handleToggle = () => {
    if (multiSelectMode) onToggle(service.id);
  };

  return (
    <Card
      elevation={0}
      onClick={multiSelectMode ? handleToggle : undefined}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1.5px solid',
        borderColor: isSelected ? TOKEN.coal : TOKEN.border,
        bgcolor: isSelected ? TOKEN.coal : TOKEN.white,
        cursor: multiSelectMode ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        overflow: 'visible',
        '&:hover': multiSelectMode ? {
          borderColor: TOKEN.coal,
          transform: 'translateY(-4px)',
          boxShadow: isSelected
            ? '0 20px 40px rgba(0,0,0,0.2)'
            : '0 10px 28px rgba(0,0,0,0.09)',
        } : {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Selected badge */}
      {isSelected && (
        <Box sx={{
          position: 'absolute', top: -10, right: -10,
          width: 28, height: 28, borderRadius: '50%',
          bgcolor: TOKEN.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(21,128,61,0.4)',
          zIndex: 1,
        }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: '#fff' }} />
        </Box>
      )}

      <CardContent sx={{ p: 2.5, flex: 1 }}>
        {/* Icon + Giá */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            bgcolor: isSelected ? 'rgba(255,255,255,0.12)' : TOKEN.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${isSelected ? 'rgba(255,255,255,0.15)' : TOKEN.border}`,
          }}>
            <BuildIcon sx={{ fontSize: 20, color: isSelected ? 'rgba(255,255,255,0.8)' : TOKEN.muted }} />
          </Box>
          <Chip
            label={formatCurrency(service.price)}
            size="small"
            sx={{
              bgcolor: isSelected ? TOKEN.goldLight : TOKEN.borderLight,
              color: isSelected ? TOKEN.gold : TOKEN.slate,
              fontWeight: 800, fontSize: '0.72rem', height: 24,
              border: isSelected ? `1px solid ${TOKEN.goldMid}55` : 'none',
            }}
          />
        </Box>

        {/* Tên dịch vụ */}
        <Typography
          variant="subtitle2"
          fontWeight={800}
          sx={{
            mb: 1, lineHeight: 1.35, fontSize: '0.9rem',
            color: isSelected ? TOKEN.white : TOKEN.coal,
          }}
        >
          {service.name}
        </Typography>

        {/* Mô tả */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.78rem', lineHeight: 1.6,
            color: isSelected ? 'rgba(255,255,255,0.55)' : TOKEN.muted,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {service.description || 'Dịch vụ bảo trì chuyên nghiệp giúp xe vận hành ổn định và bền lâu.'}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        {multiSelectMode ? (
          // Multi-select: nút toggle thêm/bỏ
          <Button
            fullWidth
            variant={isSelected ? 'outlined' : 'contained'}
            size="small"
            disableElevation
            startIcon={
              isSelected
                ? <RemoveCircleOutlineIcon sx={{ fontSize: '16px !important' }} />
                : <AddCircleOutlineIcon sx={{ fontSize: '16px !important' }} />
            }
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            sx={{
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.8rem',
              py: 0.8,
              ...(isSelected ? {
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.85)',
                '&:hover': {
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  bgcolor: 'rgba(239,68,68,0.08)',
                }
              } : {
                bgcolor: TOKEN.coal, color: TOKEN.white,
                '&:hover': { bgcolor: TOKEN.ink },
              }),
            }}
          >
            {isSelected ? 'Bỏ chọn' : 'Thêm vào lịch'}
          </Button>
        ) : (
          // Single mode: nút đặt lịch trực tiếp (backward compat)
          <Button
            fullWidth
            variant="contained"
            size="small"
            disableElevation
            startIcon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
            onClick={handleBookSingle}
            sx={{
              borderRadius: '10px', fontWeight: 700,
              textTransform: 'none', fontSize: '0.8rem', py: 0.8,
              bgcolor: TOKEN.coal, color: TOKEN.white,
              '&:hover': { bgcolor: TOKEN.ink },
            }}
          >
            Đặt lịch ngay
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ServiceCard;