import { SparePartsUsage, SpareParts } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

const include = [
    {
        model: SpareParts,
        as: "spare_part",
        attributes: ["id", "name", "code", "price", "quantity_in_stock", "unit_of_measure"]
    }
];

export const sparePartsUsageController = baseCRUD(SparePartsUsage, {
    modelName: "SparePartsUsage",
    uniqueFields: [],
    include: {
        basicInclude: include,
        detailInclude: include
    }
});