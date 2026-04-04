import ApiError from "../utils/ApiError.js";
import {
    Customer,
    CustomerVehicle,
    RepairAppointment,
    Brand,
    Account
} from "../schemas/index.js";
import { baseCRUD } from "../utils/baseCRUD.js";


const basicInclude = [{
    model: Account,
    as: "account",
    attributes: ["id", "username"]
}]

const baseController = baseCRUD(Customer, {
    modelName: "Customer",
    uniqueFields: ["phone_number"],
    include: {
        basicInclude,
        detailInclude: [
            ...basicInclude,
            {
                model: CustomerVehicle,
                as: "vehicles",
                attributes: [
                    "id",
                    "name",
                    "color",
                    "type",
                    "latest_odo",
                    "plate_number",
                    "year",
                    "image_path",
                    "is_deleted",
                ],
                include: [
                    {
                        model: Brand,
                        as: "brand",
                        attributes: ["id", "name", "country", "logo_url"]
                    }
                ]
            }, {
                model: RepairAppointment,
                as: "appointments",
                attributes: [
                    "id",
                    "created_date",
                    "appointment_date",
                    "status"
                ]
            }
        ]
    },
});

const getCustomerByUserAccount = async (user) => {
    const customer = await Customer.findOne({
        where: { account_id: user.id }
    });
    if (!customer) {
        throw new ApiError(404, "Unknown customer");
    }

    return customer;
};

const getMe = async (user) => {
    const customer = await getCustomerByUserAccount(user);
    return await baseController.getById(customer.id);
}

const linkAccount = async (user, phone_number) => {
    const account_id = user.id;

    const customer = await Customer.findOne({
        where: { phone_number }
    });

    if (!customer) {
        throw new ApiError(404, "User not found");
    }

    if (customer.account_id) {
        throw new ApiError(400, "Already linked");
    }

    await customer.update({ account_id });
}

const customerController = {
    ...baseController,
    getMe,
    linkAccount
}

export default customerController;
