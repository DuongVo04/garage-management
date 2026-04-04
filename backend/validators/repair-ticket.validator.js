import { body } from "express-validator";

const repairTicketValidator = [
    body("created_date")
        .optional()
        .isISO8601()
        .withMessage("created_date must be a valid date")
        .bail()
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("created_date must be a valid date");
            }
            return true;
        }),
    
    body("completed_date")
        .optional()
        .isISO8601()
        .withMessage("completed_date must be a valid date")
        .bail()
        .custom((value) => {
            if (value) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(value)) {
                    throw new Error("completed_date must be in format YYYY-MM-DD");
                }
            }
            return true;
        }),
    
    body("service_id")
        .optional()
        .isString()
        .withMessage("service_id must be a string")
        .bail()
        .isLength({ max: 50 })
        .withMessage("service_id must not exceed 50 characters")
        .bail()
        .custom(async (value) => {
            if (value) {
                const { Service } = await import("../schemas/index.js");
                const service = await Service.findByPk(value);
                if (!service) {
                    throw new Error("Service not found");
                }
            }
            return true;
        }),
    
    body("appointment_id")
        .optional()
        .isString()
        .withMessage("appointment_id must be a string")
        .bail()
        .isLength({ max: 50 })
        .withMessage("appointment_id must not exceed 50 characters")
        .bail()
        .custom(async (value) => {
            if (value) {
                const { RepairAppointment } = await import("../schemas/index.js");
                const appointment = await RepairAppointment.findByPk(value);
                if (!appointment) {
                    throw new Error("Repair appointment not found");
                }
            }
            return true;
        }),
    
    body("customer_vehicle_id")
        .optional()
        .isString()
        .withMessage("customer_vehicle_id must be a string")
        .bail()
        .isLength({ max: 50 })
        .withMessage("customer_vehicle_id must not exceed 50 characters")
        .bail()
        .custom(async (value) => {
            if (value) {
                const { CustomerVehicle } = await import("../schemas/index.js");
                const vehicle = await CustomerVehicle.findByPk(value);
                if (!vehicle) {
                    throw new Error("Customer vehicle not found");
                }
            }
            return true;
        })
];

export default repairTicketValidator;