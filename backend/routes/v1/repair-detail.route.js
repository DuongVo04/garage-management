import express from "express";
import { repairDetailController } from "../../controllers/repair-detail.controller.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import repairDetailValidator from "../../validators/repair-detail.validator.js";
import { response } from "../../utils/response.js";
import ROLE_NAME from "../../utils/RoleName.js";
import { RepairDetail } from "../../schemas/index.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get("/by-ticket/:ticketId",
    verifyToken,
    authorize([ROLE_NAME.ADMIN, ROLE_NAME.TECH_EMPLOYEE]),
    paramsIdValidator("ticketId"),
    validate,
    async (req, res, next) => {
        try {
            const { ticketId } = req.params;
            const details = await RepairDetail.findAll({
                where: { ticket_id: ticketId },
                order: [['id', 'ASC']],
                attributes: ['id', 'ticket_id', 'employee_id', 'usage_id', 'repair_date', 'note']
            });
            return response(res, true, "Repair details retrieved successfully", 200, details);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/:ticketId",
    verifyToken,
    authorize([ROLE_NAME.ADMIN, ROLE_NAME.TECH_EMPLOYEE]),
    paramsIdValidator("ticketId"),
    repairDetailValidator,
    validate,
    async (req, res, next) => {
        try {
            const { ticketId } = req.params;
            const repairDetail = await RepairDetail.create({
                id: uuidv4(),
                ticket_id: ticketId,
                ...req.body
            });
            return response(res, true, "Create repair detail successfully", 201, repairDetail);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize([ROLE_NAME.ADMIN, ROLE_NAME.TECH_EMPLOYEE]),
    paramsIdValidator("id"),
    validate,
    async (req, res, next) => {
        try {
            const updated = await repairDetailController.update(req.params.id, req.body);
            return response(res, true, "Update repair detail successfully", 200, updated);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:id",
    verifyToken,
    authorize([ROLE_NAME.ADMIN]),
    paramsIdValidator("id"),
    validate,
    async (req, res, next) => {
        try {
            await repairDetailController.delete(req.params.id);
            return response(res, true, "Repair detail deleted successfully", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
