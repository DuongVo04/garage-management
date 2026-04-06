import { Invoice, Voucher, RepairTicket } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

// ─── Include dùng chung cho getAll ──────────────────────────────────────────
// discount_id trong Invoice lưu UUID của bảng voucher → JOIN để lấy code
// ticket_id trong Invoice lưu UUID của bảng repair_ticket → JOIN để lấy description
const basicInclude = [
    {
        model: Voucher,
        as: "voucher",
        attributes: ["id", "code", "percent", "event"],
        foreignKey: "discount_id",  // tên cột trong bảng invoice
        required: false             // LEFT JOIN — vẫn trả invoice dù không có voucher
    },
    {
        model: RepairTicket,
        as: "ticket",
        attributes: ["id", "description"],
        foreignKey: "ticket_id",    // tên cột trong bảng invoice
        required: false             // LEFT JOIN — vẫn trả invoice dù không có ticket
    }
]

export const invoiceController = baseCRUD(Invoice, {
    modelName: "Invoice",
    uniqueFields: [],
    defaultValues: {},
    include: {
        basicInclude: basicInclude,
        detailInclude: basicInclude   // dùng cùng include cho detail view
    }
});