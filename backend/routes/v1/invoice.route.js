import express from "express"
import { invoiceController } from "../../controllers/invoice.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import invoiceValidator from "../../validators/invoice.validator.js"
import { response } from "../../utils/response.js"

const router = express.Router();

// Lấy danh sách hóa đơn (Admin và Employee)
router.get("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        try {
            const invoices = await invoiceController.getAll(req.query);
            return response(res, true, "Get invoices successfully", 200, invoices);
        } catch (error) {
            next(error);
        }
    }
);

// Lấy chi tiết hóa đơn
router.get("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const invoice = await invoiceController.getById(id);
            return response(res, true, "Invoice found", 200, invoice);
        } catch (error) {
            next(error);
        }
    }
);

// Tạo hóa đơn mới (từ repair ticket)
router.post("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    invoiceValidator,
    validate,
    async (req, res, next) => {
        try {
            const invoice = await invoiceController.create(req.body);
            return response(res, true, "Create invoice successfully", 201, invoice);
        } catch (error) {
            next(error);
        }
    }
);

// Cập nhật hóa đơn
router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    invoiceValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const invoice = await invoiceController.update(id, req.body);
            return response(res, true, "Update invoice successfully", 200, invoice);
        } catch (error) {
            next(error);
        }
    }
);

// Xóa hóa đơn (soft delete hoặc hard delete tùy logic)
router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await invoiceController.delete(id);
            return response(res, true, "Invoice deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;