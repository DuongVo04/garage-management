import { RepairTicket } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const repairTicketController = baseCRUD(RepairTicket, {
    modelName: "RepairTicket",
    uniqueFields: [],
    defaultValues: {},
    exclude: ["completed_date"],
    include: {
        basicInclude: [],
        detailInclude: []
    }
});