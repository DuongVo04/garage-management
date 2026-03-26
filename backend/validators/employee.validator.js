import { body } from "express-validator";
import { dateValidator, nameValidator, phoneNumberValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const employeeValidator = [
    nameValidator(3, 50, "employee_name"),

    phoneNumberValidator,

    body("email")
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 100 }).withMessage("Max length is 100 characters"),

    body("address")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage("Max length is 100 characters"),

    body("salary")
        .notEmpty().withMessage("Salary is required")
        .isDecimal().withMessage("Salary must be a number")
        .custom(value => {
            if (Number(value) < 0) {
                throw new Error("Salary must be >= 0");
            }
            return true;
        }),

    dateValidator("work_start_date"),

    body("account_id")
        .optional()
        .isUUID().withMessage("Id must be a valid UUID"),

    bodyIdValidator("employee_type_id")

];

export default employeeValidator;