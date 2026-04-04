import {
    CarReviewAppointment,
    ShowroomVehicle,
    Brand,

} from "../schemas/index.js";
import ApiError from "../utils/ApiError.js";
import { baseCRUD } from "../utils/baseCRUD.js";


const include = [{
    model: ShowroomVehicle,
    as: "showroom_vehicle",
    attributes: [
        "id",
        "name",
        "year",
        "thumbnail",
    ],
    include: [
        {
            model: Brand,
            as: "brand",
            attributes: ["id", "name", "country", "logo_url"]
        }
    ]
}]

const baseController = baseCRUD(CarReviewAppointment, {
    modelName: "CarReviewAppointment",
    exclude: ["delete", "update", "getById"],
    include: {
        basicInclude: include,
        detailInclude: include
    },
    customFilter: (query) => {
        const { status } = query;

        if (status === "booked") {
            return { status: "booked" };
        }

        if (status === "done") {
            return { status: "done" };
        }

        return {};
    }
});

const deleteAppoitment = async (id) => {
    const appointment = await CarReviewAppointment.findByPk(id);

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    await CarReviewAppointment.destroy({
        where: { id }
    });
};

const changeStatus = async (id, status) => {
    const [affectedRows] = await CarReviewAppointment.update(
        { status },
        { where: { id } }
    );

    if (affectedRows === 0) {
        throw new ApiError(404, "Appointment not found");
    }

};

const getByPhoneNumber = async (phone_number) => {
    const appointment = CarReviewAppointment.findOne(
        {
            where: { phone_number },
            include,
            attributes: {
                exclude: "showroom_vehicle_id"
            }
        }
    )

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    return appointment;
}

const carReviewAppointmentController = {
    ...baseController,
    changeStatus,
    deleteAppoitment,
    getByPhoneNumber
}


export default carReviewAppointmentController;