import { Invoice, Voucher, RepairTicket, RepairAppointment, Customer } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"


const basicInclude = [
    {
        model: Voucher,
        as: "voucher",
        attributes: ["id", "code", "percent", "event"],
        foreignKey: "discount_id",
        required: false
    },
    {
        model: RepairTicket,
        as: "ticket",
        attributes: ["id", "description", "appointment_id"],
        foreignKey: "ticket_id",
        required: false,
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