import { Voucher } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const voucherController = baseCRUD(Voucher, {
    modelName: "Voucher",
    uniqueFields: ["voucher_code"],
    defaultValues: { is_available: true },
});