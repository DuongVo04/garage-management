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
        console.log("🔹 [GET /repair-appointments] Request started");
        try {
            const { RepairAppointment, Customer, CustomerVehicle } = await import("../../schemas/index.js");
            console.log("✅ [GET /repair-appointments] Schemas imported successfully");

            console.log("🔹 [GET /repair-appointments] Fetching all repair appointments...");
            let appointments = await RepairAppointment.findAll();
            console.log(`✅ [GET /repair-appointments] Found ${appointments?.length || 0} repair appointments`);

            if (!appointments || appointments.length === 0) {
                return response(res, true, "Get repair appointments successfully", 200, []);
            }

            let appts = appointments.map(a => a.toJSON ? a.toJSON() : a);

            // Enrich với customer và vehicles của customer
            for (const appt of appts) {
                appt.customer = null;
                appt.vehicles = [];

                if (appt.customer_id) {
                    try {
                        const customer = await Customer.findOne({
                            where: { id: appt.customer_id },
                            attributes: ["id", "full_name", "phone_number", "email"]
                        });
                        if (customer) {
                            appt.customer = customer.toJSON();

                            // Lấy danh sách xe của customer
                            const vehicles = await CustomerVehicle.findAll({
                                where: { customer_id: appt.customer_id, is_deleted: 0 },
                                attributes: ["id", "name", "plate_number", "type", "year", "color"]
                            });
                            appt.vehicles = vehicles.map(v => v.toJSON());
                        }
                    } catch (err) {
                        console.error(`  ❌ Error fetching customer/vehicles: ${err.message}`);
                    }
                }
            }

            console.log(`✅ [GET /repair-appointments] Successfully processed ${appts.length} appointments`);
            return response(res, true, "Get repair appointments successfully", 200, appts);
        } catch (error) {
            console.error("❌ [GET /repair-appointments] CRITICAL ERROR:", error.message);
            next(error);
        }
    }
)


router.get("/:id",
    verifyToken,
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        console.log("🔹 [GET /repair-appointments/:id] Request started for ID:", req.params.id);
        try {
            const appointment = await repairAppointmentController.getById(req.params.id);
            console.log("✅ [GET /repair-appointments/:id] Appointment found successfully");
            return response(res, true, "Get repair appointment successfully", 200, appointment);
        } catch (error) {
            console.error("❌ [GET /repair-appointments/:id] Error:", error.message);
            next(error);
        }
    }
)

router.post("/",
    repairAppointmentValidator,
    validate,
    async (req, res, next) => {
        console.log("🔹 [POST /repair-appointments] Request body:", JSON.stringify(req.body, null, 2));
        try {
            const data = {
                ...req.body,
                status: req.body.status || REPAIR_APPOINTMENT_STATUS.BOOKED,
                created_date: new Date()
            };
            console.log("✅ [POST /repair-appointments] Creating appointment with data:", JSON.stringify(data, null, 2));
            const appointment = await repairAppointmentController.create(data);
            console.log("✅ [POST /repair-appointments] Appointment created successfully:", appointment.id);
            return response(res, true, "Create repair appointment successfully", 200, appointment);
        } catch (error) {
            console.error("❌ [POST /repair-appointments] Error:", error.message, error.stack);
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