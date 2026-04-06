import { body } from "express-validator";
import { dateValidator } from "./common.validator.js";
import REPAIR_APPOINTMENT_STATUS from "../utils/RepairAppointmentStatus.js";

const repairAppointmentValidator = [
    dateValidator("appointment_date", "Appointment date"),
    body("status")
        .optional()
        .trim()
        .toLowerCase()
        .isIn(Object.values(REPAIR_APPOINTMENT_STATUS)).withMessage("Invalid status"),
    body("customer_id")
        .optional()
        .isUUID().withMessage("customer_id phải là UUID hợp lệ"),
    body("customer_info")
        .optional()
        .isObject().withMessage("customer_info phải là một object"),
    body("customer_info.full_name")
        .if(() => !!body("customer_info").value)
        .trim()
        .isLength({ min: 2 }).withMessage("Họ tên tối thiểu 2 ký tự"),
    body("customer_info.phone_number")
        .if(() => !!body("customer_info").value)
        .trim()
        .matches(/^(0|\+84)[0-9]{9}$/).withMessage("Số điện thoại không hợp lệ"),
    body("customer_info.email")
        .if(() => !!body("customer_info").value)
        .trim()
        .isEmail().withMessage("Email không hợp lệ"),
]

export default repairAppointmentValidator;