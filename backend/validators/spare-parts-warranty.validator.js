import { body } from "express-validator";
import { bodyIdValidator } from "./id.validator.js";

const sparePartsWarrantyValidator = [
    body("start_date")
        .notEmpty().withMessage("Start date is required")
        .bail()
        .isInt({ min: 0 }).withMessage("Start date must be a valid timestamp (non-negative integer)"),

    body("duration")
        .notEmpty().withMessage("Duration is required")
        .bail()
        .isInt({ min: 0 }).withMessage("Duration must be a non-negative integer"),

];

export default sparePartsWarrantyValidator;
