import express from "express"
import { validate } from "../../middlewares/validation.middleware.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import repairAppointmentController from "../../controllers/repair-appointment.controller.js";
import repairAppointmentValidator from "../../validators/repair-appointment.validator.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import ROLE_NAME from "../../utils/RoleName.js";
import REPAIR_APPOINTMENT_STATUS from "../../utils/RepairAppointmentStatus.js"
import { body, param } from "express-validator";
import { response } from "../../utils/response.js";


const router = express.Router();

router.get("/",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    validate,
    async (req, res, next) => {
        try {
            const appointments = await repairAppointmentController.getAll(req.query);
            return response(res, true, "Get repair appointments successfully", 200, appointments);
        } catch (error) {
            next(error);
        }
    }
)

router.get("/:id",
    verifyToken,
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const appointment = await repairAppointmentController.getById(req.params.id);
            return response(res, true, "Get repair appointment successfully", 200, appointment);
        } catch (error) {
            next(error);
        }
    }
)

router.post("/",
    verifyToken,
    repairAppointmentValidator,
    validate,
    async (req, res, next) => {
        try {
            const data = {
                ...req.body,
                status: req.body.status || REPAIR_APPOINTMENT_STATUS.BOOKED,
                created_date: new Date()
            };
            const appointment = await repairAppointmentController.create(data);
            return response(res, true, "Create repair appointment successfully", 200, appointment);
        } catch (error) {
            next(error);
        }
    }
)

router.patch("/:id/status",
    verifyToken,
    authorize(ROLE_NAME.ADMIN),
    paramsIdValidator(),
    body("status")
        .notEmpty().withMessage("Status is required")
        .trim()
        .toLowerCase()
        .isIn(Object.values(REPAIR_APPOINTMENT_STATUS)).withMessage("Invalid status"),
    validate,
    async (req, res, next) => {
        try {
            const { status } = req.body;
            const { id } = req.params;

            const appointment = await repairAppointmentController.changeStatus(id, status);
            return response(res, true, "Change status successfully", 200, appointment);
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
            await repairAppointmentController.delete(id);
            return response(res, true, "Deleted repair appointment successfully", 200);
        } catch (error) {
            next(error);
        }
    }
)

export default router;