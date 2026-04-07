import express from "express"
import { invoiceController } from "../../controllers/invoice.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import invoiceValidator from "../../validators/invoice.validator.js"
import { response } from "../../utils/response.js"
import { sequelize, Invoice, SparePartsWarranty, RepairTicket, RepairAppointment } from "../../schemas/index.js"

const router = express.Router();

// Tạo hóa đơn + bảo hành + hoàn thành ticket trong 1 transaction
router.post("/finalize",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const {
                ticket_id,
                total_cost,
                payment_method,
                created_date,
                discount_id,
                usage_ids = [],      // mảng usage_id cần tạo bảo hành
                appointment_id       // để update trạng thái lịch hẹn
            } = req.body;

            if (!ticket_id) {
                await t.rollback();
                return response(res, false, "ticket_id là bắt buộc", 400);
            }

            // 1. Tạo hóa đơn
            const invoice = await Invoice.create({
                ticket_id,
                total_cost,
                payment_method,
                created_date,
                ...(discount_id ? { discount_id } : {})
            }, { transaction: t });

            // 2. Tạo bảo hành cho từng usage
            if (usage_ids.length > 0) {
                const warrantyData = usage_ids.map(usage_id => ({
                    usage_id,
                    start_date: Math.floor(Date.now() / 1000),
                    duration: 365
                }));
                await SparePartsWarranty.bulkCreate(warrantyData, { transaction: t });
            }

            // 3. Hoàn thành phiếu sửa
            const completedDate = new Date().toISOString().split('T')[0];
            await RepairTicket.update(
                { completed_date: completedDate },
                { where: { id: ticket_id }, transaction: t }
            );

            // 4. Cập nhật trạng thái lịch hẹn
            if (appointment_id) {
                await RepairAppointment.update(
                    { status: 'completed' },
                    { where: { id: appointment_id }, transaction: t }
                );
            }

            await t.commit();
            return response(res, true, "Tạo hóa đơn thành công", 201, invoice);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
);

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
    (req, _res, next) => { console.log("[POST /invoices] body:", JSON.stringify(req.body)); next(); },
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