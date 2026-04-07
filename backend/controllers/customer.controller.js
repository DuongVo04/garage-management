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
    // 1. Tìm hồ sơ dựa vào account_id
    const customer = await getCustomerByUserAccount(user);

    // Nếu KHÔNG có hồ sơ (user mới), chỉ trả về null
    if (!customer) {
        return null; 
    }

    // 2. Lấy data full từ baseController
    let customerData = await baseController.getById(customer.id);

    // Ép kiểu về JSON object thuần để có thể gắn thêm thuộc tính mới
    if (customerData && customerData.toJSON) {
        customerData = customerData.toJSON();
    } else {
        // Fallback an toàn
        customerData = JSON.parse(JSON.stringify(customerData));
    }

    // 3. Tiến hành "Enrich" (nhặt thêm) thông tin Xe và Thợ cho từng lịch hẹn
    if (customerData && customerData.appointments && customerData.appointments.length > 0) {
        // Import các bảng cần thiết
        const { RepairTicket, CustomerVehicle, RepairDetail, Employee } = await import("../schemas/index.js");

        for (let appt of customerData.appointments) {
            appt.vehicle = null;
            appt.mechanic = null;
            appt.description = "Không có mô tả";

            try {
                // Tìm Phiếu sửa chữa (Ticket)
                const ticket = await RepairTicket.findOne({
                    where: { appointment_id: appt.id }
                });

                if (ticket) {
                    appt.description = ticket.description; // Lấy mô tả

                    // Tìm thông tin Xe
                    if (ticket.customer_vehicle_id) {
                        const selectedVehicle = await CustomerVehicle.findOne({
                            where: { id: ticket.customer_vehicle_id },
                            attributes: ["id", "name", "plate_number", "color"]
                        });
                        if (selectedVehicle) {
                            appt.vehicle = selectedVehicle.toJSON();
                        }
                    }

                    // Tìm thông tin Thợ
                    const detail = await RepairDetail.findOne({
                        where: { ticket_id: ticket.id }
                    });

                    if (detail && detail.employee_id) {
                        const mechanic = await Employee.findOne({
                            where: { id: detail.employee_id },
                            attributes: ["id", "employee_name"]
                        });
                        if (mechanic) {
                            appt.mechanic = {
                                ...mechanic.toJSON(),
                                name: mechanic.employee_name // Map đúng tên biến frontend cần
                            };
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Lỗi khi lấy thêm dữ liệu cho lịch hẹn ${appt.id}:`, error.message);
            }
        }
    }

    // 4. Trả về toàn bộ data khách hàng (đã được bơm đầy đủ thông tin lịch hẹn)
    return customerData;
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
