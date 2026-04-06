import { body } from "express-validator";
import { dateValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const repairDetailValidator = [
    dateValidator("repair_date", "Repair Date"),

    body("note")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage("Note must not exceed 100 characters"),

    bodyIdValidator("employee_id"),

    body("usage_id")
        .optional({ nullable: true, checkFalsy: true })
        .isUUID().withMessage("Usage ID must be a valid UUID")
];

export default repairDetailValidator;
