import { baseCRUD } from "../utils/baseCRUD.js";
import { Employee, EmployeeType } from "../schemas/index.js"


const employeeController = baseCRUD(Employee, {
    modelName: "Employee",
    uniqueFields: ["phone_number"],
    defaultValues: { is_working: true },
    include: {
        basicInclude: [{
            model: EmployeeType,
            as: "employee_type",
            attributes: ["id", "name", "description"]
        }],
        detailInclude: [{
            model: EmployeeType,
            as: "employee_type",
            attributes: ["id", "name", "description"]
        }]
    },
    customFilter: (query) => {
        const { is_working } = query;

        if (is_working === "all") {
            return {};
        }

        if (is_working === "true") {
            return { is_working: true };
        }

        if (is_working === "false") {
            return { is_working: false };
        }

        return { is_working: true };
    }
});

export default employeeController;