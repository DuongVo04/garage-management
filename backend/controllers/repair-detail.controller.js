import { RepairDetail } from "../schemas/index.js"
import { basePFKCRUD } from "../utils/basePFKCRUD.js"

export const repairDetailController = basePFKCRUD(RepairDetail, {
    modelName: "RepairDetail",
    primaryKey: "ticket_id",
    include: {
        basicInclude: [],
        detailInclude: []
    }
});