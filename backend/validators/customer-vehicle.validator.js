import { body } from "express-validator";
import { nameValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const common = (filed, max) => {
    return body("color")
        .optional()
        .isString().withMessage(`${filed} must be a string`)
        .isLength({ max: 10 }).withMessage(`Color must be <= ${max} characters`);
}

const customerVehicleValidator = [
    nameValidator(1, 20, "name"),
    common("color", 10),
    common("type", 10),
    common("plate_number", 20),
    body("latest_odo")
        .optional()
        .isInt({ min: 0 }).withMessage("Latest odo must be a positive integer"),
    body("year")
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage("Year must be a valid year"),
    bodyIdValidator("brand_id")

];

export default customerVehicleValidator;