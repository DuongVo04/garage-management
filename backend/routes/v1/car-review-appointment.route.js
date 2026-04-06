import express from "express"
import { validate } from "../../middlewares/validation.middleware.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import carReviewAppointmentController from "../../controllers/car-review-appointment.controller.js";
import carReviewAppointmentValidator from "../../validators/car-review-appointment.validator.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import ROLE_NAME from "../../utils/RoleName.js";
import CAR_REVIEW_STATUS from "../../utils/CarReviewStatus.js"
import { body, param } from "express-validator";
import { response } from "../../utils/response.js";


const router = express.Router();

router.get("/",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    validate,
    async (req, res, next) => {
        try {
            const appointments = await carReviewAppointmentController.getAll(req.query);
            return response(res, true, "Get appointments successfully", 200, appointments);
        } catch (error) {
            next(error);
        }
    }
)

router.get("/me",
    verifyToken,
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;
            const appointments = await carReviewAppointmentController.getMyAppointments(user.id);
            return response(res, true, "Get my appointments successfully", 200, appointments);
        } catch (error) {
            next(error);
        }
    }
)

router.get("/phone-number/:phone_number",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    param("phone_number")
        .notEmpty().withMessage("Phone number is required")
        .isLength({ min: 9, max: 11 }).withMessage("Phone number must be 9-11 digits"),
    validate,
    async (req, res, next) => {
        try {
            const { phone_number } = req.params;
            const appointments = await carReviewAppointmentController.getByPhoneNumber(phone_number);
            return response(res, true, "Get appointments successfully", 200, appointments);
        } catch (error) {
            next(error);
        }
    }
)

router.post("/",
    carReviewAppointmentValidator,
    validate,
    async (req, res, next) => {
        try {

            const appointment = await carReviewAppointmentController.create(req.body);
            return response(res, true, "Create appointment successfully", 200, appointment);

        } catch (error) {
            next(error);
        }
    }
)

router.patch("/:id",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    body("status")
        .notEmpty().withMessage("Status is required")
        .trim()
        .toLowerCase().isIn(Object.values(CAR_REVIEW_STATUS)),
    validate,
    async (req, res, next) => {
        try {

            const { status } = req.body;
            const { id } = req.params;

            await carReviewAppointmentController.changeStatus(id, status);
            return response(res, true, "Change status successfully", 200);

        } catch (error) {
            next(error);
        }
    }
)

router.delete("/:id",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;

            await carReviewAppointmentController.deleteAppoitment(id);
            return response(res, true, "Deleted", 200);

        } catch (error) {
            next(error);
        }
    }
)

export default router;