import { Service } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"


const serviceController = baseCRUD(Service, {
    modelName: "Service",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false },
    customFilter: (query) => {
        const { is_deleted } = query;

        if (is_deleted === "all") {
            return {};
        }

        if (is_deleted === 'true') {
            return { is_deleted: true };
        }

        if (is_deleted === 'false') {
            return { is_deleted: false };
        }

        return { is_deleted: false };
    }
});

export default serviceController;