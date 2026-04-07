import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, InputAdornment, IconButton, CircularProgress,
    Alert, Chip, Box, Typography, Button, Pagination,
} from "@mui/material";
import { Search, PersonOutline, Edit, Add, Refresh } from "@mui/icons-material";
import customerService from "../services/customerService";

const PAGE_SIZE = 10;

const CustomerList = ({ onCustomerClick, onEditCustomer, onRefresh }) => {
    const [customers, setCustomers]     = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm]   = useState("");
    const [page, setPage]               = useState(1);
    const debounceRef                   = useRef(null);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await customerService.getCustomers();
            setCustomers(response.data ?? []);
            setError(null);
        } catch {
            setError("Không thể tải danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
    useEffect(() => { if (onRefresh) fetchCustomers(); }, [onRefresh, fetchCustomers]);

    /* debounce search — chỉ filter sau 300ms không gõ */
    const handleSearchChange = useCallback((e) => {
        const val = e.target.value;
        setSearchInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchTerm(val);
            setPage(1);
        }, 300);
    }, []);

    /* useMemo — chỉ tính lại khi customers hoặc searchTerm đổi */
    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase();
        if (!q) return customers;
        return customers.filter(
            (c) =>
                c.full_name?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q) ||
                c.phone_number?.includes(q) ||
                c.account?.username?.toLowerCase().includes(q)
        );
    }, [customers, searchTerm]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page]
    );

    const handleEdit = useCallback(
        (e, id) => { e.stopPropagation(); onEditCustomer?.(id); },
        [onEditCustomer]
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                severity="error"
                sx={{ m: 2 }}
                action={<Button color="inherit" size="small" onClick={fetchCustomers}>Thử lại</Button>}
            >
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Quản lý khách hàng</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {filtered.length} khách hàng{searchTerm ? ` (lọc từ ${customers.length})` : ""}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={fetchCustomers} size="small">
                        Làm mới
                    </Button>
                    {/* Nút thêm ẩn — khách hàng tự đăng ký qua app */}
                </Box>
            </Box>

            {/* Search */}
            <TextField
                placeholder="Tìm theo tên, SĐT, email, tài khoản..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchInput}
                onChange={handleSearchChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ mb: 2 }}
            />

            {/* Table */}
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Họ tên</strong></TableCell>
                            <TableCell><strong>Số điện thoại</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Địa chỉ</strong></TableCell>
                            <TableCell><strong>Tài khoản</strong></TableCell>
                            <TableCell align="center"><strong>Thao tác</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                    Không tìm thấy khách hàng nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => onCustomerClick?.(customer.id)}
                                >
                                    <TableCell>{customer.full_name}</TableCell>
                                    <TableCell>{customer.phone_number}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {customer.address}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={customer.account?.username || "Chưa liên kết"}
                                            size="small"
                                            color={customer.account ? "primary" : "default"}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            title="Chỉnh sửa"
                                            onClick={(e) => handleEdit(e, customer.id)}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            color="info"
                                            size="small"
                                            title="Xem chi tiết"
                                            onClick={() => onCustomerClick?.(customer.id)}
                                        >
                                            <PersonOutline fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                </Box>
            )}
        </Box>
    );
};

export default CustomerList;
