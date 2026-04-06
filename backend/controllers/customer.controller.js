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
    // Tìm hồ sơ dựa vào account_id
    const customer = await getCustomerByUserAccount(user);

    // Nếu KHÔNG có hồ sơ (user mới), chỉ trả về null thay vì báo lỗi (throw Error)
    if (!customer) {
        return null; 
    }

    // Nếu đã có hồ sơ thì lấy ra bình thường
    return await baseController.getById(customer.id);
}

const updateMe = async (user, data) => {
    // 1. Tìm xem user đăng nhập này đã có hồ sơ customer chưa
    let customer = await Customer.findOne({
        where: { account_id: user.id }
    });

    if (customer) {
        // Đã có hồ sơ -> Ghi đè thông tin mới
        await customer.update(data);
    } else {
        // 2. Kiểm tra xem SĐT này đã tồn tại chưa (phòng trường hợp khách từng đặt lịch hẹn khi chưa có account)
        if (data.phone_number) {
            customer = await Customer.findOne({ where: { phone_number: data.phone_number } });
            if (customer) {
                // SĐT đã tồn tại -> Liên kết account_id vào hồ sơ cũ này và cập nhật data
                await customer.update({ ...data, account_id: user.id });
                return await baseController.getById(customer.id);
            }
        }

        // 3. Hoàn toàn chưa có gì -> Tạo mới tinh và tự động gán account_id
        customer = await Customer.create({
            ...data,
            account_id: user.id
        });
    }

    // Trả về data mới nhất
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
    updateMe,
    linkAccount,
    getCustomerByUserAccount,
    Model: Customer
}

export default customerController;
