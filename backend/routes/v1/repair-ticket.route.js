import express from "express"
import { repairTicketController } from "../../controllers/repair-ticket.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import repairTicketValidator from "../../validators/repair-ticket.validator.js"
import { response } from "../../utils/response.js"

const router = express.Router();

// Lấy danh sách phiếu sửa chữa
router.get("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        try {
            const repairTickets = await repairTicketController.getAll(req.query);
            return response(res, true, "Get repair tickets successfully", 200, repairTickets);
        } catch (error) {
            next(error);
        }
    }
);

// Lấy chi tiết phiếu sửa chữa
router.get("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const repairTicket = await repairTicketController.getById(id);
            return response(res, true, "Repair ticket found", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Tạo phiếu sửa chữa mới
router.post("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    repairTicketValidator,
    validate,
    async (req, res, next) => {
        try {
            const repairTicket = await repairTicketController.create(req.body);
            return response(res, true, "Create repair ticket successfully", 201, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Cập nhật phiếu sửa chữa
router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    repairTicketValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const repairTicket = await repairTicketController.update(id, req.body);
            return response(res, true, "Update repair ticket successfully", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Xóa phiếu sửa chữa
router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await repairTicketController.delete(id);
            return response(res, true, "Repair ticket deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

// Hoàn thành phiếu sửa chữa
router.patch("/:id/complete",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const completedDate = new Date().toISOString().split('T')[0];
            const repairTicket = await repairTicketController.update(id, { 
                completed_date: completedDate 
            });
            return response(res, true, "Repair ticket completed", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Lấy phiếu sửa chữa theo customer vehicle
router.get("/vehicle/:vehicleId",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE", "CUSTOMER"]),
    paramsIdValidator("vehicleId"),
    validate,
    async (req, res, next) => {
        try {
            const { vehicleId } = req.params;
            const repairTickets = await repairTicketController.getAll({
                customer_vehicle_id: vehicleId
            });
            return response(res, true, "Get repair tickets by vehicle successfully", 200, repairTickets);
        } catch (error) {
            next(error);
        }
    }
);

export default router;