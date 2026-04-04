import { RepairTicket, Service, CustomerVehicle, RepairAppointment } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

const basicInclude = [
    {
        model: Service,
        as: "service",
        attributes: ["id", "name", "price", "duration"]
    },
    {
        model: CustomerVehicle,
        as: "vehicle",
        attributes: ["id", "name", "plate_number", "color", "year"]
    },
    {
        model: RepairAppointment,
        as: "appointment",
        attributes: ["id", "appointment_date", "status"]
    }
]

export const repairTicketController = baseCRUD(RepairTicket, {
    modelName: "RepairTicket",
    uniqueFields: [], // Không có unique fields
    defaultValues: {},
    include: {
        basicInclude: basicInclude,
        detailInclude: [
            ...basicInclude,
            {
                model: RepairDetail,
                as: "details",
                include: [
                    {
                        model: Employee,
                        as: "employee",
                        attributes: ["id", "full_name"]
                    },
                    {
                        model: SparePartsUsage,
                        as: "usage",
                        include: [
                            {
                                model: SpareParts,
                                as: "spare_part",
                                attributes: ["id", "name", "price"]
                            }
                        ]
                    }
                ]
            },
            {
                model: CarReturnAppointment,
                as: "car_return",
                attributes: ["id", "return_date", "status"]
            },
            {
                model: Invoice,
                as: "invoice",
                attributes: ["id", "total_cost", "payment_method", "created_date"]
            }
        ]
    },
    searchFields: ["id"], // Các field có thể tìm kiếm
    customFilter: (query) => {
        const { status, start_date, end_date } = query;
        const filter = {};

        if (status === "completed") {
            filter.completed_date = { [Op.ne]: null };
        } else if (status === "pending") {
            filter.completed_date = null;
        }

        if (start_date && end_date) {
            filter.created_date = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        } else if (start_date) {
            filter.created_date = {
                [Op.gte]: new Date(start_date)
            };
        } else if (end_date) {
            filter.created_date = {
                [Op.lte]: new Date(end_date)
            };
        }

        return filter;
    }
});