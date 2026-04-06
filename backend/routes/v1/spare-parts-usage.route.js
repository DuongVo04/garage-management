import express from "express"
import { sparePartsUsageController } from "../../controllers/spare-parts-usage.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import { response } from "../../utils/response.js"

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

// Lấy danh sách phiếu sử dụng theo repair_detail_id
router.get("/by-repair-detail/:repairDetailId",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("repairDetailId"),
    validate,
    async (req, res, next) => {
        try {
            const { repairDetailId } = req.params;
            const usages = await sparePartsUsageController.getAll({ 
                repair_detail_id: repairDetailId 
            });
            return response(res, true, "Spare parts usages found", 200, usages);
        } catch (error) {
            next(error);
        }
    }
);

// Tạo phiếu sử dụng phụ tùng mới
router.post("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        try {
            const usage = await sparePartsUsageController.create(req.body);
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