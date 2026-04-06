import { body } from "express-validator";

const repairAppointmentValidator = [
    body("appointment_date")
        .notEmpty().withMessage("Appointment date is required")
        .isISO8601().withMessage("Invalid appointment date"),
    body("customer_id")
        .notEmpty().withMessage("Customer ID is required"),
];

export default repairAppointmentValidator;
