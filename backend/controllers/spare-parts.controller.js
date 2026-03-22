import { SpareParts } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const sparePartsController = baseCRUD(SpareParts, {
    modelName: "SpareParts",
    uniqueFields: ["name"],
    exclude: ["delete"]
});