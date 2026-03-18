import { body, param } from "express-validator";

const idValidator = (validator, field) => {
    return validator(field)
        .notEmpty().withMessage(`${field} is required`)
        .bail()
        .isUUID().withMessage("Id must be a valid UUID");
};

const paramsIdValidator = (field = "id") => idValidator(param, field);
const bodyIdValidator = (field = "id") => idValidator(body, field);

export {
    paramsIdValidator,
    bodyIdValidator,
};