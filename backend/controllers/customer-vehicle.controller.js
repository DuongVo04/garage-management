import { CustomerVehicle, Brand, Customer } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"


const basicInclude = [{
    model: Brand,
    as: "brand",
    attributes: ["id", "name"],
}, {
    model: Customer,
    as: "customer",
    attributes: ["id", "full_name", "phone_number"],
}]

const detailInclude = [{
    model: Brand,
    as: "brand",
    attributes: [
        "id",
        "name",
        "country",
        "logo_url"
    ],
}, {
    model: Customer,
    as: "customer",
    attributes: [
        "id",
        "full_name",
        "phone_number",
        "email",
        "address"
    ]
}
]

const base = baseCRUD(CustomerVehicle, {
    modelName: "CustomerVehicle",
    defaultValues: { is_deleted: false },
    exclude: ["getById"],
    include: {
        basicInclude,
        detailInclude
    },
    imageField: "image_path"
});

const getVehicleById = async (id, customer_id) => {
    const vehicle = CustomerVehicle.findOne({
            where: { id, customer_id },
            include: detailInclude,
            attributes: {
                exclude: "customer_id"
            }
        }
    )

    if (!vehicle) {
        throw new ApiError(404, "Appointment not found");
    }

    return vehicle;
}

const customerVehiclesController = {
    ...base,
    getVehicleById,
};

export default customerVehiclesController;