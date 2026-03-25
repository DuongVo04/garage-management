import { Service } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"


const serviceController = baseCRUD(Service, {
    modelName: "Service",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false },
});

export default serviceController;