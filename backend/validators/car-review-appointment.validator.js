import { body } from "express-validator";
import { dateValidator, nameValidator, phoneNumberValidator } from "./common.validator.js";
import CAR_REVIEW_STATUS from "../utils/CarReviewStatus.js";

const carReviewAppointmentValidator = [
    nameValidator(3, 100, "viewer_name"),
    phoneNumberValidator,
    dateValidator("view_at"),
    body("status")
        .notEmpty().withMessage("Status is required")
        .trim()
        .toLowerCase().isIn(Object.values(CAR_REVIEW_STATUS)),
]

export default carReviewAppointmentValidator;