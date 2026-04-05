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
    body("showroom_vehicle_id")
        .notEmpty().withMessage("Showroom vehicle ID is required")
        .isUUID().withMessage("Showroom vehicle ID must be a valid UUID"),
    body("account_id")
        .optional()
        .isUUID().withMessage("Account ID must be a valid UUID"),
]

export default carReviewAppointmentValidator;