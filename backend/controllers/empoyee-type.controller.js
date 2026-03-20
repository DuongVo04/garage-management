import { EmployeeType } from "../schemas/index.js";
import { baseCRUD } from "../utils/baseCRUD.js";

export const employeeTypeController = baseCRUD(EmployeeType, {
    modelName: "EmployeeType",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false }
});