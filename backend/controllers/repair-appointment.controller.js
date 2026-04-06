import {
    RepairAppointment,
    Customer,
    Service
} from "../schemas/index.js";
import ApiError from "../utils/ApiError.js";
import { baseCRUD } from "../utils/baseCRUD.js";
import REPAIR_APPOINTMENT_STATUS from "../utils/RepairAppointmentStatus.js";


// Note: Using baseCRUD without includes to avoid foreign key errors.
const baseController = baseCRUD(RepairAppointment, {
    modelName: "RepairAppointment",
    exclude: [],
    include: {
        basicInclude: [],  // No includes to avoid FK mismatch
        detailInclude: []
    },
    customFilter: (query) => {
        const { status, customer_id } = query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (customer_id) {
            filter.customer_id = customer_id;
        }

        return filter;
    }
});

const create = async (data) => {
    const { appointment_date, customer_id, customer_info } = data;
    
    let finalCustomerId = customer_id;

    // 1. Xử lý khách hàng (Tìm theo SĐT hoặc tạo mới)
    if (customer_info?.phone_number) {
        let customer = await Customer.findOne({
            where: { phone_number: customer_info.phone_number }
        });

        if (!customer) {
            customer = await Customer.create({
                full_name: customer_info.full_name,
                phone_number: customer_info.phone_number,
                email: customer_info.email,
                // Nếu có account_id (user_id từ token) thì gắn vào
                account_id: (customer_id && customer_id.length > 20) ? customer_id : null 
            });
        }
        finalCustomerId = customer.id;
    }

    if (!finalCustomerId) {
        throw new ApiError(400, "Thông tin khách hàng không hợp lệ");
    }

    // 2. Tạo lịch hẹn
    const appointment = await RepairAppointment.create({
        appointment_date,
        customer_id: finalCustomerId,
        status: REPAIR_APPOINTMENT_STATUS.BOOKED,
        created_date: new Date()
    });

    return appointment;
};

const changeStatus = async (id, status) => {
    const appointment = await RepairAppointment.findByPk(id);

    if (!appointment) {
        throw new ApiError(404, "Repair Appointment not found");
    }

    appointment.status = status;
    await appointment.save();

    return appointment;
};

const repairAppointmentController = {
    ...baseController,
    create,
    changeStatus
}


export default repairAppointmentController;