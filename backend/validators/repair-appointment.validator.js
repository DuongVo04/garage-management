import { body } from "express-validator";
import { dateValidator } from "./common.validator.js";
import REPAIR_APPOINTMENT_STATUS from "../utils/RepairAppointmentStatus.js";
import { bodyIdValidator } from "./id.validator.js";

const repairAppointmentValidator = [
    dateValidator("appointment_date", "Appointment date"),
    body("status")
        .optional()
        .trim()
        .toLowerCase()
        .isIn(Object.values(REPAIR_APPOINTMENT_STATUS)).withMessage("Invalid status"),
    bodyIdValidator("customer_id"),
]

export default repairAppointmentValidator;