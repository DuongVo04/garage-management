import { Invoice } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const invoiceController = baseCRUD(Invoice, {
    modelName: "Invoice",
    uniqueFields: [], // Không có unique fields
    defaultValues: {},
    searchFields: ["payment_method"], // Các field có thể tìm kiếm
    // Không có imageField vì invoice không có ảnh
});