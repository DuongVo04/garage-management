import { Invoice, Voucher, RepairTicket, RepairAppointment, Customer } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

// ─── Chain JOIN để lấy tên khách hàng ────────────────────────────────────────
// invoice.ticket_id
//   → repair_ticket.id            (as: "ticket")
//   → repair_ticket.appointment_id
//     → repair_appointment.id     (as: "appointment")
//     → repair_appointment.customer_id
//       → customer.id             (as: "customer")   ← full_name ở đây
// ─────────────────────────────────────────────────────────────────────────────
const basicInclude = [
    {
        model: Voucher,
        as: "voucher",
        attributes: ["id", "code", "percent", "event"],
        foreignKey: "discount_id",
        required: false   // LEFT JOIN — invoice không có voucher vẫn trả về
    },
    {
        model: RepairTicket,
        as: "ticket",
        attributes: ["id", "description", "appointment_id"],
        foreignKey: "ticket_id",
        required: false,  // LEFT JOIN — invoice không có ticket vẫn trả về
        include: [
            {
                model: RepairAppointment,
                as: "appointment",
                attributes: ["id", "customer_id"],
                required: false,
                include: [
                    {
                        model: Customer,
                        as: "customer",
                        attributes: ["id", "full_name", "phone_number"],
                        required: false
                    }
                ]
            }
        ]
    }
]

export const invoiceController = baseCRUD(Invoice, {
    modelName: "Invoice",
    uniqueFields: [],
    defaultValues: {},
    include: {
        basicInclude: basicInclude,
        detailInclude: basicInclude
    }
});