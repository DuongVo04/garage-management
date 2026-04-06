import {
    RepairAppointment,
} from "../schemas/index.js";
import ApiError from "../utils/ApiError.js";
import { baseCRUD } from "../utils/baseCRUD.js";
import REPAIR_APPOINTMENT_STATUS from "../utils/RepairAppointmentStatus.js";


// Note: Customer relationship requires customer_id field in schema, which is missing.
// Using baseCRUD without includes to avoid foreign key errors.
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
    changeStatus
}


export default repairAppointmentController;