import express from "express"
import { repairDetailController } from "../../controllers/repair-detail.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import repairDetailValidator from "../../validators/repair-detail.validator.js"
import { response } from "../../utils/response.js"


const router = express.Router();

router.get("/:ticket_id",
    paramsIdValidator("ticket_id"),
    validate,
    async (req, res, next) => {
        try {
            const { ticket_id } = req.params;
            const { RepairTicket, Employee, SparePartsUsage, SpareParts } = await import("../../schemas/index.js");
            
            const repairDetail = await repairDetailController.getOne({ ticket_id });
            
            if (repairDetail) {
                const detailData = repairDetail.toJSON();
                
                try {
                    // Fetch related data separately
                    if (detailData.ticket_id) {
                        const ticket = await RepairTicket.findOne({
                            where: { id: detailData.ticket_id },
                            attributes: ["id", "created_date", "service_id", "appointment_id", "customer_vehicle_id"]
                        });
                        detailData.ticket = ticket;
                    }
                    
                    if (detailData.employee_id) {
                        const employee = await Employee.findOne({
                            where: { id: detailData.employee_id },
                            attributes: ["id", "employee_name", "phone_number", "email", "address"]
                        });
                        detailData.employee = employee;
                    }
                    
                    if (detailData.usage_id) {
                        const usage = await SparePartsUsage.findOne({
                            where: { id: detailData.usage_id },
                            attributes: ["id", "quantity", "usage_date", "spare_parts_id"]
                        });
                        
                        if (usage && usage.spare_parts_id) {
                            const sparePart = await SpareParts.findOne({
                                where: { id: usage.spare_parts_id },
                                attributes: ["id", "name", "code", "price", "quantity_in_stock", "unit_of_measure"]
                            });
                            usage.spare_part = sparePart;
                        }
                        
                        detailData.usage = usage;
                    }
                } catch (err) {
                    console.error("Error enriching repair detail:", err.message);
                }
                
                return response(res, true, "Repair detail found", 200, detailData);
            }
            
            return response(res, true, "Repair detail found", 200, repairDetail);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/:ticket_id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("ticket_id"),
    repairDetailValidator,
    validate,
    async (req, res, next) => {
        try {
            const { ticket_id } = req.params;
            const repairDetail = await repairDetailController.create(
                { ticket_id },
                req.body
            );
            return response(res, true, "Create repair detail successfully", 201, repairDetail);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:ticket_id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("ticket_id"),
    repairDetailValidator,
    validate,
    async (req, res, next) => {
        try {
            const { ticket_id } = req.params;
            const repairDetail = await repairDetailController.update(
                { ticket_id },
                req.body
            );
            return response(res, true, "Update repair detail successfully", 200, repairDetail);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:ticket_id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator("ticket_id"),
    validate,
    async (req, res, next) => {
        try {
            const { ticket_id } = req.params;
            await repairDetailController.delete({ ticket_id });
            return response(res, true, "Repair detail deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
