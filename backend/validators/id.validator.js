import { body, param } from "express-validator";

const idValidator = (validator) =>
    validator("id")
        .isUUID()
        .withMessage("Id must be a valid UUID");

const paramsIdValidator = idValidator(param);
const bodyIdValidator = idValidator(body);

export {
    paramsIdValidator,
    bodyIdValidator,
};