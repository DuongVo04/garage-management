import { Brand } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const brandController = baseCRUD(Brand, {
    modelName: "Brand",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false },
    imageField: "logo_url"
});