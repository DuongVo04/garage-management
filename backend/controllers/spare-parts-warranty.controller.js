import { SparePartsWarranty } from "../schemas/index.js"
import { basePFKCRUD } from "../utils/basePFKCRUD.js";

export const sparePartsWarrantyController = basePFKCRUD(SparePartsWarranty, {
    modelName: "SparePartsWarranty",
    primaryKey: "usage_id",
    include: {
        basicInclude: [],
        detailInclude: []
    }
});
