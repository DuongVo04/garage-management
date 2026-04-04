import { CustomerVehicle, Brand } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"
import { validateCustomerUser } from "../utils/checkCustomer.js";

const base = baseCRUD(CustomerVehicle, {
    modelName: "CustomerVehicle",
    defaultValues: { is_deleted: false },
    exclude: ["getAll"]
});


const createVehicle = async () => {
    
}

const customerVehiclesController = {
    ...base,
    create: createVehicle
};

export default customerVehiclesController;