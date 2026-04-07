import { RepairDetail } from "../schemas/index.js";
import { baseCRUD } from "../utils/baseCRUD.js";

export const repairDetailController = baseCRUD(RepairDetail, {
    modelName: "RepairDetail",
    exclude: [], 
    include: {
        basicInclude: [
        ],
        detailInclude: []
    }
});