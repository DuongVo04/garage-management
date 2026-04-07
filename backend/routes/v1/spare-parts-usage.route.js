import express from "express"
import { sparePartsUsageController } from "../../controllers/spare-parts-usage.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import { response } from "../../utils/response.js"
import { SparePartsUsage, SpareParts, RepairDetail } from "../../schemas/index.js"
import sparePartsUsageValidator from "../../validators/spare-parts-usage.validator.js";

const router = express.Router();

// Lấy danh sách phiếu sử dụng phụ tùng
router.get("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        try {
            const usages = await sparePartsUsageController.getAll(req.query);
            return response(res, true, "Get spare parts usages successfully", 200, usages);
        } catch (error) {
            next(error);
        }
    }
);

// Lấy spare parts usage theo repair_detail_id (qua repair_detail.usage_id)
router.get("/by-repair-detail/:repairDetailId",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("repairDetailId"),
    validate,
    async (req, res, next) => {
        try {
            const { repairDetailId } = req.params;

            // Theo ERD: repair_detail.usage_id → spare_parts_usage.id
            // Phải lookup qua repair_detail trước để lấy usage_id
            const detail = await RepairDetail.findOne({ where: { id: repairDetailId } });
            if (!detail || !detail.usage_id) {
                return response(res, true, "No spare parts usages found", 200, []);
            }

            const usage = await SparePartsUsage.findOne({
                where: { id: detail.usage_id },
                include: [
                    {
                        model: SpareParts,
                        as: "spare_part",
                        attributes: ["id", "name", "unit_price", "quantity_in_stock", "unit_of_measure"]
                    }
                ]
            });

            return response(res, true, "Spare parts usages found", 200, usage ? [usage] : []);
        } catch (error) {
            console.error("=== ERROR in GET /spare-parts-usage/by-repair-detail ===", {
                repairDetailId: req.params.repairDetailId,
                message: error.message,
                stack: error.stack
            });
            next(error);
        }
    }
);

// Lấy phiếu sử dụng phụ tùng theo ID
router.get("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const usage = await sparePartsUsageController.getById(id);
            return response(res, true, "Spare parts usage found", 200, usage);
        } catch (error) {
            next(error);
        }
    }
);

// Tạo phiếu sử dụng phụ tùng mới
router.post("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    sparePartsUsageValidator, 
    validate,
    async (req, res, next) => {
        try {
            const { repair_detail_id, ...usageData } = req.body;
            const usage = await sparePartsUsageController.create(usageData);

            // Cập nhật repair_detail.usage_id theo ERD
            if (repair_detail_id && usage?.id) {
                await RepairDetail.update(
                    { usage_id: usage.id },
                    { where: { id: repair_detail_id } }
                );
            }

            return response(res, true, "Create spare parts usage successfully", 201, usage);
        } catch (error) {
            next(error);
        }
    }
);

// Cập nhật phiếu sử dụng phụ tùng
router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    sparePartsUsageValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const usage = await sparePartsUsageController.update(id, req.body);
            return response(res, true, "Update spare parts usage successfully", 200, usage);
        } catch (error) {
            next(error);
        }
    }
);

// Xóa phiếu sử dụng phụ tùng
router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await sparePartsUsageController.delete(id);
            return response(res, true, "Spare parts usage deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;