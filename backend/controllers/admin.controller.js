import ApiError from "../utils/ApiError.js"
import { Account, Role, Invoice } from "../schemas/index.js"

const updateUserAccountStatus = async (id, { is_activated }) => {
    const account = await Account.findByPk(id, {
        include: {
            model: Role,
            attributes: ["name"]
        }
    });

    if (!account) {
        throw new ApiError(404, "Account not found");
    }
    if (account.Role?.name === "ADMIN") {
        throw new ApiError(403, "Cannot change ADMIN account");
    }

    await account.update({ is_activated });

    return is_activated ? "Account activated" : "Account deactivated";
};

const exportTotalCost = async () => {
    try {
        // Đơn giản chỉ tính tổng doanh thu
        const totalRevenue = await Invoice.sum('total_cost');
        
        // Lấy danh sách invoices gần đây
        const recentInvoices = await Invoice.findAll({
            attributes: ['id', 'created_date', 'total_cost', 'payment_method', 'ticket_id'],
            order: [['created_date', 'DESC']],
            limit: 100,
            raw: true
        });

        return {
            total_revenue: totalRevenue || 0,
            total_invoices: recentInvoices.length,
            average_invoice_value: recentInvoices.length > 0 ? (totalRevenue || 0) / recentInvoices.length : 0,
            recent_invoices: recentInvoices
        };
    } catch (error) {
        console.error("Error in exportTotalCost:", error);
        // Trả về dữ liệu mặc định thay vì throw error
        return {
            total_revenue: 0,
            total_invoices: 0,
            average_invoice_value: 0,
            recent_invoices: [],
            error: error.message
        };
    }
};

export {
    updateUserAccountStatus,
    exportTotalCost
};